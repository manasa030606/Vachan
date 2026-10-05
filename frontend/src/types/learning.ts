// Core learning types shared by the API mappers and the UI.

export type LanguageCode = "hi" | "te" | "ta" | "ml" | "kn" | "bn";

/** Tailwind classes used to colour a language consistently across the UI. */
export type LanguageTheme = {
  tile: string; // background + text for the script tile
  soft: string; // light background for cards
  ring: string; // ring colour when selected
};

export type Language = {
  code: LanguageCode;
  name: string; // English name, e.g. "Telugu"
  nativeName: string; // e.g. "తెలుగు"
  scriptName: string; // e.g. "Telugu script"
  glyph: string; // short native glyph shown in the language tile
  description: string;
  theme: LanguageTheme;
};

/** One letter of a script, e.g. { character: "आ", romanization: "aa" }. */
export type ScriptLetter = {
  character: string;
  romanization: string;
  kind: "vowel" | "consonant";
};

export type VocabularyWord = {
  id: string;
  script: string; // the word in its native script
  romanization: string; // how to read it in Latin letters
  meaning: string; // English meaning
  topic: string;
};

export type SentenceToken = {
  id: string;
  text: string;
  romanization: string;
};

/** Small, accurate demo content for one language (expanded into full courses in Phase 3). */
export type LanguageContent = {
  letters: ScriptLetter[];
  words: {
    hello: VocabularyWord;
    thankYou: VocabularyWord;
    water: VocabularyWord;
    mother: VocabularyWord;
    yes: VocabularyWord;
  };
  /** "My name is Asha." split into words. */
  nameSentence: {
    meaning: string;
    tokens: SentenceToken[];
    /** Index of the token meaning "name" (used for fill-in-the-blank). */
    nameTokenIndex: number;
  };
};

/** completed · current (started, not finished) · available (unlocked, not started) · locked */
export type LessonStatus = "completed" | "current" | "available" | "locked";

export type LessonIcon = "script" | "words" | "chat" | "star" | "trophy";

export type LessonSummary = {
  id: string;
  title: string;
  status: LessonStatus;
  icon: LessonIcon;
  exerciseCount: number;
};

export type UnitColor = "brand" | "teal" | "rose";

export type Unit = {
  id: string;
  number: number;
  title: string;
  description: string;
  stage: string; // learning-journey stage from the spec, e.g. "Foundations"
  color: UnitColor;
  status: "locked" | "active" | "completed";
  lessons: LessonSummary[];
};
