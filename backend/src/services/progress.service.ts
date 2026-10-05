// Submitting answers and reading learning progress.
import type { Prisma } from "../generated/prisma/client.ts";
import { forbidden, notFound } from "../lib/http-error.ts";
import { prisma } from "../lib/prisma.ts";
import type { AttemptAnswer } from "../schemas/content.schemas.ts";
import { checkAnswer } from "./answer-checker.ts";
import { getStatusesForCourse } from "./course.service.ts";
import { EXERCISE_TYPE_NAMES } from "./lesson.service.ts";

/** Percentage of correct answers, or null when nothing was answered yet. */
function accuracy(correct: number, total: number): number | null {
  return total === 0 ? null : Math.round((correct / total) * 100);
}

/** Recalculates a learner's progress in one lesson after a new attempt. */
async function refreshLessonProgress(
  tx: Prisma.TransactionClient,
  userId: string,
  lessonId: string,
) {
  const [totalExercises, solved, attempts] = await Promise.all([
    tx.exercise.count({ where: { lessonId } }),
    tx.userExerciseAttempt.findMany({
      where: { userId, lessonId, isCorrect: true },
      select: { exerciseId: true },
      distinct: ["exerciseId"],
    }),
    tx.userExerciseAttempt.groupBy({
      by: ["isCorrect"],
      where: { userId, lessonId },
      _count: { _all: true },
    }),
  ]);

  // A lesson is completed once every exercise has been answered correctly at least once.
  const isComplete = solved.length >= totalExercises && totalExercises > 0;
  const existing = await tx.userLessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });
  const alreadyCompleted = existing?.status === "COMPLETED";

  const progress = await tx.userLessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: {
      userId,
      lessonId,
      status: isComplete ? "COMPLETED" : "IN_PROGRESS",
      completedAt: isComplete ? new Date() : null,
    },
    update: isComplete && !alreadyCompleted ? { status: "COMPLETED", completedAt: new Date() } : {},
  });

  const correct = attempts.find((row) => row.isCorrect)?._count._all ?? 0;
  const total = attempts.reduce((sum, row) => sum + row._count._all, 0);

  return {
    lessonId,
    status: progress.status,
    completedAt: progress.completedAt,
    completedExercises: solved.length,
    totalExercises,
    accuracy: accuracy(correct, total),
  };
}

export async function submitAttempt(exerciseId: string, userId: string, answer: AttemptAnswer) {
  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
    include: {
      options: true,
      lesson: { select: { id: true, isPublished: true, unit: { select: { courseId: true } } } },
    },
  });
  if (!exercise || !exercise.lesson.isPublished) {
    throw notFound("EXERCISE_NOT_FOUND", "Exercise not found");
  }

  const statuses = await getStatusesForCourse(exercise.lesson.unit.courseId, userId);
  if ((statuses.get(exercise.lesson.id) ?? "locked") === "locked") {
    throw forbidden(
      "LESSON_LOCKED",
      "Complete the earlier lessons in this course to unlock this lesson",
    );
  }

  const result = checkAnswer(exercise, answer);

  return prisma.$transaction(async (tx) => {
    const attempt = await tx.userExerciseAttempt.create({
      data: {
        userId,
        exerciseId,
        lessonId: exercise.lesson.id,
        answer: answer as Prisma.InputJsonValue,
        isCorrect: result.isCorrect,
      },
    });
    const lessonProgress = await refreshLessonProgress(tx, userId, exercise.lesson.id);

    return {
      attempt: {
        id: attempt.id,
        exerciseId,
        isCorrect: result.isCorrect,
        typoCorrection: result.typoCorrection,
        correctAnswer: result.correctAnswer,
        createdAt: attempt.createdAt,
      },
      lessonProgress,
    };
  });
}

export async function getProgressSummary(userId: string) {
  const [progressRows, attemptCounts, courses] = await Promise.all([
    prisma.userLessonProgress.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            unit: {
              select: { course: { select: { id: true, language: { select: { code: true } } } } },
            },
          },
        },
      },
    }),
    prisma.userExerciseAttempt.groupBy({
      by: ["isCorrect"],
      where: { userId },
      _count: { _all: true },
    }),
    prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { language: { sortOrder: "asc" } },
      select: {
        id: true,
        title: true,
        language: { select: { code: true, name: true } },
        units: { select: { lessons: { where: { isPublished: true }, select: { id: true } } } },
      },
    }),
  ]);

  const completedIds = new Set(
    progressRows.filter((row) => row.status === "COMPLETED").map((row) => row.lessonId),
  );
  const correct = attemptCounts.find((row) => row.isCorrect)?._count._all ?? 0;
  const total = attemptCounts.reduce((sum, row) => sum + row._count._all, 0);

  return {
    totals: {
      lessonsCompleted: completedIds.size,
      lessonsStarted: progressRows.length,
      exercisesAnswered: total,
      correctAnswers: correct,
      accuracy: accuracy(correct, total),
    },
    courses: courses.map((course) => {
      const lessonIds = course.units.flatMap((unit) => unit.lessons.map((lesson) => lesson.id));
      return {
        courseId: course.id,
        title: course.title,
        language: course.language,
        completedLessons: lessonIds.filter((id) => completedIds.has(id)).length,
        totalLessons: lessonIds.length,
      };
    }),
    lessons: progressRows.map((row) => ({
      lessonId: row.lessonId,
      title: row.lesson.title,
      courseId: row.lesson.unit.course.id,
      languageCode: row.lesson.unit.course.language.code,
      status: row.status,
      startedAt: row.startedAt,
      completedAt: row.completedAt,
    })),
  };
}

export async function getLessonProgress(userId: string, lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      title: true,
      exercises: { orderBy: { sortOrder: "asc" }, select: { id: true, type: true } },
    },
  });
  if (!lesson) throw notFound("LESSON_NOT_FOUND", "Lesson not found");

  const [progress, attempts] = await Promise.all([
    prisma.userLessonProgress.findUnique({ where: { userId_lessonId: { userId, lessonId } } }),
    prisma.userExerciseAttempt.findMany({
      where: { userId, lessonId },
      select: { exerciseId: true, isCorrect: true },
    }),
  ]);

  const exercises = lesson.exercises.map((exercise) => {
    const mine = attempts.filter((attempt) => attempt.exerciseId === exercise.id);
    return {
      exerciseId: exercise.id,
      type: EXERCISE_TYPE_NAMES[exercise.type],
      attempts: mine.length,
      correctAttempts: mine.filter((attempt) => attempt.isCorrect).length,
      solved: mine.some((attempt) => attempt.isCorrect),
    };
  });
  const correct = attempts.filter((attempt) => attempt.isCorrect).length;

  return {
    lessonId: lesson.id,
    title: lesson.title,
    status: progress?.status ?? "NOT_STARTED",
    startedAt: progress?.startedAt ?? null,
    completedAt: progress?.completedAt ?? null,
    completedExercises: exercises.filter((exercise) => exercise.solved).length,
    totalExercises: exercises.length,
    accuracy: accuracy(correct, attempts.length),
    exercises,
  };
}
