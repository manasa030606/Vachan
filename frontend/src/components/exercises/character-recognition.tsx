"use client";

import type { CharacterRecognitionExercise, ExerciseComponentProps } from "@/types/exercise";
import { ChoiceList } from "./choice-list";
import { ExerciseHeading, ScriptPrompt } from "./exercise-heading";

/** Shows one big letter (e.g. "ఆ") and asks which sound it makes. */
export function CharacterRecognition({
  exercise,
  answer,
  onAnswerChange,
  isLocked,
}: ExerciseComponentProps<CharacterRecognitionExercise>) {
  const selectedId = answer?.type === "choice" ? answer.optionId : null;

  return (
    <div className="space-y-6">
      <ExerciseHeading>{exercise.instruction}</ExerciseHeading>
      <ScriptPrompt text={exercise.character} showSubtext={false} size="xl" />
      <ChoiceList
        label="Possible sounds"
        layout="row"
        options={exercise.options}
        selectedId={selectedId}
        correctId={exercise.correctOptionId}
        isLocked={isLocked}
        showSubtext={false}
        onSelect={(optionId) => onAnswerChange({ type: "choice", optionId })}
      />
    </div>
  );
}
