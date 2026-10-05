// Mock course path (units → lessons) with demo progress.
// The structure follows the spec's learning journey: Foundations → First Words → Everyday Phrases.
import type { LanguageCode, LessonSummary, Unit } from "@/types/learning";
import { getLanguage } from "./languages";

type LessonSeed = Omit<LessonSummary, "id">;

function unit(
  languageCode: LanguageCode,
  number: number,
  details: Omit<Unit, "id" | "number" | "lessons">,
  lessons: LessonSeed[],
): Unit {
  return {
    id: `${languageCode}-unit-${number}`,
    number,
    ...details,
    lessons: lessons.map((lesson, index) => ({
      ...lesson,
      id: `${languageCode}-u${number}-l${index + 1}`,
    })),
  };
}

/** Returns the demo course for a language: unit 1 done, unit 2 in progress, unit 3 locked. */
export function getCoursePath(languageCode: LanguageCode): Unit[] {
  const language = getLanguage(languageCode);

  return [
    unit(
      languageCode,
      1,
      {
        title: "Script foundations",
        description: `Read and pronounce your first ${language.scriptName} letters.`,
        stage: "Foundations",
        color: "brand",
      },
      [
        { title: "Vowels I", status: "completed", xpReward: 10, icon: "script" },
        { title: "Vowels II", status: "completed", xpReward: 10, icon: "script" },
        { title: "First consonants", status: "completed", xpReward: 10, icon: "script" },
        { title: "Sounds practice", status: "completed", xpReward: 15, icon: "star" },
        { title: "Unit 1 checkpoint", status: "completed", xpReward: 20, icon: "trophy" },
      ],
    ),
    unit(
      languageCode,
      2,
      {
        title: "First words",
        description: "Greetings, family and everyday words.",
        stage: "First Words",
        color: "teal",
      },
      [
        { title: "Greetings", status: "completed", xpReward: 10, icon: "words" },
        { title: "Polite words", status: "current", xpReward: 10, icon: "words" },
        { title: "Family", status: "locked", xpReward: 10, icon: "words" },
        { title: "Food & drink", status: "locked", xpReward: 10, icon: "words" },
        { title: "Unit 2 checkpoint", status: "locked", xpReward: 20, icon: "trophy" },
      ],
    ),
    unit(
      languageCode,
      3,
      {
        title: "Everyday phrases",
        description: "Introduce yourself and ask simple questions.",
        stage: "Everyday Phrases",
        color: "rose",
      },
      [
        { title: "Introductions", status: "locked", xpReward: 10, icon: "chat" },
        { title: "Asking questions", status: "locked", xpReward: 10, icon: "chat" },
        { title: "Directions", status: "locked", xpReward: 10, icon: "chat" },
        { title: "Shopping", status: "locked", xpReward: 15, icon: "star" },
        { title: "Unit 3 checkpoint", status: "locked", xpReward: 20, icon: "trophy" },
      ],
    ),
  ];
}

export function findLesson(languageCode: LanguageCode, lessonId: string) {
  for (const courseUnit of getCoursePath(languageCode)) {
    const lesson = courseUnit.lessons.find((item) => item.id === lessonId);
    if (lesson) return { unit: courseUnit, lesson };
  }
  return null;
}

/** The lesson the learner should do next (the one with status "current"). */
export function getCurrentLesson(languageCode: LanguageCode) {
  for (const courseUnit of getCoursePath(languageCode)) {
    const lesson = courseUnit.lessons.find((item) => item.status === "current");
    if (lesson) return { unit: courseUnit, lesson };
  }
  return null;
}
