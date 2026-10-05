"use client";

import type { ExerciseComponentProps, FillInBlankExercise } from "@/types/exercise";
import { cn } from "@/lib/cn";
import { ChoiceList } from "./choice-list";
import { ExerciseHeading } from "./exercise-heading";

/** A sentence with one missing word; the learner picks the word that fits. */
export function FillInBlank({
  exercise,
  answer,
  onAnswerChange,
  isLocked,
  result,
  showRomanization,
}: ExerciseComponentProps<FillInBlankExercise>) {
  const selectedId = answer?.type === "choice" ? answer.optionId : null;
  const selectedOption = exercise.options.find((option) => option.id === selectedId);

  return (
    <div className="space-y-6">
      <ExerciseHeading>{exercise.instruction}</ExerciseHeading>

      <div className="rounded-card border-2 border-slate-200 bg-white px-5 py-6">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-display text-3xl font-bold text-ink">
          {exercise.before && <span>{exercise.before}</span>}
          <span
            className={cn(
              "inline-flex min-w-24 justify-center rounded-xl border-b-4 px-3 pb-0.5",
              !selectedOption && "border-dashed border-slate-300 text-slate-300",
              selectedOption && !result && "border-brand-500 bg-brand-50 text-brand-700",
              result === "correct" && "border-emerald-500 bg-emerald-50 text-emerald-800",
              result === "incorrect" && "border-rose-500 bg-rose-50 text-rose-800",
            )}
          >
            {selectedOption ? selectedOption.text : "____"}
            <span className="sr-only">{selectedOption ? "" : "blank"}</span>
          </span>
          {exercise.after && <span>{exercise.after}</span>}
        </p>
        <p className="mt-3 text-slate-600">
          <span className="font-bold">Meaning:</span> {exercise.translation}
        </p>
      </div>

      <ChoiceList
        label="Words to fill the blank"
        layout="row"
        options={exercise.options}
        selectedId={selectedId}
        correctId={exercise.correctOptionId}
        isLocked={isLocked}
        large
        showSubtext={showRomanization}
        onSelect={(optionId) => onAnswerChange({ type: "choice", optionId })}
      />
    </div>
  );
}
