// Shown when every exercise has been answered correctly (a lesson or a mistake review).
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
  /** True when this run completed the lesson for the first time (the next lesson just unlocked). */
  firstCompletion: boolean;
  mode: "lesson" | "review";
  /** True when the learner resumed this run after leaving it half-way. */
  resumed: boolean;
  /** null in review mode (no hearts). */
  heartsLeft: number | null;
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
  firstCompletion,
  mode,
  resumed,
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
      <h1 className="mt-6 text-4xl font-extrabold text-ink">
        {mode === "review" ? "Review complete!" : "Lesson complete!"}
      </h1>
      <p className="mt-2 text-lg text-slate-600">
        {mode === "review" ? (
          <>
            You cleared <span className="font-bold">{totalExercises}</span>{" "}
            {totalExercises === 1 ? "mistake" : "mistakes"} from your review list.
          </>
        ) : (
          <>
            You finished <span className="font-bold">{lessonTitle}</span>.
            {mistakesReviewed > 0
              ? ` You reviewed ${mistakesReviewed} ${mistakesReviewed === 1 ? "mistake" : "mistakes"} along the way.`
              : resumed
                ? " Welcome back — you picked up right where you left off."
                : " Not a single mistake — brilliant!"}
          </>
        )}
      </p>
      {mode === "lesson" && savedAsCompleted && (
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
          <CloudCheck aria-hidden="true" className="size-4" />
          {firstCompletion
            ? "Progress saved — the next lesson is unlocked"
            : "Practice saved — this lesson stays completed"}
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
        {heartsLeft !== null ? (
          <ResultTile
            icon={<Heart aria-hidden="true" className="size-6 fill-rose-500 text-rose-500" />}
            label="Hearts left"
            value={String(heartsLeft)}
            tone="rose"
          />
        ) : (
          <ResultTile
            icon={<RotateCcw aria-hidden="true" className="size-6 text-rose-500" />}
            label="Retried"
            value={String(mistakesReviewed)}
            tone="rose"
          />
        )}
      </div>

      {words.length > 0 && (
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
      )}

      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row-reverse">
        <ButtonLink href={mode === "review" ? "/practice" : "/learn"} size="lg" fullWidth autoFocus>
          Continue
        </ButtonLink>
        {mode === "lesson" && (
          <Button variant="secondary" size="lg" fullWidth onClick={onPracticeAgain}>
            <RotateCcw aria-hidden="true" className="size-5" />
            Practise again
          </Button>
        )}
      </div>
    </div>
  );
}
