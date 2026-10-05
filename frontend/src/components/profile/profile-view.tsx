"use client";

import { getLanguage } from "@/data/languages";
import { getCurrentLesson } from "@/data/mock-course";
import { MOCK_ACHIEVEMENTS, MOCK_PROGRESS } from "@/data/mock-user";
import { useLearnerPreferences } from "@/lib/learner-preferences";
import { AchievementsGrid } from "./achievements-grid";
import { LanguageCard } from "./language-card";
import { ProfileHeader } from "./profile-header";
import { ProfileStats } from "./profile-stats";
import { SettingsCard } from "./settings-card";

export function ProfileView() {
  const { displayName, languageCode } = useLearnerPreferences();
  const language = getLanguage(languageCode);
  const current = getCurrentLesson(languageCode);

  return (
    <div className="space-y-6">
      <ProfileHeader
        displayName={displayName}
        username={MOCK_PROGRESS.username}
        joinedLabel={MOCK_PROGRESS.joinedLabel}
        language={language}
      />
      <ProfileStats />
      <AchievementsGrid achievements={MOCK_ACHIEVEMENTS} />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <LanguageCard language={language} currentUnitTitle={current?.unit.title ?? "—"} />
        <SettingsCard />
      </div>
    </div>
  );
}
