// npm run speech:check -w backend          (add -- --models to list the key's audio models)
//
// Checks the speech setup WITHOUT printing the key, using real calls:
//   1. text-to-speech: "నమస్కారం" → WAV
//   2. speech-to-text: that WAV → transcript (a full round trip, so no microphone is needed)
//   3. content match of the transcript with the original text
//   4. AI pronunciation notes (when supported)
// Exit code 1 if something is wrong, with a hint how to fix it.
import { env } from "../../config/env.ts";
import { TUTOR_CONFIG } from "../../config/tutor.ts";
import { LlmError } from "../../ai/llm/types.ts";
import { getConversationAvailability } from "../../ai/conversation/conversation.service.ts";
import { analyzeAudio } from "../audio-analysis.ts";
import { getPronunciationNotes } from "../pronunciation.ts";
import { getSpeechToText, getSttStatus } from "../stt.ts";
import { compareTranscript } from "../text-compare.ts";
import { getTextToSpeech, getTtsStatus } from "../tts.ts";
import { parseWav } from "../wav.ts";

const TEST = { text: "నమస్కారం", romanization: "namaskaaram", meaning: "Hello" };
/** How to fix each provider error; `step` tells which model/setting is involved. */
function hint(error: LlmError, step: "tts" | "stt"): string | null {
  const model = step === "tts" ? "TTS_MODEL" : "STT_MODEL (or LLM_FALLBACK_MODEL)";
  switch (error.code) {
    case "LLM_NOT_CONFIGURED":
      return "Add GEMINI_API_KEY to backend/.env (the same key as the tutor).";
    case "LLM_AUTH_FAILED":
      return "The key is wrong or revoked — create a new one at https://aistudio.google.com/apikey.";
    case "LLM_RATE_LIMITED":
      return error.quotaWindow === "minute"
        ? "Per-minute free limit — wait one minute and run this again."
        : step === "tts"
          ? "The free text-to-speech quota for today is used up. It resets at midnight Pacific time (≈ 12:30 pm in India). Already cached phrases keep working; or set TTS_MODEL to another TTS model from -- --models (each model has its own quota), or TTS_PROVIDER=browser."
          : "Today's free quota of this model is used up (resets at midnight Pacific time ≈ 12:30 pm in India). Every model has its OWN quota: set LLM_FALLBACK_MODEL=gemini-3.5-flash-lite (or STT_MODEL=…) in backend/.env.";
    case "LLM_MODEL_NOT_FOUND":
      return `The model isn't available for your key. Run with -- --models and set ${model}.`;
    case "LLM_TIMEOUT":
      return "No answer in time — the free model is probably busy. Try again in a few minutes.";
    case "LLM_UNAVAILABLE":
      return `The model is overloaded right now (free tier). Try again later, or set ${model}.`;
    case "LLM_BAD_REQUEST":
      return `The model rejected the request — check ${model} (run with -- --models).`;
    default:
      return null;
  }
}

const line = (label: string, value: string) => console.log(`   ${label.padEnd(16)}${value}`);
let failed = false;
const fail = (label: string, error: unknown, step: "tts" | "stt", fatal = true) => {
  if (fatal) failed = true;
  const message = error instanceof Error ? error.message : String(error);
  line(label, `${fatal ? "❌" : "⚠️ "} ${message}`);
  const fix = error instanceof LlmError ? hint(error, step) : null;
  if (fix) console.log(`      → ${fix}`);
};

async function listAudioModels() {
  const key = env.GEMINI_API_KEY;
  if (!key) return;
  try {
    const base =
      (env.LLM_PROVIDER === "gemini" ? env.LLM_BASE_URL : undefined) ??
      TUTOR_CONFIG.providers.gemini.baseUrl;
    const response = await fetch(`${base}/models?pageSize=200`, {
      headers: { "x-goog-api-key": key },
    });
    const data = (await response.json()) as { models?: Array<{ name: string }> };
    const names = (data.models ?? []).map((m) => m.name.replace("models/", ""));
    console.log(
      `\n   Text-to-speech models:  ${names.filter((n) => /tts/.test(n)).join(", ") || "(none)"}`,
    );
    console.log(
      `   Flash models (can listen): ${names
        .filter((n) => /flash/.test(n) && !/tts|image|live/.test(n))
        .slice(0, 10)
        .join(", ")}`,
    );
    console.log("   Use in backend/.env:  TTS_MODEL=…   STT_MODEL=…\n");
  } catch {
    // listing is only a hint
  }
}

async function main() {
  const stt = getSttStatus();
  const tts = getTtsStatus();
  console.log("\n🎙️  Vachan speech — configuration check\n");
  line(
    "Speech-to-text",
    `${stt.provider} · ${stt.model}${stt.isTestDouble ? " (TEST DOUBLE)" : ""}`,
  );
  line(
    "Text-to-speech",
    `${tts.provider}${tts.provider === "gemini" ? ` · ${tts.model ?? "auto (newest flash TTS)"} · voice ${tts.voice}` : ""}${tts.isTestDouble ? " (TEST DOUBLE)" : ""}`,
  );
  line(
    "Pronunciation",
    env.PRONUNCIATION_NOTES === "true" && stt.provider === "gemini"
      ? "AI notes on"
      : "off / not supported",
  );
  const conversation = getConversationAvailability();
  line(
    "Conversation",
    `${conversation.available ? "ready" : "not configured"} · RAG notes ${conversation.notesAvailable ? "on" : "OFF (vocabulary only)"}`,
  );
  if (process.argv.includes("--models")) await listAudioModels();
  console.log("");

  // 1. Text-to-speech
  let audio: Buffer | null = null;
  try {
    const speaker = getTextToSpeech();
    if (!speaker) {
      line("1. TTS", "– server audio off (TTS_PROVIDER=browser): the browser's voice is used");
    } else {
      const started = performance.now();
      const result = await speaker.synthesize({
        text: TEST.text,
        languageCode: "te",
        languageName: "Telugu",
      });
      audio = result.audio;
      line(
        "1. TTS",
        `✅ ${result.model} → ${result.durationMs} ms of audio, ${Math.round(result.audio.length / 1024)} KB (${Math.round(performance.now() - started)} ms)`,
      );
      if (result.durationMs > 4000) {
        console.log(
          `      ⚠️  ${result.durationMs} ms is long for one word — the model may be reading extra text.`,
        );
      }
    }
  } catch (error) {
    fail("1. TTS", error, "tts");
  }

  // 2–4. Speech-to-text round trip
  if (!audio) {
    line(
      "2. STT",
      "– skipped (no TTS audio to transcribe; test it in the app with your microphone)",
    );
  } else {
    try {
      const decoded = parseWav(audio);
      const analysis = analyzeAudio(decoded.samples, decoded.sampleRate);
      const recognizer = getSpeechToText();
      const started = performance.now();
      const transcript = await recognizer.transcribe({
        audio,
        mimeType: "audio/wav",
        languageCode: "te",
        languageName: "Telugu",
        scriptName: "Telugu script",
      });
      line(
        "2. STT",
        `✅ "${transcript.text}" (${transcript.model}, ${Math.round(performance.now() - started)} ms)`,
      );
      const match = compareTranscript(
        { script: TEST.text, romanization: TEST.romanization },
        transcript.text,
      );
      line(
        "3. Match",
        `${match.verdict === "match" || match.verdict === "close" ? "✅" : "⚠️ "} ${match.verdict} (${match.score}/100) · speech ${analysis.speechMs} ms of ${analysis.durationMs} ms`,
      );
      // 4. Pronunciation notes — optional: a failure here is a warning, not "not ready".
      if (recognizer.canListenForPronunciation && env.PRONUNCIATION_NOTES === "true") {
        try {
          const notes = await getPronunciationNotes({
            stt: recognizer,
            audio,
            mimeType: "audio/wav",
            expected: { script: TEST.text, romanization: TEST.romanization, meaning: TEST.meaning },
            languageName: "Telugu",
            level: "beginner",
          });
          line(
            "4. Notes",
            notes.supported
              ? `✅ ${notes.notes.length} note(s) — "${notes.overall}"`
              : `– ${notes.reason}`,
          );
        } catch (error) {
          fail("4. Notes", error, "stt", false);
          console.log(
            "      (The app still works: the exercise then shows content + fluency only.)",
          );
        }
      }
    } catch (error) {
      fail("2. STT", error, "stt");
    }
  }

  console.log(
    failed
      ? "\n❌ Not ready — see the hints above (docs/SPEECH.md → Troubleshooting).\n"
      : "\n✅ Speech is ready. Start the app and open /speak (Chrome/Edge/Safari, allow the microphone).\n",
  );
  process.exitCode = failed ? 1 : 0;
}

void main();
