import { Timer } from "lucide-react";
import { DAILY_GOALS, type DailyGoalId } from "@/data/onboarding-options";
import { ChoiceCard } from "./choice-card";
import { StepHeading } from "./step-heading";

type StepDailyGoalProps = {
  value: DailyGoalId | null;
  onChange: (id: DailyGoalId) => void;
};

/** Onboarding step: choose how much to practise each day. */
export function StepDailyGoal({ value, onChange }: StepDailyGoalProps) {
  return (
    <fieldset>
      <StepHeading
        title="Pick a daily goal"
        subtitle="Small, steady practice beats long sessions. You can change this anytime."
      />
      <div className="space-y-3">
        {DAILY_GOALS.map((goal) => (
          <ChoiceCard
            key={goal.id}
            name="daily-goal"
            value={goal.id}
            checked={value === goal.id}
            onChange={(id) => onChange(id as DailyGoalId)}
          >
            <Timer aria-hidden="true" className="size-6 shrink-0 text-brand-500" />
            <span className="flex flex-1 items-baseline justify-between gap-3">
              <span className="text-lg font-extrabold text-ink">{goal.label}</span>
              <span className="text-slate-600">
                {goal.minutes} min / day · <span className="font-bold">{goal.xp} XP</span>
              </span>
            </span>
          </ChoiceCard>
        ))}
      </div>
    </fieldset>
  );
}
