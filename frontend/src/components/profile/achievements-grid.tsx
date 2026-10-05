import { Card, CardHeader } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { Achievement } from "@/data/mock-user";
import { cn } from "@/lib/cn";

/** Badges: earned ones are colourful, unearned ones show progress. */
export function AchievementsGrid({ achievements }: { achievements: Achievement[] }) {
  const earnedCount = achievements.filter((item) => item.progress >= 1).length;

  return (
    <Card>
      <CardHeader
        title="Achievements"
        description={`${earnedCount} of ${achievements.length} earned`}
      />
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {achievements.map((achievement) => {
          const earned = achievement.progress >= 1;
          return (
            <li
              key={achievement.id}
              className={cn(
                "flex items-center gap-3 rounded-2xl border-2 p-3",
                earned ? "border-marigold-200 bg-marigold-50" : "border-slate-100 bg-white",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-14 shrink-0 items-center justify-center rounded-2xl text-3xl",
                  earned ? "bg-white shadow-sm" : "bg-slate-100 grayscale",
                )}
              >
                {achievement.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-ink">{achievement.title}</p>
                <p className="text-sm text-slate-600">{achievement.description}</p>
                {earned ? (
                  <p className="mt-1 text-xs font-bold text-marigold-700">✓ Earned</p>
                ) : (
                  <>
                    <ProgressBar
                      value={Math.round(achievement.progress * 100)}
                      max={100}
                      label={`${achievement.title} progress`}
                      size="sm"
                      colorClassName="bg-marigold-400"
                      className="mt-2"
                    />
                    <p className="mt-1 text-xs text-slate-500">{achievement.progressLabel}</p>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
