// One lesson with its intro words and exercises — WITHOUT the answers.
import type { ExerciseType, Prisma } from "../generated/prisma/client.ts";
import { forbidden, notFound } from "../lib/http-error.ts";
import { prisma } from "../lib/prisma.ts";
import { getStatusesForCourse } from "./course.service.ts";

/** API names for exercise types (match the frontend components). */
export const EXERCISE_TYPE_NAMES: Record<ExerciseType, string> = {
  MULTIPLE_CHOICE: "multiple-choice",
  CHARACTER_RECOGNITION: "character-recognition",
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

type LessonWithContent = Prisma.LessonGetPayload<{ include: typeof lessonInclude }>;
type ExerciseWithOptions = LessonWithContent["exercises"][number];

/** Converts a database exercise into what the browser may see (no isCorrect, no positions). */
export function toPublicExercise(exercise: ExerciseWithOptions) {
  const base = {
    id: exercise.id,
    type: EXERCISE_TYPE_NAMES[exercise.type],
    instruction: exercise.instruction,
  };
  const choices = exercise.options.map((option) => ({
    id: option.id,
    text: option.text,
    subtext: option.subtext,
  }));

  switch (exercise.type) {
    case "MULTIPLE_CHOICE":
      return {
        ...base,
        prompt: exercise.prompt,
        promptSubtext: exercise.promptSubtext,
        options: choices,
      };
    case "CHARACTER_RECOGNITION":
      return { ...base, character: exercise.prompt, options: choices };
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
        pairs: exercise.options.map((option) => ({
          id: option.id,
          left: option.text,
          leftSubtext: option.subtext,
          right: option.matchText ?? "",
        })),
      };
  }
}

export async function getLessonForLearner(lessonId: string, userId: string) {
  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, isPublished: true },
    include: lessonInclude,
  });
  if (!lesson) throw notFound("LESSON_NOT_FOUND", "Lesson not found");

  const statuses = await getStatusesForCourse(lesson.unit.course.id, userId);
  const status = statuses.get(lesson.id) ?? "locked";
  if (status === "locked") {
    throw forbidden(
      "LESSON_LOCKED",
      "Complete the earlier lessons in this course to unlock this lesson",
    );
  }

  const correctAttempts = await prisma.userExerciseAttempt.findMany({
    where: { userId, lessonId, isCorrect: true },
    select: { exerciseId: true },
    distinct: ["exerciseId"],
  });

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
    progress: {
      completedExerciseIds: correctAttempts.map((attempt) => attempt.exerciseId),
      totalExercises: lesson.exercises.length,
    },
  };
}
