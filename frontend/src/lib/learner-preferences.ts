// The learner's settings, read from the logged-in user's profile (GET /api/me)
// and saved with PATCH /api/me. (Phase 1 kept these in localStorage; Phase 2 uses the database.)
import { useCallback } from "react";
import { useSession } from "@/components/session/session-provider";
import { DEFAULT_LANGUAGE_CODE, isLanguageCode } from "@/data/languages";
import { updateMe } from "@/lib/api/endpoints";
import type { DailyGoalId, ProfileUpdate } from "@/lib/api/types";
import type { LanguageCode } from "@/types/learning";

export type LearnerPreferences = {
  displayName: string;
  languageCode: LanguageCode;
  learningGoalId: string | null;
  dailyGoalId: DailyGoalId;
  selfAssessmentId: string | null;
  showRomanization: boolean;
  soundEffects: boolean;
};

export const DEFAULT_PREFERENCES: LearnerPreferences = {
  displayName: "Learner",
  languageCode: DEFAULT_LANGUAGE_CODE,
  learningGoalId: null,
  dailyGoalId: "regular",
  selfAssessmentId: null,
  showRomanization: true,
  soundEffects: true,
};

/** React hook: the current learner's preferences (defaults while loading). */
export function useLearnerPreferences(): LearnerPreferences {
  const { user } = useSession();
  const profile = user?.profile;
  if (!profile) return DEFAULT_PREFERENCES;

  const code = profile.currentLanguage?.code;
  return {
    displayName: profile.displayName,
    languageCode: code && isLanguageCode(code) ? code : DEFAULT_LANGUAGE_CODE,
    learningGoalId: profile.learningGoal,
    dailyGoalId: profile.dailyGoal,
    selfAssessmentId: profile.selfAssessment,
    showRomanization: profile.showRomanization,
    soundEffects: profile.soundEffects,
  };
}

/** React hook: returns a function that saves profile changes to the backend. */
export function useUpdatePreferences() {
  const { setUser } = useSession();
  return useCallback(
    async (changes: ProfileUpdate) => {
      const { user } = await updateMe(changes);
      setUser(user);
      return user;
    },
    [setUser],
  );
}
