// The lesson "state machine", written as a plain reducer function (no React inside)
// so it is easy to follow and to unit-test.
//
//   intro ──START──▶ exercise ──CHECK──▶ (answer locked, feedback shown) ──CONTINUE──▶ next exercise
//                                                                              │
//                    out-of-hearts ◀── hearts reach 0                          └─▶ complete
//
// A wrong answer costs one heart and puts that exercise again at the end of the
// queue ("mini review of mistakes", spec section 5).
//
// The reducer does NOT decide whether an answer is right: the server does
// (POST /api/exercises/:id/attempt) and the result is passed in with the CHECK action.
import type { AnswerResult, Exercise, ExerciseAnswer } from "@/types/exercise";

export type LessonPhase = "intro" | "exercise" | "complete" | "out-of-hearts";

export type LessonState = {
  phase: LessonPhase;
  /** Exercises still to do, including re-queued mistakes. */
  queue: Exercise[];
  /** Index into `queue` of the current exercise. */
  position: number;
  answer: ExerciseAnswer | null;
  result: AnswerResult | null;
  /** Set when a typed answer was accepted despite a small spelling mistake. */
  typoCorrection: string | null;
  /** The correct answer text from the server, shown after "Check". */
  correctAnswer: string | null;
  hearts: number;
  totalExercises: number;
  /** Ids of exercises answered correctly at least once (drives the progress bar). */
  completedIds: string[];
  /** Ids of exercises the learner got wrong at least once. */
  mistakeIds: string[];
  correctAnswers: number;
  totalAnswers: number;
};

export type LessonAction =
  | { type: "START" }
  | { type: "ANSWER_CHANGED"; answer: ExerciseAnswer | null }
  | { type: "CHECK"; isCorrect: boolean; typoCorrection: string | null; correctAnswer: string }
  | { type: "CONTINUE" }
  | { type: "RESTART"; exercises: Exercise[]; hearts: number };

export function createInitialLessonState(exercises: Exercise[], hearts: number): LessonState {
  return {
    phase: "intro",
    queue: exercises,
    position: 0,
    answer: null,
    result: null,
    typoCorrection: null,
    correctAnswer: null,
    hearts,
    totalExercises: exercises.length,
    completedIds: [],
    mistakeIds: [],
    correctAnswers: 0,
    totalAnswers: 0,
  };
}

export function lessonReducer(state: LessonState, action: LessonAction): LessonState {
  switch (action.type) {
    case "START":
      return { ...state, phase: "exercise" };

    case "ANSWER_CHANGED":
      // Answers can't change after "Check".
      if (state.result) return state;
      return { ...state, answer: action.answer };

    case "CHECK": {
      const exercise = state.queue[state.position];
      if (!exercise || state.result || !state.answer) return state;

      if (action.isCorrect) {
        return {
          ...state,
          result: "correct",
          typoCorrection: action.typoCorrection,
          correctAnswer: action.correctAnswer,
          correctAnswers: state.correctAnswers + 1,
          totalAnswers: state.totalAnswers + 1,
          completedIds: state.completedIds.includes(exercise.id)
            ? state.completedIds
            : [...state.completedIds, exercise.id],
        };
      }
      return {
        ...state,
        result: "incorrect",
        correctAnswer: action.correctAnswer,
        hearts: Math.max(0, state.hearts - 1),
        totalAnswers: state.totalAnswers + 1,
        mistakeIds: state.mistakeIds.includes(exercise.id)
          ? state.mistakeIds
          : [...state.mistakeIds, exercise.id],
        // Practise it again at the end of the lesson.
        queue: [...state.queue, exercise],
      };
    }

    case "CONTINUE": {
      if (!state.result) return state;
      if (state.hearts === 0) return { ...state, phase: "out-of-hearts" };

      const nextPosition = state.position + 1;
      const isFinished = nextPosition >= state.queue.length;
      return {
        ...state,
        position: nextPosition,
        answer: null,
        result: null,
        typoCorrection: null,
        correctAnswer: null,
        phase: isFinished ? "complete" : "exercise",
      };
    }

    case "RESTART":
      return { ...createInitialLessonState(action.exercises, action.hearts), phase: "exercise" };
  }
}

/** Accuracy as a whole-number percentage (0–100). */
export function getAccuracy(state: LessonState): number {
  if (state.totalAnswers === 0) return 100;
  return Math.round((state.correctAnswers / state.totalAnswers) * 100);
}
