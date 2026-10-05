// Which XP an answer earns (pure function). Amounts come from config/gamification.ts.
import type { XpReason } from "../../generated/prisma/enums.ts";

export type XpAward = { reason: XpReason; amount: number };

export type XpConfig = {
  exerciseCorrect: number;
  lessonCompleted: number;
  lessonPracticed: number;
  perfectLessonBonus: number;
  reviewCorrect: number;
};

export type AnswerOutcome =
  | {
      mode: "lesson";
      /** First correct answer to this exercise in the current run. */
      newlySolved: boolean;
      /** This answer finished the run (every exercise correct). */
      runCompleted: boolean;
      /** The lesson was not completed before this run. */
      firstCompletion: boolean;
      /** No wrong answers in this run. */
      perfectRun: boolean;
    }
  | { mode: "review"; isCorrect: boolean };

export function xpForAnswer(outcome: AnswerOutcome, config: XpConfig): XpAward[] {
  if (outcome.mode === "review") {
    return outcome.isCorrect ? [{ reason: "REVIEW_CORRECT", amount: config.reviewCorrect }] : [];
  }
  const awards: XpAward[] = [];
  if (outcome.newlySolved)
    awards.push({ reason: "EXERCISE_CORRECT", amount: config.exerciseCorrect });
  if (outcome.runCompleted) {
    awards.push(
      outcome.firstCompletion
        ? { reason: "LESSON_COMPLETED", amount: config.lessonCompleted }
        : { reason: "LESSON_PRACTICED", amount: config.lessonPracticed },
    );
    if (outcome.perfectRun)
      awards.push({ reason: "PERFECT_LESSON", amount: config.perfectLessonBonus });
  }
  return awards;
}
