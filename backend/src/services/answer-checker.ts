// Checks a learner's answer. Pure functions (no database), so they are easy to unit-test.
// The correct answers live only on the server; the browser never receives them before answering.
import type { ExerciseType } from "../generated/prisma/client.ts";
import { HttpError } from "../lib/http-error.ts";
import type { AttemptAnswer } from "../schemas/content.schemas.ts";

export type CheckableOption = {
  id: string;
  text: string;
  isCorrect: boolean;
  correctPosition: number | null;
  matchText: string | null;
};

export type CheckableExercise = {
  type: ExerciseType;
  options: CheckableOption[];
};

export type CheckResult = {
  isCorrect: boolean;
  /** Set when a typed answer was accepted despite a small spelling mistake. */
  typoCorrection: string | null;
  /** The right answer as text, shown in the feedback banner. */
  correctAnswer: string;
};

// ── Text helpers ─────────────────────────────────────────────

/** Lower-case, remove punctuation and extra spaces: " Thank-you! " → "thank you". */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?;:'"“”‘’-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Also removes spaces, so "THankyou" and "thank you" compare as equal. */
export function toComparable(text: string): string {
  return normalizeText(text).replace(/ /g, "");
}

/** Letters that may be wrong before a typed answer is rejected. Short words must be exact. */
export function allowedTypos(answerLength: number): number {
  if (answerLength <= 4) return 0;
  if (answerLength <= 10) return 1;
  return 2;
}

/** Single-letter edits (insert, delete, replace, swap neighbours) to turn `a` into `b`. */
export function editDistance(a: string, b: string): number {
  const d: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array<number>(b.length + 1).fill(0),
  );
  for (let i = 0; i <= a.length; i++) d[i][0] = i;
  for (let j = 0; j <= b.length; j++) d[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

// ── Checking ─────────────────────────────────────────────────

function wrongShape(expected: string): HttpError {
  return new HttpError(
    400,
    "INVALID_ANSWER_FORMAT",
    `This exercise expects an answer like ${expected}`,
  );
}

export function checkAnswer(exercise: CheckableExercise, answer: AttemptAnswer): CheckResult {
  const options = exercise.options;

  switch (exercise.type) {
    case "MULTIPLE_CHOICE":
    case "CHARACTER_RECOGNITION":
    case "FILL_IN_BLANK": {
      if (!("optionId" in answer)) throw wrongShape('{ "optionId": "..." }');
      const correct = options.find((option) => option.isCorrect);
      if (!options.some((option) => option.id === answer.optionId)) {
        throw new HttpError(400, "UNKNOWN_OPTION", "optionId does not belong to this exercise");
      }
      return {
        isCorrect: correct?.id === answer.optionId,
        typoCorrection: null,
        correctAnswer: correct?.text ?? "",
      };
    }

    case "TRANSLATION": {
      if (!("text" in answer)) throw wrongShape('{ "text": "..." }');
      const accepted = options.filter((option) => option.isCorrect).map((option) => option.text);
      const given = toComparable(answer.text);
      const correctAnswer = accepted[0] ?? "";

      if (accepted.some((text) => toComparable(text) === given)) {
        return { isCorrect: true, typoCorrection: null, correctAnswer };
      }
      const nearMiss = accepted.find(
        (text) =>
          editDistance(given, toComparable(text)) <= allowedTypos(toComparable(text).length),
      );
      return nearMiss
        ? { isCorrect: true, typoCorrection: nearMiss, correctAnswer }
        : { isCorrect: false, typoCorrection: null, correctAnswer };
    }

    case "WORD_ORDER": {
      if (!("optionIds" in answer)) throw wrongShape('{ "optionIds": ["...", "..."] }');
      const sentence = options
        .filter((option) => option.correctPosition !== null)
        .sort((a, b) => (a.correctPosition ?? 0) - (b.correctPosition ?? 0));
      const isCorrect =
        answer.optionIds.length === sentence.length &&
        answer.optionIds.every((id, index) => id === sentence[index].id);
      return {
        isCorrect,
        typoCorrection: null,
        correctAnswer: sentence.map((option) => option.text).join(" "),
      };
    }

    case "MATCHING": {
      if (!("pairs" in answer))
        throw wrongShape('{ "pairs": [{ "leftId": "...", "rightId": "..." }] }');
      // Each option is one pair, so a correct match pairs an option with itself.
      const matchedIds = new Set(
        answer.pairs.filter((pair) => pair.leftId === pair.rightId).map((pair) => pair.leftId),
      );
      const isCorrect =
        answer.pairs.length === options.length &&
        options.every((option) => matchedIds.has(option.id));
      return {
        isCorrect,
        typoCorrection: null,
        correctAnswer: options.map((option) => `${option.text} = ${option.matchText}`).join(", "),
      };
    }
  }
}
