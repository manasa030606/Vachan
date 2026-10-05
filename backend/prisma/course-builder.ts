// Turns one language from seed-data.ts into a complete beginner course.
// Every language gets the same high-level path (spec section 4) with its own letters,
// words and sentences:
//
//   Unit 1  Vowels               (Foundations)       a·aa → i·ii → u·uu → vowel review
//   Unit 2  Consonants & sounds  (Foundations)       ka·ma → na·pa → ra·la → vowel signs
//   Unit 3  First words          (First words)       greetings → family → food & drink → numbers
//   Unit 4  Basic sentences      (Everyday phrases)  introductions → how are you → asking → review
//
// 4 units → 16 small lessons → 67 exercises per language, using all 7 exercise types.
// Pure functions with readable, predictable ids (e.g. "te-u3-l1-e2") so you can type
// them straight into Postman.
import type {
  ExerciseType,
  LearningStage,
  LessonKind,
  VocabularyKind,
} from "../src/generated/prisma/client.ts";
import {
  CONSONANT_KEYS,
  SOUND_HINTS,
  VOWEL_KEYS,
  consonantGlyph,
  syllableGlyph,
  vowelGlyph,
  type ConsonantKey,
  type SeedLanguage,
  type SeedSentence,
  type SeedWord,
  type SignKey,
  type VowelKey,
} from "./seed-data.ts";

export type OptionSeed = {
  text: string;
  subtext?: string;
  isCorrect?: boolean;
  correctPosition?: number;
  matchText?: string;
};

export type ExerciseSeed = {
  id: string;
  type: ExerciseType;
  instruction: string;
  prompt: string;
  promptSubtext?: string;
  sentenceBefore?: string;
  sentenceAfter?: string;
  translation?: string;
  explanation: string;
  options: OptionSeed[];
};

export type VocabularySeed = {
  id: string;
  kind: VocabularyKind;
  script: string;
  romanization: string;
  meaning: string;
  topic: string;
};

export type LessonSeed = {
  id: string;
  title: string;
  introText: string;
  kind: LessonKind;
  vocabularyIds: string[];
  exercises: ExerciseSeed[];
};

export type UnitSeed = {
  id: string;
  title: string;
  description: string;
  stage: LearningStage;
  lessons: LessonSeed[];
};

export type CourseSeed = {
  id: string;
  title: string;
  description: string;
  vocabulary: VocabularySeed[];
  units: UnitSeed[];
};

// ── Small helpers ────────────────────────────────────────────

/** Predictable "shuffle": rotates the list by an amount derived from the exercise id. */
export function shuffleFor<T>(id: string, items: T[]): T[] {
  const hash = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const offset = hash % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

/** A letter or syllable the course teaches. */
type Letter = {
  key: string;
  script: string;
  romanization: string;
  /** How to pronounce it, e.g. "long “aa”, like the a in “father”". */
  hint: string;
};

const sentenceScript = (sentence: SeedSentence, end = "") =>
  sentence.map(([script]) => script).join(" ") + end;
const sentenceRoman = (sentence: SeedSentence, end = "") =>
  sentence.map(([, roman]) => roman).join(" ") + end;

/** Accepted typed spellings for a letter's sound. */
const SOUND_SPELLINGS: Partial<Record<string, string[]>> = {
  aa: ["aa"],
  ii: ["ii", "ee"],
  uu: ["uu", "oo"],
};

// ── Exercise factories ───────────────────────────────────────

/** Letter → sound ("What sound does this letter make?"). */
function characterSound(id: string, letter: Letter, others: Letter[]): ExerciseSeed {
  return {
    id,
    type: "CHARACTER_SOUND",
    instruction: "What sound does this letter make?",
    prompt: letter.script,
    explanation: `${letter.script} is “${letter.romanization}”: ${letter.hint}.`,
    options: shuffleFor(id, [
      { text: letter.romanization, isCorrect: true },
      ...others.map((other) => ({ text: other.romanization })),
    ]),
  };
}

/** Sound → letter ("Select the letter for “aa”"). */
function characterRecognition(id: string, letter: Letter, others: Letter[]): ExerciseSeed {
  return {
    id,
    type: "CHARACTER_RECOGNITION",
    instruction: "Select the letter for this sound",
    prompt: letter.romanization,
    promptSubtext: letter.hint,
    explanation: `“${letter.romanization}” is written ${letter.script}.`,
    options: shuffleFor(id, [
      { text: letter.script, isCorrect: true },
      ...others.map((other) => ({ text: other.script })),
    ]),
  };
}

/** Type the sound of a letter (typed answer, checked without caring about case/spaces). */
function typeTheSound(id: string, letter: Letter, accepted: string[]): ExerciseSeed {
  return {
    id,
    type: "TRANSLATION",
    instruction: "Type the sound this letter makes",
    prompt: letter.script,
    explanation: `${letter.script} is “${letter.romanization}”: ${letter.hint}.`,
    options: accepted.map((text) => ({ text, isCorrect: true })),
  };
}

function matchLetters(id: string, letters: Letter[], title: string): ExerciseSeed {
  return {
    id,
    type: "MATCHING",
    instruction: "Match each letter with its sound",
    prompt: title,
    explanation: letters.map((letter) => `${letter.script} = ${letter.romanization}`).join(" · "),
    options: shuffleFor(
      id,
      letters.map((letter) => ({ text: letter.script, matchText: letter.romanization })),
    ),
  };
}

function wordMeaning(id: string, word: SeedWord, others: SeedWord[]): ExerciseSeed {
  return {
    id,
    type: "MULTIPLE_CHOICE",
    instruction: "Select the correct meaning",
    prompt: word.script,
    promptSubtext: word.romanization,
    explanation: `${word.script} (${word.romanization}) means “${word.meaning}”.`,
    options: shuffleFor(id, [
      { text: word.meaning, isCorrect: true },
      ...others.map((other) => ({ text: other.meaning })),
    ]),
  };
}

function whichWord(id: string, word: SeedWord, others: SeedWord[]): ExerciseSeed {
  return {
    id,
    type: "MULTIPLE_CHOICE",
    instruction: "Which word means this?",
    prompt: `“${word.meaning}”`,
    explanation: `“${word.meaning}” is ${word.script} (${word.romanization}).`,
    options: shuffleFor(id, [
      { text: word.script, subtext: word.romanization, isCorrect: true },
      ...others.map((other) => ({ text: other.script, subtext: other.romanization })),
    ]),
  };
}

function translateToEnglish(
  id: string,
  script: string,
  romanization: string,
  meaning: string,
  accepted: string[],
): ExerciseSeed {
  return {
    id,
    type: "TRANSLATION",
    instruction: "Write this in English",
    prompt: script,
    promptSubtext: romanization,
    explanation: `${script} (${romanization}) means “${meaning}”.`,
    options: accepted.map((text) => ({ text, isCorrect: true })),
  };
}

function matchWords(id: string, words: SeedWord[], title: string): ExerciseSeed {
  return {
    id,
    type: "MATCHING",
    instruction: "Tap the matching pairs",
    prompt: title,
    explanation: words.map((word) => `${word.script} = ${word.meaning}`).join(" · "),
    options: shuffleFor(
      id,
      words.map((word) => ({
        text: word.script,
        subtext: word.romanization,
        matchText: word.meaning,
      })),
    ),
  };
}

/** Fill the blank at `blankIndex` of a sentence with the right word. */
function fillTheBlank(
  id: string,
  sentence: SeedSentence,
  blankIndex: number,
  meaning: string,
  answer: SeedWord,
  others: SeedWord[],
): ExerciseSeed {
  const words = sentence.map(([script]) => script);
  return {
    id,
    type: "FILL_IN_BLANK",
    instruction: "Fill in the blank",
    prompt: words.join(" "),
    sentenceBefore: words.slice(0, blankIndex).join(" "),
    sentenceAfter: words.slice(blankIndex + 1).join(" "),
    translation: meaning,
    explanation: `${words.join(" ")} (${sentenceRoman(sentence)}) means “${meaning}”.`,
    options: shuffleFor(id, [
      { text: answer.script, subtext: answer.romanization, isCorrect: true },
      ...others.map((other) => ({ text: other.script, subtext: other.romanization })),
    ]),
  };
}

/** Build the sentence from a word bank (with one extra word that doesn't belong). */
function buildSentence(
  id: string,
  sentence: SeedSentence,
  meaning: string,
  distractor: SeedWord,
): ExerciseSeed {
  return {
    id,
    type: "WORD_ORDER",
    instruction: "Build the sentence",
    prompt: meaning,
    explanation: `${sentenceScript(sentence)} (${sentenceRoman(sentence)}) means “${meaning}”.`,
    options: shuffleFor(id, [
      ...sentence.map(([script, roman], index) => ({
        text: script,
        subtext: roman,
        correctPosition: index + 1,
      })),
      { text: distractor.script, subtext: distractor.romanization },
    ]),
  };
}

// ── The course ───────────────────────────────────────────────

export function buildCourse(language: SeedLanguage): CourseSeed {
  const c = language.code;
  const base = language.scriptBase;
  const hint = (key: VowelKey | ConsonantKey) =>
    language.soundHintOverrides?.[key] ?? SOUND_HINTS[key];

  // Letters
  const vowel = Object.fromEntries(
    VOWEL_KEYS.map((key) => [
      key,
      {
        key,
        script: vowelGlyph(base, key),
        romanization: key === "a" ? language.inherentVowel : key,
        hint: hint(key),
      },
    ]),
  ) as Record<VowelKey, Letter>;
  const consonantStem = (key: ConsonantKey) => key.slice(0, -1);
  const consonant = Object.fromEntries(
    CONSONANT_KEYS.map((key) => [
      key,
      {
        key,
        script: consonantGlyph(base, key),
        romanization: consonantStem(key) + language.inherentVowel,
        hint: hint(key),
      },
    ]),
  ) as Record<ConsonantKey, Letter>;
  const syllable = (key: ConsonantKey, sign: SignKey): Letter => ({
    key: `${key}-${sign}`,
    script: syllableGlyph(base, key, sign),
    romanization: consonantStem(key) + sign,
    hint: `${consonant[key].script} (${consonant[key].romanization}) + the “${sign}” vowel sign`,
  });
  const kaa = syllable("ka", "aa");
  const ki = syllable("ka", "i");
  const ku = syllable("ka", "u");
  const maa = syllable("ma", "aa");
  const mi = syllable("ma", "i");

  // Words and sentences
  const words = language.words;
  const s = language.sentences;
  const myName = { script: sentenceScript(s.myName), roman: sentenceRoman(s.myName) };
  const yourName = {
    script: sentenceScript(s.yourName, "?"),
    roman: sentenceRoman(s.yourName, "?"),
  };
  const howAreYou = {
    script: sentenceScript(s.howAreYou, "?"),
    roman: sentenceRoman(s.howAreYou, "?"),
  };
  const imFine = { script: sentenceScript(s.imFine), roman: sentenceRoman(s.imFine) };
  const wantWater = { script: sentenceScript(s.wantWater), roman: sentenceRoman(s.wantWater) };
  /** "I want milk." — the same sentence with the word for milk. */
  const wantMilk: SeedSentence = s.wantWater.map((token, index) =>
    index === 1 ? [words.milk.script, words.milk.romanization] : token,
  );

  // ── Vocabulary (numbered in teaching order) ──
  const vocabulary: VocabularySeed[] = [];
  const vocab = (
    slug: string,
    kind: VocabularyKind,
    script: string,
    romanization: string,
    meaning: string,
    topic: string,
  ) => {
    const id = `${c}-v${String(vocabulary.length + 1).padStart(2, "0")}-${slug}`;
    vocabulary.push({ id, kind, script, romanization, meaning, topic });
    return id;
  };
  const letterVocab = (letter: Letter, label: string, topic: string) =>
    vocab(
      `letter-${letter.key}`,
      "LETTER",
      letter.script,
      letter.romanization,
      `${label}: ${letter.hint}`,
      topic,
    );
  const wordVocab = (slug: string, word: SeedWord) =>
    vocab(slug, "WORD", word.script, word.romanization, word.meaning, word.topic);
  const phraseVocab = (slug: string, phrase: { script: string; roman: string }, meaning: string) =>
    vocab(slug, "PHRASE", phrase.script, phrase.roman, meaning, "Phrases");

  const V = Object.fromEntries(
    VOWEL_KEYS.map((key) => [key, letterVocab(vowel[key], "Vowel", "Vowels")]),
  ) as Record<VowelKey, string>;
  const C = Object.fromEntries(
    CONSONANT_KEYS.map((key) => [key, letterVocab(consonant[key], "Consonant", "Consonants")]),
  ) as Record<ConsonantKey, string>;
  const S = [kaa, ki, ku].map((letter) =>
    vocab(
      `syllable-${letter.key}`,
      "LETTER",
      letter.script,
      letter.romanization,
      `Vowel sign: ${letter.hint}`,
      "Vowel signs",
    ),
  );
  const W = Object.fromEntries(
    (Object.keys(words) as Array<keyof typeof words>).map((key) => [
      key,
      wordVocab(
        key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`),
        words[key],
      ),
    ]),
  ) as Record<keyof typeof words, string>;
  const P = {
    myName: phraseVocab("my-name-is-asha", myName, "My name is Asha."),
    yourName: phraseVocab("what-is-your-name", yourName, "What is your name?"),
    howAreYou: phraseVocab("how-are-you", howAreYou, "How are you?"),
    imFine: phraseVocab("i-am-fine", imFine, "I am fine."),
    wantWater: phraseVocab("i-want-water", wantWater, "I want water."),
  };

  const lessonId = (unit: number, lesson: number) => `${c}-u${unit}-l${lesson}`;
  const ex = (lesson: string, number: number) => `${lesson}-e${number}`;
  const { a, aa, i, ii, u, uu } = vowel;
  const { ka, ma, na, pa, ra, la } = consonant;
  const soundSpellings = (letter: Letter) => {
    const spellings = SOUND_SPELLINGS[letter.romanization] ?? [letter.romanization];
    // Bengali consonants carry "o" (lo); also accept the "a" spelling learners know from other courses.
    return letter.romanization.endsWith("o") && letter.romanization.length === 2
      ? [...spellings, letter.romanization.slice(0, -1) + "a"]
      : spellings;
  };

  // ── Unit 1: Vowels ──
  const u1 = [1, 2, 3, 4].map((n) => lessonId(1, n));
  const unit1: UnitSeed = {
    id: `${c}-u1`,
    title: "Vowels",
    description: `Read and pronounce six ${language.scriptName} vowels.`,
    stage: "FOUNDATIONS",
    lessons: [
      {
        id: u1[0],
        title: `Vowels: ${a.romanization} and ${aa.romanization}`,
        introText: `Your first two vowels. ${a.script} is short and ${aa.script} is long — say each one aloud.`,
        kind: "SCRIPT",
        vocabularyIds: [V.a, V.aa],
        exercises: [
          characterSound(ex(u1[0], 1), a, [aa, i]),
          characterSound(ex(u1[0], 2), aa, [a, u]),
          characterRecognition(ex(u1[0], 3), aa, [a, i]),
          characterRecognition(ex(u1[0], 4), a, [aa, u]),
        ],
      },
      {
        id: u1[1],
        title: "Vowels: i and ii",
        introText: `Another short/long pair. Hold ${ii.script} about twice as long as ${i.script}.`,
        kind: "SCRIPT",
        vocabularyIds: [V.i, V.ii],
        exercises: [
          characterSound(ex(u1[1], 1), i, [ii, a]),
          characterSound(ex(u1[1], 2), ii, [i, aa]),
          characterRecognition(ex(u1[1], 3), ii, [i, aa]),
          matchLetters(ex(u1[1], 4), [a, aa, i, ii], "Vowels so far"),
        ],
      },
      {
        id: u1[2],
        title: "Vowels: u and uu",
        introText: `The last pair for now: short ${u.script} and long ${uu.script}.`,
        kind: "SCRIPT",
        vocabularyIds: [V.u, V.uu],
        exercises: [
          characterSound(ex(u1[2], 1), u, [uu, i]),
          characterRecognition(ex(u1[2], 2), uu, [u, ii]),
          characterSound(ex(u1[2], 3), uu, [u, aa]),
          matchLetters(ex(u1[2], 4), [i, ii, u, uu], "Short and long vowels"),
        ],
      },
      {
        id: u1[3],
        title: "Vowel review",
        introText:
          "Check that you can read and hear all six vowels before moving on to consonants.",
        kind: "CHECKPOINT",
        vocabularyIds: [],
        exercises: [
          characterRecognition(ex(u1[3], 1), a, [aa, u]),
          characterSound(ex(u1[3], 2), ii, [i, uu]),
          {
            id: ex(u1[3], 3),
            type: "MULTIPLE_CHOICE",
            instruction: "Which of these is a long vowel?",
            prompt: "Long vowel",
            explanation: `${uu.script} (${uu.romanization}) is long. Long vowels are held about twice as long: ${i.script} ${i.romanization} → ${ii.script} ${ii.romanization}, ${u.script} ${u.romanization} → ${uu.script} ${uu.romanization}.`,
            options: shuffleFor(ex(u1[3], 3), [
              { text: uu.script, isCorrect: true },
              { text: i.script },
              { text: u.script },
            ]),
          },
          matchLetters(ex(u1[3], 4), [a, aa, u, uu], "All vowels"),
          typeTheSound(ex(u1[3], 5), ii, soundSpellings(ii)),
        ],
      },
    ],
  };

  // ── Unit 2: Consonants & sounds ──
  const u2 = [1, 2, 3, 4].map((n) => lessonId(2, n));
  const unit2: UnitSeed = {
    id: `${c}-u2`,
    title: "Consonants & sounds",
    description: "Six consonants and the vowel signs that change their sound.",
    stage: "FOUNDATIONS",
    lessons: [
      {
        id: u2[0],
        title: `Consonants: ${ka.romanization} and ${ma.romanization}`,
        introText: `Every consonant carries a built-in “${language.inherentVowel}” sound: ${ka.script} is “${ka.romanization}”, not just “k”.`,
        kind: "SCRIPT",
        vocabularyIds: [C.ka, C.ma],
        exercises: [
          characterSound(ex(u2[0], 1), ka, [ma, aa]),
          characterSound(ex(u2[0], 2), ma, [ka, a]),
          characterRecognition(ex(u2[0], 3), ma, [ka, aa]),
          matchLetters(ex(u2[0], 4), [a, aa, ka, ma], "Vowels and consonants"),
        ],
      },
      {
        id: u2[1],
        title: `Consonants: ${na.romanization} and ${pa.romanization}`,
        introText: `Two more consonants: ${na.script} and ${pa.script}.`,
        kind: "SCRIPT",
        vocabularyIds: [C.na, C.pa],
        exercises: [
          characterSound(ex(u2[1], 1), na, [ma, pa]),
          characterRecognition(ex(u2[1], 2), pa, [na, ka]),
          characterSound(ex(u2[1], 3), pa, [ka, na]),
          matchLetters(ex(u2[1], 4), [ka, ma, na, pa], "Consonants so far"),
        ],
      },
      {
        id: u2[2],
        title: `Consonants: ${ra.romanization} and ${la.romanization}`,
        introText: `${ra.script} is a light, tapped “r”; ${la.script} is like the “l” in “love”.`,
        kind: "SCRIPT",
        vocabularyIds: [C.ra, C.la],
        exercises: [
          characterSound(ex(u2[2], 1), ra, [la, na]),
          characterSound(ex(u2[2], 2), la, [ra, pa]),
          characterRecognition(ex(u2[2], 3), ra, [la, ma]),
          matchLetters(ex(u2[2], 4), [na, pa, ra, la], "New consonants"),
          typeTheSound(ex(u2[2], 5), la, soundSpellings(la)),
        ],
      },
      {
        id: u2[3],
        title: "Vowel signs",
        introText: `A consonant changes its vowel with a small mark called a vowel sign: ${ka.script} ${ka.romanization} → ${kaa.script} ${kaa.romanization}, ${ki.script} ${ki.romanization}, ${ku.script} ${ku.romanization}.`,
        kind: "SCRIPT",
        vocabularyIds: S,
        exercises: [
          characterSound(ex(u2[3], 1), kaa, [ka, ki]),
          characterSound(ex(u2[3], 2), ki, [ku, kaa]),
          characterRecognition(ex(u2[3], 3), ku, [ki, kaa]),
          characterSound(ex(u2[3], 4), maa, [ma, mi]),
          matchLetters(ex(u2[3], 5), [kaa, ki, ku, maa], "Consonants with vowel signs"),
        ],
      },
    ],
  };

  // ── Unit 3: First words ──
  const u3 = [1, 2, 3, 4].map((n) => lessonId(3, n));
  const unit3: UnitSeed = {
    id: `${c}-u3`,
    title: "First words",
    description: "Greetings, family, food and numbers.",
    stage: "FIRST_WORDS",
    lessons: [
      {
        id: u3[0],
        title: "Greetings",
        introText: "Polite words you'll use every day. Read them aloud.",
        kind: "VOCABULARY",
        vocabularyIds: [W.hello, W.thankYou, W.yes, W.no],
        exercises: [
          wordMeaning(ex(u3[0], 1), words.hello, [words.thankYou, words.yes, words.no]),
          whichWord(ex(u3[0], 2), words.no, [words.yes, words.hello, words.thankYou]),
          translateToEnglish(
            ex(u3[0], 3),
            words.thankYou.script,
            words.thankYou.romanization,
            words.thankYou.meaning,
            ["thank you", "thanks", "thank you very much"],
          ),
          matchWords(ex(u3[0], 4), [words.hello, words.thankYou, words.yes, words.no], "Greetings"),
        ],
      },
      {
        id: u3[1],
        title: "Family & friends",
        introText: "The people closest to you.",
        kind: "VOCABULARY",
        vocabularyIds: [W.mother, W.father, W.friend],
        exercises: [
          wordMeaning(ex(u3[1], 1), words.mother, [words.father, words.friend, words.hello]),
          whichWord(ex(u3[1], 2), words.father, [words.mother, words.friend, words.no]),
          matchWords(ex(u3[1], 3), [words.mother, words.father, words.friend], "Family"),
          translateToEnglish(
            ex(u3[1], 4),
            words.friend.script,
            words.friend.romanization,
            words.friend.meaning,
            ["friend", "a friend"],
          ),
        ],
      },
      {
        id: u3[2],
        title: "Food & drink",
        introText: "Three words you'll need at every meal.",
        kind: "VOCABULARY",
        vocabularyIds: [W.water, W.food, W.milk],
        exercises: [
          wordMeaning(ex(u3[2], 1), words.milk, [words.water, words.food, words.mother]),
          whichWord(ex(u3[2], 2), words.water, [words.milk, words.food, words.friend]),
          translateToEnglish(
            ex(u3[2], 3),
            words.food.script,
            words.food.romanization,
            words.food.meaning,
            ["food", "meal", "a meal"],
          ),
          matchWords(
            ex(u3[2], 4),
            [words.water, words.food, words.milk, words.mother],
            "Words so far",
          ),
        ],
      },
      {
        id: u3[3],
        title: "Numbers 1–3",
        introText: "Count to three.",
        kind: "VOCABULARY",
        vocabularyIds: [W.one, W.two, W.three],
        exercises: [
          wordMeaning(ex(u3[3], 1), words.two, [words.one, words.three, words.milk]),
          whichWord(ex(u3[3], 2), words.three, [words.one, words.two, words.water]),
          matchWords(ex(u3[3], 3), [words.one, words.two, words.three], "Numbers"),
          translateToEnglish(
            ex(u3[3], 4),
            words.one.script,
            words.one.romanization,
            words.one.meaning,
            ["one", "1"],
          ),
        ],
      },
    ],
  };

  // ── Unit 4: Basic sentences ──
  const u4 = [1, 2, 3, 4].map((n) => lessonId(4, n));
  const unit4: UnitSeed = {
    id: `${c}-u4`,
    title: "Basic sentences",
    description: "Introduce yourself, ask how someone is, and ask for things.",
    stage: "EVERYDAY_PHRASES",
    lessons: [
      {
        id: u4[0],
        title: "Introductions",
        introText: "Learn the word for “name”, then say who you are and ask someone's name.",
        kind: "PHRASES",
        vocabularyIds: [W.name, P.myName, P.yourName],
        exercises: [
          wordMeaning(ex(u4[0], 1), words.name, [words.water, words.mother, words.friend]),
          fillTheBlank(ex(u4[0], 2), s.myName, 1, "My name is Asha.", words.name, [
            words.water,
            words.mother,
          ]),
          buildSentence(ex(u4[0], 3), s.myName, "My name is Asha.", words.water),
          translateToEnglish(ex(u4[0], 4), yourName.script, yourName.roman, "What is your name?", [
            "what is your name",
            "what's your name",
          ]),
        ],
      },
      {
        id: u4[1],
        title: "How are you?",
        introText: "Ask how someone is — and answer when they ask you.",
        kind: "PHRASES",
        vocabularyIds: [P.howAreYou, P.imFine],
        exercises: [
          {
            id: ex(u4[1], 1),
            type: "MULTIPLE_CHOICE",
            instruction: "Select the correct meaning",
            prompt: howAreYou.script,
            promptSubtext: howAreYou.roman,
            explanation: `${howAreYou.script} (${howAreYou.roman}) means “How are you?”.`,
            options: shuffleFor(ex(u4[1], 1), [
              { text: "How are you?", isCorrect: true },
              { text: "I am fine." },
              { text: "What is your name?" },
            ]),
          },
          buildSentence(ex(u4[1], 2), s.imFine, "I am fine.", words.thankYou),
          {
            id: ex(u4[1], 3),
            type: "MULTIPLE_CHOICE",
            instruction: "Someone asks you this. Pick a good reply.",
            prompt: howAreYou.script,
            promptSubtext: howAreYou.roman,
            explanation: `Reply with ${imFine.script} (${imFine.roman}) — “I am fine.”`,
            options: shuffleFor(ex(u4[1], 3), [
              { text: imFine.script, subtext: imFine.roman, isCorrect: true },
              { text: myName.script, subtext: myName.roman },
              { text: words.no.script, subtext: words.no.romanization },
            ]),
          },
          translateToEnglish(ex(u4[1], 4), imFine.script, imFine.roman, "I am fine.", [
            "i am fine",
            "i'm fine",
            "i am well",
            "i'm well",
            "i am good",
            "i'm good",
          ]),
        ],
      },
      {
        id: u4[2],
        title: "Asking for things",
        introText: "Say what you want — water, milk or food.",
        kind: "PHRASES",
        vocabularyIds: [P.wantWater],
        exercises: [
          {
            id: ex(u4[2], 1),
            type: "MULTIPLE_CHOICE",
            instruction: "Select the correct meaning",
            prompt: wantWater.script,
            promptSubtext: wantWater.roman,
            explanation: `${wantWater.script} (${wantWater.roman}) means “I want water.”`,
            options: shuffleFor(ex(u4[2], 1), [
              { text: "I want water.", isCorrect: true },
              { text: "I want milk." },
              { text: "My name is Asha." },
            ]),
          },
          fillTheBlank(ex(u4[2], 2), wantMilk, 1, "I want milk.", words.milk, [
            words.water,
            words.mother,
          ]),
          buildSentence(ex(u4[2], 3), s.wantWater, "I want water.", words.milk),
          translateToEnglish(ex(u4[2], 4), wantWater.script, wantWater.roman, "I want water.", [
            "i want water",
            "i need water",
            "i want some water",
          ]),
        ],
      },
      {
        id: u4[3],
        title: "Sentence review",
        introText: "Put everything together: introductions, feelings and requests.",
        kind: "CHECKPOINT",
        vocabularyIds: [],
        exercises: [
          {
            id: ex(u4[3], 1),
            type: "MATCHING",
            instruction: "Tap the matching pairs",
            prompt: "Sentences",
            explanation: [
              `${myName.script} = My name is Asha.`,
              `${howAreYou.script} = How are you?`,
              `${wantWater.script} = I want water.`,
            ].join(" · "),
            options: shuffleFor(ex(u4[3], 1), [
              { text: myName.script, subtext: myName.roman, matchText: "My name is Asha." },
              { text: howAreYou.script, subtext: howAreYou.roman, matchText: "How are you?" },
              { text: wantWater.script, subtext: wantWater.roman, matchText: "I want water." },
            ]),
          },
          buildSentence(ex(u4[3], 2), s.yourName, "What is your name?", words.milk),
          {
            id: ex(u4[3], 3),
            type: "MULTIPLE_CHOICE",
            instruction: "Which sentence means this?",
            prompt: "“I am fine.”",
            explanation: `“I am fine.” is ${imFine.script} (${imFine.roman}).`,
            options: shuffleFor(ex(u4[3], 3), [
              { text: imFine.script, subtext: imFine.roman, isCorrect: true },
              { text: wantWater.script, subtext: wantWater.roman },
              { text: myName.script, subtext: myName.roman },
            ]),
          },
          translateToEnglish(ex(u4[3], 4), howAreYou.script, howAreYou.roman, "How are you?", [
            "how are you",
            "how are you doing",
            "are you well",
          ]),
        ],
      },
    ],
  };

  return {
    id: `${c}-course`,
    title: `${language.name} for English speakers`,
    description: `From your first ${language.scriptName} letters to simple everyday sentences.`,
    vocabulary,
    units: [unit1, unit2, unit3, unit4],
  };
}
