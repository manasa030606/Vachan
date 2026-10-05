"use client";

import type { ExerciseComponentProps, MultipleChoiceExercise } from "@/types/exercise";
import { ChoiceList } from "./choice-list";
import { ExerciseHeading, ScriptPrompt } from "./exercise-heading";

/** "What does नमस्ते mean?" → pick one of several options. */
export function MultipleChoice({
  exercise,
  answer,
  onAnswerChange,
  isLocked,
  correctAnswer,
  showRomanization,
}: ExerciseComponentProps<MultipleChoiceExercise>) {
  const selectedId = answer?.type === "choice" ? answer.optionId : null;
  // Options written in an Indian script have a romanized subtext; show them larger.
  const optionsAreScript = exercise.options.some((option) => option.subtext);

  return (
    <div className="space-y-6">
      <ExerciseHeading>{exercise.instruction}</ExerciseHeading>
      <ScriptPrompt
        text={exercise.prompt}
        subtext={exercise.promptSubtext}
        showSubtext={showRomanization}
      />
      <ChoiceList
        label="Answer options"
        options={exercise.options}
        selectedId={selectedId}
        correctAnswer={correctAnswer}
        isLocked={isLocked}
        large={optionsAreScript}
        showSubtext={showRomanization}
        onSelect={(optionId) => onAnswerChange({ type: "choice", optionId })}
      />
    </div>
  );
}
