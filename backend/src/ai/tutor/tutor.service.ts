// The AI tutor pipeline (Phase 6):
//
//   question ─► safety check ─► learner context (language, level, unit, lesson, exercise)
//            ─► retrieval query ─► RAG retrieval (Phase 5, language filter + level re-ranking)
//            ─► enough evidence?  no → "not in my notes" (NO LLM call)
//                                 yes → prompt with the retrieved notes ─► LLM ─► JSON
//            ─► grounding checks (sources must be retrieved notes, examples must appear in them)
//            ─► answer + references ─► saved in AIConversation / AIMessage
//
// There is no code path that sends a question to the LLM without retrieved notes.
import { ragEnabled } from "../../config/env.ts";
import { TUTOR_CONFIG } from "../../config/tutor.ts";
import type { Prisma } from "../../generated/prisma/client.ts";
import { HttpError, notFound } from "../../lib/http-error.ts";
import { prisma } from "../../lib/prisma.ts";
import { LANGUAGE_NAMES } from "../../rag/chunking.ts";
import type { KnowledgeLevelName } from "../../rag/config.ts";
import { searchKnowledge } from "../../rag/retrieval.service.ts";
import type { LanguageCode } from "../../rag/types.ts";
import { correctAnswerText, describeAnswer } from "../../services/answer-checker.ts";
import { llmErrorToHttp } from "../llm/http-errors.ts";
import { getLlmProvider, getLlmStatus } from "../llm/index.ts";
import { LlmError } from "../llm/types.ts";
import { decideLevel } from "./level.ts";
import { buildSystemPrompt, buildUserPrompt, type ContextChunk } from "./prompt.ts";
import { buildRetrievalQuery } from "./query-builder.ts";
import { parseTutorReply, UnreadableAnswerError, type ParsedAnswer } from "./response-parser.ts";
import { detectInjection, sanitizeQuestion } from "./safety.ts";
import { suggestQuestions } from "./suggestions.ts";

export type AskInput = {
  question: string;
  conversationId?: string;
  language?: LanguageCode;
  level?: KnowledgeLevelName;
  lessonId?: string;
  exerciseId?: string;
};

export type Reference = {
  n: number;
  id: string;
  heading: string;
  excerpt: string;
  source: string;
  reference: string;
  level: string;
  contentType: string;
  similarity: number;
  /** true = the answer is based on this note (cited by the model) */
  used: boolean;
};

const insufficientText = (language: string) =>
  `I couldn't find this in Vachan's ${language} notes, so I won't guess. I can help with ${language} letters and sounds, everyday phrases, basic grammar and the words from your lessons — try one of the suggested questions.`;

const refusalText = (language: string) =>
  `I can only help you learn ${language} — words, grammar, pronunciation and phrases. Please ask me something about ${language}.`;

// ── Learner context ─────────────────────────────────────────────

async function loadLesson(lessonId: string, languageCode: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      unit: { include: { course: { include: { language: { select: { code: true } } } } } },
      vocabulary: { select: { script: true, meaning: true }, take: 6 },
    },
  });
  if (!lesson) throw notFound("LESSON_NOT_FOUND", "Lesson not found");
  if (lesson.unit.course.language.code !== languageCode) {
    throw new HttpError(400, "LESSON_LANGUAGE_MISMATCH", "This lesson belongs to another language");
  }
  return lesson;
}

/** The lesson the learner was most recently active in, for this language. */
async function latestLessonId(userId: string, languageCode: string) {
  const progress = await prisma.userLessonProgress.findFirst({
    where: {
      userId,
      placedOut: false,
      lesson: { unit: { course: { language: { code: languageCode } } } },
    },
    orderBy: { lastActivityAt: "desc" },
    select: { lessonId: true },
  });
  return progress?.lessonId ?? null;
}

/**
 * "Why is my answer wrong?" — the exercise and the learner's LAST answer, from the database.
 * Only available after the learner has answered it, so the tutor can't be used to get answers early.
 */
async function loadExercise(userId: string, exerciseId: string, languageCode: string) {
  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
    include: {
      options: true,
      lesson: { include: { unit: { include: { course: { include: { language: true } } } } } },
    },
  });
  if (!exercise) throw notFound("EXERCISE_NOT_FOUND", "Exercise not found");
  if (exercise.lesson.unit.course.language.code !== languageCode) {
    throw new HttpError(
      400,
      "EXERCISE_LANGUAGE_MISMATCH",
      "This exercise belongs to another language",
    );
  }
  const attempt = await prisma.userExerciseAttempt.findFirst({
    where: { userId, exerciseId },
    orderBy: { createdAt: "desc" },
  });
  if (!attempt) {
    throw new HttpError(
      403,
      "EXERCISE_NOT_ANSWERED",
      "Answer this exercise first, then ask the tutor about it",
    );
  }
  const correctAnswer = correctAnswerText(exercise);
  return {
    lessonId: exercise.lessonId,
    searchText: `${exercise.prompt} — ${correctAnswer}. ${exercise.explanation ?? ""}`.trim(),
    prompt: `${exercise.instruction}: ${exercise.prompt}${exercise.promptSubtext ? ` (${exercise.promptSubtext})` : ""}`,
    learnerAnswer: describeAnswer(exercise, attempt.answer) || "(no answer)",
    correctAnswer,
    explanation: exercise.explanation,
    wasCorrect: attempt.isCorrect,
  };
}

export async function resolveTutorContext(
  userId: string,
  input: {
    language?: LanguageCode;
    level?: KnowledgeLevelName;
    lessonId?: string;
    conversationLanguage?: string;
    conversationLessonId?: string | null;
  },
) {
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    select: { selfAssessment: true, currentLanguage: { select: { code: true } } },
  });
  // Language: the chat's, the request's, the lesson's (when only a lesson is given), the profile's.
  const lessonLanguage =
    !input.conversationLanguage && !input.language && input.lessonId
      ? (
          await prisma.lesson.findUnique({
            where: { id: input.lessonId },
            select: {
              unit: { select: { course: { select: { language: { select: { code: true } } } } } },
            },
          })
        )?.unit.course.language.code
      : undefined;
  const languageCode =
    input.conversationLanguage ??
    input.language ??
    lessonLanguage ??
    profile?.currentLanguage?.code;
  if (!languageCode) {
    throw new HttpError(
      400,
      "NO_LANGUAGE",
      'Choose a language first (onboarding) or send "language"',
    );
  }
  const languageName = LANGUAGE_NAMES[languageCode] ?? languageCode;
  const level = decideLevel(input.level, profile?.selfAssessment);

  const lessonId =
    input.lessonId ?? input.conversationLessonId ?? (await latestLessonId(userId, languageCode));
  const lesson = lessonId ? await loadLesson(lessonId, languageCode) : null;

  return {
    languageCode: languageCode as LanguageCode,
    languageName,
    level: level.level,
    levelSource: level.source,
    lesson,
    unitTitle: lesson ? `Unit ${lesson.unit.sortOrder}: ${lesson.unit.title}` : null,
    lessonTitle: lesson?.title ?? null,
  };
}

// ── Status / context for the UI ─────────────────────────────────

export function getTutorAvailability() {
  const llm = getLlmStatus();
  const reason = !ragEnabled
    ? "Knowledge-base search is turned off on this server (RAG_ENABLED=false), so the tutor can't look anything up."
    : !llm.configured
      ? `The tutor needs ${llm.keyVariable} in backend/.env (see docs/AI_TUTOR.md → Setup).`
      : null;
  return {
    available: reason === null,
    reason,
    provider: llm.provider,
    providerLabel: llm.providerLabel,
    model: llm.model,
    isTestDouble: llm.isTestDouble,
    searchEnabled: ragEnabled,
  };
}

export async function getTutorContext(
  userId: string,
  input: { language?: LanguageCode; lessonId?: string },
) {
  const context = await resolveTutorContext(userId, input);
  return {
    context: {
      language: { code: context.languageCode, name: context.languageName },
      level: context.level,
      levelSource: context.levelSource,
      unit: context.unitTitle,
      lesson: context.lesson ? { id: context.lesson.id, title: context.lesson.title } : null,
    },
    suggestions: suggestQuestions({
      languageName: context.languageName,
      lesson: context.lesson
        ? {
            title: context.lesson.title,
            kind: context.lesson.kind,
            words: context.lesson.vocabulary,
          }
        : null,
    }),
    status: getTutorAvailability(),
  };
}

// ── Ask ─────────────────────────────────────────────────────────

const toHttpError = (error: LlmError) => llmErrorToHttp(error, "tutor", "TUTOR_NOT_CONFIGURED");

export async function askTutor(userId: string, input: AskInput) {
  const started = performance.now();
  const question = sanitizeQuestion(input.question);
  if (question.length < 2) throw new HttpError(400, "EMPTY_QUESTION", "Type a question first");

  const conversation = input.conversationId
    ? await prisma.aIConversation.findFirst({ where: { id: input.conversationId, userId } })
    : null;
  if (input.conversationId && !conversation) {
    throw notFound("CONVERSATION_NOT_FOUND", "Conversation not found");
  }

  const context = await resolveTutorContext(userId, {
    language: input.language,
    level: input.level,
    lessonId: input.lessonId,
    conversationLanguage: conversation?.languageCode,
    conversationLessonId: conversation?.lessonId,
  });
  const exercise = input.exerciseId
    ? await loadExercise(userId, input.exerciseId, context.languageCode)
    : null;

  const history = conversation
    ? (
        await prisma.aIMessage.findMany({
          where: { conversationId: conversation.id },
          orderBy: { createdAt: "desc" },
          take: TUTOR_CONFIG.historyMessages,
          select: { role: true, content: true },
        })
      )
        .reverse()
        .map((m) => ({
          role: m.role === "USER" ? ("user" as const) : ("assistant" as const),
          content: m.content,
        }))
    : [];

  const baseContext = {
    language: context.languageCode,
    level: context.level,
    levelSource: context.levelSource,
    unit: context.unitTitle,
    lesson: context.lessonTitle,
    exerciseId: input.exerciseId ?? null,
  };

  // 1. Basic prompt-injection check — refused before retrieval or any LLM call.
  const injection = detectInjection(question);
  if (injection) {
    console.warn(`[tutor] refused (${injection}) user=${userId}`);
    return save(userId, conversation?.id, context, question, {
      content: refusalText(context.languageName),
      status: "REFUSED",
      references: [],
      examples: [],
      context: { ...baseContext, refusedBecause: injection },
      model: null,
      latencyMs: Math.round(performance.now() - started),
    });
  }

  if (!ragEnabled) {
    throw new HttpError(
      503,
      "TUTOR_UNAVAILABLE",
      getTutorAvailability().reason ?? "Tutor unavailable",
    );
  }

  // 2. RAG retrieval (the tutor never answers without it).
  const previousQuestion = [...history].reverse().find((m) => m.role === "user")?.content ?? null;
  const retrievalQuery = buildRetrievalQuery({
    question,
    previousQuestion,
    lessonTitle: context.lessonTitle,
    exercise,
  });
  const retrieval = await searchKnowledge({
    query: retrievalQuery.query,
    language: context.languageCode,
    level: context.level,
    limit: TUTOR_CONFIG.contextChunks,
  });

  const chunks: ContextChunk[] = retrieval.results.map((result, index) => ({
    n: index + 1,
    heading: result.heading,
    content: result.content,
    contentType: result.metadata.contentType,
    level: result.metadata.level,
    source: result.metadata.source,
  }));
  const references = (usedIds: number[]): Reference[] =>
    retrieval.results.map((result, index) => ({
      n: index + 1,
      id: result.id,
      heading: result.heading,
      excerpt: result.content.length > 320 ? `${result.content.slice(0, 320)}…` : result.content,
      source: result.metadata.source,
      reference: result.reference,
      level: result.metadata.level,
      contentType: result.metadata.contentType,
      similarity: result.relevance.similarity,
      used: usedIds.includes(index + 1),
    }));
  const retrievalInfo = {
    retrievalQuery: retrievalQuery.query,
    queryNotes: retrievalQuery.reasons,
    bestSimilarity: retrieval.retrieval.bestSimilarity,
    sufficient: retrieval.retrieval.sufficient,
  };

  // 3. Not enough evidence → say so. No LLM call, nothing invented.
  if (!retrieval.retrieval.sufficient || chunks.length === 0) {
    return save(userId, conversation?.id, context, question, {
      content: insufficientText(context.languageName),
      status: "INSUFFICIENT",
      references: references([]),
      examples: [],
      context: { ...baseContext, ...retrievalInfo },
      model: null,
      latencyMs: Math.round(performance.now() - started),
    });
  }

  // 4. Prompt augmentation + LLM.
  let provider;
  try {
    provider = getLlmProvider();
  } catch (error) {
    if (error instanceof LlmError) throw toHttpError(error);
    throw error;
  }
  const system = buildSystemPrompt(context.languageName, context.level);
  const userPrompt = buildUserPrompt({
    languageName: context.languageName,
    level: context.level,
    unitTitle: context.unitTitle,
    lessonTitle: context.lessonTitle,
    exercise,
    history,
    chunks,
    question,
  });

  let parsed: ParsedAnswer | null = null;
  let model = provider.model;
  for (let attempt = 1; attempt <= 2 && !parsed; attempt++) {
    try {
      const result = await provider.generate({
        system,
        turns: [{ role: "user", text: userPrompt }],
        json: true,
        temperature: TUTOR_CONFIG.temperature,
        maxOutputTokens: TUTOR_CONFIG.maxOutputTokens,
      });
      model = result.model;
      // 5. Grounding checks on the reply.
      parsed = parseTutorReply(
        result.text,
        chunks.map((c) => `${c.heading}\n${c.content}`),
        insufficientText(context.languageName),
      );
    } catch (error) {
      if (error instanceof LlmError) throw toHttpError(error);
      if (error instanceof UnreadableAnswerError && attempt < 2) continue; // one retry
      if (error instanceof UnreadableAnswerError) {
        throw new HttpError(
          502,
          "LLM_BAD_ANSWER",
          "The AI gave an answer in the wrong format. Please try again.",
        );
      }
      throw error;
    }
  }
  const answer = parsed!;
  if (answer.issues.length > 0) console.info(`[tutor] checks: ${answer.issues.join(", ")}`);

  return save(userId, conversation?.id, context, question, {
    content: answer.answer,
    status: answer.status === "answered" ? "ANSWERED" : "INSUFFICIENT",
    references: references(answer.sourceIds),
    examples: answer.examples,
    context: { ...baseContext, ...retrievalInfo, checks: answer.issues },
    model,
    latencyMs: Math.round(performance.now() - started),
  });
}

// ── Saving + DTOs ───────────────────────────────────────────────

type AssistantDraft = {
  content: string;
  status: "ANSWERED" | "INSUFFICIENT" | "REFUSED";
  references: Reference[];
  examples: Array<{ native: string; romanization: string; meaning: string }>;
  context: Record<string, unknown>;
  model: string | null;
  latencyMs: number;
};

async function save(
  userId: string,
  conversationId: string | undefined,
  context: Awaited<ReturnType<typeof resolveTutorContext>>,
  question: string,
  draft: AssistantDraft,
) {
  const result = await prisma.$transaction(async (tx) => {
    const conversation = conversationId
      ? await tx.aIConversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() },
        })
      : await tx.aIConversation.create({
          data: {
            userId,
            languageCode: context.languageCode,
            title: question.length > 60 ? `${question.slice(0, 57)}…` : question,
            lessonId: context.lesson?.id ?? null,
          },
        });
    const userMessage = await tx.aIMessage.create({
      data: { conversationId: conversation.id, role: "USER", content: question },
    });
    const assistantMessage = await tx.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: "ASSISTANT",
        content: draft.content,
        status: draft.status,
        references: draft.references as unknown as Prisma.InputJsonValue,
        examples: draft.examples as unknown as Prisma.InputJsonValue,
        context: draft.context as Prisma.InputJsonValue,
        model: draft.model,
        latencyMs: draft.latencyMs,
      },
    });
    return { conversation, userMessage, assistantMessage };
  });

  console.info(
    `[tutor] ${draft.status} lang=${context.languageCode} level=${context.level} sources=${
      draft.references
        .filter((r) => r.used)
        .map((r) => r.id)
        .join(",") || "-"
    } ${draft.model ?? "no-llm"} ${draft.latencyMs}ms`,
  );

  return {
    conversation: toConversationDto(result.conversation),
    messages: [toMessageDto(result.userMessage), toMessageDto(result.assistantMessage)],
  };
}

type MessageRow = Prisma.AIMessageGetPayload<object>;
type ConversationRow = Prisma.AIConversationGetPayload<object>;

export const toConversationDto = (row: ConversationRow) => ({
  id: row.id,
  title: row.title,
  language: row.languageCode,
  lessonId: row.lessonId,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
});

export const toMessageDto = (row: MessageRow) => ({
  id: row.id,
  role: row.role === "USER" ? ("user" as const) : ("assistant" as const),
  content: row.content,
  status: row.status ? (row.status.toLowerCase() as "answered" | "insufficient" | "refused") : null,
  references: (row.references as Reference[] | null) ?? [],
  examples: (row.examples as AssistantDraft["examples"] | null) ?? [],
  context: (row.context as Record<string, unknown> | null) ?? null,
  model: row.model,
  latencyMs: row.latencyMs,
  createdAt: row.createdAt.toISOString(),
});
