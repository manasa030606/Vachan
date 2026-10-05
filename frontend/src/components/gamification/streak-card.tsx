"use client";

import { Flame } from "lucide-react";
import { useStats } from "@/components/session/stats-provider";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

/** First letter of the weekday for a YYYY-MM-DD date. */
function weekdayLetter(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en", {
    weekday: "narrow",
    timeZone: "UTC",
  });
}

/** Current streak with the last 7 days (GET /api/stats → streak). */
export function StreakCard() {
  const { stats } = useStats();
  const streak = stats?.streak;

  return (
    <Card>
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-orange-100">
          <Flame aria-hidden="true" className="size-6 fill-orange-400 text-orange-500" />
        </span>
        <div>
          <h2 className="text-lg font-bold">
            {streak ? `${streak.current} day streak` : "Streak"}
          </h2>
          <p className="text-sm text-slate-500">
            {streak
              ? `${streak.activeToday ? "Done for today" : "Earn XP today to keep it going"} · longest ${streak.longest} ${streak.longest === 1 ? "day" : "days"}`
              : "Loading…"}
          </p>
        </div>
      </div>
      {streak && (
        <ol className="mt-4 flex justify-between" aria-label="Last 7 days">
          {streak.week.map((day) => (
            <li key={day.date} className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-xs font-extrabold",
                  day.active ? "bg-orange-400 text-white" : "bg-slate-100 text-slate-400",
                  day.date === streak.today && "ring-2 ring-orange-200",
                )}
              >
                {day.active ? (
                  <Flame aria-hidden="true" className="size-4 fill-white" />
                ) : (
                  weekdayLetter(day.date)
                )}
              </span>
              <span className="text-xs text-slate-500">
                {weekdayLetter(day.date)}
                <span className="sr-only">
                  {` ${day.date}: ${day.active ? `practised, ${day.xpEarned} XP` : "no activity"}`}
                </span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
