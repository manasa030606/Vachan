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

/**
 * Makes two answers comparable:
 *  - Unicode NFC, so the same Indian-script letter typed two ways is equal
 *  - removes zero-width joiners (invisible characters some keyboards add)
 *  - lower case, punctuation → space (also the Devanagari full stop "।"), collapse spaces
 * " Thank-you! " → "thank you"
 */
export function normalizeText(text: string): string {
  return text
    .normalize("NFC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .toLowerCase()
    .replace(/[.,!?;:'"“”‘’`´\-–—()[\]{}।॥]/g, " ")
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

/** The right answer as text (feedback banner, review list). */
export function correctAnswerText(exercise: CheckableExercise): string {
  const options = exercise.options;
  switch (exercise.type) {
    case "TRANSLATION":
      return options.find((option) => option.isCorrect)?.text ?? "";
    case "WORD_ORDER":
      return options
        .filter((option) => option.correctPosition !== null)
        .sort((a, b) => (a.correctPosition ?? 0) - (b.correctPosition ?? 0))
        .map((option) => option.text)
        .join(" ");
    case "MATCHING":
      return options.map((option) => `${option.text} = ${option.matchText}`).join(", ");
    default:
      return options.find((option) => option.isCorrect)?.text ?? "";
  }
}

/** Turns a stored answer back into readable text, e.g. for "You answered: …". */
export function describeAnswer(exercise: CheckableExercise, answer: unknown): string {
  const byId = new Map(exercise.options.map((option) => [option.id, option]));
  if (typeof answer !== "object" || answer === null) return "";
  if ("optionId" in answer && typeof answer.optionId === "string") {
    return byId.get(answer.optionId)?.text ?? "";
  }
  if ("text" in answer && typeof answer.text === "string") return answer.text;
  if ("optionIds" in answer && Array.isArray(answer.optionIds)) {
    return answer.optionIds.map((id) => byId.get(String(id))?.text ?? "?").join(" ");
  }
  if ("pairs" in answer && Array.isArray(answer.pairs)) {
    const pairs = answer.pairs as Array<{ leftId: string; rightId: string }>;
    const wrong = pairs.filter((pair) => pair.leftId !== pair.rightId);
    const shown = wrong.length > 0 ? wrong : pairs;
    return shown
      .map(
        (pair) =>
          `${byId.get(pair.leftId)?.text ?? "?"} = ${byId.get(pair.rightId)?.matchText ?? "?"}`,
      )
      .join(", ");
  }
  return "";
}

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
    case "CHARACTER_SOUND":
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
