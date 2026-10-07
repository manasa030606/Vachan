// Checks that an exercise written in the admin dashboard can actually be answered — the same
// rules the answer checker (services/answer-checker.ts) relies on. Pure function, unit-tested.
import type { ExerciseType } from "../../generated/prisma/client.ts";

export type OptionInput = {
  text: string;
  subtext?: string | null;
  isCorrect?: boolean;
  correctPosition?: number | null;
  matchText?: string | null;
};

export type ExerciseInput = {
  type: ExerciseType;
  instruction: string;
  prompt: string;
  sentenceBefore?: string | null;
  sentenceAfter?: string | null;
  options: OptionInput[];
};

const CHOICE_TYPES: ExerciseType[] = [
  "MULTIPLE_CHOICE",
  "CHARACTER_RECOGNITION",
  "CHARACTER_SOUND",
  "FILL_IN_BLANK",
];

/** Returns a list of problems in plain English (empty = the exercise is valid). */
export function exerciseProblems(exercise: ExerciseInput): string[] {
  const problems: string[] = [];
  const options = exercise.options;
  const texts = options.map((o) => o.text.trim());
  if (!exercise.instruction.trim())
    problems.push("Write an instruction (e.g. “Select the meaning”).");
  if (!exercise.prompt.trim() && exercise.type !== "MATCHING")
    problems.push("Write the prompt the learner sees.");
  if (texts.some((t) => !t)) problems.push("Every option needs text.");

  if (CHOICE_TYPES.includes(exercise.type)) {
    if (options.length < 2 || options.length > 6) problems.push("Give 2–6 options.");
    const correct = options.filter((o) => o.isCorrect).length;
    if (correct !== 1) problems.push("Mark exactly one option as correct.");
    if (new Set(texts).size !== texts.length) problems.push("Options must all be different.");
    if (
      exercise.type === "FILL_IN_BLANK" &&
      !exercise.sentenceBefore?.trim() &&
      !exercise.sentenceAfter?.trim()
    ) {
      problems.push("A fill-in-the-blank needs the sentence text before and/or after the blank.");
    }
  }

  if (exercise.type === "TRANSLATION") {
    if (!options.some((o) => o.isCorrect))
      problems.push("Add at least one accepted answer (marked correct).");
  }

  if (exercise.type === "WORD_ORDER") {
    const positions = options
      .map((o) => o.correctPosition)
      .filter((p): p is number => typeof p === "number");
    if (positions.length < 2) problems.push("A sentence needs at least 2 words with a position.");
    const sorted = [...positions].sort((a, b) => a - b);
    if (sorted.some((p, i) => p !== i + 1)) {
      problems.push(
        "Word positions must be 1, 2, 3 … without gaps or repeats (extra words: empty).",
      );
    }
  }

  if (exercise.type === "MATCHING") {
    if (options.length < 2 || options.length > 6) problems.push("Give 2–6 pairs.");
    if (options.some((o) => !o.matchText?.trim())) problems.push("Every pair needs a match.");
    const matches = options.map((o) => o.matchText?.trim());
    if (new Set(matches).size !== matches.length) problems.push("Matches must all be different.");
  }
  return problems;
}
