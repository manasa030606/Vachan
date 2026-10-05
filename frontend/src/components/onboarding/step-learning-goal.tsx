import { LEARNING_GOALS, type LearningGoalId } from "@/data/onboarding-options";
import { ChoiceCard } from "./choice-card";
import { StepHeading } from "./step-heading";

type StepLearningGoalProps = {
  languageName: string;
  value: LearningGoalId | null;
  onChange: (id: LearningGoalId) => void;
};

export function StepLearningGoal({ languageName, value, onChange }: StepLearningGoalProps) {
  return (
    <fieldset>
      <StepHeading
        title={`Why are you learning ${languageName}?`}
        subtitle="This helps us pick examples that matter to you."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {LEARNING_GOALS.map((goal) => (
          <ChoiceCard
            key={goal.id}
            name="learning-goal"
            value={goal.id}
            checked={value === goal.id}
            onChange={(id) => onChange(id as LearningGoalId)}
          >
            <span
              aria-hidden="true"
              className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-2xl"
            >
              {goal.emoji}
            </span>
            <span>
              <span className="block font-extrabold text-ink">{goal.label}</span>
              <span className="block text-sm text-slate-500">{goal.description}</span>
            </span>
          </ChoiceCard>
        ))}
      </div>
    </fieldset>
  );
}
