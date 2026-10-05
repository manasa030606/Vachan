// Phase 1 mock "session": remembers the learner's onboarding choices in the browser
// (localStorage) so the demo feels connected across pages.
// Phase 2 replaces this with the real user profile from the backend API.
import { useSyncExternalStore } from "react";
import { z } from "zod";
import { DEFAULT_LANGUAGE_CODE } from "@/data/languages";

const STORAGE_KEY = "vachan.preferences.v1";

const preferencesSchema = z.object({
  displayName: z.string().min(1).max(60),
  languageCode: z.enum(["hi", "te", "ta", "ml", "kn", "bn"]),
  learningGoalId: z.string().nullable(),
  dailyGoalId: z.enum(["casual", "regular", "serious", "intense"]),
  selfAssessmentId: z.string().nullable(),
  showRomanization: z.boolean(),
  soundEffects: z.boolean(),
});

export type LearnerPreferences = z.infer<typeof preferencesSchema>;

export const DEFAULT_PREFERENCES: LearnerPreferences = {
  displayName: "Learner",
  languageCode: DEFAULT_LANGUAGE_CODE,
  learningGoalId: null,
  dailyGoalId: "regular",
  selfAssessmentId: null,
  showRomanization: true,
  soundEffects: true,
};

// ── A tiny external store (works with React's useSyncExternalStore) ──
const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedValue: LearnerPreferences = DEFAULT_PREFERENCES;
let memoryOnlyValue: LearnerPreferences | null = null; // used if localStorage is blocked

function parse(raw: string | null): LearnerPreferences {
  if (!raw) return DEFAULT_PREFERENCES;
  try {
    const result = preferencesSchema.partial().safeParse(JSON.parse(raw));
    return result.success ? { ...DEFAULT_PREFERENCES, ...result.data } : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function getSnapshot(): LearnerPreferences {
  if (memoryOnlyValue) return memoryOnlyValue;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return cachedValue;
  }
  // Only re-parse when the stored text changed, so React gets the same object back.
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = parse(raw);
  }
  return cachedValue;
}

function getServerSnapshot(): LearnerPreferences {
  return DEFAULT_PREFERENCES;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Update one or more preferences. All components using them re-render. */
export function updatePreferences(changes: Partial<LearnerPreferences>): void {
  const next = { ...getSnapshot(), ...changes };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    memoryOnlyValue = next;
  }
  listeners.forEach((listener) => listener());
}

/** Clears the mock session (used by "Log out"). */
export function resetPreferences(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  memoryOnlyValue = null;
  listeners.forEach((listener) => listener());
}

/** React hook: read the current learner preferences. */
export function useLearnerPreferences(): LearnerPreferences {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
