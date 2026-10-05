import { Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { MOCK_PROGRESS } from "@/data/mock-user";

/** Learner level and XP progress towards the next level. */
export function LevelCard() {
  const { level, totalXp, xpIntoLevel, xpForNextLevel } = MOCK_PROGRESS;

  return (
    <Card>
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-100 font-display text-xl font-extrabold text-brand-700">
          {level}
        </span>
        <div className="flex-1">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-bold">Level {level}</h2>
            <span className="flex items-center gap-1 text-sm font-bold text-marigold-700">
              <Zap aria-hidden="true" className="size-4 fill-marigold-400 text-marigold-500" />
              {totalXp.toLocaleString("en-IN")} XP
            </span>
          </div>
          <ProgressBar
            value={xpIntoLevel}
            max={xpForNextLevel}
            label="Progress to next level"
            className="mt-2"
          />
          <p className="mt-1.5 text-sm text-slate-500">
            {xpForNextLevel - xpIntoLevel} XP to level {level + 1}
          </p>
        </div>
      </div>
    </Card>
  );
}
