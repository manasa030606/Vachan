// One lesson with its intro words and exercises — WITHOUT the answers —
// plus starting/resuming a lesson.
import type { ExerciseType, Prisma } from "../generated/prisma/client.ts";
import { forbidden, notFound } from "../lib/http-error.ts";
import { prisma } from "../lib/prisma.ts";
import { getStatusesForCourse } from "./course.service.ts";
import { isUnlocked, type LessonStatus } from "./lesson-status.ts";
import { getHearts } from "./stats.service.ts";

/** API names for exercise types (match the frontend components). */
export const EXERCISE_TYPE_NAMES: Record<ExerciseType, string> = {
  MULTIPLE_CHOICE: "multiple-choice",
  CHARACTER_RECOGNITION: "character-recognition",
  CHARACTER_SOUND: "character-sound",
  MATCHING: "matching",
  FILL_IN_BLANK: "fill-in-blank",
  TRANSLATION: "translation",
  WORD_ORDER: "word-order",
};

const lessonInclude = {
  unit: {
    select: {
      id: true,
      title: true,
      sortOrder: true,
      course: {
        select: { id: true, title: true, language: { select: { code: true, name: true } } },
      },
    },
  },
  vocabulary: {
    select: { id: true, kind: true, script: true, romanization: true, meaning: true, topic: true },
    orderBy: { id: "asc" },
  },
  exercises: {
    orderBy: { sortOrder: "asc" },
    include: { options: { orderBy: { sortOrder: "asc" } } },
  },
} satisfies Prisma.LessonInclude;

export type ExerciseWithOptions = Prisma.ExerciseGetPayload<{ include: { options: true } }>;

/**
 * Converts a database exercise into what the browser may see:
 * no `isCorrect`, no word positions, no accepted translations, no explanation.
 */
/** A lesson learners may see: published, in a published unit of a published course (Phase 8). */
export const PUBLISHED_LESSON = {
  isPublished: true,
  unit: { isPublished: true, course: { isPublished: true } },
} as const;

export function toPublicExercise(exercise: ExerciseWithOptions) {
  const base = {
    id: exercise.id,
    type: EXERCISE_TYPE_NAMES[exercise.type],
    instruction: exercise.instruction,
  };
  const choices = [...exercise.options]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((option) => ({ id: option.id, text: option.text, subtext: option.subtext }));

  switch (exercise.type) {
    case "MULTIPLE_CHOICE":
      return {
        ...base,
        prompt: exercise.prompt,
        promptSubtext: exercise.promptSubtext,
        options: choices,
      };
    case "CHARACTER_SOUND":
      // Show a letter, pick its sound.
      return { ...base, character: exercise.prompt, options: choices };
    case "CHARACTER_RECOGNITION":
      // Show a sound, pick its letter.
      return {
        ...base,
        prompt: exercise.prompt,
        promptSubtext: exercise.promptSubtext,
        options: choices,
      };
    case "FILL_IN_BLANK":
      return {
        ...base,
        before: exercise.sentenceBefore ?? "",
        after: exercise.sentenceAfter ?? "",
        translation: exercise.translation ?? "",
        options: choices,
      };
    case "TRANSLATION":
      // Accepted answers stay on the server.
      return { ...base, prompt: exercise.prompt, promptSubtext: exercise.promptSubtext };
    case "WORD_ORDER":
      return { ...base, prompt: exercise.prompt, tokens: choices };
    case "MATCHING":
      // Matching gives instant feedback per tap, so the pairs are sent; the final result is still checked on the server.
      return {
        ...base,
        pairs: choices.map((choice) => ({
          id: choice.id,
          left: choice.text,
          leftSubtext: choice.subtext,
          right: exercise.options.find((option) => option.id === choice.id)?.matchText ?? "",
        })),
      };
  }
}

/** Throws 404/403 unless the learner may open this lesson. Returns its status. */
export async function assertLessonUnlocked(
  lesson: { id: string; courseId: string },
  userId: string,
): Promise<LessonStatus> {
  const statuses = await getStatusesForCourse(lesson.courseId, userId);
  const status = statuses.get(lesson.id);
  if (!isUnlocked(status)) {
    throw forbidden(
      "LESSON_LOCKED",
      "Complete the earlier lessons in this course to unlock this lesson",
    );
  }
  return status as LessonStatus;
}

/** Exercises answered correctly in the learner's current run through a lesson. */
export async function solvedInCurrentRun(
  db: Prisma.TransactionClient | typeof prisma,
  userId: string,
  lessonId: string,
  runStartedAt: Date,
): Promise<string[]> {
  const rows = await db.userExerciseAttempt.findMany({
    where: {
      userId,
      lessonId,
      isCorrect: true,
      source: "LESSON",
      createdAt: { gte: runStartedAt },
    },
    select: { exerciseId: true },
    distinct: ["exerciseId"],
  });
  return rows.map((row) => row.exerciseId);
}

type ProgressRow = Prisma.UserLessonProgressGetPayload<object>;

/** The learner's progress in one lesson, in the shape the API returns everywhere. */
export function toLessonProgressDto(
  lessonId: string,
  row: ProgressRow | null,
  completedExerciseIds: string[],
  totalExercises: number,
) {
  return {
    lessonId,
    status: row?.status ?? ("NOT_STARTED" as const),
    startedAt: row?.startedAt ?? null,
    runStartedAt: row?.runStartedAt ?? null,
    lastActivityAt: row?.lastActivityAt ?? null,
    completedAt: row?.completedAt ?? null,
    timesCompleted: row?.timesCompleted ?? 0,
    correctAttempts: row?.correctAttempts ?? 0,
    incorrectAttempts: row?.incorrectAttempts ?? 0,
    accuracy: row?.accuracy ?? null,
    /** Exercises answered correctly in the current run (used to resume). */
    completedExerciseIds,
    completedExercises: completedExerciseIds.length,
    totalExercises,
  };
}

async function loadLesson(lessonId: string) {
  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, ...PUBLISHED_LESSON },
    include: lessonInclude,
  });
  if (!lesson) throw notFound("LESSON_NOT_FOUND", "Lesson not found");
  return lesson;
}

export async function getLessonForLearner(lessonId: string, userId: string) {
  const lesson = await loadLesson(lessonId);
  const status = await assertLessonUnlocked(
    { id: lesson.id, courseId: lesson.unit.course.id },
    userId,
  );

  const row = await prisma.userLessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });
  const solved = row ? await solvedInCurrentRun(prisma, userId, lessonId, row.runStartedAt) : [];

  return {
    id: lesson.id,
    title: lesson.title,
    introText: lesson.introText,
    kind: lesson.kind,
    status,
    unit: { id: lesson.unit.id, number: lesson.unit.sortOrder, title: lesson.unit.title },
    course: {
      id: lesson.unit.course.id,
      title: lesson.unit.course.title,
      language: lesson.unit.course.language,
    },
    vocabulary: lesson.vocabulary,
    exercises: lesson.exercises.map(toPublicExercise),
    progress: toLessonProgressDto(lesson.id, row, solved, lesson.exercises.length),
  };
}

/**
 * POST /api/lessons/:id/start
 *  - first time: creates the progress row (status IN_PROGRESS) → "lesson started"
 *  - lesson in progress: resumes where the learner stopped (or starts over with restart=true)
 *  - lesson completed: starts a new practice run (the lesson stays COMPLETED)
 */
export async function startLesson(lessonId: string, userId: string, restart: boolean) {
  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, ...PUBLISHED_LESSON },
    select: {
      id: true,
      unit: { select: { courseId: true } },
      _count: { select: { exercises: true } },
    },
  });
  if (!lesson) throw notFound("LESSON_NOT_FOUND", "Lesson not found");
  await assertLessonUnlocked({ id: lesson.id, courseId: lesson.unit.courseId }, userId);

  const now = new Date();
  const existing = await prisma.userLessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });
  const newRun = !existing || restart || existing.status === "COMPLETED";

  const row = existing
    ? await prisma.userLessonProgress.update({
        where: { id: existing.id },
        data: { lastActivityAt: now, ...(newRun ? { runStartedAt: now } : {}) },
      })
    : await prisma.userLessonProgress.create({
        data: { userId, lessonId, startedAt: now, runStartedAt: now, lastActivityAt: now },
      });

  const solved = newRun ? [] : await solvedInCurrentRun(prisma, userId, lessonId, row.runStartedAt);
  return {
    resumed: !newRun,
    progress: toLessonProgressDto(lessonId, row, solved, lesson._count.exercises),
    /** Hearts right now (with refills) — 0 means lesson answers are refused until a refill. */
    hearts: await getHearts(userId),
  };
}
