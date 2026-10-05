// Pure functions for checking answers. No React here, so this logic is easy to
// read, test, and later move to the backend (Phase 3 checks answers server-side).
import type { Exercise, ExerciseAnswer } from "@/types/exercise";

/** Lower-case, trim, remove punctuation and extra spaces: " Thank-you! " → "thank you". */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?;:'"“”‘’-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

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

/** Result of checking an answer. `typoCorrection` is set when a small spelling slip was accepted. */
export type AnswerEvaluation = {
  isCorrect: boolean;
  typoCorrection?: string;
};

/**
 * How many letters may be wrong before a typed answer is rejected.
 * Short words must be exact; longer phrases allow 1–2 slips ("thnak you" → "thank you").
 */
export function allowedTypos(answerLength: number): number {
  if (answerLength <= 4) return 0;
  if (answerLength <= 10) return 1;
  return 2;
}

/**
 * Number of single-letter edits (insert, delete, replace, or swap two neighbouring
 * letters) needed to turn `a` into `b`. "thnak" → "thank" is 1 (one swap).
 */
export function editDistance(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const d: number[][] = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));
  for (let i = 0; i < rows; i++) d[i][0] = i;
  for (let j = 0; j < cols; j++) d[0][j] = j;

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      const isSwap = i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1];
      if (isSwap) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}

/** Compares a typed answer with the accepted answers (case, punctuation and small typos ignored). */
/**
 * The form used to compare typed answers: lower-case, no punctuation and NO spaces.
 * So "THankyou", "ThaNk you" and "thank-you!" all become "thankyou".
 */
export function toComparable(text: string): string {
  return normalizeText(text).replace(/ /g, "");
}

/** Compares a typed answer with the accepted answers (capitals, spaces, punctuation and small typos ignored). */
function evaluateTypedAnswer(value: string, acceptedAnswers: string[]): AnswerEvaluation {
  const given = toComparable(value);
  if (acceptedAnswers.some((accepted) => toComparable(accepted) === given)) {
    return { isCorrect: true };
  }
  for (const accepted of acceptedAnswers) {
    const target = toComparable(accepted);
    if (editDistance(given, target) <= allowedTypos(target.length)) {
      return { isCorrect: true, typoCorrection: accepted };
    }
  }
  return { isCorrect: false };
}

export function evaluateAnswer(
  exercise: Exercise,
  answer: ExerciseAnswer | null,
): AnswerEvaluation {
  if (!answer) return { isCorrect: false };

  switch (exercise.type) {
    case "multiple-choice":
    case "character-recognition":
    case "fill-in-blank":
      return {
        isCorrect: answer.type === "choice" && answer.optionId === exercise.correctOptionId,
      };

    case "translation":
      return answer.type === "text"
        ? evaluateTypedAnswer(answer.value, exercise.acceptedAnswers)
        : { isCorrect: false };

    case "word-order":
      return {
        isCorrect:
          answer.type === "order" &&
          answer.tokenIds.length === exercise.correctOrder.length &&
          answer.tokenIds.every((id, index) => id === exercise.correctOrder[index]),
      };

    case "matching":
      // Wrong taps are shown immediately inside the exercise; finishing all pairs completes it.
      return { isCorrect: answer.type === "matching" && answer.complete };
  }
}

export function isAnswerCorrect(exercise: Exercise, answer: ExerciseAnswer | null): boolean {
  return evaluateAnswer(exercise, answer).isCorrect;
}

/** Human-readable correct answer, shown in the feedback banner after a mistake. */
export function getCorrectAnswerText(exercise: Exercise): string {
  switch (exercise.type) {
    case "multiple-choice":
    case "character-recognition":
    case "fill-in-blank": {
      const option = exercise.options.find((item) => item.id === exercise.correctOptionId);
      return option ? option.text : "";
    }
    case "translation":
      return exercise.acceptedAnswers[0];
    case "word-order":
      return exercise.correctOrder
        .map((id) => exercise.tokens.find((token) => token.id === id)?.text ?? "")
        .join(" ");
    case "matching":
      return exercise.pairs.map((pair) => `${pair.left} = ${pair.right}`).join(", ");
  }
}
