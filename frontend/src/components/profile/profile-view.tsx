"use client";

// Profile: account details (GET /api/me), learning progress (GET /api/progress) and settings.
import { useSession } from "@/components/session/session-provider";
import { getLanguage } from "@/data/languages";
import { MOCK_ACHIEVEMENTS } from "@/data/mock-user";
import { useApi } from "@/hooks/use-api";
import { getProgress } from "@/lib/api/endpoints";
import { useLearnerPreferences } from "@/lib/learner-preferences";
import { AchievementsGrid } from "./achievements-grid";
import { LanguageCard } from "./language-card";
import { ProfileHeader } from "./profile-header";
import { ProfileStats } from "./profile-stats";
import { SettingsCard } from "./settings-card";

function formatJoined(isoDate: string | undefined): string {
  if (!isoDate) return "";
  return new Date(isoDate).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

export function ProfileView() {
  const { user } = useSession();
  const { displayName, languageCode } = useLearnerPreferences();
  const language = getLanguage(languageCode);
  const { data } = useApi(async () => (await getProgress()).progress, "progress");
  const courseProgress = data?.courses.find((course) => course.language.code === languageCode);

  return (
    <div className="space-y-6">
      <ProfileHeader
        displayName={displayName}
        email={user?.email ?? ""}
        joinedLabel={formatJoined(user?.createdAt)}
        language={language}
      />
      <ProfileStats progress={data} />
      <AchievementsGrid achievements={MOCK_ACHIEVEMENTS} />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <LanguageCard
          language={language}
          progressLabel={
            courseProgress
              ? `${courseProgress.completedLessons} of ${courseProgress.totalLessons} lessons completed`
              : "Loading progress…"
          }
        />
        <SettingsCard />
      </div>
    </div>
  );
}
