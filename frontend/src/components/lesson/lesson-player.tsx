"use client";

// Runs a lesson: intro → exercises (check / feedback / continue) → complete screen.
// All rules live in lessonReducer; this component only connects state to the UI.
import { useCallback, useEffect, useMemo, useReducer } from "react";
import type { ExerciseAnswer, Lesson } from "@/types/exercise";
import { ExerciseRenderer } from "@/components/exercises/exercise-renderer";
import { MOCK_GAMIFICATION_RULES, MOCK_PROGRESS } from "@/data/mock-user";
import { getCorrectAnswerText, isAnswerReady } from "@/lib/exercises/check-answer";
import {
  createInitialLessonState,
  getAccuracy,
  lessonReducer,
} from "@/lib/exercises/lesson-reducer";
import { LessonComplete } from "./lesson-complete";
import { LessonFooter } from "./lesson-footer";
import { LessonIntro } from "./lesson-intro";
import { LessonTopBar } from "./lesson-top-bar";
import { OutOfHearts } from "./out-of-hearts";

type LessonPlayerProps = {
  lesson: Lesson;
  showRomanization: boolean;
};

export function LessonPlayer({ lesson, showRomanization }: LessonPlayerProps) {
  const [state, dispatch] = useReducer(
    lessonReducer,
    createInitialLessonState(lesson.exercises, MOCK_PROGRESS.hearts),
  );

  const exercise = state.queue[state.position];
  const canCheck = exercise ? isAnswerReady(exercise, state.answer) : false;
  const correctAnswerText = useMemo(
    () => (exercise ? getCorrectAnswerText(exercise) : ""),
    [exercise],
  );

  const handleAnswerChange = useCallback(
    (answer: ExerciseAnswer | null) => dispatch({ type: "ANSWER_CHANGED", answer }),
    [],
  );

  // Keyboard: Enter = Check, then Enter again = Continue.
  useEffect(() => {
    if (state.phase !== "exercise") return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Enter") return;
      // A focused button already reacts to Enter by itself.
      if ((event.target as HTMLElement | null)?.tagName === "BUTTON") return;
      if (state.result) dispatch({ type: "CONTINUE" });
      else if (canCheck) dispatch({ type: "CHECK" });
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.phase, state.result, canCheck]);

  if (state.phase === "intro") {
    return (
      <LessonIntro
        title={lesson.title}
        unitTitle={lesson.unitTitle}
        words={lesson.newWords}
        introText={lesson.introText}
        showRomanization={showRomanization}
        onStart={() => dispatch({ type: "START" })}
      />
    );
  }

  if (state.phase === "out-of-hearts") {
    return <OutOfHearts />;
  }

  if (state.phase === "complete") {
    const isPerfect = state.mistakeIds.length === 0;
    const bonus = isPerfect ? MOCK_GAMIFICATION_RULES.perfectLessonBonusXp : 0;
    return (
      <LessonComplete
        lessonTitle={lesson.title}
        xpEarned={lesson.xpReward + bonus}
        perfectBonusXp={bonus}
        accuracy={getAccuracy(state)}
        heartsLeft={state.hearts}
        mistakesReviewed={state.mistakeIds.length}
        words={lesson.newWords}
        onPracticeAgain={() =>
          dispatch({ type: "RESTART", exercises: lesson.exercises, hearts: MOCK_PROGRESS.hearts })
        }
      />
    );
  }

  if (!exercise) return null;

  return (
    <div className="flex min-h-dvh flex-col">
      <LessonTopBar
        completed={state.completedIds.length}
        total={state.totalExercises}
        hearts={state.hearts}
      />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:py-12">
        {state.mistakeIds.includes(exercise.id) && !state.result && (
          <p className="mb-4 inline-block rounded-full bg-marigold-100 px-3 py-1 text-sm font-bold text-marigold-700">
            Previous mistake — try again
          </p>
        )}
        {/* `key` makes React reset the exercise component when the step changes. */}
        <ExerciseRenderer
          key={`${state.position}-${exercise.id}`}
          exercise={exercise}
          answer={state.answer}
          onAnswerChange={handleAnswerChange}
          isLocked={state.result !== null}
          result={state.result}
          showRomanization={showRomanization}
        />
      </main>

      <div className="sticky bottom-0">
        <LessonFooter
          result={state.result}
          canCheck={canCheck}
          correctAnswerText={correctAnswerText}
          typoCorrection={state.typoCorrection}
          onCheck={() => dispatch({ type: "CHECK" })}
          onContinue={() => dispatch({ type: "CONTINUE" })}
        />
      </div>
    </div>
  );
}
