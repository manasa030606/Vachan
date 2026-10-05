// Exercise types. Each exercise has a `type` field so TypeScript (and the
// ExerciseRenderer) knows exactly which shape and which component to use.
import type { VocabularyWord } from "./learning";

export type ChoiceOption = {
  id: string;
  text: string;
  /** Optional smaller line under the text, e.g. romanization. */
  subtext?: string;
};

type ExerciseBase = {
  id: string;
  /** Instruction shown above the exercise, e.g. "Select the correct meaning". */
  instruction: string;
};

export type MultipleChoiceExercise = ExerciseBase & {
  type: "multiple-choice";
  prompt: string;
  promptSubtext?: string;
  options: ChoiceOption[];
  correctOptionId: string;
};

export type CharacterRecognitionExercise = ExerciseBase & {
  type: "character-recognition";
  character: string;
  options: ChoiceOption[];
  correctOptionId: string;
};

export type MatchingPair = {
  id: string;
  left: string;
  leftSubtext?: string;
  right: string;
};

export type MatchingExercise = ExerciseBase & {
  type: "matching";
  pairs: MatchingPair[];
};

export type FillInBlankExercise = ExerciseBase & {
  type: "fill-in-blank";
  /** Sentence text before and after the blank. */
  before: string;
  after: string;
  translation: string;
  options: ChoiceOption[];
  correctOptionId: string;
};

export type TranslationExercise = ExerciseBase & {
  type: "translation";
  prompt: string;
  promptSubtext?: string;
  /** Any of these (case/punctuation-insensitive) counts as correct. */
  acceptedAnswers: string[];
};

export type WordOrderExercise = ExerciseBase & {
  type: "word-order";
  /** The sentence to build, e.g. "My name is Asha." */
  prompt: string;
  /** Word bank (already shuffled, may include extra distractor words). */
  tokens: ChoiceOption[];
  /** Token ids in the correct order. */
  correctOrder: string[];
};

export type Exercise =
  | MultipleChoiceExercise
  | CharacterRecognitionExercise
  | MatchingExercise
  | FillInBlankExercise
  | TranslationExercise
  | WordOrderExercise;

export type ExerciseType = Exercise["type"];

/** What the learner has answered so far for the current exercise. */
export type ExerciseAnswer =
  | { type: "choice"; optionId: string }
  | { type: "text"; value: string }
  | { type: "order"; tokenIds: string[] }
  | { type: "matching"; complete: boolean };

export type AnswerResult = "correct" | "incorrect";

export type Lesson = {
  id: string;
  title: string;
  unitTitle: string;
  xpReward: number;
  /** Words introduced before the exercises start ("Short introduction + examples"). */
  newWords: VocabularyWord[];
  /** Sentence shown on the intro screen. */
  introText: string;
  exercises: Exercise[];
};

/** Common props every exercise component receives. */
export type ExerciseComponentProps<TExercise extends Exercise> = {
  exercise: TExercise;
  answer: ExerciseAnswer | null;
  onAnswerChange: (answer: ExerciseAnswer | null) => void;
  /** True after the learner pressed "Check": the answer can no longer change. */
  isLocked: boolean;
  result: AnswerResult | null;
  /** Show Latin-letter pronunciation under Indian-script text (a learner setting). */
  showRomanization: boolean;
};
