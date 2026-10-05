// Mock data for the Practice screen, built from each language's demo words.
// In Phase 4 this is produced by transparent review rules from real attempt history.
import type { LanguageCode, VocabularyWord } from "@/types/learning";
import { LANGUAGE_CONTENT, getVocabulary } from "./language-content";

export type MistakeItem = {
  id: string;
  prompt: string;
  promptSubtext?: string;
  yourAnswer: string;
  correctAnswer: string;
  lessonTitle: string;
  when: string;
};

export type WeakTopic = {
  id: string;
  title: string;
  /** 0–100 */
  strength: number;
  reason: string;
};

export type VocabularyEntry = VocabularyWord & {
  /** 0–100 how well the learner knows the word */
  strength: number;
  lastPracticed: string;
};

export function getMistakes(languageCode: LanguageCode): MistakeItem[] {
  const { words, letters } = LANGUAGE_CONTENT[languageCode];
  return [
    {
      id: "m1",
      prompt: words.thankYou.script,
      promptSubtext: words.thankYou.romanization,
      yourAnswer: "Hello",
      correctAnswer: words.thankYou.meaning,
      lessonTitle: "Greetings",
      when: "Today",
    },
    {
      id: "m2",
      prompt: letters[1].character,
      yourAnswer: letters[0].romanization,
      correctAnswer: letters[1].romanization,
      lessonTitle: "Vowels II",
      when: "Yesterday",
    },
    {
      id: "m3",
      prompt: `“${words.water.meaning}”`,
      yourAnswer: words.mother.script,
      correctAnswer: words.water.script,
      lessonTitle: "Greetings",
      when: "2 days ago",
    },
  ];
}

export const WEAK_TOPICS: WeakTopic[] = [
  {
    id: "long-vowels",
    title: "Long vs short vowels",
    strength: 35,
    reason: "3 mistakes this week",
  },
  { id: "polite-words", title: "Polite words", strength: 50, reason: "Not practised for 4 days" },
  { id: "word-order", title: "Sentence word order", strength: 62, reason: "Slow answers" },
];

const STRENGTHS = [92, 40, 75, 58, 85];
const LAST_PRACTICED = ["Today", "5 days ago", "Yesterday", "3 days ago", "Today"];

export function getVocabularyEntries(languageCode: LanguageCode): VocabularyEntry[] {
  return getVocabulary(languageCode).map((word, index) => ({
    ...word,
    strength: STRENGTHS[index % STRENGTHS.length],
    lastPracticed: LAST_PRACTICED[index % LAST_PRACTICED.length],
  }));
}

/** A word is "weak" below this strength. */
export const WEAK_WORD_THRESHOLD = 60;
