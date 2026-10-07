"use client";

import { Target } from "lucide-react";
import { useStats } from "@/components/session/stats-provider";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getDailyGoal } from "@/data/onboarding-options";
import { useLearnerPreferences } from "@/lib/learner-preferences";

/** Today's XP compared with the learner's daily goal (from GET /api/stats). */
export function DailyGoalCard({ compact = false }: { compact?: boolean }) {
  const { stats } = useStats();
  const { dailyGoalId } = useLearnerPreferences();
  // The goal the learner picked locally is used until the server stats have loaded.
  const goal = getDailyGoal(dailyGoalId);
  const target = stats?.dailyGoal.targetXp ?? goal.xp;
  const earned = stats?.dailyGoal.earnedToday ?? 0;
  const isComplete = stats?.dailyGoal.completed ?? false;

  return (
    <Card className={compact ? "p-4" : undefined}>
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-marigold-100">
          <Target aria-hidden="true" className="size-6 text-marigold-600" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-lg font-bold">Daily goal</h2>
            <span className="text-sm font-bold text-slate-600">
              {stats ? `${Math.min(earned, target)} / ${target} XP` : "…"}
            </span>
          </div>
          <ProgressBar
            value={Math.min(earned, target)}
            max={target}
            label="Daily goal progress"
            colorClassName="bg-marigold-400"
            className="mt-2"
          />
          <p className="mt-1.5 text-sm text-slate-500">
            {isComplete
              ? `Goal reached — ${earned} XP today. Great work!`
              : `${Math.max(0, target - earned)} XP to go · ${goal.label} goal (${goal.minutes} min/day)`}
          </p>
        </div>
      </div>
    </Card>
  );
}
