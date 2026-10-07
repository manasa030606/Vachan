// "Play phrase": returns WAV audio for a course word/phrase or a short text.
// Generated audio is cached in the AudioClip table, so each phrase costs one TTS call ever —
// the free Gemini TTS quota is small. Cache key = sha256(provider/model/voice + language + text).
import { createHash } from "node:crypto";
import { SPEECH_CONFIG } from "../config/speech.ts";
import { HttpError, notFound } from "../lib/http-error.ts";
import { prisma } from "../lib/prisma.ts";
import { llmErrorToHttp } from "../ai/llm/http-errors.ts";
import { LlmError } from "../ai/llm/types.ts";
import { getTextToSpeech, getTtsStatus } from "./tts.ts";
import { normalizeText } from "./text-compare.ts";

export type SpeechAudio = {
  audio: Buffer;
  mimeType: string;
  durationMs: number;
  /** cache = served from the database; generated = new TTS call */
  source: "cache" | "generated";
  text: string;
};

/** Which text to speak: a vocabulary item (text not revealed to the client) or a given text. */
export async function resolveSpeechText(input: {
  vocabularyItemId?: string;
  text?: string;
  language?: string;
}): Promise<{ text: string; languageCode: string; languageName: string }> {
  if (input.vocabularyItemId) {
    const item = await prisma.vocabularyItem.findUnique({
      where: { id: input.vocabularyItemId },
      select: { script: true, language: { select: { code: true, name: true } } },
    });
    if (!item) throw notFound("VOCABULARY_NOT_FOUND", "Word or phrase not found");
    return {
      text: item.script,
      languageCode: item.language.code,
      languageName: item.language.name,
    };
  }
  const language = input.language
    ? await prisma.language.findUnique({ where: { code: input.language } })
    : null;
  if (!language) throw new HttpError(400, "LANGUAGE_REQUIRED", 'Send "language" with "text"');
  const text = (input.text ?? "").normalize("NFC").replace(/\s+/g, " ").trim();
  if (!text) throw new HttpError(400, "TEXT_REQUIRED", 'Send "text" or "vocabularyItemId"');
  if (text.length > SPEECH_CONFIG.tts.maxTextLength) {
    throw new HttpError(
      400,
      "TEXT_TOO_LONG",
      `Text-to-speech is for short phrases (max ${SPEECH_CONFIG.tts.maxTextLength} characters)`,
    );
  }
  return { text, languageCode: language.code, languageName: language.name };
}

export async function getSpeechAudio(input: {
  vocabularyItemId?: string;
  text?: string;
  language?: string;
}): Promise<SpeechAudio> {
  const { text, languageCode, languageName } = await resolveSpeechText(input);

  let tts;
  try {
    tts = getTextToSpeech();
  } catch (error) {
    if (error instanceof LlmError) throw llmErrorToHttp(error, "tts", "TTS_NOT_CONFIGURED");
    throw error;
  }
  if (!tts) {
    throw new HttpError(
      503,
      "TTS_BROWSER_ONLY",
      "This server doesn't generate audio (TTS_PROVIDER=browser). The app uses your browser's voice instead.",
    );
  }

  const tag = await tts.cacheTag();
  const cacheKey = createHash("sha256")
    .update(`${tag}|${languageCode}|${normalizeText(text)}`)
    .digest("hex");

  const cached = await prisma.audioClip.findUnique({ where: { cacheKey } });
  if (cached) {
    await prisma.audioClip.update({
      where: { id: cached.id },
      data: { hits: { increment: 1 }, lastUsedAt: new Date() },
    });
    return {
      audio: Buffer.from(cached.data),
      mimeType: cached.mimeType,
      durationMs: cached.durationMs,
      source: "cache",
      text,
    };
  }

  let result;
  try {
    result = await tts.synthesize({ text, languageCode, languageName });
  } catch (error) {
    if (error instanceof LlmError) throw llmErrorToHttp(error, "tts", "TTS_NOT_CONFIGURED");
    throw error;
  }
  await prisma.audioClip.upsert({
    where: { cacheKey },
    create: {
      cacheKey,
      languageCode,
      text,
      provider: tag,
      mimeType: result.mimeType,
      sampleRate: result.sampleRate,
      durationMs: result.durationMs,
      byteSize: result.audio.length,
      data: new Uint8Array(result.audio),
    },
    update: {},
  });
  console.info(`[tts] generated ${languageCode} "${text.slice(0, 40)}" ${result.durationMs}ms`);
  return {
    audio: result.audio,
    mimeType: result.mimeType,
    durationMs: result.durationMs,
    source: "generated",
    text,
  };
}

export { getTtsStatus };
