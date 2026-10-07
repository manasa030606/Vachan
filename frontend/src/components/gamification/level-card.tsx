"use client";

import { Zap } from "lucide-react";
import { useStats } from "@/components/session/stats-provider";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { StatsDto } from "@/lib/api/types";

/** The small line under the progress bar. */
function levelHint(xp: StatsDto["xp"] | undefined): string {
  if (!xp) return "Loading…";
  if (xp.isMaxLevel) return "Top level reached!";
  return `${xp.xpToNextLevel} XP to level ${xp.level + 1}`;
}

/** Learner level and XP progress towards the next level (from GET /api/stats). */
export function LevelCard() {
  const { stats } = useStats();
  const xp = stats?.xp;
  // XP needed to go from the start of this level to the next one.
  const levelSpan = xp?.nextLevelXp ? xp.nextLevelXp - xp.levelStartXp : 1;
  // At the top level there is no next level, so show the bar as full.
  let progress = 0;
  if (xp) progress = xp.isMaxLevel ? levelSpan : xp.xpIntoLevel;

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
            value={progress}
            max={levelSpan}
            label="Progress to next level"
            className="mt-2"
          />
          <p className="mt-1.5 text-sm text-slate-500">{levelHint(xp)}</p>
        </div>
      </div>
    </Card>
  );
}
