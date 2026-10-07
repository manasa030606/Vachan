// Helpers for the admin exercise editor (pure functions, unit-tested in admin-exercise.test.ts).
// The server re-checks everything (services/admin/exercise-rules.ts) — these only shape the form.
import type { AdminExercise, AdminOption, ExerciseBody, ExerciseType } from "./api/admin";

export const CHOICE_TYPES: ExerciseType[] = [
  "MULTIPLE_CHOICE",
  "CHARACTER_RECOGNITION",
  "CHARACTER_SOUND",
  "FILL_IN_BLANK",
];

/** What the option rows mean for each type (labels for the editor). */
export function optionMode(type: ExerciseType): "choice" | "accepted" | "order" | "pairs" {
  if (type === "TRANSLATION") return "accepted";
  if (type === "WORD_ORDER") return "order";
  if (type === "MATCHING") return "pairs";
  return "choice";
}

const blankOption = (): AdminOption => ({
  text: "",
  subtext: "",
  isCorrect: false,
  correctPosition: null,
  matchText: "",
});

/** A new, empty exercise of a type with a sensible starting set of rows. */
export function blankExercise(type: ExerciseType): ExerciseBody {
  const instruction: Record<ExerciseType, string> = {
    MULTIPLE_CHOICE: "Select the correct meaning",
    CHARACTER_RECOGNITION: "Which letter is this?",
    CHARACTER_SOUND: "Select the sound",
    MATCHING: "Match the pairs",
    FILL_IN_BLANK: "Fill in the blank",
    TRANSLATION: "Translate this sentence",
    WORD_ORDER: "Put the words in order",
  };
  const rows = type === "TRANSLATION" ? 1 : type === "WORD_ORDER" ? 3 : 3;
  const options = Array.from({ length: rows }, blankOption);
  if (optionMode(type) === "choice") options[0]!.isCorrect = true;
  if (type === "TRANSLATION") options[0]!.isCorrect = true;
  if (type === "WORD_ORDER") options.forEach((o, i) => (o.correctPosition = i + 1));
  return {
    type,
    instruction: instruction[type],
    prompt: "",
    promptSubtext: "",
    sentenceBefore: "",
    sentenceAfter: "",
    translation: "",
    explanation: "",
    options,
  };
}

/** An existing exercise as editable form values. */
export function toDraft(exercise: AdminExercise): ExerciseBody {
  return {
    type: exercise.type,
    instruction: exercise.instruction,
    prompt: exercise.prompt,
    promptSubtext: exercise.promptSubtext ?? "",
    sentenceBefore: exercise.sentenceBefore ?? "",
    sentenceAfter: exercise.sentenceAfter ?? "",
    translation: exercise.translation ?? "",
    explanation: exercise.explanation ?? "",
    options: exercise.options.map((o) => ({
      text: o.text,
      subtext: o.subtext ?? "",
      isCorrect: Boolean(o.isCorrect),
      correctPosition: o.correctPosition ?? null,
      matchText: o.matchText ?? "",
    })),
  };
}

const orNull = (value: string | null | undefined) => (value && value.trim() ? value.trim() : null);

/** Form values → the request body: trims text, drops fields the type doesn't use, no option ids. */
export function toRequestBody(draft: ExerciseBody): ExerciseBody {
  const mode = optionMode(draft.type);
  return {
    type: draft.type,
    instruction: draft.instruction.trim(),
    prompt: draft.prompt.trim(),
    promptSubtext: orNull(draft.promptSubtext),
    sentenceBefore: draft.type === "FILL_IN_BLANK" ? orNull(draft.sentenceBefore) : null,
    sentenceAfter: draft.type === "FILL_IN_BLANK" ? orNull(draft.sentenceAfter) : null,
    translation: orNull(draft.translation),
    explanation: orNull(draft.explanation),
    options: draft.options.map((o) => ({
      text: o.text.trim(),
      subtext: orNull(o.subtext),
      isCorrect: mode === "choice" || mode === "accepted" ? Boolean(o.isCorrect) : false,
      correctPosition: mode === "order" ? (o.correctPosition ?? null) : null,
      matchText: mode === "pairs" ? orNull(o.matchText) : null,
    })),
  };
}

/** Quick checks shown while typing (the server has the final say). */
export function draftProblems(draft: ExerciseBody): string[] {
  const problems: string[] = [];
  const mode = optionMode(draft.type);
  if (!draft.instruction.trim()) problems.push("Write an instruction.");
  if (!draft.prompt.trim() && draft.type !== "MATCHING")
    problems.push("Write the prompt the learner sees.");
  if (draft.options.some((o) => !o.text.trim())) problems.push("Every option needs text.");
  if (mode === "choice" && draft.options.filter((o) => o.isCorrect).length !== 1)
    problems.push("Mark exactly one option as correct.");
  if (mode === "accepted" && !draft.options.some((o) => o.isCorrect))
    problems.push("Mark at least one accepted answer.");
  if (mode === "pairs" && draft.options.some((o) => !o.matchText?.trim()))
    problems.push("Every pair needs a match.");
  if (mode === "order") {
    const positions = draft.options
      .map((o) => o.correctPosition)
      .filter((p): p is number => typeof p === "number")
      .sort((a, b) => a - b);
    if (positions.some((p, i) => p !== i + 1))
      problems.push("Positions must be 1, 2, 3 … (extra words: empty).");
  }
  return problems;
}
