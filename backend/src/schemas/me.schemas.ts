import { z } from "zod";

export const DAILY_GOALS = ["casual", "regular", "serious", "intense"] as const;

/** PATCH /api/me — every field is optional; send only what changes. */
export const updateMeSchema = z
  .object({
    displayName: z.string().trim().min(2).max(60),
    languageCode: z.string().trim().toLowerCase().length(2, "Use a 2-letter code like hi or te"),
    learningGoal: z.string().trim().max(40).nullable(),
    dailyGoal: z.enum(DAILY_GOALS),
    selfAssessment: z.string().trim().max(40).nullable(),
    showRomanization: z.boolean(),
    soundEffects: z.boolean(),
    onboardingDone: z.boolean(),
  })
  .partial()
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Send at least one field to update",
  });

export type UpdateMeInput = z.infer<typeof updateMeSchema>;
