// Speech-to-text providers. The audio (a WAV recording) goes to the provider; the API key
// stays on the server.
//
//   gemini: Gemini listens to the audio (same key and model family as the tutor). Default.
//   groq:   Groq's hosted Whisper (whisper-large-v3), a dedicated speech-to-text model.
//   mock:   offline test double, not speech recognition: returns a fixed text (for tests).
//
// The transcription prompt never contains the phrase the learner was asked to say, so the
// model can't "correct" a mistake into the expected answer.
import { env } from "../config/env.ts";
import { TUTOR_CONFIG } from "../config/tutor.ts";
import { getLlmStatus, WithFallback } from "../ai/llm/index.ts";
import { GeminiProvider } from "../ai/llm/gemini.ts";
import { LlmError, postFormData, type LlmProvider } from "../ai/llm/types.ts";

export type TranscribeInput = {
  audio: Buffer;
  mimeType: string;
  languageCode: string;
  languageName: string;
  scriptName: string;
  /** Test double only: what the mock should "hear". Ignored by real providers. */
  mockTranscript?: string;
};

export type Transcription = { text: string; model: string };

export interface SpeechToText {
  readonly name: "gemini" | "groq" | "mock";
  readonly model: string;
  /** Whether this provider can also give AI pronunciation notes (needs a model that listens). */
  readonly canListenForPronunciation: boolean;
  transcribe(input: TranscribeInput): Promise<Transcription>;
}

const looksLikePlaceholder = (key: string | undefined) =>
  !key || key.length < 20 || /^(your|replace|xxx|paste)/i.test(key);

// Gemini

export function transcriptionPrompt(languageName: string, scriptName: string) {
  return [
    "You are a speech-to-text engine for a language-learning app.",
    `The speaker is a beginner learning ${languageName} and usually speaks ${languageName}, sometimes English.`,
    "Write down exactly the words you hear — including mistakes and mispronounced words, as they sound.",
    "Do not correct, complete, translate or explain anything. Do not add words that were not spoken.",
    `Write ${languageName} words in ${scriptName}. Write English words in English.`,
    'If there is no clear speech, return an empty transcript and "heard": "no-speech".',
    'Reply with JSON only: {"transcript": "...", "heard": "speech" | "no-speech"}',
  ].join("\n");
}

export function parseTranscription(raw: string): string {
  const cleaned = raw.replace(/^\s*```(?:json)?|```\s*$/g, "").trim();
  let data: unknown;
  try {
    data = JSON.parse(cleaned);
  } catch {
    throw new LlmError("LLM_FAILED", "The speech-to-text reply was not valid JSON");
  }
  const object = data as { transcript?: unknown; heard?: unknown };
  if (typeof object.transcript !== "string") {
    throw new LlmError("LLM_FAILED", "The speech-to-text reply had no transcript");
  }
  if (object.heard === "no-speech") return "";
  return object.transcript.replace(/\s+/g, " ").trim().slice(0, 500);
}

/**
 * A Gemini model that listens to audio, with LLM_FALLBACK_MODEL as backup when it is busy or its
 * free quota is used up (every model has its own free quota).
 */
export function geminiListener(model: string): LlmProvider {
  const base =
    (env.LLM_PROVIDER === "gemini" ? env.LLM_BASE_URL : undefined) ??
    TUTOR_CONFIG.providers.gemini.baseUrl;
  const make = (name: string) =>
    new GeminiProvider(env.GEMINI_API_KEY!, name, base, env.SPEECH_TIMEOUT_MS);
  const fallback = env.LLM_FALLBACK_MODEL;
  return fallback && fallback !== model
    ? new WithFallback(make(model), make(fallback))
    : make(model);
}

class GeminiSpeechToText implements SpeechToText {
  readonly name = "gemini";
  readonly canListenForPronunciation = true;
  private readonly llm: LlmProvider;

  constructor(readonly model: string) {
    this.llm = geminiListener(model);
  }

  async transcribe(input: TranscribeInput): Promise<Transcription> {
    const result = await this.llm.generate({
      system: transcriptionPrompt(input.languageName, input.scriptName),
      turns: [
        {
          role: "user",
          text: "Transcribe this recording.",
          audio: { mimeType: input.mimeType, data: input.audio },
        },
      ],
      json: true,
      temperature: 0,
      maxOutputTokens: 1024,
      purpose: "transcription",
    });
    return { text: parseTranscription(result.text), model: result.model };
  }
}

// Groq Whisper

class GroqSpeechToText implements SpeechToText {
  readonly name = "groq";
  readonly canListenForPronunciation = false;

  constructor(
    private readonly apiKey: string,
    readonly model: string,
    private readonly baseUrl: string,
  ) {}

  async transcribe(input: TranscribeInput): Promise<Transcription> {
    const form = new FormData();
    form.append(
      "file",
      new Blob([new Uint8Array(input.audio)], { type: input.mimeType }),
      "speech.wav",
    );
    form.append("model", this.model);
    form.append("language", input.languageCode); // Whisper knows hi, te, ta, ml, kn, bn
    form.append("response_format", "json");
    form.append("temperature", "0");
    const data = (await postFormData(
      `${this.baseUrl}/audio/transcriptions`,
      { Authorization: `Bearer ${this.apiKey}` },
      form,
      env.SPEECH_TIMEOUT_MS,
      "Groq Whisper",
    )) as { text?: string };
    return {
      text: (data.text ?? "").replace(/\s+/g, " ").trim().slice(0, 500),
      model: `groq/${this.model}`,
    };
  }
}

// Offline test double

/** Fixed "transcripts" per language: the word for "hello" (see prisma/seed-data.ts). */
const MOCK_HEARD: Record<string, string> = {
  hi: "नमस्ते",
  te: "నమస్కారం",
  ta: "வணக்கம்",
  ml: "നമസ്കാരം",
  kn: "ನಮಸ್ಕಾರ",
  bn: "নমস্কার",
};

class MockSpeechToText implements SpeechToText {
  readonly name = "mock";
  readonly model = "mock-fixed-transcript";
  readonly canListenForPronunciation = false;

  async transcribe(input: TranscribeInput): Promise<Transcription> {
    return {
      text: input.mockTranscript ?? MOCK_HEARD[input.languageCode] ?? "hello",
      model: `mock/${this.model}`,
    };
  }
}

// Choosing the provider

export const STT_DEFAULT_MODELS = {
  gemini: () => getLlmStatus().model, // the tutor's Gemini model can listen to audio
  groq: () => "whisper-large-v3",
  mock: () => "mock-fixed-transcript",
};

type SttProviderName = keyof typeof STT_DEFAULT_MODELS;

function sttApiKey(provider: SttProviderName): string | undefined {
  if (provider === "gemini") return env.GEMINI_API_KEY;
  if (provider === "groq") return env.GROQ_API_KEY;
  return undefined;
}

function defaultSttModel(provider: SttProviderName): string {
  // Gemini for speech while the tutor uses another provider: the tutor's model name won't fit.
  if (provider === "gemini" && env.LLM_PROVIDER !== "gemini") {
    return TUTOR_CONFIG.providers.gemini.defaultModel;
  }
  return STT_DEFAULT_MODELS[provider]();
}

export function getSttStatus() {
  const provider = env.STT_PROVIDER ?? env.LLM_PROVIDER;
  const configured = provider === "mock" || !looksLikePlaceholder(sttApiKey(provider));
  const model = env.STT_MODEL ?? defaultSttModel(provider);
  return {
    provider,
    model,
    configured,
    keyVariable: provider === "mock" ? null : TUTOR_CONFIG.providers[provider].keyVariable,
    isTestDouble: provider === "mock",
  };
}

let cached: SpeechToText | null = null;

export function getSpeechToText(): SpeechToText {
  if (cached) return cached;
  const status = getSttStatus();
  if (!status.configured) {
    throw new LlmError(
      "LLM_NOT_CONFIGURED",
      `Speech-to-text needs ${status.keyVariable} in backend/.env (see docs/AI.md).`,
    );
  }
  // LLM_BASE_URL is only used when the tutor and speech use the same provider (proxies, tests).
  const base = (name: "gemini" | "groq") =>
    (env.LLM_PROVIDER === name ? env.LLM_BASE_URL : undefined) ??
    TUTOR_CONFIG.providers[name].baseUrl;
  if (status.provider === "gemini") {
    cached = new GeminiSpeechToText(status.model);
  } else if (status.provider === "groq") {
    cached = new GroqSpeechToText(env.GROQ_API_KEY!, status.model, base("groq"));
  } else {
    cached = new MockSpeechToText();
  }
  return cached;
}
