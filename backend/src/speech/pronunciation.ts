// Pronunciation notes, "where supported" (Gemini only; Whisper and the mock can't do it).
//
// Gemini listens to the recording together with the expected phrase and gives up to three
// short observations about specific sounds. This is an AI opinion, NOT a measured
// pronunciation score: there is no phoneme alignment or acoustic scoring behind it. The API
// returns it separately from the content match and the timing-based fluency, labelled
// "experimental", and the UI says so.
import { env } from "../config/env.ts";
import type { KnowledgeLevelName } from "../rag/config.ts";
import { geminiListener, type SpeechToText } from "./stt.ts";
import { normalizeText } from "./text-compare.ts";

export type PronunciationNotes =
  | {
      supported: true;
      notes: Array<{ word: string | null; tip: string }>;
      overall: string;
      /** The model's own statement whether the audio was clear enough to judge. */
      confident: boolean;
      model: string;
      disclaimer: string;
    }
  | { supported: false; reason: string };

export const PRONUNCIATION_DISCLAIMER =
  "AI listening notes — experimental. They are the AI's impression of your recording, not a measured pronunciation score.";

export function pronunciationPrompt(languageName: string, level: KnowledgeLevelName) {
  return [
    `You are a kind ${languageName} pronunciation coach for a ${level} learner.`,
    "You get a recording and the phrase the learner tried to say.",
    "Listen and give at most 3 short, specific observations about sounds — for example vowel length,",
    "retroflex vs dental consonants, aspiration, doubled consonants, or a letter that sounded like another.",
    "Only mention what you can clearly hear. If the recording is unclear, say so and set confident to false.",
    "Never give a score or a percentage. Use simple English and the romanization in brackets.",
    'Reply with JSON only: {"notes": [{"word": "<word from the phrase or null>", "tip": "<max 25 words>"}], "overall": "<one short encouraging sentence>", "confident": true|false}',
  ].join("\n");
}

export function parsePronunciationNotes(raw: string, expectedScript: string) {
  const cleaned = raw.replace(/^\s*```(?:json)?|```\s*$/g, "").trim();
  const data = JSON.parse(cleaned) as {
    notes?: Array<{ word?: unknown; tip?: unknown }>;
    overall?: unknown;
    confident?: unknown;
  };
  const words = new Set(normalizeText(expectedScript).split(" "));
  const notes = (Array.isArray(data.notes) ? data.notes : [])
    .filter((note) => typeof note?.tip === "string" && note.tip.trim())
    .slice(0, 3)
    .map((note) => {
      const word = typeof note.word === "string" ? normalizeText(note.word) : "";
      return {
        // Only keep a word that really is in the phrase (no invented words).
        word: words.has(word) ? word : null,
        tip: String(note.tip).trim().slice(0, 220),
      };
    });
  return {
    notes,
    overall: typeof data.overall === "string" ? data.overall.trim().slice(0, 200) : "",
    confident: data.confident === true,
  };
}

export async function getPronunciationNotes(input: {
  stt: SpeechToText;
  audio: Buffer;
  mimeType: string;
  expected: { script: string; romanization: string; meaning: string };
  languageName: string;
  level: KnowledgeLevelName;
}): Promise<PronunciationNotes> {
  if (env.PRONUNCIATION_NOTES === "false") {
    return { supported: false, reason: "Turned off on this server (PRONUNCIATION_NOTES=false)." };
  }
  if (!input.stt.canListenForPronunciation) {
    return {
      supported: false,
      reason:
        input.stt.name === "mock"
          ? "Not available in test mode."
          : "The current speech-to-text provider (Whisper) can't comment on pronunciation.",
    };
  }
  const llm = geminiListener(input.stt.model);
  const result = await llm.generate({
    system: pronunciationPrompt(input.languageName, input.level),
    turns: [
      {
        role: "user",
        text: `The learner tried to say: ${input.expected.script} (${input.expected.romanization}) — "${input.expected.meaning}".`,
        audio: { mimeType: input.mimeType, data: input.audio },
      },
    ],
    json: true,
    temperature: 0.2,
    maxOutputTokens: 1024,
    purpose: "pronunciation",
  });
  const parsed = parsePronunciationNotes(result.text, input.expected.script);
  return {
    supported: true,
    ...parsed,
    model: result.model,
    disclaimer: PRONUNCIATION_DISCLAIMER,
  };
}
