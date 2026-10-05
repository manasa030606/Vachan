// Shown when every exercise has been answered correctly.
import { CloudCheck, Heart, ListChecks, RotateCcw, Target } from "lucide-react";
import type { VocabularyWord } from "@/types/learning";
import { Button, ButtonLink } from "@/components/ui/button";
import { Confetti } from "./confetti";
import { ResultTile } from "./result-tile";

type LessonCompleteProps = {
  lessonTitle: string;
  exercisesCompleted: number;
  totalExercises: number;
  accuracy: number;
  /** True when the backend confirmed the lesson is saved as completed. */
  savedAsCompleted: boolean;
  heartsLeft: number;
  mistakesReviewed: number;
  words: VocabularyWord[];
  onPracticeAgain: () => void;
};

export function LessonComplete({
  lessonTitle,
  exercisesCompleted,
  totalExercises,
  accuracy,
  savedAsCompleted,
  heartsLeft,
  mistakesReviewed,
  words,
  onPracticeAgain,
}: LessonCompleteProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-10 text-center">
      <Confetti />
      <div className="flex size-28 animate-pop items-center justify-center rounded-[2rem] bg-marigold-100 text-6xl">
        <span aria-hidden="true">🪔</span>
      </div>
      <h1 className="mt-6 text-4xl font-extrabold text-ink">Lesson complete!</h1>
      <p className="mt-2 text-lg text-slate-600">
        You finished <span className="font-bold">{lessonTitle}</span>.
        {mistakesReviewed > 0
          ? ` You reviewed ${mistakesReviewed} ${mistakesReviewed === 1 ? "mistake" : "mistakes"} along the way.`
          : " Not a single mistake — brilliant!"}
      </p>
      {savedAsCompleted && (
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
          <CloudCheck aria-hidden="true" className="size-4" />
          Progress saved — the next lesson is unlocked
        </p>
      )}

      <div className="mt-8 grid w-full grid-cols-3 gap-3">
        <ResultTile
          icon={<ListChecks aria-hidden="true" className="size-6 text-marigold-600" />}
          label="Exercises"
          value={`${exercisesCompleted}/${totalExercises}`}
          tone="marigold"
        />
        <ResultTile
          icon={<Target aria-hidden="true" className="size-6 text-emerald-600" />}
          label="Accuracy"
          value={`${accuracy}%`}
          tone="emerald"
        />
        <ResultTile
          icon={<Heart aria-hidden="true" className="size-6 fill-rose-500 text-rose-500" />}
          label="Hearts left"
          value={String(heartsLeft)}
          tone="rose"
        />
      </div>

      <section className="mt-8 w-full rounded-card border border-slate-200 bg-white p-5 text-left">
        <h2 className="text-lg font-bold">What you practised</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {words.map((word) => (
            <li key={word.id} className="rounded-xl bg-brand-50 px-3 py-1.5">
              <span className="font-display text-lg font-bold text-brand-800">{word.script}</span>{" "}
              <span className="text-slate-600">· {word.meaning}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row-reverse">
        <ButtonLink href="/learn" size="lg" fullWidth autoFocus>
          Continue
        </ButtonLink>
        <Button variant="secondary" size="lg" fullWidth onClick={onPracticeAgain}>
          <RotateCcw aria-hidden="true" className="size-5" />
          Practise again
        </Button>
      </div>
    </div>
  );
}
