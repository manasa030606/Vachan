"use client";

// The Home / Learn screen: course header, recommended lesson, the unit path,
// and (on desktop) a right-hand column with streak, daily goal, level and hearts.
import { DailyGoalCard } from "@/components/gamification/daily-goal-card";
import { HeartsCard } from "@/components/gamification/hearts-card";
import { LevelCard } from "@/components/gamification/level-card";
import { StreakCard } from "@/components/gamification/streak-card";
import { getLanguage } from "@/data/languages";
import { getCoursePath, getCurrentLesson } from "@/data/mock-course";
import { getMistakes } from "@/data/mock-practice";
import { useLearnerPreferences } from "@/lib/learner-preferences";
import { ReviewCard } from "./review-card";
import { UnitSection } from "./unit-section";
import { UpNextCard } from "./up-next-card";

export function LearnView() {
  const { languageCode } = useLearnerPreferences();
  const language = getLanguage(languageCode);
  const units = getCoursePath(languageCode);
  const current = getCurrentLesson(languageCode);
  const mistakeCount = getMistakes(languageCode).length;

  return (
    <div className="flex gap-8">
      <div className="min-w-0 flex-1 space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-ink">
            {language.name}{" "}
            <span className="font-display text-brand-600">{language.nativeName}</span>
          </h1>
          <p className="text-slate-600">Your learning path · {language.scriptName}</p>
        </div>

        {current && <UpNextCard language={language} unit={current.unit} lesson={current.lesson} />}

        {/* On phones/tablets the daily goal sits above the path; on desktop it is in the right column. */}
        <div className="lg:hidden">
          <DailyGoalCard compact />
        </div>

        <div className="mx-auto max-w-xl space-y-4 pt-4">
          {units.map((unit) => (
            <UnitSection key={unit.id} unit={unit} />
          ))}
          <p className="pb-4 text-center text-sm text-slate-500">
            More units (Sentence Building → Advanced) arrive with the real course content in Phase
            3.
          </p>
        </div>
      </div>

      <aside aria-label="Your progress" className="hidden w-80 shrink-0 space-y-4 lg:block">
        <div className="sticky top-24 space-y-4">
          <DailyGoalCard />
          <StreakCard />
          <LevelCard />
          <HeartsCard />
          <ReviewCard mistakeCount={mistakeCount} />
        </div>
      </aside>
    </div>
  );
}
