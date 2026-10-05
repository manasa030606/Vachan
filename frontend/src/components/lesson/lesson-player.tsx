"use client";

// Runs a lesson: intro → exercises (check / feedback / continue) → complete screen.
// "Check" sends the answer to the backend (POST /api/exercises/:id/attempt), which
// decides if it is right and saves the attempt. The lesson rules live in lessonReducer.
import { useCallback, useEffect, useReducer, useState } from "react";
import type { ExerciseAnswer, Lesson } from "@/types/exercise";
import { ExerciseRenderer } from "@/components/exercises/exercise-renderer";
import { MOCK_PROGRESS } from "@/data/mock-user";
import { ApiError } from "@/lib/api/client";
import { submitAttempt } from "@/lib/api/endpoints";
import type { LessonProgressDto } from "@/lib/api/types";
import { isAnswerReady, toAttemptAnswer } from "@/lib/exercises/check-answer";
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
  const [isChecking, setIsChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  /** Latest progress from the server (status, accuracy) — shown on the complete screen. */
  const [serverProgress, setServerProgress] = useState<LessonProgressDto | null>(null);

  const exercise = state.queue[state.position];
  const canCheck = exercise ? isAnswerReady(exercise, state.answer) && !isChecking : false;

  const handleAnswerChange = useCallback(
    (answer: ExerciseAnswer | null) => dispatch({ type: "ANSWER_CHANGED", answer }),
    [],
  );

  const check = useCallback(async () => {
    if (!exercise || !state.answer || state.result || isChecking) return;
    setIsChecking(true);
    setCheckError(null);
    try {
      const { attempt, lessonProgress } = await submitAttempt(
        exercise.id,
        toAttemptAnswer(state.answer),
      );
      setServerProgress(lessonProgress);
      dispatch({
        type: "CHECK",
        isCorrect: attempt.isCorrect,
        typoCorrection: attempt.typoCorrection,
        correctAnswer: attempt.correctAnswer,
      });
    } catch (error) {
      setCheckError(
        error instanceof ApiError ? error.message : "Couldn't check your answer. Please try again.",
      );
    } finally {
      setIsChecking(false);
    }
  }, [exercise, state.answer, state.result, isChecking]);

  // Keyboard: Enter = Check, then Enter again = Continue.
  useEffect(() => {
    if (state.phase !== "exercise") return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Enter") return;
      // A focused button already reacts to Enter by itself.
      if ((event.target as HTMLElement | null)?.tagName === "BUTTON") return;
      if (state.result) dispatch({ type: "CONTINUE" });
      else if (canCheck) void check();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.phase, state.result, canCheck, check]);

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
    return (
      <LessonComplete
        lessonTitle={lesson.title}
        exercisesCompleted={serverProgress?.completedExercises ?? state.totalExercises}
        totalExercises={serverProgress?.totalExercises ?? state.totalExercises}
        accuracy={getAccuracy(state)}
        heartsLeft={state.hearts}
        mistakesReviewed={state.mistakeIds.length}
        savedAsCompleted={serverProgress?.status === "COMPLETED"}
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
          isLocked={state.result !== null || isChecking}
          result={state.result}
          correctAnswer={state.correctAnswer}
          showRomanization={showRomanization}
        />
        {checkError && (
          <p role="alert" className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 font-bold text-rose-700">
            {checkError}
          </p>
        )}
      </main>

      <div className="sticky bottom-0">
        <LessonFooter
          result={state.result}
          canCheck={canCheck}
          isChecking={isChecking}
          correctAnswerText={state.correctAnswer ?? ""}
          typoCorrection={state.typoCorrection}
          onCheck={() => void check()}
          onContinue={() => dispatch({ type: "CONTINUE" })}
        />
      </div>
    </div>
  );
}
