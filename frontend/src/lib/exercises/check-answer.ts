// Small helpers for answers on the frontend.
// The actual checking happens on the server (backend/src/services/answer-checker.ts),
// so the browser never needs to know the correct answers in advance.
import type { AttemptAnswerDto } from "@/lib/api/types";
import type { Exercise, ExerciseAnswer } from "@/types/exercise";

/** Has the learner given enough of an answer to press "Check"? */
export function isAnswerReady(exercise: Exercise, answer: ExerciseAnswer | null): boolean {
  if (!answer) return false;
  switch (answer.type) {
    case "choice":
      return true;
    case "text":
      return answer.value.trim().length > 0;
    case "order":
      return answer.tokenIds.length > 0;
    case "matching":
      return exercise.type === "matching" && answer.complete;
  }
}

/** Converts the UI answer into the JSON body expected by POST /api/exercises/:id/attempt. */
export function toAttemptAnswer(answer: ExerciseAnswer): AttemptAnswerDto {
  switch (answer.type) {
    case "choice":
      return { optionId: answer.optionId };
    case "text":
      return { text: answer.value };
    case "order":
      return { optionIds: answer.tokenIds };
    case "matching":
      // Each pair is one item, so a correct match pairs an id with itself.
      return { pairs: answer.matchedIds.map((id) => ({ leftId: id, rightId: id })) };
  }
}
