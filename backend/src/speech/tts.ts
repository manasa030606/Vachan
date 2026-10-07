// Text-to-speech providers (listening practice: "play phrase").
//
//   gemini:  Gemini's text-to-speech models (free tier, Indian languages supported). The audio
//            is cached in the database by tts.service.ts, so each phrase is generated once.
//   browser: no server audio; the frontend uses the browser's own voice (speechSynthesis)
//            when the device has a voice for the language.
//   mock:    offline test double that makes short beeps (one per word), not speech.
import { env } from "../config/env.ts";
import { TUTOR_CONFIG } from "../config/tutor.ts";
import { LlmError, postJson } from "../ai/llm/types.ts";
import { pcm16ToWav, encodeWav } from "./wav.ts";

export type SynthesisInput = { text: string; languageCode: string; languageName: string };
export type Synthesis = {
  audio: Buffer;
  mimeType: "audio/wav";
  sampleRate: number;
  durationMs: number;
  model: string;
  voice: string;
};

export interface TextToSpeech {
  readonly name: "gemini" | "mock";
  /** Cache key part: a change of model or voice makes new audio. */
  cacheTag(): Promise<string>;
  synthesize(input: SynthesisInput): Promise<Synthesis>;
}

/** Without TTS_PROVIDER: Gemini when the tutor uses Gemini, mock in tests, else the browser. */
function defaultTtsProvider(): "gemini" | "browser" | "mock" {
  if (env.LLM_PROVIDER === "gemini") return "gemini";
  if (env.LLM_PROVIDER === "mock") return "mock";
  return "browser";
}

/** Safe-to-show TTS configuration (never contains the key). */
export function getTtsStatus() {
  const provider = env.TTS_PROVIDER ?? defaultTtsProvider();
  const key = env.GEMINI_API_KEY;
  const configured =
    provider !== "gemini" || Boolean(key && key.length >= 20 && !/^(your|replace)/i.test(key));
  let model: string | null = null; // null = picked automatically (newest Gemini "flash … tts" model)
  if (provider === "gemini") model = env.TTS_MODEL ?? null;
  else if (provider === "mock") model = "mock-beeps";
  return {
    provider,
    model,
    voice: provider === "gemini" ? env.TTS_VOICE : null,
    configured,
    serverAudio: provider !== "browser",
    isTestDouble: provider === "mock",
  };
}

// Gemini TTS

type GeminiAudioResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ inlineData?: { mimeType?: string; data?: string } }> };
    finishReason?: string;
  }>;
};

/** Used when the key's model list can't be read. */
export const FALLBACK_TTS_MODEL = "gemini-2.5-flash-preview-tts";

/**
 * Picks the newest "flash … tts" model available to the key (model names change often —
 * gemini-2.5-flash was retired for new keys in 2026). TTS_MODEL overrides this.
 */
export function pickTtsModel(names: string[]): string | null {
  const tts = names
    .map((name) => name.replace(/^models\//, ""))
    .filter((name) => /tts/i.test(name) && /flash/i.test(name));
  if (!tts.length) return null;
  const version = (name: string) => Number(/gemini-(\d+(?:\.\d+)?)/.exec(name)?.[1] ?? 0);
  // Newest version first; at equal versions prefer stable names over "preview".
  return tts.sort(
    (a, b) => version(b) - version(a) || Number(/preview/.test(a)) - Number(/preview/.test(b)),
  )[0]!;
}

class GeminiTextToSpeech implements TextToSpeech {
  readonly name = "gemini";
  private model: Promise<string> | null = null;

  constructor(
    private readonly apiKey: string,
    private readonly baseUrl: string,
    private readonly voice: string,
  ) {}

  private resolveModel(): Promise<string> {
    if (env.TTS_MODEL) return Promise.resolve(env.TTS_MODEL);
    this.model ??= fetch(`${this.baseUrl}/models?pageSize=200`, {
      headers: { "x-goog-api-key": this.apiKey },
      signal: AbortSignal.timeout(10_000),
    })
      .then((response) => response.json() as Promise<{ models?: Array<{ name: string }> }>)
      .then((data) => {
        const picked = pickTtsModel((data.models ?? []).map((m) => m.name));
        console.info(`[tts] using ${picked ?? FALLBACK_TTS_MODEL}`);
        return picked ?? FALLBACK_TTS_MODEL;
      })
      .catch(() => {
        this.model = null; // try the list again next time
        return FALLBACK_TTS_MODEL;
      });
    return this.model;
  }

  async cacheTag() {
    // "v2": audio cached with an older prompt (which some models read out in full) is ignored.
    return `gemini/${await this.resolveModel()}/${this.voice}/v2`;
  }

  async synthesize(input: SynthesisInput): Promise<Synthesis> {
    const model = await this.resolveModel();
    const data = (await postJson(
      `${this.baseUrl}/models/${encodeURIComponent(model)}:generateContent`,
      { "x-goog-api-key": this.apiKey },
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                // Only the text. Newer TTS models read a style instruction ("Read aloud…:") out
                // loud as well, which made a one-word clip 8 seconds long. Slower speech is done
                // in the player (0.75× / 0.5×) instead.
                text: input.text,
              },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: this.voice } } },
        },
      },
      env.SPEECH_TIMEOUT_MS,
      "Gemini TTS",
    )) as GeminiAudioResponse;

    const inline = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData;
    if (!inline?.data) {
      throw new LlmError(
        "LLM_FAILED",
        `Gemini TTS returned no audio (finishReason: ${data.candidates?.[0]?.finishReason ?? "none"})`,
      );
    }
    // Gemini returns raw 16-bit PCM ("audio/L16;codec=pcm;rate=24000") — wrap it as WAV.
    const sampleRate = Number(/rate=(\d+)/.exec(inline.mimeType ?? "")?.[1] ?? 24_000);
    const pcm = Buffer.from(inline.data, "base64");
    return {
      audio: pcm16ToWav(pcm, sampleRate),
      mimeType: "audio/wav",
      sampleRate,
      durationMs: Math.round((pcm.length / 2 / sampleRate) * 1000),
      model: `gemini/${model}`,
      voice: this.voice,
    };
  }
}

// Offline test double

class MockTextToSpeech implements TextToSpeech {
  readonly name = "mock";

  async cacheTag() {
    return "mock/beeps";
  }

  async synthesize(input: SynthesisInput): Promise<Synthesis> {
    const sampleRate = 16_000;
    const words = Math.max(1, input.text.trim().split(/\s+/).length);
    const samples: number[] = [];
    for (let w = 0; w < words; w++) {
      for (let i = 0; i < sampleRate * 0.25; i++) {
        samples.push(0.25 * Math.sin((2 * Math.PI * (330 + 40 * w) * i) / sampleRate));
      }
      for (let i = 0; i < sampleRate * 0.12; i++) samples.push(0);
    }
    return {
      audio: encodeWav(samples, sampleRate),
      mimeType: "audio/wav",
      sampleRate,
      durationMs: Math.round((samples.length / sampleRate) * 1000),
      model: "mock/mock-beeps",
      voice: "beep",
    };
  }
}

let cached: TextToSpeech | null = null;

/** The server TTS provider, or null when TTS_PROVIDER=browser (the frontend speaks itself). */
export function getTextToSpeech(): TextToSpeech | null {
  if (cached) return cached;
  const status = getTtsStatus();
  if (status.provider === "browser") return null;
  if (!status.configured) {
    throw new LlmError(
      "LLM_NOT_CONFIGURED",
      "Text-to-speech needs GEMINI_API_KEY in backend/.env (see docs/AI.md).",
    );
  }
  const base =
    (env.LLM_PROVIDER === "gemini" ? env.LLM_BASE_URL : undefined) ??
    TUTOR_CONFIG.providers.gemini.baseUrl;
  cached =
    status.provider === "gemini"
      ? new GeminiTextToSpeech(env.GEMINI_API_KEY!, base, env.TTS_VOICE)
      : new MockTextToSpeech();
  return cached;
}
