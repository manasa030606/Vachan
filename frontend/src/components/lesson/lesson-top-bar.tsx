import Link from "next/link";
import { X } from "lucide-react";
import { HeartsCounter } from "@/components/ui/hearts-counter";
import { ProgressBar } from "@/components/ui/progress-bar";

type LessonTopBarProps = {
  completed: number;
  total: number;
  /** null hides the hearts (the mistake review costs no hearts). */
  hearts: number | null;
  exitHref: string;
};

/** Exit button, lesson progress and hearts — always visible during a lesson. */
export function LessonTopBar({ completed, total, hearts, exitHref }: LessonTopBarProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl items-center gap-4 px-4 pt-4 sm:pt-6">
      <Link
        href={exitHref}
        aria-label="Exit — your progress is saved"
        title="Exit — your progress is saved"
        className="-ml-2 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
      >
        <X aria-hidden="true" className="size-6" />
      </Link>
      <ProgressBar
        value={completed}
        max={total}
        label="Lesson progress"
        size="lg"
        colorClassName="bg-gradient-to-r from-brand-500 to-brand-400"
      />
      {hearts !== null && <HeartsCounter hearts={hearts} />}
    </div>
  );
}
