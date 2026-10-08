"use client";

// Profile page: account details, learning progress, XP/streak/level, badges and settings.
// Data comes from GET /api/me, /api/progress, /api/stats and /api/achievements.
import { Compass, ShieldCheck } from "lucide-react";
import { useSession } from "@/components/session/session-provider";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLanguage } from "@/data/languages";
import { useApi } from "@/hooks/use-api";
import { getAchievements, getProgress } from "@/lib/api/endpoints";
import { useLearnerPreferences } from "@/lib/learner-preferences";
import { AchievementsGrid } from "./achievements-grid";
import { LanguageCard } from "./language-card";
import { ProfileHeader } from "./profile-header";
import { ProfileStats } from "./profile-stats";
import { SettingsCard } from "./settings-card";

/** e.g. "October 2026". */
function formatJoined(isoDate: string | undefined): string {
  if (!isoDate) return "";
  return new Date(isoDate).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

/** The Profile page. */
export function ProfileView() {
  const { user } = useSession();
  const { displayName, languageCode } = useLearnerPreferences();
  const language = getLanguage(languageCode);
  const { data } = useApi(async () => (await getProgress()).progress, "progress");
  const { data: badges } = useApi(
    async () => (await getAchievements()).achievements,
    "achievements",
  );
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
      <AchievementsGrid achievements={badges} />
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
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Compass aria-hidden="true" className="size-10 shrink-0 text-brand-600" />
        <div className="flex-1">
          <h2 className="text-lg font-bold">Placement test</h2>
          <p className="text-sm text-slate-600">
            Already know some {language.name}? 18 questions recommend where to start. You decide
            whether to skip ahead.
          </p>
        </div>
        <ButtonLink href="/placement" variant="secondary">
          Take the test
        </ButtonLink>
      </Card>
      {user?.role === "ADMIN" && (
        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <ShieldCheck aria-hidden="true" className="size-10 shrink-0 text-brand-600" />
          <div className="flex-1">
            <h2 className="text-lg font-bold">Admin dashboard</h2>
            <p className="text-sm text-slate-600">
              Manage languages, lessons, exercises, vocabulary and the AI Tutor’s knowledge base,
              and see learning analytics.
            </p>
          </div>
          <ButtonLink href="/admin" variant="secondary">
            Open dashboard
          </ButtonLink>
        </Card>
      )}
    </div>
  );
}
