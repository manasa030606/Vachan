import { z } from "zod";
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
