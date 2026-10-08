// Turns the curriculum (content/curriculum.ts) and one language's content
// (content/languages/<code>.ts) into a complete course: units, lessons, exercises,
// vocabulary and placement questions.
//
// Pure functions with readable, predictable ids, so the same input always gives the same course:
//   unit "te-u5", lesson "te-u5-l2", exercise "te-u5-l2-e07",
//   vocabulary "te-w-water" (word), "te-p-how-are-you" (phrase), "te-x-pongal" (extra),
//   "te-l-c-ka" (letter).
import type {
  ExerciseType,
  LearningStage,
  LessonKind,
  PlacementSkill,
  VocabularyKind,
} from "../src/generated/prisma/client.ts";
import {
  CONCEPTS,
  CURRICULUM,
  DIALOGUES,
  PLACEMENT_UNITS,
  type ConceptKey,
  type LessonPlan,
} from "./content/curriculum.ts";
import {
  SCRIPT_PLANS,
  consonantLetter,
  syllable,
  vowelLetter,
  type Letter,
  type ScriptPlan,
} from "./content/script.ts";
import { isPhrase, type LanguageContent, type Token } from "./content/types.ts";

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
  notes: string | null;
};

export type LessonSeed = {
  id: string;
  key: string;
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

export type PlacementQuestionSeed = {
  exerciseId: string;
  unitNumber: number;
  skill: PlacementSkill;
};

export type CourseSeed = {
  id: string;
  title: string;
  description: string;
  vocabulary: VocabularySeed[];
  units: UnitSeed[];
  placementQuestions: PlacementQuestionSeed[];
};

export type LanguageMeta = {
  code: string;
  name: string;
  nativeName: string;
  scriptName: string;
  description: string;
};

/** Exercises per lesson: at least MIN, at most MAX. */
const MIN_EXERCISES = 8;
const MAX_EXERCISES = 15;

// Small helpers

/** A stable number from a string, used for predictable "random" choices. */
function hashOf(text: string): number {
  let hash = 0;
  for (const char of text) hash = (hash * 31 + char.codePointAt(0)!) >>> 0;
  return hash;
}

/** Predictable "shuffle": rotates the list by an amount derived from the exercise id. */
export function shuffleFor<T>(id: string, items: T[]): T[] {
  const hash = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const offset = hash % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

const comparable = (text: string) =>
  text
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^\p{L}\p{N} ]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

const slugOf = (key: string) =>
  key
    .replace(/_/g, "-")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();

/** First sentence of a note, short enough to show after an answer. */
function shortNote(notes: string | undefined): string {
  if (!notes) return "";
  const first = notes.split(/(?<=[.!?])\s/)[0] ?? notes;
  return first.length <= 220 ? ` ${first}` : "";
}

/** English answers accepted for a typed translation. */
export function acceptedAnswers(meaning: string, extra: readonly string[] = []): string[] {
  const variants = new Set<string>();
  const add = (text: string) => {
    const clean = text.replace(/\s+/g, " ").trim();
    if (clean) variants.add(clean);
  };
  const base = [meaning, ...extra];
  for (const text of base) {
    add(text);
    add(text.replace(/\s*\(.*?\)\s*/g, " ")); // "Roti (flatbread)" → "Roti"
    const inner = /\((.*?)\)/.exec(text)?.[1];
    if (inner && !/[,;]|polite|casual|friend|guest|height|age|taste|on the phone/i.test(inner))
      add(inner);
    if (/^to /i.test(text)) add(text.replace(/^to /i, ""));
  }
  const contractions: Array<[RegExp, string]> = [
    [/\bI am\b/gi, "I'm"],
    [/\bdo not\b/gi, "don't"],
    [/\bdoes not\b/gi, "doesn't"],
    [/\bis not\b/gi, "isn't"],
    [/\bcannot\b/gi, "can't"],
    [/\bwhat is\b/gi, "what's"],
    [/\bit is\b/gi, "it's"],
    [/\byou are\b/gi, "you're"],
    [/\blet us\b/gi, "let's"],
    [/\bI will\b/gi, "I'll"],
    [/\bwe will\b/gi, "we'll"],
  ];
  for (const text of [...variants]) {
    for (const [pattern, short] of contractions) {
      if (pattern.test(text)) add(text.replace(pattern, short));
    }
    // and the other way round
    add(
      text
        .replace(/\bI'm\b/gi, "I am")
        .replace(/\bdon't\b/gi, "do not")
        .replace(/\bcan't\b/gi, "cannot"),
    );
  }
  // Unique by comparable form.
  const seen = new Set<string>();
  return [...variants].filter((text) => {
    const key = comparable(text).replace(/ /g, "");
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Items: everything the course teaches (concepts, extras)

type Item = {
  id: string;
  key: string;
  kind: "WORD" | "PHRASE";
  script: string;
  roman: string;
  meaning: string;
  topic: string;
  accept: string[];
  notes?: string;
  words?: Token[];
  blank?: number;
};

function makeItems(content: LanguageContent) {
  const c = content.code;
  const items = new Map<string, Item>();
  for (const key of Object.keys(CONCEPTS) as ConceptKey[]) {
    const def = CONCEPTS[key];
    const entry = content.entries[key];
    const phrase = isPhrase(entry);
    items.set(key, {
      id: `${c}-${def.kind === "WORD" ? "w" : "p"}-${slugOf(key)}`,
      key,
      kind: def.kind,
      script: phrase ? entry.words.map(([s]) => s).join(" ") : entry.script,
      roman: phrase ? entry.words.map(([, r]) => r).join(" ") : entry.roman,
      meaning: entry.meaning ?? def.en,
      topic: def.topic,
      accept: [...("accept" in def && def.accept ? def.accept : []), ...(entry.accept ?? [])],
      notes: entry.notes,
      words: phrase ? entry.words : undefined,
      blank: phrase ? entry.blank : undefined,
    });
  }
  const extrasByLesson = new Map<string, Item[]>();
  for (const extra of content.extras) {
    const phrase = isPhrase(extra);
    const item: Item = {
      id: `${c}-x-${extra.key}`,
      key: `x:${extra.key}`,
      kind: phrase ? "PHRASE" : "WORD",
      script: phrase ? extra.words.map(([s]) => s).join(" ") : extra.script,
      roman: phrase ? extra.words.map(([, r]) => r).join(" ") : extra.roman,
      meaning: extra.meaning,
      topic: extra.topic,
      accept: extra.accept ?? [],
      notes: extra.notes,
      words: phrase ? extra.words : undefined,
      blank: phrase ? extra.blank : undefined,
    };
    items.set(item.key, item);
    extrasByLesson.set(extra.lesson, [...(extrasByLesson.get(extra.lesson) ?? []), item]);
  }
  return { items, extrasByLesson };
}

// Distractors

/**
 * Picks `count` items from `pool` to use as wrong answers next to `answer`: different text,
 * different meaning, same kind (word/phrase) and preferably the same topic. Deterministic.
 */
function distractors(
  seed: string,
  answer: Item,
  pool: Item[],
  count: number,
  by: "meaning" | "script",
): Item[] {
  const answerKey = comparable(by === "meaning" ? answer.meaning : answer.script);
  const answerMeaning = comparable(answer.meaning);
  const usable = pool.filter(
    (item) =>
      item.key !== answer.key &&
      comparable(item.meaning) !== answerMeaning &&
      comparable(item.script) !== comparable(answer.script) &&
      comparable(by === "meaning" ? item.meaning : item.script) !== answerKey,
  );
  const rank = (item: Item) =>
    (item.kind === answer.kind ? 0 : 2) + (item.topic === answer.topic ? 0 : 1);
  const sorted = [...usable].sort(
    (a, b) => rank(a) - rank(b) || hashOf(seed + a.key) - hashOf(seed + b.key),
  );
  const chosen: Item[] = [];
  const seen = new Set<string>();
  for (const item of sorted) {
    const key = comparable(by === "meaning" ? item.meaning : item.script);
    if (seen.has(key)) continue;
    seen.add(key);
    chosen.push(item);
    if (chosen.length === count) break;
  }
  return chosen;
}

// Exercise factories

const explain = (item: Item) =>
  `${item.script} (${item.roman}) means “${item.meaning}”.${shortNote(item.notes)}`;

function meaningChoice(id: string, item: Item, pool: Item[]): ExerciseSeed | null {
  const wrong = distractors(id, item, pool, 3, "meaning");
  if (wrong.length < 2) return null;
  return {
    id,
    type: "MULTIPLE_CHOICE",
    instruction: "Select the correct meaning",
    prompt: item.script,
    promptSubtext: item.roman,
    explanation: explain(item),
    options: shuffleFor(id, [
      { text: item.meaning, isCorrect: true },
      ...wrong.map((other) => ({ text: other.meaning })),
    ]),
  };
}

function scriptChoice(id: string, item: Item, pool: Item[]): ExerciseSeed | null {
  const wrong = distractors(id, item, pool, 3, "script");
  if (wrong.length < 2) return null;
  return {
    id,
    type: "MULTIPLE_CHOICE",
    instruction: item.kind === "PHRASE" ? "Which sentence means this?" : "Which word means this?",
    prompt: `“${item.meaning}”`,
    explanation: explain(item),
    options: shuffleFor(id, [
      { text: item.script, subtext: item.roman, isCorrect: true },
      ...wrong.map((other) => ({ text: other.script, subtext: other.roman })),
    ]),
  };
}

function translation(id: string, item: Item): ExerciseSeed {
  return {
    id,
    type: "TRANSLATION",
    instruction: "Write this in English",
    prompt: item.script,
    promptSubtext: item.roman,
    explanation: explain(item),
    options: acceptedAnswers(item.meaning, item.accept).map((text) => ({ text, isCorrect: true })),
  };
}

function matching(id: string, group: Item[], title: string): ExerciseSeed | null {
  const unique: Item[] = [];
  for (const item of group) {
    if (
      unique.some(
        (other) =>
          comparable(other.meaning) === comparable(item.meaning) ||
          comparable(other.script) === comparable(item.script),
      )
    ) {
      continue;
    }
    unique.push(item);
  }
  if (unique.length < 3) return null;
  const pairs = unique.slice(0, 5);
  return {
    id,
    type: "MATCHING",
    instruction: "Tap the matching pairs",
    prompt: title,
    explanation: pairs.map((item) => `${item.script} = ${item.meaning}`).join(" · "),
    options: shuffleFor(
      id,
      pairs.map((item) => ({ text: item.script, subtext: item.roman, matchText: item.meaning })),
    ),
  };
}

/** Phrase tokens that make a good word-order / fill-in exercise (2+ different words). */
const goodTokens = (item: Item) =>
  item.words !== undefined &&
  item.words.length >= 2 &&
  new Set(item.words.map(([script]) => script)).size === item.words.length;

function wordOrder(id: string, item: Item, pool: Item[]): ExerciseSeed | null {
  if (!goodTokens(item)) return null;
  const words = item.words!;
  const own = new Set(words.map(([script]) => script));
  const extra = pool
    .flatMap((other) =>
      other.key === item.key ? [] : (other.words ?? [[other.script, other.roman]]),
    )
    .filter(([script]) => !own.has(script) && !/\s/.test(script))
    .sort((a, b) => hashOf(id + a[0]) - hashOf(id + b[0]))[0];
  return {
    id,
    type: "WORD_ORDER",
    instruction: "Build the sentence",
    prompt: item.meaning,
    explanation: explain(item),
    options: shuffleFor(id, [
      ...words.map(([script, roman], index) => ({
        text: script,
        subtext: roman,
        correctPosition: index + 1,
      })),
      ...(extra ? [{ text: extra[0], subtext: extra[1] }] : []),
    ]),
  };
}

function fillBlank(id: string, item: Item, pool: Item[]): ExerciseSeed | null {
  if (!goodTokens(item)) return null;
  const words = item.words!;
  const blank =
    item.blank ??
    words.reduce(
      (best, [script], index) => (script.length > words[best]![0].length ? index : best),
      0,
    );
  const [answer, answerRoman] = words[blank]!;
  const own = new Set(words.map(([script]) => script));
  const candidates = pool
    .flatMap((other) =>
      other.key === item.key ? [] : (other.words ?? [[other.script, other.roman]]),
    )
    .filter(([script]) => !own.has(script) && script !== answer && !/\s/.test(script));
  const seen = new Set<string>();
  const wrong = candidates
    .sort((a, b) => hashOf(id + a[0]) - hashOf(id + b[0]))
    .filter(([script]) => (seen.has(script) ? false : (seen.add(script), true)))
    .slice(0, 2);
  if (wrong.length < 2) return null;
  const scripts = words.map(([script]) => script);
  return {
    id,
    type: "FILL_IN_BLANK",
    instruction: "Fill in the blank",
    prompt: scripts.join(" "),
    sentenceBefore: scripts.slice(0, blank).join(" ") || undefined,
    sentenceAfter: scripts.slice(blank + 1).join(" ") || undefined,
    translation: item.meaning,
    explanation: explain(item),
    options: shuffleFor(id, [
      { text: answer, subtext: answerRoman, isCorrect: true },
      ...wrong.map(([script, roman]) => ({ text: script, subtext: roman })),
    ]),
  };
}

function replyChoice(id: string, said: Item, reply: Item, pool: Item[]): ExerciseSeed | null {
  const wrong = distractors(
    id,
    reply,
    pool.filter((item) => item.kind === "PHRASE" && item.key !== said.key),
    2,
    "script",
  );
  if (wrong.length < 2) return null;
  return {
    id,
    type: "MULTIPLE_CHOICE",
    instruction: "Someone says this to you. Pick a good reply.",
    prompt: said.script,
    promptSubtext: `${said.roman} — “${said.meaning}”`,
    explanation: `A natural reply is ${reply.script} (${reply.roman}) — “${reply.meaning}”.`,
    options: shuffleFor(id, [
      { text: reply.script, subtext: reply.roman, isCorrect: true },
      ...wrong.map((other) => ({ text: other.script, subtext: other.roman })),
    ]),
  };
}

// Script exercises

function characterSound(id: string, letter: Letter, others: Letter[]): ExerciseSeed {
  return {
    id,
    type: "CHARACTER_SOUND",
    instruction:
      letter.kind === "syllable" ? "How do you read this?" : "What sound does this letter make?",
    prompt: letter.script,
    explanation: `${letter.script} is “${letter.romanization}”: ${letter.hint}.`,
    options: shuffleFor(id, [
      { text: letter.romanization, isCorrect: true },
      ...others.map((other) => ({ text: other.romanization })),
    ]),
  };
}

/** "short “a”, like the u in “cup”" → "cup" (the English example word in a sound hint). */
function exampleWord(hint: string): string | null {
  const quoted = [...hint.matchAll(/“([^”]+)”/g)].map((match) => match[1]!);
  const word = quoted.at(-1);
  return quoted.length >= 2 && word && /^[a-z]+$/i.test(word) ? word : null;
}

/** Pronunciation check: which English word has the same sound as this letter? */
function soundAlike(id: string, letter: Letter, pool: Letter[]): ExerciseSeed | null {
  const word = exampleWord(letter.hint);
  if (!word) return null;
  const others = [
    ...new Set(
      pool.map((other) => exampleWord(other.hint)).filter((w): w is string => !!w && w !== word),
    ),
  ];
  if (others.length < 2) return null;
  return {
    id,
    type: "MULTIPLE_CHOICE",
    instruction: `Which English word has the sound of ${letter.script}?`,
    prompt: letter.script,
    explanation: `${letter.script} (${letter.romanization}) is ${letter.hint}.`,
    options: shuffleFor(id, [
      { text: word, isCorrect: true },
      ...shuffleFor(`${id}-w`, others)
        .slice(0, 2)
        .map((text) => ({ text })),
    ]),
  };
}

function recognitionInstruction(letter: Letter): string {
  if (letter.kind === "vowel" || letter.kind === "consonant")
    return "Select the letter for this sound";
  return /^s-/.test(letter.key) ? "Select the syllable for this sound" : "Which word is this?";
}

function characterRecognition(id: string, letter: Letter, others: Letter[]): ExerciseSeed {
  return {
    id,
    type: "CHARACTER_RECOGNITION",
    instruction: recognitionInstruction(letter),
    prompt: letter.romanization,
    promptSubtext: letter.hint,
    explanation: `“${letter.romanization}” is written ${letter.script}.`,
    options: shuffleFor(id, [
      { text: letter.script, isCorrect: true },
      ...others.map((other) => ({ text: other.script })),
    ]),
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

/** Accepted typed spellings of a sound ("ii" or "ee", "uu" or "oo"). */
function soundSpellings(letter: Letter): string[] {
  const roman = letter.romanization;
  const set = new Set([roman]);
  if (roman.endsWith("ii")) set.add(roman.replace(/ii$/, "ee"));
  if (roman.endsWith("uu")) set.add(roman.replace(/uu$/, "oo"));
  if (roman.endsWith("ee")) set.add(roman.replace(/ee$/, "e"));
  if (roman.endsWith("oo")) set.add(roman.replace(/oo$/, "o"));
  if (roman.endsWith("o") && roman.length >= 2) set.add(roman.replace(/o$/, "a")); // Bengali ko → ka
  return [...set].filter((text) => /^[a-z]+$/i.test(text));
}

function typeTheSound(id: string, letter: Letter): ExerciseSeed | null {
  const spellings = soundSpellings(letter);
  if (!spellings.length) return null;
  return {
    id,
    type: "TRANSLATION",
    instruction: "Type the sound this letter makes",
    prompt: letter.script,
    explanation: `${letter.script} is “${letter.romanization}”: ${letter.hint}.`,
    options: spellings.map((text) => ({ text, isCorrect: true })),
  };
}

/** Other letters with a different sound, for the wrong answers. */
function otherLetters(seed: string, letter: Letter, pool: Letter[], count: number): Letter[] {
  const seen = new Set([letter.romanization, letter.script]);
  return pool
    .filter((other) => other.key !== letter.key)
    .sort((a, b) => hashOf(seed + a.key) - hashOf(seed + b.key))
    .filter((other) => {
      if (seen.has(other.romanization) || seen.has(other.script)) return false;
      seen.add(other.romanization);
      seen.add(other.script);
      return true;
    })
    .slice(0, count);
}

/** Up to 4 letters with different sounds (for matching). */
function distinctLetters(letters: Letter[], max = 4): Letter[] {
  const result: Letter[] = [];
  for (const letter of letters) {
    if (result.some((other) => other.romanization === letter.romanization)) continue;
    result.push(letter);
    if (result.length === max) break;
  }
  return result;
}

/** The exercises of one lesson: numbered ids, capped at MAX_EXERCISES. */
class ExerciseList {
  readonly items: ExerciseSeed[] = [];
  constructor(private readonly lessonId: string) {}

  get size() {
    return this.items.length;
  }

  private readonly seen = new Set<string>();

  /**
   * Builds an exercise with the next id; a factory may return null to skip (no id used).
   * The same question (type, prompt and correct answer) is never added twice to one lesson.
   */
  add = (make: (id: string) => ExerciseSeed | null) => {
    if (this.items.length >= MAX_EXERCISES) return;
    const id = `${this.lessonId}-e${String(this.items.length + 1).padStart(2, "0")}`;
    const exercise = make(id);
    if (!exercise) return;
    const answer = exercise.options
      .filter((option) => option.isCorrect || option.correctPosition != null || option.matchText)
      .map((option) => `${option.text}=${option.matchText ?? option.correctPosition ?? ""}`)
      .sort()
      .join(",");
    const key = `${exercise.type}|${exercise.prompt}|${answer}`;
    if (this.seen.has(key)) return;
    this.seen.add(key);
    this.items.push(exercise);
  };
}

// The course

export function buildCourse(meta: LanguageMeta, content: LanguageContent): CourseSeed {
  const c = meta.code;
  const plan: ScriptPlan | undefined = SCRIPT_PLANS[c];
  if (!plan) throw new Error(`No script plan for ${c}`);

  const { items, extrasByLesson } = makeItems(content);
  const item = (key: string) => {
    const found = items.get(key);
    if (!found) throw new Error(`Unknown item ${key}`);
    return found;
  };

  // Letters
  const vowelGroups = plan.vowelGroups.map((group) => group.map((key) => vowelLetter(plan, key)));
  const consonantGroups = plan.consonantGroups.map((group) =>
    group.map((key) => consonantLetter(plan, key)),
  );
  const signGroups = plan.signGroups.map((group) =>
    plan.signConsonants.flatMap((consonant) =>
      group.map((sign) => syllable(plan, consonant, sign)),
    ),
  );
  const allVowels = vowelGroups.flat();
  const allConsonants = consonantGroups.flat();
  const allSyllables = signGroups.flat();
  const allLetters = [...allVowels, ...allConsonants, ...allSyllables];

  const vocabulary: VocabularySeed[] = [];
  const vocabIds = new Map<string, string>(); // item/letter key → vocabulary id
  const idByScript = new Map<string, string>();
  const storedId = new Map<string, string>(); // generated id → id of the row actually stored
  const addVocabulary = (seed: VocabularySeed, key: string) => {
    // The same text can only be stored once per language; reuse the first row.
    const existing = idByScript.get(seed.script);
    if (existing) {
      vocabIds.set(key, existing);
      storedId.set(seed.id, existing);
      return;
    }
    storedId.set(seed.id, seed.id);
    idByScript.set(seed.script, seed.id);
    vocabIds.set(key, seed.id);
    vocabulary.push(seed);
  };
  for (const letter of allLetters) {
    const label =
      letter.kind === "vowel" ? "Vowel" : letter.kind === "consonant" ? "Consonant" : "Vowel sign";
    const topic =
      letter.kind === "vowel"
        ? "Vowels"
        : letter.kind === "consonant"
          ? "Consonants"
          : "Vowel signs";
    addVocabulary(
      {
        id: `${c}-l-${letter.key}`,
        kind: "LETTER",
        script: letter.script,
        romanization: letter.romanization,
        meaning: `${label}: ${letter.hint}`,
        topic,
        notes: null,
      },
      letter.key,
    );
  }

  const units: UnitSeed[] = [];
  /** Everything taught so far (for distractors and reviews). */
  const taught: Item[] = [];

  CURRICULUM.forEach((unitPlan, unitIndex) => {
    const unitNumber = unitIndex + 1;
    const unitLessons: LessonSeed[] = [];
    const unitItems: Item[] = [];

    unitPlan.lessons.forEach((lessonPlan, lessonIndex) => {
      const lessonId = `${c}-u${unitNumber}-l${lessonIndex + 1}`;
      const list = new ExerciseList(lessonId);
      const tryAdd = list.add;
      const exercises = list.items;

      let title = lessonPlan.title;
      let intro = lessonPlan.intro;
      let vocabularyIds: string[] = [];

      if (lessonPlan.script) {
        const result = buildScriptLesson(lessonPlan, {
          vowelGroups,
          consonantGroups,
          signGroups,
          allVowels,
          allConsonants,
          allSyllables,
          inherent: plan.inherent,
          readingWords: [
            "water",
            "milk",
            "mother",
            "father",
            "house",
            "name",
            "yes",
            "no",
            "food",
            "book",
          ].map(item),
          tryAdd,
          size: () => list.size,
        });
        title = result.title;
        intro = result.intro || intro;
        vocabularyIds = result.letters.map((letter) => vocabIds.get(letter.key)!).filter(Boolean);
        if (lessonPlan.script.kind === "reading") {
          vocabularyIds = result.words.map((word) => vocabIds.get(word.key) ?? word.id);
        }
      } else {
        const newItems = [
          ...(lessonPlan.items ?? []).map(item),
          ...(extrasByLesson.get(lessonPlan.key) ?? []),
        ];
        for (const newItem of newItems) {
          addVocabulary(
            {
              id: newItem.id,
              kind: newItem.kind,
              script: newItem.script,
              romanization: newItem.roman,
              meaning: newItem.meaning,
              topic: newItem.topic,
              notes: newItem.notes ?? null,
            },
            newItem.key,
          );
        }
        taught.push(...newItems);
        unitItems.push(...newItems);
        vocabularyIds = newItems.map((newItem) => vocabIds.get(newItem.key)!);
        const practice = (lessonPlan.practice ?? []).map(item);
        buildContentLesson(lessonPlan, newItems, practice, unitItems, taught, item, content, list);
      }

      const note = content.lessonNotes?.[lessonPlan.key];
      unitLessons.push({
        id: lessonId,
        key: lessonPlan.key,
        title,
        introText: note ? `${intro} ${note}` : intro,
        kind: lessonPlan.kind,
        vocabularyIds: [...new Set(vocabularyIds)],
        exercises,
      });
    });

    units.push({
      id: `${c}-u${unitNumber}`,
      title: unitPlan.title,
      description: unitPlan.description,
      stage: unitPlan.stage,
      lessons: unitLessons,
    });
  });

  // Make sure every extra/concept is in the vocabulary even if no lesson used it.
  for (const leftover of items.values()) {
    if (!vocabIds.has(leftover.key)) {
      addVocabulary(
        {
          id: leftover.id,
          kind: leftover.kind,
          script: leftover.script,
          romanization: leftover.roman,
          meaning: leftover.meaning,
          topic: leftover.topic,
          notes: leftover.notes ?? null,
        },
        leftover.key,
      );
    }
  }

  // Reading lessons link words before they are formally taught: resolve those ids now.
  for (const unit of units) {
    for (const lesson of unit.lessons) {
      lesson.vocabularyIds = [...new Set(lesson.vocabularyIds.map((id) => storedId.get(id) ?? id))];
    }
  }

  return {
    id: `${c}-course`,
    title: `${meta.name} for English speakers`,
    description: `From your first ${meta.scriptName} letters to everyday conversations.`,
    vocabulary,
    units,
    placementQuestions: placementQuestions(units),
  };
}

type ScriptContext = {
  vowelGroups: Letter[][];
  consonantGroups: Letter[][];
  signGroups: Letter[][];
  allVowels: Letter[];
  allConsonants: Letter[];
  allSyllables: Letter[];
  inherent: "a" | "o";
  readingWords: Item[];
  tryAdd: (make: (id: string) => ExerciseSeed | null) => void;
  size: () => number;
};

function buildScriptLesson(
  lesson: LessonPlan,
  ctx: ScriptContext,
): { title: string; intro: string; letters: Letter[]; words: Item[] } {
  const { tryAdd } = ctx;
  const script = lesson.script!;
  const names = (letters: Letter[]) => {
    const list = letters.map((letter) => letter.romanization);
    return list.length > 1 ? `${list.slice(0, -1).join(", ")} and ${list.at(-1)}` : list[0]!;
  };

  /** The standard drill for a set of new letters, with earlier letters as review. */
  const drill = (letters: Letter[], pool: Letter[], earlier: Letter[], title: string) => {
    letters.forEach((letter, index) => {
      tryAdd((id) => characterSound(id, letter, otherLetters(id, letter, pool, 2)));
      if (index < 5)
        tryAdd((id) => characterRecognition(id, letter, otherLetters(id, letter, pool, 2)));
    });
    const forMatching = distinctLetters([...letters, ...earlier.slice(-4)]);
    if (forMatching.length >= 3) tryAdd((id) => matchLetters(id, forMatching, title));
    const typed = letters.find((letter) => soundSpellings(letter).length > 0);
    if (typed) tryAdd((id) => typeTheSound(id, typed));
    const typedKeys = new Set(typed ? [typed.key] : []);
    for (const old of earlier.slice(-3)) {
      tryAdd((id) =>
        characterRecognition(id, old, otherLetters(id, old, [...letters, ...earlier], 2)),
      );
    }
    // Small groups (e.g. the first two vowels): practise each letter once more, the other way round.
    for (const letter of letters) {
      if (ctx.size() >= MIN_EXERCISES) break;
      if (!typedKeys.has(letter.key)) tryAdd((id) => typeTheSound(id, letter));
      if (ctx.size() < MIN_EXERCISES) tryAdd((id) => soundAlike(id, letter, pool));
    }
  };

  switch (script.kind) {
    case "vowels": {
      if (script.group) {
        const letters = ctx.vowelGroups[script.group - 1]!;
        const earlier = ctx.vowelGroups.slice(0, script.group - 1).flat();
        drill(letters, ctx.allVowels, earlier, "Vowels so far");
        if (letters.length >= 2 && script.group <= 3) {
          const [short, long] = letters as [Letter, Letter];
          tryAdd((id) => ({
            id,
            type: "MULTIPLE_CHOICE",
            instruction: "Which of these is the long vowel?",
            prompt: "Long vowel",
            explanation: `${long.script} (${long.romanization}) is long; ${short.script} (${short.romanization}) is short. Long vowels are held about twice as long.`,
            options: shuffleFor(id, [
              { text: long.script, isCorrect: true },
              { text: short.script },
            ]),
          }));
        }
        return {
          title: `Vowels: ${names(letters)}`,
          intro: `${lesson.intro} ${letters.map((l) => `${l.script} is “${l.romanization}” — ${l.hint}`).join("; ")}.`,
          letters,
          words: [],
        };
      }
      // Review
      const all = ctx.allVowels;
      all.forEach((letter, index) => {
        if (index % 2 === 0)
          tryAdd((id) => characterSound(id, letter, otherLetters(id, letter, all, 2)));
        else tryAdd((id) => characterRecognition(id, letter, otherLetters(id, letter, all, 2)));
      });
      tryAdd((id) => matchLetters(id, distinctLetters(all.slice(0, 4)), "Vowels"));
      tryAdd((id) => matchLetters(id, distinctLetters(all.slice(4)), "More vowels"));
      return { title: lesson.title, intro: lesson.intro, letters: [], words: [] };
    }
    case "consonants": {
      const letters = ctx.consonantGroups[script.group! - 1]!;
      const earlier = ctx.consonantGroups.slice(0, script.group! - 1).flat();
      drill(letters, ctx.allConsonants, earlier, "Consonants so far");
      return {
        title: `Consonants: ${names(letters)}`,
        intro: `Every consonant carries a built-in “${ctx.inherent}” sound: ${letters[0]!.script} is “${letters[0]!.romanization}”, not just “${letters[0]!.romanization.slice(0, -1)}”. New letters: ${letters.map((l) => `${l.script} ${l.romanization}`).join(", ")}.`,
        letters,
        words: [],
      };
    }
    case "signs": {
      const letters = ctx.signGroups[script.group! - 1]!;
      const earlier = ctx.signGroups.slice(0, script.group! - 1).flat();
      drill(letters, ctx.allSyllables, earlier, "Consonants with vowel signs");
      const first = letters[0]!;
      return {
        title: `Vowel signs: ${names(letters.slice(0, letters.length / 2))}`,
        intro: `${lesson.intro} ${letters.map((l) => `${l.script} ${l.romanization}`).join(", ")}. Example: ${first.hint} = ${first.script}.`,
        letters,
        words: [],
      };
    }
    case "reading": {
      const words = ctx.readingWords;
      const asLetter = (word: Item): Letter => ({
        key: word.key,
        kind: "syllable",
        script: word.script,
        romanization: word.roman,
        hint: `“${word.meaning}”`,
      });
      const letters = words.map(asLetter);
      letters.forEach((letter, index) => {
        if (index % 2 === 0)
          tryAdd((id) => characterSound(id, letter, otherLetters(id, letter, letters, 2)));
        else tryAdd((id) => characterRecognition(id, letter, otherLetters(id, letter, letters, 2)));
      });
      tryAdd((id) => matchLetters(id, distinctLetters(letters.slice(0, 4)), "Read the words"));
      tryAdd((id) => meaningChoice(id, words[0]!, words));
      tryAdd((id) => meaningChoice(id, words[4]!, words));
      return { title: lesson.title, intro: lesson.intro, letters: [], words };
    }
    case "script-review": {
      const mixed = [
        ...ctx.allVowels.slice(0, 4),
        ...ctx.allConsonants.slice(0, 6),
        ...ctx.allSyllables.slice(0, 4),
      ];
      mixed.forEach((letter, index) => {
        if (index % 2 === 0)
          tryAdd((id) => characterSound(id, letter, otherLetters(id, letter, mixed, 2)));
        else tryAdd((id) => characterRecognition(id, letter, otherLetters(id, letter, mixed, 2)));
      });
      tryAdd((id) => matchLetters(id, distinctLetters(ctx.allConsonants.slice(6)), "Consonants"));
      return { title: lesson.title, intro: lesson.intro, letters: [], words: [] };
    }
  }
}

function buildContentLesson(
  lesson: LessonPlan,
  newItems: Item[],
  practice: Item[],
  unitItems: Item[],
  taught: Item[],
  item: (key: string) => Item,
  content: LanguageContent,
  list: ExerciseList,
) {
  const tryAdd = list.add;
  const pool = taught;
  const focus = newItems.length ? newItems : practice;
  const phrases = [...focus, ...practice].filter((entry) => goodTokens(entry));

  // 1. Meaning / which-word for every new item (alternating), practice items as review.
  focus.forEach((entry, index) => {
    tryAdd((id) =>
      index % 2 === 0 ? meaningChoice(id, entry, pool) : scriptChoice(id, entry, pool),
    );
  });
  // 2. Matching in groups of 4–5.
  for (let start = 0; start + 3 <= focus.length && start < 10; start += 5) {
    tryAdd((id) => matching(id, focus.slice(start, start + 5), lesson.title));
  }
  // 3. Replies ("pick a good reply").
  for (const [said, reply] of lesson.replies ?? []) {
    tryAdd((id) => replyChoice(id, item(said), item(reply), pool));
  }
  // 4. Sentence building and fill-in-the-blank on phrases.
  phrases.slice(0, 3).forEach((entry) => tryAdd((id) => wordOrder(id, entry, pool)));
  phrases.slice(3, 5).forEach((entry) => tryAdd((id) => fillBlank(id, entry, pool)));
  if (phrases.length && phrases.length <= 3) tryAdd((id) => fillBlank(id, phrases[0]!, pool));
  // 5. Typed translation: a phrase if there is one, otherwise a word.
  const toTranslate = [...focus.filter((entry) => entry.kind === "PHRASE"), ...focus].slice(0, 2);
  for (const entry of toTranslate) tryAdd((id) => translation(id, entry));
  // 6. Dialogue questions.
  if (lesson.dialogue) {
    const dialogue = content.dialogues[lesson.dialogue];
    const lines = dialogue.lines;
    for (let index = 1; index < lines.length && index < 6; index += 2) {
      const said = lines[index - 1]!;
      const reply = lines[index]!;
      const others = lines.filter(
        (line, i) => i !== index && i !== index - 1 && line.script !== reply.script,
      );
      if (others.length < 2) continue;
      tryAdd((id) => ({
        id,
        type: "MULTIPLE_CHOICE",
        instruction: `${DIALOGUES[lesson.dialogue!].title}: what comes next?`,
        prompt: said.script,
        promptSubtext: `${said.roman} — “${said.meaning}”`,
        explanation: `${dialogue.context} The next line is ${reply.script} (${reply.roman}) — “${reply.meaning}”.`,
        options: shuffleFor(id, [
          { text: reply.script, subtext: reply.roman, isCorrect: true },
          ...others
            .sort((a, b) => hashOf(id + a.script) - hashOf(id + b.script))
            .slice(0, 2)
            .map((line) => ({ text: line.script, subtext: line.roman })),
        ]),
      }));
    }
    const line = lines.find(
      (entry) =>
        entry.script.split(/\s+/).length >= 2 &&
        entry.script.split(/\s+/).length === entry.roman.split(/\s+/).length,
    );
    if (line) {
      const pseudo: Item = {
        id: "",
        key: `dialogue:${line.script}`,
        kind: "PHRASE",
        script: line.script,
        roman: line.roman,
        meaning: line.meaning,
        topic: "Conversation",
        accept: [],
        words: line.script
          .split(/\s+/)
          .map((script, i): Token => [script, line.roman.split(/\s+/)[i]!]),
      };
      tryAdd((id) => wordOrder(id, pseudo, pool));
    }
  }
  // 7. Top up to the minimum with review exercises from this unit and earlier.
  const reviewPool = [
    ...practice,
    ...unitItems.filter((entry) => !newItems.includes(entry)),
    ...taught,
  ].filter((entry, index, list) => list.indexOf(entry) === index);
  let guard = 0;
  for (const entry of reviewPool) {
    if (guard++ > 40) break;
    tryAdd((id) => {
      const pick = hashOf(id) % 3;
      if (pick === 0) return meaningChoice(id, entry, pool);
      if (pick === 1) return scriptChoice(id, entry, pool);
      return goodTokens(entry) ? wordOrder(id, entry, pool) : meaningChoice(id, entry, pool);
    });
    // Lessons with new content stop at a comfortable size; reviews fill up to the maximum.
    if (lesson.kind !== "CHECKPOINT" && list.size >= MIN_EXERCISES + 2) break;
  }
}

/** 3 placement questions for each placement unit, re-using real exercises. */
function placementQuestions(units: UnitSeed[]): PlacementQuestionSeed[] {
  const questions: PlacementQuestionSeed[] = [];
  /** First exercise of one of these types, looking at the lessons from `from` onwards (then all). */
  const pick = (unit: UnitSeed, types: ExerciseType[], from: number, taken: Set<string>) => {
    const lessons = [...unit.lessons.slice(from), ...unit.lessons.slice(0, from)];
    for (const lesson of lessons) {
      const found = lesson.exercises.find(
        (exercise) => types.includes(exercise.type) && !taken.has(exercise.id),
      );
      if (found) return found;
    }
    return undefined;
  };
  for (const unitNumber of PLACEMENT_UNITS) {
    const unit = units[unitNumber - 1]!;
    const taken = new Set<string>();
    // Script units: letters and sounds from three different lessons.
    // Other units: a word (vocabulary), a sentence (word order / gap) and a translation.
    const plan: Array<[PlacementSkill, ExerciseType[], number]> =
      unitNumber <= 3
        ? [
            ["SCRIPT", ["CHARACTER_SOUND", "CHARACTER_RECOGNITION", "MULTIPLE_CHOICE"], 0],
            ["SCRIPT", ["CHARACTER_RECOGNITION", "CHARACTER_SOUND"], 1],
            ["SCRIPT", ["CHARACTER_SOUND", "CHARACTER_RECOGNITION"], 2],
          ]
        : [
            ["VOCABULARY", ["MULTIPLE_CHOICE"], 0],
            ["SENTENCE", ["WORD_ORDER", "FILL_IN_BLANK"], 1],
            ["TRANSLATION", ["TRANSLATION"], 2],
          ];
    for (const [skill, types, from] of plan) {
      const exercise = pick(unit, types, from, taken);
      if (!exercise) throw new Error(`No ${skill} placement question in unit ${unitNumber}`);
      taken.add(exercise.id);
      questions.push({ exerciseId: exercise.id, unitNumber, skill });
    }
  }
  return questions;
}
