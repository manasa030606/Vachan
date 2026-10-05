"use client";

import type { CharacterRecognitionExercise, ExerciseComponentProps } from "@/types/exercise";
import { ChoiceList } from "./choice-list";
import { ExerciseHeading } from "./exercise-heading";

/** Character recognition: shows a sound (e.g. "aa") and asks which letter makes it. */
export function CharacterRecognition({
  exercise,
  answer,
  onAnswerChange,
  isLocked,
  correctAnswer,
}: ExerciseComponentProps<CharacterRecognitionExercise>) {
  const selectedId = answer?.type === "choice" ? answer.optionId : null;

  return (
    <div className="space-y-6">
      <ExerciseHeading>{exercise.instruction}</ExerciseHeading>
      <div className="flex flex-col items-center justify-center rounded-card border-2 border-dashed border-brand-200 bg-brand-50/60 px-6 py-6 text-center">
        <p className="text-sm font-bold tracking-wide text-slate-500 uppercase">Sound</p>
        <p className="text-5xl font-extrabold text-brand-800">“{exercise.prompt}”</p>
        {exercise.promptSubtext && (
          <p className="mt-2 max-w-md text-slate-600">{exercise.promptSubtext}</p>
        )}
      </div>
      <ChoiceList
        label="Letters"
        layout="row"
        options={exercise.options}
        selectedId={selectedId}
        correctAnswer={correctAnswer}
        isLocked={isLocked}
        glyph
        showSubtext={false}
        onSelect={(optionId) => onAnswerChange({ type: "choice", optionId })}
      />
    </div>
  );
}
