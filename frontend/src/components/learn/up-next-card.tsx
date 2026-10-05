import { Play } from "lucide-react";
import type { Language, LessonSummary, Unit } from "@/types/learning";
import { ButtonLink } from "@/components/ui/button";
import { LanguageTile } from "@/components/ui/language-tile";

type UpNextCardProps = {
  language: Language;
  unit: Unit;
  lesson: LessonSummary;
};

/** "Continue where you left off" — the recommended next lesson (in progress, or the next one to start). */
export function UpNextCard({ language, unit, lesson }: UpNextCardProps) {
  return (
    <section
      aria-label="Recommended lesson"
      className="flex flex-col gap-4 rounded-card border-2 border-brand-100 bg-white p-5 sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-center gap-4">
        <LanguageTile language={language} />
        <div>
          <p className="text-sm font-bold tracking-wide text-brand-600 uppercase">
            {lesson.status === "current" ? "Continue where you left off" : "Up next"} ·{" "}
            {language.name}
          </p>
          <p className="text-xl font-extrabold text-ink">{lesson.title}</p>
          <p className="text-sm text-slate-500">
            Unit {unit.number}: {unit.title} · {lesson.exerciseCount} exercises
          </p>
        </div>
      </div>
      <ButtonLink href={`/lesson/${lesson.id}`} size="lg">
        <Play aria-hidden="true" className="size-5 fill-white" />
        {lesson.status === "current" ? "Continue" : "Start"}
      </ButtonLink>
    </section>
  );
}
