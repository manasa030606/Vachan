"use client";

import { Zap } from "lucide-react";
import { useStats } from "@/components/session/stats-provider";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";

/** Learner level and XP progress towards the next level (GET /api/stats → xp). */
export function LevelCard() {
  const { stats } = useStats();
  const xp = stats?.xp;
  const span = xp?.nextLevelXp ? xp.nextLevelXp - xp.levelStartXp : 1;

  return (
    <Card>
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-100 font-display text-xl font-extrabold text-brand-700">
          {xp?.level ?? "…"}
        </span>
        <div className="flex-1">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-bold">Level {xp?.level ?? "…"}</h2>
            <span className="flex items-center gap-1 text-sm font-bold text-marigold-700">
              <Zap aria-hidden="true" className="size-4 fill-marigold-400 text-marigold-500" />
              {(xp?.total ?? 0).toLocaleString("en-IN")} XP
            </span>
          </div>
          <ProgressBar
            value={xp ? (xp.isMaxLevel ? span : xp.xpIntoLevel) : 0}
            max={span}
            label="Progress to next level"
            className="mt-2"
          />
          <p className="mt-1.5 text-sm text-slate-500">
            {!xp
              ? "Loading…"
              : xp.isMaxLevel
                ? "Top level reached!"
                : `${xp.xpToNextLevel} XP to level ${xp.level + 1}`}
          </p>
        </div>
      </div>
    </Card>
  );
}
