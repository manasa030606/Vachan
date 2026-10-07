// Request validation for the AI tutor and role-play conversation routes.
import { z } from "zod";
import { CONVERSATION_CONFIG, SCENARIO_IDS } from "../config/conversation.ts";
import { TUTOR_CONFIG } from "../config/tutor.ts";
import { KNOWLEDGE_LEVELS } from "../rag/config.ts";
import { LANGUAGE_CODES } from "../rag/types.ts";

const id = z.string().trim().min(1).max(100);

/** POST /api/ai/tutor */
export const tutorAskSchema = z
  .object({
    question: z
      .string({ error: "question is required" })
      .trim()
      .min(2, "Type a question first")
      .max(
        TUTOR_CONFIG.maxQuestionLength,
        `Questions can be at most ${TUTOR_CONFIG.maxQuestionLength} characters`,
      ),
    /** Continue an existing chat (its language and lesson are reused). */
    conversationId: id.optional(),
    /** Target language — default: the learner's current language. */
    language: z.enum(LANGUAGE_CODES).optional(),
    /** Learner level — default: from the onboarding self-assessment. */
    level: z.enum(KNOWLEDGE_LEVELS).optional(),
    /** Current lesson — default: the lesson the learner was most recently in. */
    lessonId: id.optional(),
    /** "Why is my answer wrong?" — an exercise the learner has already answered. */
    exerciseId: id.optional(),
  })
  .strict();

/** GET /api/ai/tutor/context?language=te&lessonId=te-u1-l1 */
export const tutorContextQuerySchema = z.object({
  language: z.enum(LANGUAGE_CODES).optional(),
  lessonId: id.optional(),
});

/** GET /api/ai/conversations?language=te */
export const conversationListQuerySchema = z.object({
  language: z.enum(LANGUAGE_CODES).optional(),
});

// Role-play conversation

/** GET /api/ai/conversation/scenarios?language=te  ·  GET /api/ai/conversation?language=te */
export const conversationLanguageQuerySchema = z.object({
  language: z.enum(LANGUAGE_CODES).optional(),
});

/** POST /api/ai/conversation */
export const conversationStartSchema = z
  .object({
    scenario: z.enum(SCENARIO_IDS, {
      error: `scenario must be one of: ${SCENARIO_IDS.join(", ")}`,
    }),
    language: z.enum(LANGUAGE_CODES).optional(),
    level: z.enum(KNOWLEDGE_LEVELS).optional(),
  })
  .strict();

/** POST /api/ai/conversation/:id/reply */
export const conversationReplySchema = z
  .object({
    text: z
      .string({ error: "text is required" })
      .trim()
      .min(1, "Type or say something first")
      .max(
        CONVERSATION_CONFIG.maxReplyLength,
        `At most ${CONVERSATION_CONFIG.maxReplyLength} characters`,
      ),
    /** voice = the text is a transcript from POST /api/speech/transcribe */
    inputMode: z.enum(["text", "voice"]).default("text"),
    /** Facts about the recording (voice replies only) — the audio itself is not sent here. */
    audio: z
      .object({
        durationMs: z.number().int().min(0).max(120_000).optional(),
        bytes: z.number().int().min(0).max(10_000_000).optional(),
        sttModel: z.string().max(100).optional(),
      })
      .strict()
      .optional(),
  })
  .strict();
