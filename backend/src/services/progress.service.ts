// Submitting answers and reading learning progress.
//
// Progress rules:
//   - Every answer is saved as a UserExerciseAttempt (source LESSON or REVIEW).
//   - Lesson answers update the lesson's counters (correct / incorrect / accuracy / last activity).
//   - A run is finished when every exercise of the lesson was answered correctly since the run
//     started (mistakes come back at the end of the lesson until they are right).
//     The first finished run marks the lesson COMPLETED, which unlocks the next lesson.
//   - Review answers are saved too, but do not change lesson counters; a correct review answer
//     clears that exercise from the mistake list (see review.service.ts).
//   - Every answer then updates XP, hearts, streak, daily goal and badges (stats.service.ts).
//     With 0 hearts, lesson answers are refused (403 OUT_OF_HEARTS); review answers still work.
import type { Prisma } from "../generated/prisma/client.ts";
import { notFound } from "../lib/http-error.ts";
import { prisma } from "../lib/prisma.ts";
import type { AttemptAnswer, AttemptMode } from "../schemas/content.schemas.ts";
import { checkAnswer } from "./answer-checker.ts";
import { isOpenMistake } from "./review.service.ts";
import { applyAnswerRewards, assertHasHearts } from "./stats.service.ts";
import {
  EXERCISE_TYPE_NAMES,
  assertLessonUnlocked,
  solvedInCurrentRun,
  toLessonProgressDto,
} from "./lesson.service.ts";

/** Percentage of correct answers, or null when nothing was answered yet. */
export function accuracyOf(correct: number, total: number): number | null {
  return total === 0 ? null : Math.round((correct / total) * 100);
}

export async function submitAttempt(
  exerciseId: string,
  userId: string,
  answer: AttemptAnswer,
  mode: AttemptMode,
) {
  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
    include: {
      options: true,
      lesson: {
        select: {
          id: true,
          isPublished: true,
          unit: {
            select: {
              courseId: true,
              isPublished: true,
              course: { select: { isPublished: true } },
            },
          },
          _count: { select: { exercises: true } },
        },
      },
    },
  });
  if (
    !exercise ||
    !exercise.lesson.isPublished ||
    !exercise.lesson.unit.isPublished ||
    !exercise.lesson.unit.course.isPublished
  ) {
    throw notFound("EXERCISE_NOT_FOUND", "Exercise not found");
  }
  const lessonId = exercise.lesson.id;
  await assertLessonUnlocked({ id: lessonId, courseId: exercise.lesson.unit.courseId }, userId);

  if (mode === "lesson") await assertHasHearts(prisma, userId);
  const result = checkAnswer(exercise, answer);
  const now = new Date();
  const totalExercises = exercise.lesson._count.exercises;

  return prisma.$transaction(
    async (tx) => {
      // Answering without calling /start first is allowed: the lesson is started implicitly.
      const existing = await tx.userLessonProgress.findUnique({
        where: { userId_lessonId: { userId, lessonId } },
      });
      const row =
        existing ??
        (await tx.userLessonProgress.create({
          data: { userId, lessonId, startedAt: now, runStartedAt: now, lastActivityAt: now },
        }));
      const solvedBefore = await solvedInCurrentRun(tx, userId, lessonId, row.runStartedAt);
      const clearedMistake =
        mode === "review" && result.isCorrect && (await isOpenMistake(tx, userId, exerciseId));

      const attempt = await tx.userExerciseAttempt.create({
        data: {
          userId,
          exerciseId,
          lessonId,
          answer: answer as Prisma.InputJsonValue,
          isCorrect: result.isCorrect,
          source: mode === "review" ? "REVIEW" : "LESSON",
        },
      });

      let updated = row;
      let solved = solvedBefore;
      let runCompleted = false;
      let newlySolved = false;
      let perfectRun = false;
      // A lesson unlocked by the placement test counts as "first completion" when really finished.
      const firstCompletion = row.status !== "COMPLETED" || row.placedOut;

      if (mode === "review") {
        updated = await tx.userLessonProgress.update({
          where: { id: row.id },
          data: { lastActivityAt: now },
        });
      } else {
        newlySolved = result.isCorrect && !solvedBefore.includes(exerciseId);
        solved = newlySolved ? [...solvedBefore, exerciseId] : solvedBefore;
        runCompleted = newlySolved && solved.length >= totalExercises;
        if (runCompleted) {
          const mistakesThisRun = await tx.userExerciseAttempt.count({
            where: {
              userId,
              lessonId,
              source: "LESSON",
              isCorrect: false,
              createdAt: { gte: row.runStartedAt },
            },
          });
          perfectRun = mistakesThisRun === 0;
        }

        const correct = row.correctAttempts + (result.isCorrect ? 1 : 0);
        const incorrect = row.incorrectAttempts + (result.isCorrect ? 0 : 1);
        updated = await tx.userLessonProgress.update({
          where: { id: row.id },
          data: {
            correctAttempts: correct,
            incorrectAttempts: incorrect,
            accuracy: accuracyOf(correct, correct + incorrect),
            lastActivityAt: now,
            ...(runCompleted
              ? {
                  status: "COMPLETED",
                  placedOut: false,
                  timesCompleted: { increment: 1 },
                  // Keep the date of the FIRST completion.
                  completedAt: row.completedAt ?? now,
                }
              : {}),
          },
        });
      }

      const rewards = await applyAnswerRewards(tx, {
        userId,
        lessonId,
        exerciseId,
        isCorrect: result.isCorrect,
        clearedMistake,
        now,
        outcome:
          mode === "review"
            ? { mode: "review", isCorrect: result.isCorrect }
            : { mode: "lesson", newlySolved, runCompleted, firstCompletion, perfectRun },
      });

      return {
        attempt: {
          id: attempt.id,
          exerciseId,
          mode,
          isCorrect: result.isCorrect,
          typoCorrection: result.typoCorrection,
          correctAnswer: result.correctAnswer,
          /** Teaching note for the feedback banner (sent only after answering). */
          explanation: exercise.explanation,
          createdAt: attempt.createdAt,
        },
        lessonProgress: {
          ...toLessonProgressDto(lessonId, updated, solved, totalExercises),
          /** True only for the answer that finished the run. */
          justCompleted: runCompleted,
        },
        /** XP, level, hearts, streak, daily goal and new badges after this answer. */
        rewards,
      };
    },
    { timeout: 15_000 },
  );
}

export async function getProgressSummary(userId: string) {
  const [progressRows, attemptCounts, lastAttempt, courses] = await Promise.all([
    prisma.userLessonProgress.findMany({
      where: { userId },
      orderBy: { lastActivityAt: "desc" },
      include: {
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
            _count: { select: { exercises: true } },
          },
        },
      },
    }),
    prisma.userExerciseAttempt.groupBy({
      by: ["isCorrect"],
      where: { userId },
      _count: { _all: true },
    }),
    prisma.userExerciseAttempt.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
    prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { language: { sortOrder: "asc" } },
      select: {
        id: true,
        title: true,
        language: { select: { code: true, name: true } },
        units: {
          where: { isPublished: true },
          select: { lessons: { where: { isPublished: true }, select: { id: true } } },
        },
      },
    }),
  ]);

  const statusById = new Map(progressRows.map((row) => [row.lessonId, row.status]));
  const correct = attemptCounts.find((row) => row.isCorrect)?._count._all ?? 0;
  const total = attemptCounts.reduce((sum, row) => sum + row._count._all, 0);
  const latestProgress = progressRows[0]?.lastActivityAt ?? null;
  const lastActivityAt =
    [latestProgress, lastAttempt?.createdAt ?? null]
      .filter((date): date is Date => date !== null)
      .sort((a, b) => b.getTime() - a.getTime())[0] ?? null;
  const resumeRow = progressRows.find((row) => row.status === "IN_PROGRESS");

  return {
    totals: {
      lessonsCompleted: progressRows.filter((row) => row.status === "COMPLETED").length,
      lessonsInProgress: progressRows.filter((row) => row.status === "IN_PROGRESS").length,
      exercisesAnswered: total,
      correctAnswers: correct,
      incorrectAnswers: total - correct,
      accuracy: accuracyOf(correct, total),
      lastActivityAt,
    },
    /** The unfinished lesson the learner touched most recently ("continue where you left off"). */
    resume: resumeRow
      ? {
          lessonId: resumeRow.lessonId,
          title: resumeRow.lesson.title,
          unitTitle: resumeRow.lesson.unit.title,
          courseId: resumeRow.lesson.unit.course.id,
          language: resumeRow.lesson.unit.course.language,
          lastActivityAt: resumeRow.lastActivityAt,
        }
      : null,
    courses: courses.map((course) => {
      const lessonIds = course.units.flatMap((unit) => unit.lessons.map((lesson) => lesson.id));
      return {
        courseId: course.id,
        title: course.title,
        language: course.language,
        completedLessons: lessonIds.filter((id) => statusById.get(id) === "COMPLETED").length,
        inProgressLessons: lessonIds.filter((id) => statusById.get(id) === "IN_PROGRESS").length,
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
      lastActivityAt: row.lastActivityAt,
      completedAt: row.completedAt,
      timesCompleted: row.timesCompleted,
      correctAttempts: row.correctAttempts,
      incorrectAttempts: row.incorrectAttempts,
      accuracy: row.accuracy,
      totalExercises: row.lesson._count.exercises,
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

  const [row, attempts] = await Promise.all([
    prisma.userLessonProgress.findUnique({ where: { userId_lessonId: { userId, lessonId } } }),
    prisma.userExerciseAttempt.findMany({
      where: { userId, lessonId },
      orderBy: { createdAt: "asc" },
      select: { exerciseId: true, isCorrect: true, source: true, createdAt: true },
    }),
  ]);
  const solved = row ? await solvedInCurrentRun(prisma, userId, lessonId, row.runStartedAt) : [];

  const exercises = lesson.exercises.map((exercise) => {
    const mine = attempts.filter((attempt) => attempt.exerciseId === exercise.id);
    const inLessons = mine.filter((attempt) => attempt.source === "LESSON");
    const last = mine.at(-1);
    return {
      exerciseId: exercise.id,
      type: EXERCISE_TYPE_NAMES[exercise.type],
      attempts: inLessons.length,
      correctAttempts: inLessons.filter((attempt) => attempt.isCorrect).length,
      incorrectAttempts: inLessons.filter((attempt) => !attempt.isCorrect).length,
      reviewAttempts: mine.length - inLessons.length,
      solvedInCurrentRun: solved.includes(exercise.id),
      lastAttemptAt: last?.createdAt ?? null,
      lastAttemptCorrect: last?.isCorrect ?? null,
    };
  });

  return {
    title: lesson.title,
    ...toLessonProgressDto(lesson.id, row, solved, lesson.exercises.length),
    exercises,
  };
}
