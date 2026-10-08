"use client";

// The Home / Learn screen: course header, recommended lesson and the unit path,
// plus (on desktop) a right-hand column with daily goal, streak, level and hearts.
// The course and lesson statuses come from the courses API; the stat cards read GET /api/stats.
import { PartyPopper } from "lucide-react";
import { AchievementsCard } from "@/components/gamification/achievements-card";
import { DailyGoalCard } from "@/components/gamification/daily-goal-card";
import { HeartsCard } from "@/components/gamification/hearts-card";
import { LevelCard } from "@/components/gamification/level-card";
import { RecommendationsCard } from "@/components/gamification/recommendations-card";
import { StreakCard } from "@/components/gamification/streak-card";
import { LogoMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getLanguage, withTheme } from "@/data/languages";
import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api/client";
import { getCourse, getCourses } from "@/lib/api/endpoints";
import { toUnits } from "@/lib/api/mappers";
import { useLearnerPreferences } from "@/lib/learner-preferences";
import { UnitSection } from "./unit-section";
import { UpNextCard } from "./up-next-card";

/** Finds the course for a language, then loads it with this learner's lesson statuses. */
async function loadCourseFor(languageCode: string) {
  const { courses } = await getCourses(languageCode);
  if (courses.length === 0) {
    throw new ApiError(
      404,
      "NO_COURSE",
      "No course is available for this language yet. Did you run the seed?",
    );
  }
  return (await getCourse(courses[0].id)).course;
}

/** The main learning path page for the learner's current language. */
export function LearnView() {
  const { languageCode } = useLearnerPreferences();
  const {
    data: course,
    error,
    isLoading,
    reload,
  } = useApi(() => loadCourseFor(languageCode), `course-for:${languageCode}`);
  const language = course ? withTheme(course.language) : getLanguage(languageCode);
  const units = course ? toUnits(course) : [];
  // The server tells us which lesson to do next; find it and its unit for the "Up next" card.
  const recommendedId = course?.progress.currentLessonId ?? null;
  const currentUnit = units.find((unit) =>
    unit.lessons.some((lesson) => lesson.id === recommendedId),
  );
  const currentLesson = currentUnit?.lessons.find((lesson) => lesson.id === recommendedId);

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

        {isLoading && (
          <div className="flex justify-center py-16" aria-busy="true">
            <LogoMark className="size-12 animate-pulse" />
            <span className="sr-only">Loading your course…</span>
          </div>
        )}

        {error && (
          <Card role="alert" className="text-center">
            <p className="font-bold text-rose-700">{error.message}</p>
            <Button variant="secondary" className="mt-4" onClick={reload}>
              Try again
            </Button>
          </Card>
        )}

        {course && (
          <>
            <Card className="p-4">
              <div className="flex items-baseline justify-between text-sm font-bold text-slate-600">
                <span>Course progress</span>
                <span>
                  {course.progress.completedLessons} / {course.progress.totalLessons} lessons
                </span>
              </div>
              <ProgressBar
                value={course.progress.completedLessons}
                max={course.progress.totalLessons}
                label="Course progress"
                className="mt-2"
              />
            </Card>

            {currentUnit && currentLesson ? (
              <UpNextCard language={language} unit={currentUnit} lesson={currentLesson} />
            ) : (
              <Card className="flex items-center gap-4">
                <PartyPopper aria-hidden="true" className="size-10 text-marigold-500" />
                <div>
                  <p className="text-xl font-extrabold">Course complete!</p>
                  <p className="text-slate-600">
                    You finished every lesson in this course. Practise your mistakes to keep them
                    fresh.
                  </p>
                </div>
              </Card>
            )}

            {/* On phones/tablets the daily goal sits above the path; on desktop it is in the right column. */}
            <div className="space-y-4 lg:hidden">
              <DailyGoalCard compact />
              <RecommendationsCard limit={2} />
            </div>

            <div className="mx-auto max-w-xl space-y-4 pt-4">
              {units.map((unit) => (
                <UnitSection key={unit.id} unit={unit} />
              ))}
            </div>

            {/* On phones/tablets the other stats sit below the path; on desktop they are in the right column. */}
            <div className="space-y-4 lg:hidden">
              <StreakCard />
              <LevelCard />
              <AchievementsCard />
            </div>
          </>
        )}
      </div>

      <aside aria-label="Your progress" className="hidden w-80 shrink-0 space-y-4 lg:block">
        <div className="space-y-4">
          <DailyGoalCard />
          <StreakCard />
          <LevelCard />
          <HeartsCard />
          <RecommendationsCard />
          <AchievementsCard />
        </div>
      </aside>
    </div>
  );
}
