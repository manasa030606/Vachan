// XP, levels, streaks, hearts, daily goals and badges — reading them and updating them
// after every answer. The RULES are pure functions in ./gamification/*; the NUMBERS are in
// config/gamification.ts. This file only loads/saves rows.
import { GAMIFICATION, type DailyGoalKey } from "../config/gamification.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import { HttpError } from "../lib/http-error.ts";
import { prisma } from "../lib/prisma.ts";
import {
  newlyEarned,
  progressTowards,
  type AchievementMetrics,
} from "./gamification/achievements.ts";
import { lastDates, localDate } from "./gamification/dates.ts";
import { changeHearts, refillHearts } from "./gamification/hearts.ts";
import { levelFor } from "./gamification/levels.ts";
import { recordActiveDay, visibleStreak, type StreakChange } from "./gamification/streak.ts";
import { xpForAnswer, type AnswerOutcome } from "./gamification/xp.ts";

type Db = Prisma.TransactionClient | typeof prisma;

async function getOrCreateStats(db: Db, userId: string) {
  return db.userStats.upsert({
    where: { userId },
    update: {},
    create: { userId, hearts: GAMIFICATION.hearts.initial, heartsUpdatedAt: new Date() },
  });
}

async function getProfileSettings(db: Db, userId: string) {
  const profile = await db.userProfile.findUnique({
    where: { userId },
    select: { timeZone: true, dailyGoal: true },
  });
  return {
    timeZone: profile?.timeZone ?? GAMIFICATION.streak.defaultTimeZone,
    dailyGoalXp: GAMIFICATION.dailyGoalXp[(profile?.dailyGoal ?? "REGULAR") as DailyGoalKey],
  };
}

function heartsDto(hearts: { hearts: number; nextHeartAt: Date | null }) {
  return {
    current: hearts.hearts,
    max: GAMIFICATION.hearts.max,
    nextHeartAt: hearts.nextHeartAt,
    refillMinutes: GAMIFICATION.hearts.refillMinutes,
  };
}

/** Throws 403 OUT_OF_HEARTS when the learner has no hearts left (lesson answers only). */
export async function assertHasHearts(db: Db, userId: string, now = new Date()) {
  const stats = await getOrCreateStats(db, userId);
  const hearts = refillHearts(
    { hearts: stats.hearts, updatedAt: stats.heartsUpdatedAt },
    now,
    GAMIFICATION.hearts,
  );
  if (hearts.hearts <= 0) {
    throw new HttpError(
      403,
      "OUT_OF_HEARTS",
      "You're out of hearts. Review your mistakes to earn one back, or wait for a refill.",
      { nextHeartAt: hearts.nextHeartAt },
    );
  }
}

/** The numbers badges are checked against. */
async function achievementMetrics(
  db: Db,
  userId: string,
  stats: {
    totalXp: number;
    longestStreak: number;
    perfectLessons: number;
    mistakesCleared: number;
    dailyGoalsMet: number;
  },
): Promise<AchievementMetrics> {
  const [completed, units] = await Promise.all([
    db.userLessonProgress.findMany({
      where: { userId, status: "COMPLETED", placedOut: false },
      select: { lessonId: true },
    }),
    db.unit.findMany({
      where: { course: { isPublished: true } },
      select: { lessons: { where: { isPublished: true }, select: { id: true } } },
    }),
  ]);
  const done = new Set(completed.map((row) => row.lessonId));
  return {
    LESSONS_COMPLETED: done.size,
    TOTAL_XP: stats.totalXp,
    LONGEST_STREAK: stats.longestStreak,
    UNITS_COMPLETED: units.filter(
      (unit) => unit.lessons.length > 0 && unit.lessons.every((lesson) => done.has(lesson.id)),
    ).length,
    PERFECT_LESSONS: stats.perfectLessons,
    MISTAKES_CLEARED: stats.mistakesCleared,
    DAILY_GOALS_MET: stats.dailyGoalsMet,
  };
}

/** Unlocks every badge whose rule is now met. Returns the new ones. */
async function unlockAchievements(db: Db, userId: string, metrics: AchievementMetrics) {
  const [rules, unlocked] = await Promise.all([
    db.achievement.findMany({ orderBy: { sortOrder: "asc" } }),
    db.userAchievement.findMany({
      where: { userId },
      select: { achievement: { select: { code: true } } },
    }),
  ]);
  const codes = newlyEarned(rules, metrics, new Set(unlocked.map((row) => row.achievement.code)));
  const earned = rules.filter((rule) => codes.includes(rule.code));
  if (earned.length > 0) {
    await db.userAchievement.createMany({
      data: earned.map((rule) => ({ userId, achievementId: rule.id })),
      skipDuplicates: true,
    });
  }
  return earned.map((rule) => ({
    code: rule.code,
    title: rule.title,
    description: rule.description,
    icon: rule.icon,
  }));
}

export type AnswerRewardInput = {
  userId: string;
  lessonId: string;
  exerciseId: string;
  isCorrect: boolean;
  outcome: AnswerOutcome;
  /** Review answers only: this answer cleared an open mistake. */
  clearedMistake: boolean;
  now?: Date;
};

/**
 * Runs inside the attempt transaction. Applies, in order:
 * hearts → XP (+ XpEvent rows) → daily activity & goal → streak → counters → badges.
 */
export async function applyAnswerRewards(db: Db, input: AnswerRewardInput) {
  const now = input.now ?? new Date();
  const { outcome } = input;
  const [stats, settings] = await Promise.all([
    getOrCreateStats(db, input.userId),
    getProfileSettings(db, input.userId),
  ]);
  const today = localDate(now, settings.timeZone);

  // 1. Hearts
  const heartDelta =
    outcome.mode === "lesson" && !input.isCorrect
      ? -GAMIFICATION.hearts.lossPerMistake
      : outcome.mode === "review" && input.isCorrect
        ? GAMIFICATION.hearts.reviewRestore
        : 0;
  const hearts = changeHearts(
    { hearts: stats.hearts, updatedAt: stats.heartsUpdatedAt },
    heartDelta,
    now,
    GAMIFICATION.hearts,
  );

  // 2. XP
  const awards = xpForAnswer(outcome, GAMIFICATION.xp);
  const xpEarned = awards.reduce((sum, award) => sum + award.amount, 0);
  if (awards.length > 0) {
    await db.xpEvent.createMany({
      data: awards.map((award) => ({
        userId: input.userId,
        amount: award.amount,
        reason: award.reason,
        lessonId: input.lessonId,
        exerciseId: input.exerciseId,
        localDate: today,
        createdAt: now,
      })),
    });
  }
  const totalXp = stats.totalXp + xpEarned;
  const levelBefore = levelFor(stats.totalXp, GAMIFICATION.levelThresholds);
  const level = levelFor(totalXp, GAMIFICATION.levelThresholds);

  // 3. Daily activity + daily goal
  const runCompleted = outcome.mode === "lesson" && outcome.runCompleted;
  const day = await db.userDailyActivity.upsert({
    where: { userId_date: { userId: input.userId, date: today } },
    create: {
      userId: input.userId,
      date: today,
      xpEarned,
      exercisesAnswered: 1,
      lessonsCompleted: runCompleted ? 1 : 0,
    },
    update: {
      xpEarned: { increment: xpEarned },
      exercisesAnswered: { increment: 1 },
      lessonsCompleted: { increment: runCompleted ? 1 : 0 },
    },
  });
  const goalJustMet = !day.goalMet && day.xpEarned >= settings.dailyGoalXp;
  if (goalJustMet) {
    await db.userDailyActivity.update({ where: { id: day.id }, data: { goalMet: true } });
  }

  // 4. Streak (a day counts once the learner earns XP)
  let streak = {
    currentStreak: stats.currentStreak,
    longestStreak: stats.longestStreak,
    lastActiveDate: stats.lastActiveDate,
  };
  let streakChange: StreakChange | "none" = "none";
  if (day.xpEarned >= GAMIFICATION.streak.minXpForActiveDay) {
    const result = recordActiveDay(streak, today);
    streak = result.state;
    streakChange = result.change;
  }

  // 5. Save
  const perfect = outcome.mode === "lesson" && outcome.runCompleted && outcome.perfectRun;
  const saved = await db.userStats.update({
    where: { id: stats.id },
    data: {
      totalXp,
      hearts: hearts.hearts,
      heartsUpdatedAt: hearts.updatedAt,
      ...streak,
      perfectLessons: { increment: perfect ? 1 : 0 },
      mistakesCleared: { increment: input.clearedMistake ? 1 : 0 },
      dailyGoalsMet: { increment: goalJustMet ? 1 : 0 },
    },
  });

  // 6. Badges
  const newAchievements = await unlockAchievements(
    db,
    input.userId,
    await achievementMetrics(db, input.userId, saved),
  );

  return {
    xpEarned,
    awards,
    totalXp,
    level,
    leveledUp: level.level > levelBefore.level,
    hearts: heartsDto(hearts),
    streak: {
      current: visibleStreak(streak, today),
      longest: streak.longestStreak,
      change: streakChange,
    },
    dailyGoal: {
      targetXp: settings.dailyGoalXp,
      earnedToday: day.xpEarned,
      completed: day.xpEarned >= settings.dailyGoalXp,
      justCompleted: goalJustMet,
    },
    newAchievements,
  };
}

export type AnswerRewards = Awaited<ReturnType<typeof applyAnswerRewards>>;

/** Hearts right now (with refills), for lesson start / UI. */
export async function getHearts(userId: string, now = new Date()) {
  const stats = await getOrCreateStats(prisma, userId);
  return heartsDto(
    refillHearts(
      { hearts: stats.hearts, updatedAt: stats.heartsUpdatedAt },
      now,
      GAMIFICATION.hearts,
    ),
  );
}

/** GET /api/streak */
export async function getStreak(userId: string, now = new Date()) {
  const [stats, settings] = await Promise.all([
    getOrCreateStats(prisma, userId),
    getProfileSettings(prisma, userId),
  ]);
  const today = localDate(now, settings.timeZone);
  const week = lastDates(today, 7);
  const days = await prisma.userDailyActivity.findMany({
    where: { userId, date: { in: week } },
    select: { date: true, xpEarned: true, goalMet: true },
  });
  const byDate = new Map(days.map((day) => [day.date, day]));
  return {
    current: visibleStreak(stats, today),
    longest: stats.longestStreak,
    lastActiveDate: stats.lastActiveDate,
    today,
    timeZone: settings.timeZone,
    activeToday: stats.lastActiveDate === today,
    /** The last 7 local days, oldest first. */
    week: week.map((date) => ({
      date,
      xpEarned: byDate.get(date)?.xpEarned ?? 0,
      active: (byDate.get(date)?.xpEarned ?? 0) >= GAMIFICATION.streak.minXpForActiveDay,
      goalMet: byDate.get(date)?.goalMet ?? false,
    })),
  };
}

/** GET /api/achievements */
export async function getAchievements(userId: string) {
  const stats = await getOrCreateStats(prisma, userId);
  const [rules, unlocked, metrics] = await Promise.all([
    prisma.achievement.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.userAchievement.findMany({ where: { userId } }),
    achievementMetrics(prisma, userId, stats),
  ]);
  const unlockedAt = new Map(unlocked.map((row) => [row.achievementId, row.unlockedAt]));
  const achievements = rules.map((rule) => ({
    code: rule.code,
    title: rule.title,
    description: rule.description,
    icon: rule.icon,
    metric: rule.metric,
    threshold: rule.threshold,
    value: Math.min(metrics[rule.metric], rule.threshold),
    progress: progressTowards(rule, metrics),
    unlocked: unlockedAt.has(rule.id),
    unlockedAt: unlockedAt.get(rule.id) ?? null,
  }));
  return {
    unlockedCount: achievements.filter((achievement) => achievement.unlocked).length,
    total: achievements.length,
    achievements,
  };
}

/** GET /api/stats — everything the Home screen needs in one call. */
export async function getStatsSummary(userId: string, now = new Date()) {
  // Create the stats row first (the helpers below would otherwise race to create it).
  const stats = await getOrCreateStats(prisma, userId);
  const [settings, streak, achievements] = await Promise.all([
    getProfileSettings(prisma, userId),
    getStreak(userId, now),
    getAchievements(userId),
  ]);
  const today = streak.today;
  const todayRow = streak.week[streak.week.length - 1];
  return {
    xp: {
      total: stats.totalXp,
      today: todayRow.xpEarned,
      ...levelFor(stats.totalXp, GAMIFICATION.levelThresholds),
    },
    streak,
    hearts: heartsDto(
      refillHearts(
        { hearts: stats.hearts, updatedAt: stats.heartsUpdatedAt },
        now,
        GAMIFICATION.hearts,
      ),
    ),
    dailyGoal: {
      date: today,
      targetXp: settings.dailyGoalXp,
      earnedToday: todayRow.xpEarned,
      completed: todayRow.xpEarned >= settings.dailyGoalXp,
    },
    achievements: {
      unlockedCount: achievements.unlockedCount,
      total: achievements.total,
      recent: achievements.achievements
        .filter((achievement) => achievement.unlocked)
        .sort((a, b) => (b.unlockedAt?.getTime() ?? 0) - (a.unlockedAt?.getTime() ?? 0))
        .slice(0, 3),
    },
    /** The configured rules, so the UI can explain them. */
    rules: {
      xp: GAMIFICATION.xp,
      hearts: GAMIFICATION.hearts,
      levelThresholds: GAMIFICATION.levelThresholds,
      dailyGoalXp: GAMIFICATION.dailyGoalXp,
    },
  };
}
