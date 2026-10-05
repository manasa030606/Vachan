"use client";

import { useId } from "react";
import type { ExerciseComponentProps, TranslationExercise } from "@/types/exercise";
import { cn } from "@/lib/cn";
import { ExerciseHeading, ScriptPrompt } from "./exercise-heading";

/**
 * Shows a word or sentence in an Indian script; the learner types its English meaning.
 * Also used for "Type the sound this letter makes" (a single letter, answered in Latin letters).
 */
export function Translation({
  exercise,
  answer,
  onAnswerChange,
  isLocked,
  result,
  showRomanization,
}: ExerciseComponentProps<TranslationExercise>) {
  const inputId = useId();
  const value = answer?.type === "text" ? answer.value : "";
  // A single letter (1–3 code points, e.g. "ఈ" or "కా") asks for its sound, not a translation.
  const isLetter = [...exercise.prompt].length <= 3 && !exercise.promptSubtext;

  return (
    <div className="space-y-6">
      <ExerciseHeading>{exercise.instruction}</ExerciseHeading>
      <ScriptPrompt
        text={exercise.prompt}
        subtext={exercise.promptSubtext}
        showSubtext={showRomanization}
        size={isLetter ? "xl" : "md"}
      />
      <div>
        <label htmlFor={inputId} className="mb-2 block font-bold text-slate-700">
          {isLetter ? "The sound" : "Your translation"}
        </label>
        <textarea
          id={inputId}
          rows={3}
          value={value}
          readOnly={isLocked}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          placeholder={isLetter ? "Type the sound, e.g. aa…" : "Type in English…"}
          onKeyDown={(event) => {
            // Enter submits (handled by the lesson player); Shift+Enter would add a new line.
            if (event.key === "Enter" && !event.shiftKey) event.preventDefault();
          }}
          onChange={(event) =>
            onAnswerChange(event.target.value ? { type: "text", value: event.target.value } : null)
          }
          className={cn(
            "w-full resize-none rounded-2xl border-2 bg-white p-4 text-lg text-ink transition outline-none",
            "focus:border-brand-400 focus:ring-4 focus:ring-brand-100",
            !result && "border-slate-200",
            result === "correct" && "border-emerald-500 bg-emerald-50",
            result === "incorrect" && "border-rose-500 bg-rose-50",
          )}
        />
        <p className="mt-1 text-sm text-slate-500">
          Capital letters, spaces and punctuation don&apos;t matter.
        </p>
      </div>
    </div>
  );
}
