import { SELF_ASSESSMENT_LEVELS, type SelfAssessmentId } from "@/data/onboarding-options";
import { cn } from "@/lib/cn";
import { ChoiceCard } from "./choice-card";
import { StepHeading } from "./step-heading";

type StepSelfAssessmentProps = {
  languageName: string;
  value: SelfAssessmentId | null;
  onChange: (id: SelfAssessmentId) => void;
};

export function StepSelfAssessment({ languageName, value, onChange }: StepSelfAssessmentProps) {
  return (
    <fieldset>
      <StepHeading
        title={`How much ${languageName} do you know?`}
        subtitle="Be honest — there's no wrong answer."
      />
      <div className="space-y-3">
        {SELF_ASSESSMENT_LEVELS.map((level, index) => (
          <ChoiceCard
            key={level.id}
            name="self-assessment"
            value={level.id}
            checked={value === level.id}
            onChange={(id) => onChange(id as SelfAssessmentId)}
          >
            {/* Signal bars: more filled bars = more experience */}
            <span aria-hidden="true" className="flex h-7 shrink-0 items-end gap-0.5">
              {[0, 1, 2, 3, 4, 5].map((bar) => (
                <span
                  key={bar}
                  className={cn(
                    "w-1.5 rounded-full",
                    bar <= index ? "bg-brand-500" : "bg-slate-200",
                  )}
                  style={{ height: `${8 + bar * 4}px` }}
                />
              ))}
            </span>
            <span className="font-bold text-ink">{level.label}</span>
          </ChoiceCard>
        ))}
      </div>
    </fieldset>
  );
}
