// Exercise types. Each exercise has a `type` field so TypeScript (and the
// ExerciseRenderer) knows exactly which shape and which component to use.
// The correct answers are NOT sent to the browser: the backend
// checks every answer (POST /api/exercises/:id/attempt).
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
};

/** Shows one letter (e.g. "ఆ"); the learner picks the sound it makes. */
export type CharacterSoundExercise = ExerciseBase & {
  type: "character-sound";
  character: string;
  options: ChoiceOption[];
};

/** Shows a sound (e.g. "aa"); the learner picks the matching letter. */
export type CharacterRecognitionExercise = ExerciseBase & {
  type: "character-recognition";
  prompt: string;
  /** How the sound is pronounced, e.g. "long “aa”, like the a in “father”". */
  promptSubtext?: string;
  options: ChoiceOption[];
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
};

export type TranslationExercise = ExerciseBase & {
  type: "translation";
  prompt: string;
  promptSubtext?: string;
};

export type WordOrderExercise = ExerciseBase & {
  type: "word-order";
  /** The sentence to build, e.g. "My name is Asha." */
  prompt: string;
  /** Word bank (already shuffled, may include extra distractor words). */
  tokens: ChoiceOption[];
};

export type Exercise =
  | MultipleChoiceExercise
  | CharacterSoundExercise
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
  | { type: "matching"; complete: boolean; matchedIds: string[] };

export type AnswerResult = "correct" | "incorrect";

export type LessonMode = "lesson" | "review";

export type Lesson = {
  id: string;
  /** "lesson" = a lesson from the path; "review" = a session of past mistakes. */
  mode: LessonMode;
  title: string;
  unitTitle: string;
  /** Course language code, e.g. "te" (used for audio). Empty for review sessions. */
  languageCode: string;
  /** Words introduced before the exercises start ("Short introduction + examples"). */
  newWords: VocabularyWord[];
  /** Sentence shown on the intro screen. */
  introText: string;
  exercises: Exercise[];
  /** Saved progress (lessons only): used to resume or to offer "practise again". */
  progress: {
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
    completedExerciseIds: string[];
  };
};

/** Common props every exercise component receives. */
export type ExerciseComponentProps<TExercise extends Exercise> = {
  exercise: TExercise;
  answer: ExerciseAnswer | null;
  onAnswerChange: (answer: ExerciseAnswer | null) => void;
  /** True after the learner pressed "Check": the answer can no longer change. */
  isLocked: boolean;
  result: AnswerResult | null;
  /** The correct answer text from the server after "Check" (used to highlight the right option). */
  correctAnswer: string | null;
  /** Show Latin-letter pronunciation under Indian-script text (a learner setting). */
  showRomanization: boolean;
};
