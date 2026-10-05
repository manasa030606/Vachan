// Turns the small word lists in seed-data.ts into a full course:
//   1 course → 3 units → 5 lessons → 18 exercises (all six exercise types).
// Pure functions with readable, predictable ids (e.g. "te-u2-l1-e3"), so you can
// type them straight into Postman.
import type {
  ExerciseType,
  LearningStage,
  LessonKind,
  VocabularyKind,
} from "../src/generated/prisma/client.ts";
import type { SeedLanguage, SeedWord } from "./seed-data.ts";

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

/** Moves the first `steps` items to the end — a predictable "shuffle" so answers aren't always first. */
function rotate<T>(items: T[], steps: number): T[] {
  const offset = steps % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

const meaningOption = (word: SeedWord, correct: boolean): OptionSeed => ({
  text: word.meaning,
  isCorrect: correct,
});
const scriptOption = (word: SeedWord, correct: boolean): OptionSeed => ({
  text: word.script,
  subtext: word.romanization,
  isCorrect: correct,
});

export function buildCourse(language: SeedLanguage): CourseSeed {
  const c = language.code;
  const { hello, thankYou, water, mother, yes, name } = language.words;
  const [letterA, letterAa, letterKa] = language.letters;
  const sentenceText = language.sentence.map(([script]) => script).join(" ");
  const sentenceRoman = language.sentence.map(([, roman]) => roman).join(" ");

  // ── Vocabulary (ids sort in teaching order) ──
  const letterVocab = language.letters.map((letter, index) => ({
    id: `${c}-v0${index + 1}-letter-${letter.romanization}`,
    kind: "LETTER" as const,
    script: letter.script,
    romanization: letter.romanization,
    meaning: letter.kind === "vowel" ? "Vowel" : "Consonant",
    topic: "Script",
  }));
  const wordEntries: Array<[string, SeedWord]> = [
    ["hello", hello],
    ["thank-you", thankYou],
    ["yes", yes],
    ["mother", mother],
    ["water", water],
    ["name", name],
  ];
  const wordVocab = wordEntries.map(([key, word], index) => ({
    id: `${c}-v${String(index + 4).padStart(2, "0")}-${key}`,
    kind: "WORD" as const,
    ...word,
  }));
  const phraseVocab = {
    id: `${c}-v10-my-name-is-asha`,
    kind: "PHRASE" as const,
    script: sentenceText,
    romanization: sentenceRoman,
    meaning: "My name is Asha.",
    topic: "Introductions",
  };
  const vocabId = (key: string) => wordVocab.find((item) => item.id.endsWith(`-${key}`))!.id;

  const letterChoices = (correctRoman: string, steps: number): OptionSeed[] =>
    rotate(
      language.letters.map((letter) => ({
        text: letter.romanization,
        isCorrect: letter.romanization === correctRoman,
      })),
      steps,
    );
  const letterGlyphChoices = (correctRoman: string, steps: number): OptionSeed[] =>
    rotate(
      language.letters.map((letter) => ({
        text: letter.script,
        isCorrect: letter.romanization === correctRoman,
      })),
      steps,
    );

  const lesson = (unit: number, number: number) => `${c}-u${unit}-l${number}`;
  const ex = (lessonId: string, number: number) => `${lessonId}-e${number}`;

  // ── Unit 1: Script foundations ──
  const vowels = lesson(1, 1);
  const consonants = lesson(1, 2);
  const unit1: UnitSeed = {
    id: `${c}-u1`,
    title: "Script foundations",
    description: `Read and pronounce your first ${language.scriptName} letters.`,
    stage: "FOUNDATIONS",
    lessons: [
      {
        id: vowels,
        title: "Vowels",
        introText: "Here are your first two vowels. Say each sound aloud.",
        kind: "SCRIPT",
        vocabularyIds: [letterVocab[0].id, letterVocab[1].id],
        exercises: [
          {
            id: ex(vowels, 1),
            type: "CHARACTER_RECOGNITION",
            instruction: "What sound does this letter make?",
            prompt: letterAa.script,
            options: letterChoices(letterAa.romanization, 2),
          },
          {
            id: ex(vowels, 2),
            type: "CHARACTER_RECOGNITION",
            instruction: "What sound does this letter make?",
            prompt: letterA.script,
            options: letterChoices(letterA.romanization, 1),
          },
          {
            id: ex(vowels, 3),
            type: "MULTIPLE_CHOICE",
            instruction: "Which letter makes this sound?",
            prompt: `“${letterAa.romanization}”`,
            options: letterGlyphChoices(letterAa.romanization, 0),
          },
        ],
      },
      {
        id: consonants,
        title: "First consonant",
        introText: "Meet your first consonant. Compare it with the vowels you know.",
        kind: "SCRIPT",
        vocabularyIds: [letterVocab[2].id],
        exercises: [
          {
            id: ex(consonants, 1),
            type: "CHARACTER_RECOGNITION",
            instruction: "What sound does this letter make?",
            prompt: letterKa.script,
            options: letterChoices(letterKa.romanization, 1),
          },
          {
            id: ex(consonants, 2),
            type: "MATCHING",
            instruction: "Match each letter with its sound",
            prompt: "Letters and sounds",
            options: language.letters.map((letter) => ({
              text: letter.script,
              matchText: letter.romanization,
            })),
          },
          {
            id: ex(consonants, 3),
            type: "MULTIPLE_CHOICE",
            instruction: "Which letter makes this sound?",
            prompt: `“${letterKa.romanization}”`,
            options: letterGlyphChoices(letterKa.romanization, 2),
          },
        ],
      },
    ],
  };

  // ── Unit 2: First words ──
  const greetings = lesson(2, 1);
  const familyFood = lesson(2, 2);
  const unit2: UnitSeed = {
    id: `${c}-u2`,
    title: "First words",
    description: "Greetings, family and everyday words.",
    stage: "FIRST_WORDS",
    lessons: [
      {
        id: greetings,
        title: "Greetings",
        introText: "Here are the words you'll practise in this lesson. Read them aloud.",
        kind: "VOCABULARY",
        vocabularyIds: [vocabId("hello"), vocabId("thank-you"), vocabId("yes")],
        exercises: [
          {
            id: ex(greetings, 1),
            type: "MULTIPLE_CHOICE",
            instruction: "Select the correct meaning",
            prompt: hello.script,
            promptSubtext: hello.romanization,
            options: rotate(
              [
                meaningOption(hello, true),
                meaningOption(thankYou, false),
                meaningOption(water, false),
                meaningOption(yes, false),
              ],
              1,
            ),
          },
          {
            id: ex(greetings, 2),
            type: "MULTIPLE_CHOICE",
            instruction: "Which word means this?",
            prompt: `“${yes.meaning}”`,
            options: rotate(
              [
                scriptOption(mother, false),
                scriptOption(yes, true),
                scriptOption(water, false),
                scriptOption(thankYou, false),
              ],
              3,
            ),
          },
          {
            id: ex(greetings, 3),
            type: "TRANSLATION",
            instruction: "Write this in English",
            prompt: thankYou.script,
            promptSubtext: thankYou.romanization,
            options: [
              { text: "thank you", isCorrect: true },
              { text: "thanks", isCorrect: true },
              { text: "thank you very much", isCorrect: true },
            ],
          },
          {
            id: ex(greetings, 4),
            type: "MATCHING",
            instruction: "Tap the matching pairs",
            prompt: "Greetings",
            options: [hello, thankYou, yes].map((word) => ({
              text: word.script,
              subtext: word.romanization,
              matchText: word.meaning,
            })),
          },
        ],
      },
      {
        id: familyFood,
        title: "Family & food",
        introText: "Two everyday words: one for family, one for food & drink.",
        kind: "VOCABULARY",
        vocabularyIds: [vocabId("mother"), vocabId("water")],
        exercises: [
          {
            id: ex(familyFood, 1),
            type: "MULTIPLE_CHOICE",
            instruction: "Select the correct meaning",
            prompt: mother.script,
            promptSubtext: mother.romanization,
            options: rotate(
              [
                meaningOption(mother, true),
                meaningOption(water, false),
                meaningOption(hello, false),
                meaningOption(yes, false),
              ],
              2,
            ),
          },
          {
            id: ex(familyFood, 2),
            type: "MULTIPLE_CHOICE",
            instruction: "Which word means this?",
            prompt: `“${water.meaning}”`,
            options: rotate(
              [
                scriptOption(mother, false),
                scriptOption(water, true),
                scriptOption(yes, false),
                scriptOption(thankYou, false),
              ],
              3,
            ),
          },
          {
            id: ex(familyFood, 3),
            type: "TRANSLATION",
            instruction: "Write this in English",
            prompt: water.script,
            promptSubtext: water.romanization,
            options: [{ text: "water", isCorrect: true }],
          },
          {
            id: ex(familyFood, 4),
            type: "MATCHING",
            instruction: "Tap the matching pairs",
            prompt: "Words so far",
            options: [hello, thankYou, water, mother].map((word) => ({
              text: word.script,
              subtext: word.romanization,
              matchText: word.meaning,
            })),
          },
        ],
      },
    ],
  };

  // ── Unit 3: Everyday phrases ──
  const intro = lesson(3, 1);
  const before = language.sentence
    .slice(0, language.nameIndex)
    .map(([script]) => script)
    .join(" ");
  const after = language.sentence
    .slice(language.nameIndex + 1)
    .map(([script]) => script)
    .join(" ");
  const unit3: UnitSeed = {
    id: `${c}-u3`,
    title: "Everyday phrases",
    description: "Introduce yourself in a simple sentence.",
    stage: "EVERYDAY_PHRASES",
    lessons: [
      {
        id: intro,
        title: "Introductions",
        introText: "Learn the word for “name” and say your first full sentence.",
        kind: "PHRASES",
        vocabularyIds: [vocabId("name"), phraseVocab.id],
        exercises: [
          {
            id: ex(intro, 1),
            type: "MULTIPLE_CHOICE",
            instruction: "Select the correct meaning",
            prompt: name.script,
            promptSubtext: name.romanization,
            options: rotate(
              [
                meaningOption(name, true),
                meaningOption(water, false),
                meaningOption(mother, false),
                meaningOption(yes, false),
              ],
              3,
            ),
          },
          {
            id: ex(intro, 2),
            type: "FILL_IN_BLANK",
            instruction: "Fill in the blank",
            prompt: sentenceText,
            sentenceBefore: before,
            sentenceAfter: after,
            translation: "My name is Asha.",
            options: rotate(
              [scriptOption(name, true), scriptOption(water, false), scriptOption(mother, false)],
              1,
            ),
          },
          {
            id: ex(intro, 3),
            type: "WORD_ORDER",
            instruction: "Build the sentence",
            prompt: "My name is Asha.",
            options: rotate(
              [
                ...language.sentence.map(([script, roman], index) => ({
                  text: script,
                  subtext: roman,
                  correctPosition: index + 1,
                })),
                { text: water.script, subtext: water.romanization },
              ],
              2,
            ),
          },
          {
            id: ex(intro, 4),
            type: "TRANSLATION",
            instruction: "Write this in English",
            prompt: sentenceText,
            promptSubtext: sentenceRoman,
            options: [
              { text: "my name is asha", isCorrect: true },
              { text: "my name's asha", isCorrect: true },
            ],
          },
        ],
      },
    ],
  };

  return {
    id: `${c}-course`,
    title: `${language.name} for English speakers`,
    description: `Start from the ${language.scriptName} letters and build up to your first sentence.`,
    vocabulary: [...letterVocab, ...wordVocab, phraseVocab],
    units: [unit1, unit2, unit3],
  };
}
