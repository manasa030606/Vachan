"use client";

// Runs a lesson (or a mistake review): intro, then the exercises, then the complete screen.
// "Start" calls POST /api/lessons/:id/start, which returns the exercises already done, so a
// half-finished lesson resumes where the learner stopped. "Check" sends the answer to
// POST /api/exercises/:id/attempt; the server marks it, saves it and returns feedback.
// Review mode costs no hearts. The step-by-step lesson rules live in lessonReducer.
import { useCallback, useEffect, useReducer, useState } from "react";
import type { ExerciseAnswer, Lesson } from "@/types/exercise";
import { ExerciseRenderer } from "@/components/exercises/exercise-renderer";
import { TutorDrawer } from "@/components/tutor/tutor-drawer";
import { ApiError } from "@/lib/api/client";
import { startLesson, submitAttempt } from "@/lib/api/endpoints";
import type { AttemptResultDto, BadgeDto, RewardsDto } from "@/lib/api/types";
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

/** Placeholder until POST /lessons/:id/start returns the real number of hearts. */
const START_HEARTS = 5;

/** What the learner earned in this run, for the complete screen. */
export type RunRewards = {
  xpEarned: number;
  badges: BadgeDto[];
  last: RewardsDto | null;
  leveledUp: boolean;
  goalJustCompleted: boolean;
};

/** Rewards at the start of a run, before any answer is checked. */
const NO_REWARDS: RunRewards = {
  xpEarned: 0,
  badges: [],
  last: null,
  leveledUp: false,
  goalJustCompleted: false,
};

/** Plays one lesson or review from start to finish. */
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
  /** Latest lesson progress from the server, shown on the complete screen. */
  const [serverProgress, setServerProgress] = useState<AttemptResultDto["lessonProgress"] | null>(
    null,
  );
  const [firstCompletion, setFirstCompletion] = useState(false);
  const [resumed, setResumed] = useState(false);
  const [runRewards, setRunRewards] = useState<RunRewards>(NO_REWARDS);
  const [nextHeartAt, setNextHeartAt] = useState<string | null>(null);
  /** Exercise the learner opened the AI tutor for, or null. */
  const [tutorExerciseId, setTutorExerciseId] = useState<string | null>(null);

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
        const { progress, resumed: wasResumed, hearts } = await startLesson(lesson.id, restart);
        setResumed(wasResumed && progress.completedExerciseIds.length > 0);
        setRunRewards(NO_REWARDS);
        setNextHeartAt(hearts.nextHeartAt);
        dispatch({
          type: "BEGIN",
          exercises: lesson.exercises,
          hearts: hearts.current,
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
      const { attempt, lessonProgress, rewards } = await submitAttempt(
        exercise.id,
        toAttemptAnswer(state.answer),
        isReview ? "review" : "lesson",
      );
      setServerProgress(lessonProgress);
      if (lessonProgress.justCompleted && lessonProgress.timesCompleted === 1) {
        setFirstCompletion(true);
      }
      setNextHeartAt(rewards.hearts.nextHeartAt);
      // Add this answer's rewards to the running totals for the complete screen.
      setRunRewards((previous) => ({
        xpEarned: previous.xpEarned + rewards.xpEarned,
        badges: [...previous.badges, ...rewards.newAchievements],
        last: rewards,
        leveledUp: previous.leveledUp || rewards.leveledUp,
        goalJustCompleted: previous.goalJustCompleted || rewards.dailyGoal.justCompleted,
      }));
      dispatch({
        type: "CHECK",
        isCorrect: attempt.isCorrect,
        typoCorrection: attempt.typoCorrection,
        correctAnswer: attempt.correctAnswer,
        explanation: attempt.explanation,
        hearts: rewards.hearts.current,
      });
    } catch (error) {
      if (error instanceof ApiError && error.code === "OUT_OF_HEARTS") {
        // The server sends when the next heart comes back in the error details.
        const details = error.details as unknown as { nextHeartAt?: string | null } | undefined;
        setNextHeartAt(details?.nextHeartAt ?? null);
        dispatch({ type: "OUT_OF_HEARTS" });
        return;
      }
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
      // The tutor panel is open (or another box already handled Enter): leave the lesson alone.
      if (tutorExerciseId || event.defaultPrevented) return;
      // A focused button already reacts to Enter by itself.
      if ((event.target as HTMLElement | null)?.tagName === "BUTTON") return;
      if (state.result) dispatch({ type: "CONTINUE" });
      else if (canCheck) void check();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.phase, state.result, canCheck, check, tutorExerciseId]);

  if (state.phase === "intro") {
    return (
      <LessonIntro
        title={lesson.title}
        unitTitle={lesson.unitTitle}
        words={lesson.newWords}
        introText={lesson.introText}
        showRomanization={showRomanization}
        languageCode={lesson.languageCode}
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
    return <OutOfHearts nextHeartAt={nextHeartAt} />;
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
        rewards={runRewards}
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
          onAskTutor={
            state.result === "incorrect" && !isReview
              ? () => setTutorExerciseId(exercise.id)
              : undefined
          }
        />
      </div>
      {tutorExerciseId && (
        <TutorDrawer
          lessonId={lesson.id}
          exerciseId={tutorExerciseId}
          onClose={() => setTutorExerciseId(null)}
        />
      )}
    </div>
  );
}
