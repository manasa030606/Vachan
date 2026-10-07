import { z } from "zod";
import { SPEECH_CONFIG } from "../config/speech.ts";
import { KNOWLEDGE_LEVELS } from "../rag/config.ts";
import { LANGUAGE_CODES } from "../rag/types.ts";

const id = z.string().trim().min(1).max(100);
const language = z.enum(LANGUAGE_CODES);

/** GET /api/speech/tts?vocabularyItemId=…  or  ?language=te&text=…  or  ?question=<listening token> */
export const ttsQuerySchema = z
  .object({
    vocabularyItemId: id.optional(),
    question: z.string().trim().min(20).max(400).optional(),
    language: language.optional(),
    text: z.string().trim().min(1).max(SPEECH_CONFIG.tts.maxTextLength).optional(),
  })
  .refine((q) => q.vocabularyItemId || q.question || (q.text && q.language), {
    message: 'Send "vocabularyItemId", "question", or "text" together with "language"',
  });

/** Text fields sent next to the audio file (multipart/form-data — all values are strings). */
const audioFields = {
  language: language.optional(),
  /** recorded = microphone in the app (default) · uploaded = an audio file the learner chose */
  source: z.enum(["recorded", "uploaded"]).default("recorded"),
  /** Test double only (STT_PROVIDER=mock): the transcript the mock should return. */
  mockTranscript: z.string().max(500).optional(),
};

/** POST /api/speech/transcribe (multipart: audio + fields) */
export const transcribeFieldsSchema = z.object(audioFields).strict();

/** POST /api/speech/evaluate (multipart: audio + fields) */
export const evaluateFieldsSchema = z
  .object({
    ...audioFields,
    level: z.enum(KNOWLEDGE_LEVELS).optional(),
    vocabularyItemId: id.optional(),
    expectedText: z.string().trim().min(1).max(SPEECH_CONFIG.tts.maxTextLength).optional(),
    romanization: z.string().trim().max(SPEECH_CONFIG.tts.maxTextLength).optional(),
    meaning: z.string().trim().max(SPEECH_CONFIG.tts.maxTextLength).optional(),
  })
  .strict()
  .refine((f) => f.vocabularyItemId || f.expectedText, {
    message: 'Send "vocabularyItemId" (a course phrase) or "expectedText"',
  });

export const languageQuerySchema = z.object({ language: language.optional() });

export const listeningQuerySchema = z.object({
  language: language.optional(),
  count: z.coerce.number().int().min(1).max(20).optional(),
});

export const listeningAnswerSchema = z
  .object({ token: z.string().trim().min(20).max(400), choiceId: z.string().trim().min(1).max(4) })
  .strict();

export const attemptsQuerySchema = z.object({
  language: language.optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
