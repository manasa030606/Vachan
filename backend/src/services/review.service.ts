// The mistake / review system.
//
// Rule: an exercise is an OPEN MISTAKE when the learner answered it wrong (in a lesson or a
// review) and has not answered it correctly IN A REVIEW since that wrong answer.
// Getting it right later in the same lesson does not clear it — the point of review is to
// come back to it later. Deterministic and transparent, no AI involved.
import type { Prisma } from "../generated/prisma/client.ts";
import { prisma } from "../lib/prisma.ts";
import { correctAnswerText, describeAnswer } from "./answer-checker.ts";
import { EXERCISE_TYPE_NAMES, toPublicExercise } from "./lesson.service.ts";

const exerciseInclude = {
  options: true,
  lesson: {
    select: {
      id: true,
      title: true,
      unit: {
        select: {
          title: true,
          course: { select: { id: true, language: { select: { code: true, name: true } } } },
        },
      },
    },
  },
} satisfies Prisma.ExerciseInclude;

type ExerciseForReview = Prisma.ExerciseGetPayload<{ include: typeof exerciseInclude }>;

/** What the learner saw, as one line of text (e.g. the word, the letter or the sentence). */
function promptText(exercise: ExerciseForReview) {
  if (exercise.type === "FILL_IN_BLANK") {
    return {
      prompt: [exercise.sentenceBefore, "___", exercise.sentenceAfter].filter(Boolean).join(" "),
      promptSubtext: exercise.translation,
    };
  }
  return { prompt: exercise.prompt, promptSubtext: exercise.promptSubtext };
}

const languageFilter = (languageCode?: string): Prisma.UserExerciseAttemptWhereInput =>
  languageCode
    ? { exercise: { lesson: { unit: { course: { language: { code: languageCode } } } } } }
    : {};

/** Is this exercise currently an open mistake for the learner? (checked before a review answer) */
export async function isOpenMistake(
  db: Prisma.TransactionClient | typeof prisma,
  userId: string,
  exerciseId: string,
): Promise<boolean> {
  const [lastWrong, lastReviewRight] = await Promise.all([
    db.userExerciseAttempt.findFirst({
      where: { userId, exerciseId, isCorrect: false },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
    db.userExerciseAttempt.findFirst({
      where: { userId, exerciseId, isCorrect: true, source: "REVIEW" },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
  ]);
  return (
    lastWrong !== null && (!lastReviewRight || lastReviewRight.createdAt < lastWrong.createdAt)
  );
}

/** Loads wrong answers + correct review answers and works out which mistakes are still open. */
async function collectMistakes(userId: string, languageCode?: string) {
  const attempts = await prisma.userExerciseAttempt.findMany({
    where: {
      userId,
      OR: [{ isCorrect: false }, { source: "REVIEW", isCorrect: true }],
      ...languageFilter(languageCode),
    },
    orderBy: { createdAt: "asc" },
    include: { exercise: { include: exerciseInclude } },
  });

  type Entry = {
    exercise: ExerciseForReview;
    wrongCount: number;
    lastWrong: (typeof attempts)[number] | null;
    lastReviewCorrectAt: Date | null;
  };
  const byExercise = new Map<string, Entry>();
  for (const attempt of attempts) {
    const entry = byExercise.get(attempt.exerciseId) ?? {
      exercise: attempt.exercise,
      wrongCount: 0,
      lastWrong: null,
      lastReviewCorrectAt: null,
    };
    if (attempt.isCorrect) {
      entry.lastReviewCorrectAt = attempt.createdAt;
    } else {
      entry.wrongCount += 1;
      entry.lastWrong = attempt;
    }
    byExercise.set(attempt.exerciseId, entry);
  }

  const entries = [...byExercise.values()].filter((entry) => entry.lastWrong !== null);
  const isOpen = (entry: Entry) =>
    !entry.lastReviewCorrectAt || entry.lastReviewCorrectAt < entry.lastWrong!.createdAt;

  return {
    open: entries
      .filter(isOpen)
      .sort((a, b) => b.lastWrong!.createdAt.getTime() - a.lastWrong!.createdAt.getTime()),
    resolvedCount: entries.filter((entry) => !isOpen(entry)).length,
    wrongAttempts: attempts.filter((attempt) => !attempt.isCorrect),
    isOpen: (exerciseId: string) => {
      const entry = byExercise.get(exerciseId);
      return entry ? entry.lastWrong !== null && isOpen(entry) : false;
    },
  };
}

function lessonInfo(exercise: ExerciseForReview) {
  return {
    lessonId: exercise.lesson.id,
    lessonTitle: exercise.lesson.title,
    unitTitle: exercise.lesson.unit.title,
    courseId: exercise.lesson.unit.course.id,
    languageCode: exercise.lesson.unit.course.language.code,
  };
}

/** GET /api/review — open mistakes and the words the learner has learned. */
export async function getReview(userId: string, languageCode?: string) {
  const [{ open, resolvedCount }, completed] = await Promise.all([
    collectMistakes(userId, languageCode),
    prisma.userLessonProgress.findMany({
      where: {
        userId,
        status: "COMPLETED",
        ...(languageCode
          ? { lesson: { unit: { course: { language: { code: languageCode } } } } }
          : {}),
      },
      select: {
        lesson: {
          select: {
            vocabulary: {
              select: {
                id: true,
                kind: true,
                script: true,
                romanization: true,
                meaning: true,
                topic: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const learned = new Map(
    completed.flatMap((row) => row.lesson.vocabulary).map((item) => [item.id, item] as const),
  );

  return {
    languageCode: languageCode ?? null,
    openMistakes: open.length,
    resolvedMistakes: resolvedCount,
    mistakes: open.map((entry) => ({
      exerciseId: entry.exercise.id,
      type: EXERCISE_TYPE_NAMES[entry.exercise.type],
      instruction: entry.exercise.instruction,
      ...promptText(entry.exercise),
      yourAnswer: describeAnswer(entry.exercise, entry.lastWrong!.answer),
      correctAnswer: correctAnswerText(entry.exercise),
      explanation: entry.exercise.explanation,
      wrongCount: entry.wrongCount,
      lastWrongAt: entry.lastWrong!.createdAt,
      ...lessonInfo(entry.exercise),
    })),
    learnedVocabulary: [...learned.values()].sort((a, b) => a.id.localeCompare(b.id)),
  };
}

/** GET /api/review/attempts — every incorrect answer, newest first. */
export async function getIncorrectAttempts(
  userId: string,
  languageCode: string | undefined,
  limit: number,
) {
  const { wrongAttempts, isOpen } = await collectMistakes(userId, languageCode);
  return wrongAttempts
    .slice(-limit)
    .reverse()
    .map((attempt) => ({
      attemptId: attempt.id,
      exerciseId: attempt.exerciseId,
      source: attempt.source,
      ...promptText(attempt.exercise),
      yourAnswer: describeAnswer(attempt.exercise, attempt.answer),
      correctAnswer: correctAnswerText(attempt.exercise),
      createdAt: attempt.createdAt,
      /** Still on the review list? */
      stillOpen: isOpen(attempt.exerciseId),
      ...lessonInfo(attempt.exercise),
    }));
}

/** GET /api/review/session — open mistakes as exercises to practise (answers stay on the server). */
export async function getReviewSession(
  userId: string,
  languageCode: string | undefined,
  limit: number,
) {
  const { open } = await collectMistakes(userId, languageCode);
  const picked = open.slice(0, limit);
  return {
    id: "review",
    title: "Review your mistakes",
    introText:
      picked.length > 0
        ? "Answer each one correctly to clear it from your list."
        : "No mistakes to review right now. Keep learning!",
    totalOpen: open.length,
    exercises: picked.map((entry) => ({
      ...toPublicExercise(entry.exercise),
      lessonTitle: entry.exercise.lesson.title,
    })),
  };
}
