// API tests for gamification (XP, levels, streaks, hearts, daily goal, badges,
// recommendations) and the placement test. Needs a migrated + seeded database.
// Day changes are simulated by editing UserStats.lastActiveDate (the app has no fake clock).
// Run with:  npm run test:api -w backend
import assert from "node:assert/strict";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { after, before, describe, it } from "node:test";
import { createApp } from "../src/app.ts";
import { prisma } from "../src/lib/prisma.ts";
import { addDays, localDate } from "../src/services/gamification/dates.ts";

type Json = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

let server: Server;
let base = "";
const users: string[] = [];
const TZ = "Asia/Kolkata";
const today = () => localDate(new Date(), TZ);

async function call(token: string, method: string, path: string, body?: unknown) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, body: (await response.json()) as Json };
}

/** Registers a fresh learner and finishes onboarding for the given language. */
async function newUser(languageCode: string, selfAssessment = "few-words") {
  const email = `gam-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@example.com`;
  users.push(email);
  const response = await fetch(`${base}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Game Tester", email, password: "learn1234" }),
  });
  const { token, user } = (await response.json()) as Json;
  await call(token, "PATCH", "/me", {
    languageCode,
    timeZone: TZ,
    dailyGoal: "regular",
    selfAssessment,
    onboardingDone: true,
  });
  return { token: token as string, userId: user.id as string };
}

/** Builds a right (or deliberately wrong) answer for an exercise from the database. */
async function answerFor(exerciseId: string, correct = true) {
  const exercise = await prisma.exercise.findUniqueOrThrow({
    where: { id: exerciseId },
    include: { options: true },
  });
  const options = exercise.options;
  if (!correct) {
    if (exercise.type === "TRANSLATION") return { text: "definitely wrong" };
    if (exercise.type === "WORD_ORDER") {
      const words = options.filter((option) => option.correctPosition !== null);
      return {
        optionIds: words.sort((a, b) => b.correctPosition! - a.correctPosition!).map((o) => o.id),
      };
    }
    return { optionId: options.find((option) => !option.isCorrect)!.id };
  }
  switch (exercise.type) {
    case "TRANSLATION":
      return { text: options.find((option) => option.isCorrect)!.text };
    case "WORD_ORDER":
      return {
        optionIds: options
          .filter((option) => option.correctPosition !== null)
          .sort((a, b) => a.correctPosition! - b.correctPosition!)
          .map((option) => option.id),
      };
    case "MATCHING":
      return { pairs: options.map((option) => ({ leftId: option.id, rightId: option.id })) };
    default:
      return { optionId: options.find((option) => option.isCorrect)!.id };
  }
}

const exercisesOf = async (lessonId: string) =>
  (
    await prisma.exercise.findMany({
      where: { lessonId },
      orderBy: { sortOrder: "asc" },
      select: { id: true },
    })
  ).map((exercise) => exercise.id);

async function answer(token: string, exerciseId: string, correct = true, mode = "lesson") {
  return call(token, "POST", `/exercises/${exerciseId}/attempt`, {
    answer: await answerFor(exerciseId, correct),
    mode,
  });
}

async function completeLesson(token: string, lessonId: string) {
  await call(token, "POST", `/lessons/${lessonId}/start`);
  let last: Json = {};
  for (const id of await exercisesOf(lessonId)) last = await answer(token, id);
  return last;
}

/** Edits a learner's stats directly, to set up hearts, XP or streak days. */
const setStats = (userId: string, data: Json) =>
  prisma.userStats.update({ where: { userId }, data });

before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://localhost:${(server.address() as AddressInfo).port}/api`;
});

after(async () => {
  await prisma.user.deleteMany({ where: { email: { in: users } } });
  server.close();
  await prisma.$disconnect();
});

describe("gamification", () => {
  let token = "";
  let userId = "";

  it("new learner: 0 XP, level 1, 5 hearts, no streak, daily goal 20 XP, 0 of 8 badges", async () => {
    ({ token, userId } = await newUser("te"));
    const { body, status } = await call(token, "GET", "/stats");
    assert.equal(status, 200);
    assert.equal(body.stats.xp.total, 0);
    assert.equal(body.stats.xp.level, 1);
    assert.equal(body.stats.hearts.current, 5);
    assert.equal(body.stats.streak.current, 0);
    assert.equal(body.stats.dailyGoal.targetXp, 20);
    assert.equal(body.stats.achievements.unlockedCount, 0);
    assert.equal(body.stats.achievements.total, 8);
  });

  it("first day: a perfect lesson gives 33 XP, streak 1, daily goal met and 3 badges", async () => {
    const last = await completeLesson(token, "te-u1-l1");
    const rewards = last.body.rewards;
    assert.equal(rewards.totalXp, 33); // 9 × 2 exercise XP + 10 lesson + 5 perfect bonus
    assert.equal(rewards.xpEarned, 17); // last answer: 2 + 10 + 5
    assert.equal(rewards.streak.current, 1);
    const firstDay = await prisma.userStats.findUniqueOrThrow({ where: { userId } });
    assert.equal(firstDay.lastActiveDate, today());
    assert.equal(firstDay.longestStreak, 1);
    assert.equal(rewards.dailyGoal.completed, true);
    assert.equal(rewards.dailyGoal.justCompleted, true);
    assert.deepEqual(rewards.newAchievements.map((a: Json) => a.code).sort(), [
      "first-lesson",
      "goal-getter",
      "perfect-lesson",
    ]);
    const events = await prisma.xpEvent.findMany({ where: { userId } });
    assert.equal(
      events.reduce((sum, event) => sum + event.amount, 0),
      33,
    );
  });

  it("same day: more XP keeps the streak at 1", async () => {
    await call(token, "POST", "/lessons/te-u1-l2/start");
    const result = await answer(token, "te-u1-l2-e01");
    assert.equal(result.body.rewards.streak.current, 1);
    assert.equal(result.body.rewards.streak.change, "same-day");
  });

  it("heart loss: a wrong lesson answer costs one heart and starts the refill timer", async () => {
    const result = await answer(token, "te-u1-l2-e02", false);
    assert.equal(result.body.attempt.isCorrect, false);
    assert.equal(result.body.rewards.hearts.current, 4);
    assert.ok(result.body.rewards.hearts.nextHeartAt);
    assert.equal(result.body.rewards.xpEarned, 0);
  });

  it("out of hearts: lesson answers are refused, the review still works and gives a heart back", async () => {
    await setStats(userId, { hearts: 0, heartsUpdatedAt: new Date() });
    const refused = await answer(token, "te-u1-l2-e03");
    assert.equal(refused.status, 403);
    assert.equal(refused.body.error.code, "OUT_OF_HEARTS");
    assert.ok(refused.body.error.details.nextHeartAt);

    const recs = await call(token, "GET", "/recommendations?languageCode=te");
    assert.equal(recs.body.recommendations[0].type, "earn-hearts");

    const review = await answer(token, "te-u1-l2-e02", true, "review");
    assert.equal(review.status, 201);
    assert.equal(review.body.rewards.hearts.current, 1);
    assert.equal(review.body.rewards.xpEarned, 2);
    assert.ok(review.body.rewards.newAchievements.some((a: Json) => a.code === "mistake-mender"));
  });

  it("hearts refill over time (1 per 30 minutes)", async () => {
    await setStats(userId, { hearts: 1, heartsUpdatedAt: new Date(Date.now() - 61 * 60_000) });
    const { body } = await call(token, "GET", "/stats");
    assert.equal(body.stats.hearts.current, 3);
  });

  it("consecutive day: activity the day after the last active day → streak + 1 and the 3-day badge", async () => {
    await setStats(userId, {
      currentStreak: 2,
      longestStreak: 2,
      lastActiveDate: addDays(today(), -1),
    });
    const result = await answer(token, "te-u1-l2-e03");
    assert.equal(result.body.rewards.streak.change, "continued");
    assert.equal(result.body.rewards.streak.current, 3);
    assert.ok(result.body.rewards.newAchievements.some((a: Json) => a.code === "streak-3"));
  });

  it("missed day: the streak shows 0, then restarts at 1 and the longest streak is kept", async () => {
    await setStats(userId, {
      currentStreak: 5,
      longestStreak: 5,
      lastActiveDate: addDays(today(), -2),
    });
    const before = await call(token, "GET", "/streak");
    assert.equal(before.body.streak.current, 0);
    assert.equal(before.body.streak.longest, 5);
    assert.equal(before.body.streak.week.length, 7);

    const result = await answer(token, "te-u1-l2-e04");
    assert.equal(result.body.rewards.streak.change, "restarted");
    assert.equal(result.body.rewards.streak.current, 1);
    assert.equal(result.body.rewards.streak.longest, 5);
  });

  it("XP thresholds: crossing 50 XP is level 2, crossing 100 XP unlocks the badge", async () => {
    await setStats(userId, { hearts: 5 });
    for (const e of ["e05", "e06", "e07", "e08", "e09"]) await answer(token, `te-u1-l2-${e}`);
    await setStats(userId, { totalXp: 49 });
    const levelUp = await answer(token, "te-u1-l2-e02"); // finishes lesson 2: 2 + 10 XP
    assert.equal(levelUp.body.lessonProgress.justCompleted, true);
    assert.equal(levelUp.body.rewards.totalXp, 61);
    assert.equal(levelUp.body.rewards.level.level, 2);
    assert.equal(levelUp.body.rewards.leveledUp, true);

    await setStats(userId, { totalXp: 99 });
    await call(token, "POST", "/lessons/te-u1-l3/start");
    const badge = await answer(token, "te-u1-l3-e01");
    assert.equal(badge.body.rewards.totalXp, 101);
    assert.equal(badge.body.rewards.level.level, 2);
    assert.ok(badge.body.rewards.newAchievements.some((a: Json) => a.code === "xp-100"));
  });

  it("first unit completed unlocks its badge", async () => {
    const lesson3 = await call(token, "GET", "/lessons/te-u1-l3");
    for (const exercise of lesson3.body.lesson.exercises.slice(1)) await answer(token, exercise.id);
    await completeLesson(token, "te-u1-l4");
    await completeLesson(token, "te-u1-l5");
    const last = await completeLesson(token, "te-u1-l6");
    assert.ok(last.body.rewards.newAchievements.some((a: Json) => a.code === "first-unit"));
    const all = await call(token, "GET", "/achievements");
    assert.equal(all.body.achievements.find((a: Json) => a.code === "first-unit").unlocked, true);
    assert.equal(all.body.achievements.find((a: Json) => a.code === "streak-7").progress, 5 / 7);
  });

  it("recommendations follow the transparent rules", async () => {
    // Make a repeated mistake: wrong twice on the same exercise.
    await call(token, "POST", "/lessons/te-u2-l1/start");
    await answer(token, "te-u2-l1-e01", false);
    await answer(token, "te-u2-l1-e01", false);
    const { body } = await call(token, "GET", "/recommendations?languageCode=te");
    const types = body.recommendations.map((r: Json) => r.type);
    assert.equal(types[0], "repeated-mistakes");
    assert.ok(types.includes("unfinished-lesson"));
    assert.ok(body.rules.length >= 5);
  });

  it("daily goal and settings validation", async () => {
    const stats = await call(token, "GET", "/stats");
    assert.equal(stats.body.stats.dailyGoal.completed, true);
    assert.equal((await call(token, "PATCH", "/me", { timeZone: "Mars/Olympus" })).status, 400);
    assert.equal((await call(token, "PATCH", "/me", { selfAssessment: "expert" })).status, 400);
    await call(token, "PATCH", "/me", { dailyGoal: "intense" });
    const harder = await call(token, "GET", "/stats");
    assert.equal(harder.body.stats.dailyGoal.targetXp, 50);
  });
});

describe("placement test", () => {
  let token = "";
  let testId = "";
  let questions: Json[] = [];

  it("start: 18 questions (3 for each of six units) without answers", async () => {
    ({ token } = await newUser("hi", "knows-script"));
    const { status, body } = await call(token, "POST", "/placement/start", {});
    assert.equal(status, 201);
    testId = body.test.id;
    questions = body.questions;
    assert.equal(questions.length, 18);
    assert.equal(body.test.selfAssessment, "knows-script");
    assert.deepEqual([...new Set(questions.map((q) => q.skill))].sort(), [
      "SCRIPT",
      "SENTENCE",
      "TRANSLATION",
      "VOCABULARY",
    ]);
    assert.ok(!JSON.stringify(body).includes("isCorrect"));
  });

  it("result before finishing → 409", async () => {
    const result = await call(token, "GET", `/placement/result?testId=${testId}`);
    assert.equal(result.status, 409);
    assert.equal(result.body.error.code, "PLACEMENT_INCOMPLETE");
  });

  it("answers: unit 1 3/3, unit 2 2/3, unit 4 1/3, units 5, 7, 9 3/3 → 'You are ready for Unit 4'", async () => {
    const correctPerUnit: Record<number, number> = { 1: 3, 2: 2, 4: 1, 5: 3, 7: 3, 9: 3 };
    const seen: Record<number, number> = {};
    let last: Json = {};
    for (const question of questions) {
      seen[question.unit] = (seen[question.unit] ?? 0) + 1;
      const correct = seen[question.unit] <= correctPerUnit[question.unit];
      const exerciseId = question.exercise.id;
      last = await call(token, "POST", "/placement/answer", {
        testId,
        questionId: question.id,
        answer: await answerFor(exerciseId, correct),
      });
      assert.equal(last.status, 201);
      assert.equal(last.body.isCorrect, undefined, "correctness is not revealed per question");
    }
    assert.equal(last.body.completed, true);

    const again = await call(token, "POST", "/placement/answer", {
      testId,
      questionId: questions[0].id,
      answer: { optionId: "x" },
    });
    assert.equal(again.status, 409);

    const { body } = await call(token, "GET", `/placement/result?testId=${testId}`);
    assert.equal(body.result.recommendedUnit, 4);
    assert.equal(body.result.correctCount, 15);
    assert.equal(body.result.message, "You are ready for Unit 4 — First words.");
    assert.deepEqual(
      body.result.units.map((u: Json) => u.passed),
      [true, true, false, true, true, true],
    );
  });

  it("placement answers cost no hearts and give no XP", async () => {
    const stats = await call(token, "GET", "/stats");
    assert.equal(stats.body.stats.hearts.current, 5);
    assert.equal(stats.body.stats.xp.total, 0);
  });

  it("accept → units 1–3 unlocked (placed out), Unit 4 lesson 1 available", async () => {
    const decide = await call(token, "POST", "/placement/decide", {
      testId,
      choice: "recommended",
    });
    assert.equal(decide.status, 200);
    assert.equal(decide.body.chosenUnit, 4);
    assert.equal(decide.body.startLessonId, "hi-u4-l1");
    assert.equal(decide.body.lessonsUnlocked, 17);
    const course = await call(token, "GET", "/courses/hi-course");
    const lessons = course.body.course.units.flatMap((unit: Json) => unit.lessons);
    assert.ok(lessons.slice(0, 17).every((l: Json) => l.status === "completed" && l.placedOut));
    assert.equal(lessons[17].status, "available");
    assert.equal(course.body.course.progress.currentLessonId, "hi-u4-l1");
    // Placed-out lessons don't count as studied lessons for badges.
    const badges = await call(token, "GET", "/achievements");
    assert.equal(badges.body.unlockedCount, 0);
    const twice = await call(token, "POST", "/placement/decide", { testId, choice: "beginning" });
    assert.equal(twice.status, 409);
  });

  it("choosing Unit 1 instead unlocks nothing", async () => {
    const other = await newUser("ta", "advanced");
    const start = await call(other.token, "POST", "/placement/start");
    for (const question of start.body.questions) {
      await call(other.token, "POST", "/placement/answer", {
        testId: start.body.test.id,
        questionId: question.id,
        answer: await answerFor(question.exercise.id, true),
      });
    }
    const result = await call(other.token, "GET", "/placement/result");
    assert.equal(result.body.result.recommendedUnit, 9);
    const decide = await call(other.token, "POST", "/placement/decide", {
      testId: start.body.test.id,
      choice: "beginning",
    });
    assert.equal(decide.body.chosenUnit, 1);
    assert.equal(decide.body.lessonsUnlocked, 0);
    assert.equal(decide.body.status, "DECLINED");
  });
});
