// Phase 8 — learning analytics for admins.
//
// PRIVACY: everything here is an aggregate (counts, rates, averages). No names, emails, user ids
// or individual answers leave this file, and nothing new is tracked: the numbers are computed
// from data the app already stores to work (progress, attempts, daily activity, chats).
// Exercises in "common mistakes" are content, not people.
import { Prisma } from "../../generated/prisma/client.ts";
import { prisma } from "../../lib/prisma.ts";

const DAY = 24 * 60 * 60_000;
const pct = (part: number, whole: number) =>
  whole > 0 ? Math.round((part / whole) * 1000) / 10 : null;
const isoDate = (date: Date) => date.toISOString().slice(0, 10);

export async function getAnalytics(input: { days: number; language?: string }) {
  const since = new Date(Date.now() - input.days * DAY);
  const sinceDate = isoDate(since);
  const lang = input.language;
  const attemptLanguage: Prisma.UserExerciseAttemptWhereInput = lang
    ? { exercise: { lesson: { unit: { course: { language: { code: lang } } } } } }
    : {};
  const progressLanguage: Prisma.UserLessonProgressWhereInput = lang
    ? { lesson: { unit: { course: { language: { code: lang } } } } }
    : {};

  const [
    learners,
    newLearners,
    activeDaily,
    activeToday,
    active7,
    activeWindow,
    attempts,
    attemptsByType,
    mistakes,
    completedInWindow,
    startedInWindow,
    languageLearners,
    streakRows,
    tutor,
    tutorStatus,
    speaking,
    speakingVerdicts,
    conversations,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "LEARNER" } }),
    prisma.user.count({ where: { role: "LEARNER", createdAt: { gte: since } } }),
    // Learners active per day (any exercise answered that day).
    prisma.$queryRaw<Array<{ date: string; learners: bigint }>>`
      SELECT "date", COUNT(DISTINCT "userId") AS learners
      FROM "UserDailyActivity" WHERE "date" >= ${sinceDate} AND "exercisesAnswered" > 0
      GROUP BY "date" ORDER BY "date"`,
    activeSince(isoDate(new Date())),
    activeSince(isoDate(new Date(Date.now() - 6 * DAY))),
    activeSince(sinceDate),
    prisma.userExerciseAttempt.groupBy({
      by: ["isCorrect"],
      where: { createdAt: { gte: since }, source: "LESSON", ...attemptLanguage },
      _count: { _all: true },
    }),
    prisma.$queryRaw<Array<{ type: string; total: bigint; correct: bigint }>>`
      SELECT e."type"::text AS type, COUNT(*) AS total, COUNT(*) FILTER (WHERE a."isCorrect") AS correct
      FROM "UserExerciseAttempt" a JOIN "Exercise" e ON e."id" = a."exerciseId"
      JOIN "Lesson" l ON l."id" = e."lessonId" JOIN "Unit" u ON u."id" = l."unitId"
      JOIN "Course" c ON c."id" = u."courseId" JOIN "Language" g ON g."id" = c."languageId"
      WHERE a."createdAt" >= ${since} AND a."source" = 'LESSON' ${lang ? Prisma.sql`AND g."code" = ${lang}` : Prisma.empty}
      GROUP BY e."type" ORDER BY total DESC`,
    prisma.$queryRaw<
      Array<{
        exerciseId: string;
        prompt: string;
        type: string;
        lesson: string;
        language: string;
        total: bigint;
        wrong: bigint;
      }>
    >`
      SELECT e."id" AS "exerciseId", e."prompt", e."type"::text AS type, l."title" AS lesson, g."code" AS language,
             COUNT(*) AS total, COUNT(*) FILTER (WHERE NOT a."isCorrect") AS wrong
      FROM "UserExerciseAttempt" a JOIN "Exercise" e ON e."id" = a."exerciseId"
      JOIN "Lesson" l ON l."id" = e."lessonId" JOIN "Unit" u ON u."id" = l."unitId"
      JOIN "Course" c ON c."id" = u."courseId" JOIN "Language" g ON g."id" = c."languageId"
      WHERE a."createdAt" >= ${since} ${lang ? Prisma.sql`AND g."code" = ${lang}` : Prisma.empty}
      GROUP BY e."id", e."prompt", e."type", l."title", g."code"
      HAVING COUNT(*) >= 3 AND COUNT(*) FILTER (WHERE NOT a."isCorrect") > 0
      ORDER BY wrong DESC, total DESC LIMIT 10`,
    prisma.userLessonProgress.count({
      where: { completedAt: { gte: since }, placedOut: false, ...progressLanguage },
    }),
    prisma.userLessonProgress.groupBy({
      by: ["status"],
      where: { startedAt: { gte: since }, placedOut: false, ...progressLanguage },
      _count: { _all: true },
    }),
    prisma.language.findMany({
      orderBy: { sortOrder: "asc" },
      select: { code: true, name: true, isActive: true, _count: { select: { learners: true } } },
    }),
    prisma.userStats.findMany({ select: { currentStreak: true, longestStreak: true } }),
    prisma.aIMessage.groupBy({
      by: ["role"],
      where: {
        createdAt: { gte: since },
        ...(lang ? { conversation: { languageCode: lang } } : {}),
      },
      _count: { _all: true },
      _avg: { latencyMs: true },
    }),
    prisma.aIMessage.groupBy({
      by: ["status"],
      where: {
        createdAt: { gte: since },
        role: "ASSISTANT",
        ...(lang ? { conversation: { languageCode: lang } } : {}),
      },
      _count: { _all: true },
    }),
    prisma.speechAttempt.aggregate({
      where: { createdAt: { gte: since }, ...(lang ? { languageCode: lang } : {}) },
      _count: { _all: true },
      _avg: { contentScore: true, audioDurationMs: true },
    }),
    prisma.speechAttempt.groupBy({
      by: ["contentVerdict"],
      where: { createdAt: { gte: since }, ...(lang ? { languageCode: lang } : {}) },
      _count: { _all: true },
    }),
    prisma.conversationSession.groupBy({
      by: ["scenario", "status"],
      where: { startedAt: { gte: since }, ...(lang ? { languageCode: lang } : {}) },
      _count: { _all: true },
      _avg: { learnerTurns: true },
    }),
  ]);

  // Attempts per language in the window (language usage).
  const attemptsPerLanguage = await prisma.$queryRaw<
    Array<{ code: string; attempts: bigint; learners: bigint }>
  >`
    SELECT g."code", COUNT(*) AS attempts, COUNT(DISTINCT a."userId") AS learners
    FROM "UserExerciseAttempt" a JOIN "Exercise" e ON e."id" = a."exerciseId"
    JOIN "Lesson" l ON l."id" = e."lessonId" JOIN "Unit" u ON u."id" = l."unitId"
    JOIN "Course" c ON c."id" = u."courseId" JOIN "Language" g ON g."id" = c."languageId"
    WHERE a."createdAt" >= ${since}
    GROUP BY g."code"`;
  const perLanguage = new Map(attemptsPerLanguage.map((row) => [row.code, row]));

  const correct = attempts.find((row) => row.isCorrect)?._count._all ?? 0;
  const incorrect = attempts.find((row) => !row.isCorrect)?._count._all ?? 0;
  const started = startedInWindow.reduce((sum, row) => sum + row._count._all, 0);
  const finished = startedInWindow.find((row) => row.status === "COMPLETED")?._count._all ?? 0;

  const buckets = [
    { label: "0 days", min: 0, max: 0 },
    { label: "1–2 days", min: 1, max: 2 },
    { label: "3–6 days", min: 3, max: 6 },
    { label: "7–29 days", min: 7, max: 29 },
    { label: "30+ days", min: 30, max: Infinity },
  ];
  const questions = tutor.find((row) => row.role === "USER")?._count._all ?? 0;
  const answers = tutor.find((row) => row.role === "ASSISTANT");
  const scenarioMap = new Map<
    string,
    { scenario: string; sessions: number; ended: number; avgReplies: number }
  >();
  for (const row of conversations) {
    const key = row.scenario.toLowerCase();
    const entry = scenarioMap.get(key) ?? { scenario: key, sessions: 0, ended: 0, avgReplies: 0 };
    const weightTotal = entry.sessions + row._count._all;
    entry.avgReplies =
      weightTotal > 0
        ? Math.round(
            ((entry.avgReplies * entry.sessions + (row._avg.learnerTurns ?? 0) * row._count._all) /
              weightTotal) *
              10,
          ) / 10
        : 0;
    entry.sessions = weightTotal;
    if (row.status === "ENDED") entry.ended += row._count._all;
    scenarioMap.set(key, entry);
  }

  return {
    window: { days: input.days, since: since.toISOString(), language: lang ?? null },
    privacy:
      "Aggregates only — computed from existing learning records. No names, emails or user ids.",
    learners: { total: learners, newInWindow: newLearners },
    activeLearners: {
      today: activeToday,
      last7Days: active7,
      inWindow: activeWindow,
      perDay: activeDaily.map((row) => ({ date: row.date, learners: Number(row.learners) })),
    },
    lessons: {
      completedInWindow,
      startedInWindow: started,
      completionRate: pct(finished, started),
      dropOff: await lessonDropOff(lang),
    },
    accuracy: {
      answers: correct + incorrect,
      percentCorrect: pct(correct, correct + incorrect),
      byExerciseType: attemptsByType.map((row) => ({
        type: row.type,
        answers: Number(row.total),
        percentCorrect: pct(Number(row.correct), Number(row.total)),
      })),
    },
    commonMistakes: mistakes.map((row) => ({
      exerciseId: row.exerciseId,
      prompt: row.prompt,
      type: row.type,
      lesson: row.lesson,
      language: row.language,
      answers: Number(row.total),
      wrong: Number(row.wrong),
      percentWrong: pct(Number(row.wrong), Number(row.total)),
    })),
    languages: languageLearners.map((language) => ({
      code: language.code,
      name: language.name,
      isActive: language.isActive,
      learnersStudying: language._count.learners,
      answersInWindow: Number(perLanguage.get(language.code)?.attempts ?? 0),
      activeLearnersInWindow: Number(perLanguage.get(language.code)?.learners ?? 0),
    })),
    streaks: {
      learnersWithStats: streakRows.length,
      averageCurrent:
        streakRows.length > 0
          ? Math.round(
              (streakRows.reduce((s, r) => s + r.currentStreak, 0) / streakRows.length) * 10,
            ) / 10
          : 0,
      longestEver: Math.max(0, ...streakRows.map((r) => r.longestStreak)),
      distribution: buckets.map((bucket) => ({
        label: bucket.label,
        learners: streakRows.filter(
          (r) => r.currentStreak >= bucket.min && r.currentStreak <= bucket.max,
        ).length,
      })),
    },
    tutor: {
      questions,
      averageAnswerMs: answers?._avg.latencyMs ? Math.round(answers._avg.latencyMs) : null,
      byStatus: tutorStatus.map((row) => ({
        status: (row.status ?? "UNKNOWN").toLowerCase(),
        answers: row._count._all,
      })),
    },
    speaking: {
      attempts: speaking._count._all,
      averageContentScore:
        speaking._avg.contentScore === null ? null : Math.round(speaking._avg.contentScore),
      averageRecordingMs:
        speaking._avg.audioDurationMs === null ? null : Math.round(speaking._avg.audioDurationMs),
      byVerdict: speakingVerdicts.map((row) => ({
        verdict: row.contentVerdict,
        attempts: row._count._all,
      })),
      conversations: [...scenarioMap.values()],
    },
  };
}

/** Distinct learners with activity on or after a local date (YYYY-MM-DD). */
async function activeSince(date: string) {
  const rows = await prisma.userDailyActivity.findMany({
    where: { date: { gte: date }, exercisesAnswered: { gt: 0 } },
    distinct: ["userId"],
    select: { userId: true },
  });
  return rows.length;
}

/**
 * Lesson drop-off for one language, in course order: how many learners started each lesson and
 * how many finished it (placement unlocks excluded). Without a language: the most-used course.
 */
async function lessonDropOff(language?: string) {
  const course = await prisma.course.findFirst({
    where: language ? { language: { code: language } } : {},
    orderBy: language ? { sortOrder: "asc" } : { language: { learners: { _count: "desc" } } },
    select: {
      title: true,
      language: { select: { code: true } },
      units: {
        orderBy: { sortOrder: "asc" },
        select: {
          sortOrder: true,
          lessons: { orderBy: { sortOrder: "asc" }, select: { id: true, title: true } },
        },
      },
    },
  });
  if (!course) return { course: null, lessons: [] };
  const lessonIds = course.units.flatMap((unit) => unit.lessons.map((lesson) => lesson.id));
  const rows = await prisma.userLessonProgress.groupBy({
    by: ["lessonId", "status"],
    where: { lessonId: { in: lessonIds }, placedOut: false },
    _count: { _all: true },
  });
  const count = (lessonId: string, status?: string) =>
    rows
      .filter((row) => row.lessonId === lessonId && (!status || row.status === status))
      .reduce((sum, row) => sum + row._count._all, 0);
  return {
    course: `${course.title} (${course.language.code})`,
    lessons: course.units.flatMap((unit) =>
      unit.lessons.map((lesson, index) => {
        const startedCount = count(lesson.id);
        const completed = count(lesson.id, "COMPLETED");
        return {
          lessonId: lesson.id,
          label: `U${unit.sortOrder}·L${index + 1} ${lesson.title}`,
          started: startedCount,
          completed,
          dropOffRate: pct(startedCount - completed, startedCount),
        };
      }),
    ),
  };
}
