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
 *   multiple-choice / character-recognition / fill-in-blank → { "optionId": "..." }
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
});

export type AttemptAnswer = z.infer<typeof attemptBodySchema>["answer"];
