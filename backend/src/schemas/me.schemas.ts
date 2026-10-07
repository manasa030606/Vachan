// Request validation for the learner's own profile and settings (PATCH /api/me).
import { z } from "zod";
import { isValidTimeZone } from "../services/gamification/dates.ts";

export const DAILY_GOALS = ["casual", "regular", "serious", "intense"] as const;

/** The six onboarding self-assessment answers, as stored ids. */
export const SELF_ASSESSMENTS = [
  "new", // Completely new — I know nothing
  "few-words", // I know a few words
  "knows-script", // I know the alphabet/script but need practice
  "basic-sentences", // I can understand basic sentences
  "simple-conversations", // I can have simple conversations
  "advanced", // I'm comfortable and want advanced practice
] as const;

/** PATCH /api/me — every field is optional; send only what changes. */
export const updateMeSchema = z
  .object({
    displayName: z.string().trim().min(2).max(60),
    languageCode: z.string().trim().toLowerCase().length(2, "Use a 2-letter code like hi or te"),
    learningGoal: z.string().trim().max(40).nullable(),
    dailyGoal: z.enum(DAILY_GOALS),
    selfAssessment: z.enum(SELF_ASSESSMENTS).nullable(),
    showRomanization: z.boolean(),
    soundEffects: z.boolean(),
    onboardingDone: z.boolean(),
    /** IANA time zone from the browser, e.g. "Asia/Kolkata" (decides when a streak day starts). */
    timeZone: z.string().trim().max(60).refine(isValidTimeZone, "Unknown time zone"),
  })
  .partial()
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Send at least one field to update",
  });

export type UpdateMeInput = z.infer<typeof updateMeSchema>;
