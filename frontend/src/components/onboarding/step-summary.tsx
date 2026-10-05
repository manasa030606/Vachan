import { ClipboardCheck, Flag, Target } from "lucide-react";
import type { Language } from "@/types/learning";
import { LanguageTile } from "@/components/ui/language-tile";

type StepSummaryProps = {
  language: Language;
  goalLabel: string;
  dailyGoalLabel: string;
  levelLabel: string;
  startHint: string;
};

/** Final onboarding step: confirms the choices and explains where the learner starts. */
export function StepSummary({
  language,
  goalLabel,
  dailyGoalLabel,
  levelLabel,
  startHint,
}: StepSummaryProps) {
  const rows = [
    { icon: Flag, label: "Your reason", value: goalLabel },
    { icon: Target, label: "Daily goal", value: dailyGoalLabel },
    { icon: ClipboardCheck, label: "Your level", value: levelLabel },
  ];

  return (
    <div className="animate-pop text-center">
      <LanguageTile language={language} size="lg" className="mx-auto" />
      <h2 className="mt-5 text-3xl font-extrabold text-ink sm:text-4xl">You&apos;re all set!</h2>
      <p className="mt-2 text-lg text-slate-600">
        Your {language.name} course is ready.{" "}
        <span className="font-bold text-brand-700">{startHint}.</span>
      </p>

      <ul className="mx-auto mt-8 max-w-md space-y-3 text-left">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-white p-4"
          >
            <row.icon aria-hidden="true" className="size-6 shrink-0 text-brand-500" />
            <span className="text-sm text-slate-500">{row.label}</span>
            <span className="ml-auto text-right font-bold text-ink">{row.value}</span>
          </li>
        ))}
      </ul>
      <p className="mx-auto mt-6 max-w-md text-sm text-slate-500">
        A short placement test will fine-tune your starting point once it&apos;s added (Phase 4).
      </p>
    </div>
  );
}
