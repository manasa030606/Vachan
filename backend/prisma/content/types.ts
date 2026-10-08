// Shapes of the course content. The curriculum (curriculum.ts) is the same for every language;
// each language file (languages/<code>.ts) gives the natural way to say every concept in it.
import type { ConceptKey, DialogueKey } from "./curriculum.ts";

/** One word of a phrase: [native script, romanization]. Punctuation stays on the last word. */
export type Token = [script: string, roman: string];

type EntryBase = {
  /** English meaning shown to learners. Defaults to the concept's English text. */
  meaning?: string;
  /** Other correct English translations, accepted in "write this in English" exercises. */
  accept?: string[];
  /**
   * Usage notes for learners and the AI tutor: formal/casual forms, gender, alternatives,
   * literal meaning, when to use it. Plain English with native script + romanization.
   */
  notes?: string;
};

/** A single word (or a fixed expression that is not split into words). */
export type WordEntry = EntryBase & { script: string; roman: string };

/** A phrase or sentence, word by word in natural order (used for word-order exercises). */
export type PhraseEntry = EntryBase & {
  words: Token[];
  /** Index of the word to hide in a fill-in-the-blank exercise (default: the longest word). */
  blank?: number;
};

export type Entry = WordEntry | PhraseEntry;

/** A word or phrase that only this language teaches (cultural or language-specific items). */
export type ExtraEntry = (WordEntry | PhraseEntry) & {
  /** Stable slug, unique within the language, e.g. "pongal". */
  key: string;
  /** Curriculum lesson that teaches it, e.g. "food-staples". */
  lesson: string;
  topic: string;
  /** Required for extras (there is no concept to take the English from). */
  meaning: string;
};

export type DialogueLine = {
  speaker: "A" | "B";
  script: string;
  roman: string;
  meaning: string;
};

export type Dialogue = {
  /** Who is talking and where, e.g. "Asha meets her new neighbour Ravi." */
  context: string;
  lines: DialogueLine[];
};

export type LanguageContent = {
  code: string;
  /** Every curriculum concept, said naturally in this language. */
  entries: Record<ConceptKey, Entry>;
  /** Language-specific additions (at least a few per topic where it makes sense). */
  extras: ExtraEntry[];
  /** Short beginner dialogues, one per curriculum dialogue. */
  dialogues: Record<DialogueKey, Dialogue>;
  /** Optional language-specific note added to a lesson's intro (e.g. a grammar point). */
  lessonNotes?: Partial<Record<string, string>>;
};

export const isPhrase = (entry: Entry): entry is PhraseEntry => "words" in entry;
