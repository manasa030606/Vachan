import { Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MOCK_PROGRESS } from "@/data/mock-user";
import { cn } from "@/lib/cn";

const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

/** Current streak with a small Monday–Sunday activity row. */
export function StreakCard() {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-orange-100">
          <Flame aria-hidden="true" className="size-6 fill-orange-400 text-orange-500" />
        </span>
        <div>
          <h2 className="text-lg font-bold">{MOCK_PROGRESS.streakDays} day streak</h2>
          <p className="text-sm text-slate-500">Longest: {MOCK_PROGRESS.longestStreak} days</p>
        </div>
      </div>
      <ol className="mt-4 flex justify-between" aria-label="This week's activity">
        {MOCK_PROGRESS.weekActivity.map((active, index) => (
          <li key={index} className="flex flex-col items-center gap-1">
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-xs font-extrabold",
                active ? "bg-orange-400 text-white" : "bg-slate-100 text-slate-400",
              )}
            >
              {active ? (
                <Flame aria-hidden="true" className="size-4 fill-white" />
              ) : (
                WEEK_DAYS[index]
              )}
            </span>
            <span className="text-xs text-slate-500">
              {WEEK_DAYS[index]}
              <span className="sr-only">{active ? ": practised" : ": missed"}</span>
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
