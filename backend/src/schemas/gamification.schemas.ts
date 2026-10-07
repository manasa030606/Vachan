// Request validation for the placement test and recommendations.
import { z } from "zod";
import { attemptBodySchema } from "./content.schemas.ts";

const id = z.string().trim().min(1).max(100);

/** POST /api/placement/start — languageCode is optional (defaults to your current language). */
export const placementStartSchema = z
  .object({ languageCode: z.string().trim().toLowerCase().length(2).optional() })
  .strict()
  .default({});

/** POST /api/placement/answer */
export const placementAnswerSchema = z
  .object({
    testId: id,
    questionId: id,
    answer: attemptBodySchema.shape.answer,
  })
  .strict();

/** GET /api/placement/result?testId=… */
export const placementResultQuerySchema = z.object({ testId: id.optional() });

/** POST /api/placement/decide */
export const placementDecideSchema = z
  .object({
    testId: id,
    /** "recommended" = start at the recommended unit, "beginning" = start from Unit 1. */
    choice: z.enum(["recommended", "beginning"]),
  })
  .strict();

/** GET /api/recommendations?languageCode=te */
export const languageQuerySchema = z.object({
  languageCode: z.string().trim().toLowerCase().length(2).optional(),
});
