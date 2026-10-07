import { Card, CardHeader } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { AchievementDto } from "@/lib/api/types";
import { cn } from "@/lib/cn";

/** Short date such as "5 Oct". */
function shortDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/** All badges (GET /api/achievements): earned ones are colourful, the others show progress. */
export function AchievementsGrid({ achievements }: { achievements: AchievementDto[] | null }) {
  const earnedCount = achievements?.filter((item) => item.unlocked).length ?? 0;

  return (
    <Card>
      <CardHeader
        title="Achievements"
        description={
          achievements ? `${earnedCount} of ${achievements.length} earned` : "Loading badges…"
        }
      />
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {(achievements ?? []).map((achievement) => (
          <li
            key={achievement.code}
            className={cn(
              "flex items-center gap-3 rounded-2xl border-2 p-3",
              achievement.unlocked
                ? "border-marigold-200 bg-marigold-50"
                : "border-slate-100 bg-white",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "flex size-14 shrink-0 items-center justify-center rounded-2xl text-3xl",
                achievement.unlocked ? "bg-white shadow-sm" : "bg-slate-100 grayscale",
              )}
            >
              {achievement.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-extrabold text-ink">{achievement.title}</p>
              <p className="text-sm text-slate-600">{achievement.description}</p>
              {achievement.unlocked ? (
                <p className="mt-1 text-xs font-bold text-marigold-700">
                  ✓ Earned
                  {achievement.unlockedAt && ` · ${shortDate(achievement.unlockedAt)}`}
                </p>
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
                  <p className="mt-1 text-xs text-slate-500">
                    {achievement.value} / {achievement.threshold}
                  </p>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
