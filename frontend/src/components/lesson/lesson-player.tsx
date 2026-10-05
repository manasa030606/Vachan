"use client";

// Runs a lesson (or a mistake review): intro → exercises (check / feedback / continue) → complete.
//
//  - "Start" calls POST /api/lessons/:id/start. The server answers with the exercises already
//    done in this run, so a lesson left half-way resumes where the learner stopped.
//  - "Check" sends the answer to POST /api/exercises/:id/attempt; the server decides if it is
//    right, saves the attempt and returns feedback (correct answer + explanation).
//  - Review mode sends answers with mode "review" and costs no hearts.
// The lesson rules live in lessonReducer.
import { useCallback, useEffect, useReducer, useState } from "react";
import type { ExerciseAnswer, Lesson } from "@/types/exercise";
import { ExerciseRenderer } from "@/components/exercises/exercise-renderer";
import { MOCK_PROGRESS } from "@/data/mock-user";
import { ApiError } from "@/lib/api/client";
import { startLesson, submitAttempt } from "@/lib/api/endpoints";
import type { AttemptResultDto } from "@/lib/api/types";
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

/** Hearts are demo values until gamification (Phase 4). */
const START_HEARTS = MOCK_PROGRESS.hearts;

export function LessonPlayer({ lesson, showRomanization }: LessonPlayerProps) {
  const isReview = lesson.mode === "review";
  const [state, dispatch] = useReducer(
    lessonReducer,
    createInitialLessonState(lesson.exercises, START_HEARTS, {
      heartsEnabled: !isReview,
      alreadyCompletedIds:
        lesson.progress.status === "IN_PROGRESS" ? lesson.progress.completedExerciseIds : [],
    }),
  );
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  /** Latest lesson progress from the server — shown on the complete screen. */
  const [serverProgress, setServerProgress] = useState<AttemptResultDto["lessonProgress"] | null>(
    null,
  );
  const [firstCompletion, setFirstCompletion] = useState(false);
  const [resumed, setResumed] = useState(false);

  const exercise = state.queue[state.position];
  const canCheck = exercise ? isAnswerReady(exercise, state.answer) && !isChecking : false;
  const exitHref = isReview ? "/practice" : "/learn";

  const begin = useCallback(
    async (restart: boolean) => {
      if (isReview) {
        dispatch({ type: "START" });
        return;
      }
      setIsStarting(true);
      setStartError(null);
      try {
        const { progress, resumed: wasResumed } = await startLesson(lesson.id, restart);
        setResumed(wasResumed && progress.completedExerciseIds.length > 0);
        dispatch({
          type: "BEGIN",
          exercises: lesson.exercises,
          hearts: START_HEARTS,
          alreadyCompletedIds: progress.completedExerciseIds,
        });
      } catch (error) {
        setStartError(
          error instanceof ApiError
            ? error.message
            : "Couldn't start the lesson. Please try again.",
        );
      } finally {
        setIsStarting(false);
      }
    },
    [isReview, lesson.id, lesson.exercises],
  );

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
        isReview ? "review" : "lesson",
      );
      setServerProgress(lessonProgress);
      if (lessonProgress.justCompleted && lessonProgress.timesCompleted === 1) {
        setFirstCompletion(true);
      }
      dispatch({
        type: "CHECK",
        isCorrect: attempt.isCorrect,
        typoCorrection: attempt.typoCorrection,
        correctAnswer: attempt.correctAnswer,
        explanation: attempt.explanation,
      });
    } catch (error) {
      setCheckError(
        error instanceof ApiError ? error.message : "Couldn't check your answer. Please try again.",
      );
    } finally {
      setIsChecking(false);
    }
  }, [exercise, state.answer, state.result, isChecking, isReview]);

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
        status={lesson.progress.status}
        doneCount={state.completedIds.length}
        totalCount={state.totalExercises}
        exitHref={exitHref}
        isStarting={isStarting}
        startError={startError}
        onStart={(restart) => void begin(restart)}
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
        mode={lesson.mode}
        exercisesCompleted={serverProgress?.completedExercises ?? state.completedIds.length}
        totalExercises={
          isReview ? state.totalExercises : (serverProgress?.totalExercises ?? state.totalExercises)
        }
        // Lessons show the saved accuracy (includes answers given before leaving and resuming).
        accuracy={isReview ? getAccuracy(state) : (serverProgress?.accuracy ?? getAccuracy(state))}
        resumed={resumed}
        heartsLeft={isReview ? null : state.hearts}
        mistakesReviewed={state.mistakeIds.length}
        savedAsCompleted={serverProgress?.status === "COMPLETED"}
        firstCompletion={firstCompletion}
        words={lesson.newWords}
        onPracticeAgain={() => {
          setFirstCompletion(false);
          void begin(true);
        }}
      />
    );
  }

  if (!exercise) return null;

  return (
    <div className="flex min-h-dvh flex-col">
      <LessonTopBar
        completed={state.completedIds.length}
        total={state.totalExercises}
        hearts={state.heartsEnabled ? state.hearts : null}
        exitHref={exitHref}
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
          explanation={state.explanation}
          onCheck={() => void check()}
          onContinue={() => dispatch({ type: "CONTINUE" })}
        />
      </div>
    </div>
  );
}
