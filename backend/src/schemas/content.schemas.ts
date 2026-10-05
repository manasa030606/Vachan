import { z } from "zod";

/** Route parameter ids, e.g. /api/lessons/:id */
export const idParamSchema = z.object({
  id: z.string().trim().min(1).max(100),
});

export const lessonIdParamSchema = z.object({
  lessonId: z.string().trim().min(1).max(100),
});

/** GET /api/courses?languageCode=te */
export const listCoursesQuerySchema = z.object({
  languageCode: z.string().trim().toLowerCase().length(2).optional(),
});

/**
 * POST /api/exercises/:id/attempt
 * The shape of `answer` depends on the exercise type:
 *   multiple-choice / character-recognition / character-sound / fill-in-blank → { "optionId": "..." }
 *   translation                                              → { "text": "thank you" }
 *   word-order                                               → { "optionIds": ["...", "..."] }
 *   matching                                                 → { "pairs": [{ "leftId": "...", "rightId": "..." }] }
 */
export const attemptBodySchema = z.object({
  answer: z.union(
    [
      z.object({ optionId: z.string().min(1) }).strict(),
      z.object({ text: z.string().trim().min(1, "Type an answer").max(200) }).strict(),
      z.object({ optionIds: z.array(z.string().min(1)).min(1).max(20) }).strict(),
      z
        .object({
          pairs: z
            .array(z.object({ leftId: z.string().min(1), rightId: z.string().min(1) }).strict())
            .min(1)
            .max(20),
        })
        .strict(),
    ],
    { error: "answer must be { optionId }, { text }, { optionIds } or { pairs } (see README)" },
  ),
  /** "lesson" (default) or "review" — answers given on the Practice → Review screen. */
  mode: z.enum(["lesson", "review"]).default("lesson"),
});

export type AttemptAnswer = z.infer<typeof attemptBodySchema>["answer"];
export type AttemptMode = z.infer<typeof attemptBodySchema>["mode"];

/** POST /api/lessons/:id/start — body is optional. */
export const startLessonBodySchema = z
  .object({
    /** Start the run again from the first exercise instead of resuming. */
    restart: z.boolean().default(false),
  })
  .strict()
  .default({ restart: false });

/** GET /api/review, /api/review/attempts, /api/review/session */
export const reviewQuerySchema = z.object({
  languageCode: z.string().trim().toLowerCase().length(2).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
