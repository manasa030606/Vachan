// LISTENING COMPREHENSION: hear a word/phrase (text-to-speech), then choose
//   • what it means          ("meaning" — English options), or
//   • how it is written      ("script"  — native-script options, a light dictation exercise).
// The question never contains the answer: options are labelled a–d, and the question carries an
// encrypted token (question-token.ts) used to fetch its audio and to check the answer.
import { randomInt } from "node:crypto";
import { SPEECH_CONFIG } from "../config/speech.ts";
import { HttpError, notFound } from "../lib/http-error.ts";
import { prisma } from "../lib/prisma.ts";
import type { LanguageCode } from "../rag/types.ts";
import { resolveLearnerContext } from "./learner-context.ts";
import { openQuestion, sealQuestion } from "./question-token.ts";

const LETTERS = ["a", "b", "c", "d", "e", "f"];

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export async function createListeningRound(
  userId: string,
  input: { language?: LanguageCode; count?: number },
) {
  const context = await resolveLearnerContext(userId, { language: input.language });
  const items = await prisma.vocabularyItem.findMany({
    where: { language: { code: context.languageCode }, kind: { in: ["WORD", "PHRASE"] } },
    select: { id: true, kind: true, script: true, meaning: true },
  });
  const optionCount = SPEECH_CONFIG.listening.optionsPerQuestion;
  if (items.length < optionCount) {
    throw new HttpError(409, "NOT_ENOUGH_CONTENT", "This course doesn't have enough words yet");
  }
  const count = Math.min(input.count ?? SPEECH_CONFIG.listening.questionsPerRound, items.length);

  const questions = shuffle(items)
    .slice(0, count)
    .map((item, index) => {
      // Alternate the two question types; phrases always ask for the meaning.
      const type = item.kind === "PHRASE" || index % 2 === 0 ? "meaning" : "script";
      const sameKind = items.filter((other) => other.id !== item.id && other.kind === item.kind);
      const pool =
        sameKind.length >= optionCount - 1 ? sameKind : items.filter((o) => o.id !== item.id);
      const label = (v: { script: string; meaning: string }) =>
        type === "meaning" ? v.meaning : v.script;
      // Distractors must look different from the answer (two words can share a meaning).
      const distractors = shuffle(pool)
        .filter(
          (other, i, all) =>
            label(other) !== label(item) && all.findIndex((o) => label(o) === label(other)) === i,
        )
        .slice(0, optionCount - 1);
      const options = shuffle([item, ...distractors]).map((option, i) => ({
        id: LETTERS[i]!,
        label: label(option),
        isAnswer: option.id === item.id,
      }));
      const correct = options.find((o) => o.isAnswer)!.id;
      return {
        token: sealQuestion(item.id, correct),
        type,
        instruction:
          type === "meaning" ? "Listen. What does it mean?" : "Listen. Which one did you hear?",
        options: options.map(({ id, label }) => ({ id, label })),
      };
    });

  return {
    language: { code: context.languageCode, name: context.languageName },
    questions,
  };
}

export async function checkListeningAnswer(input: { token: string; choiceId: string }) {
  const secret = openQuestion(input.token);
  const item = await prisma.vocabularyItem.findUnique({
    where: { id: secret.itemId },
    select: { script: true, romanization: true, meaning: true },
  });
  if (!item) throw notFound("QUESTION_NOT_FOUND", "Question not found");
  return {
    correct: input.choiceId === secret.correct,
    correctChoiceId: secret.correct,
    answer: item,
  };
}

/** The vocabulary item behind a listening question (for its audio). */
export const questionItemId = (token: string) => openQuestion(token).itemId;
