// Speech features: transcribing a recording and the speaking exercise.
//   Transcribe: check the audio, then speech-to-text gives the transcript.
//   Evaluate (speaking exercise): check the audio, then three separate kinds of feedback:
//     1. content match: speech-to-text (never told the expected phrase) compared with the phrase
//     2. AI pronunciation notes (Gemini only, experimental, run in parallel with step 1)
//     3. fluency from the audio timing (no AI)
//   The result is saved as a SpeechAttempt (without the audio).
import { ragEnabled } from "../config/env.ts";
import { SPEECH_LOCALES } from "../config/speech.ts";
import { HttpError, notFound } from "../lib/http-error.ts";
import { prisma } from "../lib/prisma.ts";
import { llmErrorToHttp } from "../ai/llm/http-errors.ts";
import { LlmError } from "../ai/llm/types.ts";
import type { KnowledgeLevelName } from "../rag/config.ts";
import type { LanguageCode } from "../rag/types.ts";
import { checkAudio, SPEECH_LIMITS, warningCodes, type UploadedFile } from "./audio-input.ts";
import { fluencyFeedback } from "./fluency.ts";
import { resolveLearnerContext } from "./learner-context.ts";
import { getPronunciationNotes, type PronunciationNotes } from "./pronunciation.ts";
import { getSpeechToText, getSttStatus, type SpeechToText } from "./stt.ts";
import { compareTranscript } from "./text-compare.ts";
import { getTtsStatus } from "./tts.ts";

export type AudioSource = "recorded" | "uploaded";

const toHttp = (error: unknown) =>
  error instanceof LlmError ? llmErrorToHttp(error, "speech", "SPEECH_NOT_CONFIGURED") : error;

function speechToText(): SpeechToText {
  try {
    return getSpeechToText();
  } catch (error) {
    throw toHttp(error);
  }
}

// Status

export function getSpeechStatus() {
  const stt = getSttStatus();
  const tts = getTtsStatus();
  return {
    speechToText: {
      provider: stt.provider,
      model: stt.model,
      available: stt.configured,
      isTestDouble: stt.isTestDouble,
    },
    textToSpeech: {
      provider: tts.provider,
      model: tts.model,
      voice: tts.voice,
      available: tts.configured,
      /** false = the browser's own voice is used (TTS_PROVIDER=browser) */
      serverAudio: tts.serverAudio,
      isTestDouble: tts.isTestDouble,
    },
    pronunciationNotes: stt.provider === "gemini",
    conversationNotes: ragEnabled,
    limits: SPEECH_LIMITS,
    locales: SPEECH_LOCALES,
  };
}

// Transcribe

export async function transcribeRecording(
  userId: string,
  file: UploadedFile | undefined,
  input: { language?: LanguageCode; source: AudioSource; mockTranscript?: string },
) {
  const started = performance.now();
  const audio = checkAudio(file);
  const context = await resolveLearnerContext(userId, { language: input.language });
  const stt = speechToText();

  let transcript;
  try {
    transcript = await stt.transcribe({
      audio: audio.wav,
      mimeType: "audio/wav",
      languageCode: context.languageCode,
      languageName: context.languageName,
      scriptName: context.scriptName,
      mockTranscript: input.mockTranscript,
    });
  } catch (error) {
    throw toHttp(error);
  }
  if (!transcript.text) {
    throw new HttpError(
      422,
      "NO_WORDS_HEARD",
      "We heard sound but couldn't make out any words. Try again a little closer to the microphone.",
    );
  }
  console.info(
    `[speech] transcribed ${context.languageCode} ${audio.meta.durationMs}ms → "${transcript.text.slice(0, 60)}" (${transcript.model})`,
  );
  return {
    transcript: transcript.text,
    language: { code: context.languageCode, name: context.languageName },
    model: transcript.model,
    audio: {
      source: input.source,
      durationMs: audio.meta.durationMs,
      speechMs: audio.analysis.speechMs,
      bytes: audio.meta.bytes,
      sampleRate: audio.meta.sampleRate,
    },
    warnings: warningCodes(audio.warnings),
    latencyMs: Math.round(performance.now() - started),
  };
}

// Speaking exercise

type Expected = {
  vocabularyItemId: string | null;
  script: string;
  romanization: string;
  meaning: string;
};

async function resolveExpected(
  languageCode: string,
  input: {
    vocabularyItemId?: string;
    expectedText?: string;
    romanization?: string;
    meaning?: string;
  },
): Promise<Expected> {
  if (input.vocabularyItemId) {
    const item = await prisma.vocabularyItem.findUnique({
      where: { id: input.vocabularyItemId },
      include: { language: { select: { code: true } } },
    });
    if (!item) throw notFound("VOCABULARY_NOT_FOUND", "Word or phrase not found");
    if (item.language.code !== languageCode) {
      throw new HttpError(400, "LANGUAGE_MISMATCH", "This phrase belongs to another language");
    }
    return {
      vocabularyItemId: item.id,
      script: item.script,
      romanization: item.romanization,
      meaning: item.meaning,
    };
  }
  if (!input.expectedText) {
    throw new HttpError(
      400,
      "EXPECTED_PHRASE_REQUIRED",
      'Send "vocabularyItemId" (a course phrase) or "expectedText"',
    );
  }
  return {
    vocabularyItemId: null,
    script: input.expectedText,
    romanization: input.romanization ?? "",
    meaning: input.meaning ?? "",
  };
}

export async function evaluateSpeaking(
  userId: string,
  file: UploadedFile | undefined,
  input: {
    language?: LanguageCode;
    level?: KnowledgeLevelName;
    vocabularyItemId?: string;
    expectedText?: string;
    romanization?: string;
    meaning?: string;
    source: AudioSource;
    mockTranscript?: string;
  },
) {
  const started = performance.now();
  const audio = checkAudio(file);
  const context = await resolveLearnerContext(userId, {
    language: input.language,
    level: input.level,
  });
  const expected = await resolveExpected(context.languageCode, input);
  const stt = speechToText();

  // Transcription (blind — it never sees the expected phrase) and the AI pronunciation notes
  // run at the same time. Notes failing never fails the exercise.
  const [transcription, notes] = await Promise.all([
    stt
      .transcribe({
        audio: audio.wav,
        mimeType: "audio/wav",
        languageCode: context.languageCode,
        languageName: context.languageName,
        scriptName: context.scriptName,
        mockTranscript: input.mockTranscript,
      })
      .catch((error: unknown) => {
        throw toHttp(error);
      }),
    getPronunciationNotes({
      stt,
      audio: audio.wav,
      mimeType: "audio/wav",
      expected,
      languageName: context.languageName,
      level: context.level,
    }).catch((error: unknown): PronunciationNotes => {
      console.warn(`[speech] pronunciation notes failed: ${(error as Error).message}`);
      return {
        supported: false,
        reason: "The AI notes are unavailable right now — try again later.",
      };
    }),
  ]);

  const content = compareTranscript(expected, transcription.text);
  const fluency = fluencyFeedback(audio.analysis, expected.script);
  const pronunciation: PronunciationNotes =
    content.verdict === "nothing-heard"
      ? { supported: false, reason: "No words were recognised, so there is nothing to comment on." }
      : notes;
  const latencyMs = Math.round(performance.now() - started);

  const attempt = await prisma.speechAttempt.create({
    data: {
      userId,
      languageCode: context.languageCode,
      vocabularyItemId: expected.vocabularyItemId,
      expectedText: expected.script,
      expectedRomanization: expected.romanization,
      transcript: transcription.text,
      contentScore: content.score,
      contentVerdict: content.verdict,
      contentMatch: { words: content.words, extraWords: content.extraWords },
      fluency,
      pronunciation,
      audioIssues: warningCodes(audio.warnings),
      audioSource: input.source === "uploaded" ? "UPLOADED" : "RECORDED",
      audioMimeType: audio.meta.mimeType,
      audioBytes: audio.meta.bytes,
      audioDurationMs: audio.meta.durationMs,
      audioSampleRate: audio.meta.sampleRate,
      speechMs: audio.analysis.speechMs,
      sttModel: transcription.model,
      latencyMs,
    },
  });
  console.info(
    `[speech] evaluate ${context.languageCode} "${expected.script}" → "${transcription.text}" ${content.verdict} (${content.score}) fluency=${fluency.rating} ${latencyMs}ms`,
  );

  return {
    attemptId: attempt.id,
    expected,
    transcript: transcription.text,
    language: { code: context.languageCode, name: context.languageName },
    level: context.level,
    // The three kinds of feedback are kept apart on purpose.
    content: {
      ...content,
      method:
        "Compares the speech-to-text transcript with the expected phrase, letter by letter. It shows whether the right words were recognised — not how native your pronunciation sounds.",
    },
    pronunciation,
    fluency,
    warnings: warningCodes(audio.warnings),
    audio: {
      source: input.source,
      durationMs: audio.meta.durationMs,
      speechMs: audio.analysis.speechMs,
      bytes: audio.meta.bytes,
      sampleRate: audio.meta.sampleRate,
    },
    model: transcription.model,
    latencyMs,
  };
}

// Practice material

/** Course words and phrases of a language, in course order, with my best score for each. */
export async function listSpeakingPhrases(userId: string, language?: LanguageCode) {
  const context = await resolveLearnerContext(userId, { language });
  const items = await prisma.vocabularyItem.findMany({
    where: { language: { code: context.languageCode }, kind: { in: ["WORD", "PHRASE"] } },
    include: {
      lessons: {
        select: { title: true, sortOrder: true, unit: { select: { sortOrder: true } } },
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
    },
  });
  const best = await prisma.speechAttempt.groupBy({
    by: ["vocabularyItemId"],
    where: { userId, languageCode: context.languageCode, vocabularyItemId: { not: null } },
    _max: { contentScore: true },
    _count: { _all: true },
  });
  const bestById = new Map(best.map((b) => [b.vocabularyItemId, b]));
  // Sort key: unit, then lesson; words that are in no lesson go last.
  const order = (item: (typeof items)[number]) =>
    (item.lessons[0]?.unit.sortOrder ?? 99) * 100 + (item.lessons[0]?.sortOrder ?? 99);

  return {
    language: { code: context.languageCode, name: context.languageName },
    level: context.level,
    phrases: items
      .sort((a, b) => order(a) - order(b) || a.id.localeCompare(b.id, "en", { numeric: true }))
      .map((item) => ({
        id: item.id,
        kind: item.kind,
        script: item.script,
        romanization: item.romanization,
        meaning: item.meaning,
        topic: item.topic,
        lesson: item.lessons[0]?.title ?? null,
        bestScore: bestById.get(item.id)?._max.contentScore ?? null,
        attempts: bestById.get(item.id)?._count._all ?? 0,
      })),
  };
}

export async function listSpeechAttempts(userId: string, language?: LanguageCode, limit = 20) {
  const attempts = await prisma.speechAttempt.findMany({
    where: { userId, ...(language ? { languageCode: language } : {}) },
    orderBy: { createdAt: "desc" },
    take: Math.min(limit, 50),
    select: {
      id: true,
      languageCode: true,
      vocabularyItemId: true,
      expectedText: true,
      transcript: true,
      contentScore: true,
      contentVerdict: true,
      fluency: true,
      audioSource: true,
      audioDurationMs: true,
      sttModel: true,
      createdAt: true,
    },
  });
  return attempts.map((a) => ({
    ...a,
    fluencyRating: (a.fluency as { rating?: string } | null)?.rating ?? null,
    fluency: undefined,
    createdAt: a.createdAt.toISOString(),
  }));
}
