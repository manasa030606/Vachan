// Builds a demo lesson for any language from LANGUAGE_CONTENT.
// Every lesson in Phase 1 uses this same demo exercise set (one of each exercise type),
// so the whole lesson flow can be clicked through. Real lessons arrive in Phase 3.
import type { ChoiceOption, Exercise, Lesson } from "@/types/exercise";
import type { LanguageCode, VocabularyWord } from "@/types/learning";
import { LANGUAGE_CONTENT } from "./language-content";
import { findLesson } from "./mock-course";

/** Moves the first `steps` items to the end. A predictable "shuffle" (no random → no hydration mismatch). */
function rotate<T>(items: T[], steps: number): T[] {
  const offset = steps % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

function scriptOption(word: VocabularyWord): ChoiceOption {
  return { id: word.id, text: word.script, subtext: word.romanization };
}

function meaningOption(word: VocabularyWord): ChoiceOption {
  return { id: word.id, text: word.meaning };
}

export function buildDemoLesson(languageCode: LanguageCode, lessonId: string): Lesson {
  const content = LANGUAGE_CONTENT[languageCode];
  const { hello, thankYou, water, mother, yes } = content.words;
  const [letterA, letterAa, letterKa] = content.letters;
  const sentence = content.nameSentence;
  const nameToken = sentence.tokens[sentence.nameTokenIndex];
  const lessonInfo = findLesson(languageCode, lessonId);

  const exercises: Exercise[] = [
    {
      id: "ex-character",
      type: "character-recognition",
      instruction: "What sound does this letter make?",
      character: letterAa.character,
      options: rotate(
        [letterA, letterAa, letterKa].map((letter) => ({
          id: letter.romanization,
          text: letter.romanization,
        })),
        2,
      ),
      correctOptionId: letterAa.romanization,
    },
    {
      id: "ex-meaning",
      type: "multiple-choice",
      instruction: "Select the correct meaning",
      prompt: hello.script,
      promptSubtext: hello.romanization,
      options: rotate([hello, thankYou, water, yes].map(meaningOption), 1),
      correctOptionId: hello.id,
    },
    {
      id: "ex-matching",
      type: "matching",
      instruction: "Tap the matching pairs",
      pairs: [hello, thankYou, water, mother].map((item) => ({
        id: item.id,
        left: item.script,
        leftSubtext: item.romanization,
        right: item.meaning,
      })),
    },
    {
      id: "ex-reverse-choice",
      type: "multiple-choice",
      instruction: "Which word means this?",
      prompt: `“${water.meaning}”`,
      options: rotate([mother, water, yes, thankYou].map(scriptOption), 3),
      correctOptionId: water.id,
    },
    {
      id: "ex-fill-blank",
      type: "fill-in-blank",
      instruction: "Fill in the blank",
      before: sentence.tokens
        .slice(0, sentence.nameTokenIndex)
        .map((token) => token.text)
        .join(" "),
      after: sentence.tokens
        .slice(sentence.nameTokenIndex + 1)
        .map((token) => token.text)
        .join(" "),
      translation: sentence.meaning,
      options: rotate(
        [
          { id: nameToken.id, text: nameToken.text, subtext: nameToken.romanization },
          scriptOption(water),
          scriptOption(mother),
        ],
        1,
      ),
      correctOptionId: nameToken.id,
    },
    {
      id: "ex-translation",
      type: "translation",
      instruction: "Write this in English",
      prompt: thankYou.script,
      promptSubtext: thankYou.romanization,
      acceptedAnswers: ["thank you", "thanks", "thank you very much"],
    },
    {
      id: "ex-word-order",
      type: "word-order",
      instruction: "Build the sentence",
      prompt: sentence.meaning,
      tokens: rotate(
        [
          ...sentence.tokens.map((token) => ({
            id: token.id,
            text: token.text,
            subtext: token.romanization,
          })),
          scriptOption(water),
        ],
        2,
      ),
      correctOrder: sentence.tokens.map((token) => token.id),
    },
  ];

  // Script lessons introduce letters; other lessons introduce words.
  const isScriptLesson = lessonInfo?.lesson.icon === "script";
  const letterCards: VocabularyWord[] = content.letters.map((letter) => ({
    id: `${languageCode}-letter-${letter.romanization}`,
    script: letter.character,
    romanization: letter.romanization,
    meaning: letter.kind === "vowel" ? "Vowel" : "Consonant",
    topic: "Script",
  }));

  return {
    id: lessonId,
    title: lessonInfo?.lesson.title ?? "Practice session",
    unitTitle: lessonInfo?.unit.title ?? "Personalised review",
    xpReward: lessonInfo?.lesson.xpReward ?? 15,
    newWords: isScriptLesson ? letterCards : [hello, thankYou, water],
    introText: isScriptLesson
      ? "Here are the letters you'll practise. Say each sound aloud."
      : "Here are the words you'll practise in this lesson. Take a moment to read them aloud.",
    exercises,
  };
}
