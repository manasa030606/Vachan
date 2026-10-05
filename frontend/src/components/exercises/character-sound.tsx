"use client";

import type { CharacterSoundExercise, ExerciseComponentProps } from "@/types/exercise";
import { ChoiceList } from "./choice-list";
import { ExerciseHeading, ScriptPrompt } from "./exercise-heading";

/** Character → sound: shows one big letter (e.g. "ఆ") and asks which sound it makes. */
export function CharacterSound({
  exercise,
  answer,
  onAnswerChange,
  isLocked,
  correctAnswer,
}: ExerciseComponentProps<CharacterSoundExercise>) {
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
        correctAnswer={correctAnswer}
        isLocked={isLocked}
        showSubtext={false}
        onSelect={(optionId) => onAnswerChange({ type: "choice", optionId })}
      />
    </div>
  );
}
