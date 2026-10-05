import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GAMIFICATION } from "../../config/gamification.ts";
import { newlyEarned, progressTowards, type AchievementMetrics } from "./achievements.ts";
import { addDays, daysBetween, isValidTimeZone, lastDates, localDate } from "./dates.ts";
import { changeHearts, refillHearts } from "./hearts.ts";
import { levelFor } from "./levels.ts";
import { scorePlacement } from "./placement-scoring.ts";
import { buildRecommendations } from "./recommendations.ts";
import { recordActiveDay, visibleStreak } from "./streak.ts";
import { xpForAnswer } from "./xp.ts";

describe("dates", () => {
  it("uses the learner's local calendar day", () => {
    const evening = new Date("2026-10-05T20:00:00Z"); // 01:30 next day in India
    assert.equal(localDate(evening, "Asia/Kolkata"), "2026-10-06");
    assert.equal(localDate(evening, "America/New_York"), "2026-10-05");
  });
  it("counts calendar days across month ends and daylight-saving changes", () => {
    assert.equal(daysBetween("2026-10-31", "2026-11-01"), 1);
    assert.equal(daysBetween("2026-03-07", "2026-03-09"), 2); // US DST starts 8 March
    assert.equal(addDays("2026-12-31", 1), "2027-01-01");
    assert.deepEqual(lastDates("2026-10-05", 3), ["2026-10-03", "2026-10-04", "2026-10-05"]);
  });
  it("validates time zones", () => {
    assert.equal(isValidTimeZone("Asia/Kolkata"), true);
    assert.equal(isValidTimeZone("Mars/Olympus"), false);
  });
});

describe("streak", () => {
  const empty = { currentStreak: 0, longestStreak: 0, lastActiveDate: null };
  it("first day → 1", () => {
    const { state, change } = recordActiveDay(empty, "2026-10-05");
    assert.equal(change, "first-day");
    assert.deepEqual(state, { currentStreak: 1, longestStreak: 1, lastActiveDate: "2026-10-05" });
  });
  it("same day → unchanged", () => {
    const day1 = recordActiveDay(empty, "2026-10-05").state;
    assert.equal(recordActiveDay(day1, "2026-10-05").change, "same-day");
    assert.equal(recordActiveDay(day1, "2026-10-05").state.currentStreak, 1);
  });
  it("consecutive days → +1 and longest follows", () => {
    let state = recordActiveDay(empty, "2026-10-05").state;
    state = recordActiveDay(state, "2026-10-06").state;
    const third = recordActiveDay(state, "2026-10-07");
    assert.equal(third.change, "continued");
    assert.equal(third.state.currentStreak, 3);
    assert.equal(third.state.longestStreak, 3);
  });
  it("missed day → restarts at 1, longest is kept", () => {
    const state = { currentStreak: 5, longestStreak: 5, lastActiveDate: "2026-10-01" };
    const result = recordActiveDay(state, "2026-10-03");
    assert.equal(result.change, "restarted");
    assert.equal(result.state.currentStreak, 1);
    assert.equal(result.state.longestStreak, 5);
  });
  it("shows 0 once a day was missed, but keeps it until the end of today", () => {
    const state = { currentStreak: 4, longestStreak: 4, lastActiveDate: "2026-10-04" };
    assert.equal(visibleStreak(state, "2026-10-04"), 4);
    assert.equal(visibleStreak(state, "2026-10-05"), 4); // yesterday: still alive today
    assert.equal(visibleStreak(state, "2026-10-06"), 0); // missed the 5th
  });
});

describe("hearts", () => {
  const config = GAMIFICATION.hearts;
  const t0 = new Date("2026-10-05T10:00:00Z");
  const minutes = (n: number) => new Date(t0.getTime() + n * 60_000);

  it("loses a heart and starts the refill timer", () => {
    const after = changeHearts({ hearts: 5, updatedAt: new Date(0) }, -1, t0, config);
    assert.equal(after.hearts, 4);
    assert.deepEqual(after.nextHeartAt, minutes(30));
  });
  it("refills one heart every 30 minutes, up to the maximum", () => {
    const stored = { hearts: 2, updatedAt: t0 };
    assert.equal(refillHearts(stored, minutes(29), config).hearts, 2);
    assert.equal(refillHearts(stored, minutes(61), config).hearts, 4);
    assert.deepEqual(refillHearts(stored, minutes(61), config).nextHeartAt, minutes(90));
    assert.equal(refillHearts(stored, minutes(500), config).hearts, 5);
    assert.equal(refillHearts(stored, minutes(500), config).nextHeartAt, null);
  });
  it("never goes below 0 or above the maximum", () => {
    assert.equal(changeHearts({ hearts: 0, updatedAt: t0 }, -1, t0, config).hearts, 0);
    assert.equal(changeHearts({ hearts: 5, updatedAt: t0 }, +1, t0, config).hearts, 5);
  });
  it("a review answer restores a heart", () => {
    assert.equal(changeHearts({ hearts: 1, updatedAt: t0 }, +1, minutes(5), config).hearts, 2);
  });
});

describe("levels", () => {
  const thresholds = GAMIFICATION.levelThresholds;
  it("level boundaries", () => {
    assert.equal(levelFor(0, thresholds).level, 1);
    assert.equal(levelFor(49, thresholds).level, 1);
    assert.equal(levelFor(50, thresholds).level, 2);
    assert.equal(levelFor(119, thresholds).xpToNextLevel, 1);
    assert.equal(levelFor(120, thresholds).level, 3);
  });
  it("top level has no next level", () => {
    const top = levelFor(5000, thresholds);
    assert.equal(top.level, thresholds.length);
    assert.equal(top.isMaxLevel, true);
    assert.equal(top.nextLevelXp, null);
  });
});

describe("xp", () => {
  const config = GAMIFICATION.xp;
  const total = (awards: Array<{ amount: number }>) => awards.reduce((sum, a) => sum + a.amount, 0);
  it("exercise XP only for the first correct answer in a run", () => {
    const base = {
      mode: "lesson" as const,
      runCompleted: false,
      firstCompletion: true,
      perfectRun: true,
    };
    assert.equal(total(xpForAnswer({ ...base, newlySolved: true }, config)), 2);
    assert.equal(total(xpForAnswer({ ...base, newlySolved: false }, config)), 0);
  });
  it("lesson XP: first completion + perfect bonus, practice gives less", () => {
    const finish = { mode: "lesson" as const, newlySolved: true, runCompleted: true };
    assert.equal(
      total(xpForAnswer({ ...finish, firstCompletion: true, perfectRun: true }, config)),
      17,
    );
    assert.equal(
      total(xpForAnswer({ ...finish, firstCompletion: true, perfectRun: false }, config)),
      12,
    );
    assert.equal(
      total(xpForAnswer({ ...finish, firstCompletion: false, perfectRun: false }, config)),
      7,
    );
  });
  it("review XP only when correct", () => {
    assert.equal(total(xpForAnswer({ mode: "review", isCorrect: true }, config)), 2);
    assert.equal(total(xpForAnswer({ mode: "review", isCorrect: false }, config)), 0);
  });
});

describe("achievements", () => {
  const metrics: AchievementMetrics = {
    LESSONS_COMPLETED: 1,
    TOTAL_XP: 99,
    LONGEST_STREAK: 3,
    UNITS_COMPLETED: 0,
    PERFECT_LESSONS: 0,
    MISTAKES_CLEARED: 0,
    DAILY_GOALS_MET: 0,
  };
  const rules = [
    { code: "first-lesson", metric: "LESSONS_COMPLETED" as const, threshold: 1 },
    { code: "xp-100", metric: "TOTAL_XP" as const, threshold: 100 },
    { code: "streak-3", metric: "LONGEST_STREAK" as const, threshold: 3 },
  ];
  it("unlocks reached badges once", () => {
    assert.deepEqual(newlyEarned(rules, metrics, new Set()), ["first-lesson", "streak-3"]);
    assert.deepEqual(newlyEarned(rules, metrics, new Set(["first-lesson"])), ["streak-3"]);
    assert.deepEqual(
      newlyEarned(rules, { ...metrics, TOTAL_XP: 100 }, new Set(["first-lesson", "streak-3"])),
      ["xp-100"],
    );
  });
  it("progress is capped at 1", () => {
    assert.equal(progressTowards(rules[1], metrics), 0.99);
    assert.equal(progressTowards(rules[0], { ...metrics, LESSONS_COMPLETED: 5 }), 1);
  });
});

describe("placement scoring", () => {
  const answer = (unit: number, correct: number) =>
    [0, 1, 2].map((i) => ({ unit, isCorrect: i < correct }));
  it("recommends the first unit that was not passed", () => {
    const result = scorePlacement(
      [...answer(1, 3), ...answer(2, 2), ...answer(3, 1), ...answer(4, 3)],
      [1, 2, 3, 4],
      2,
    );
    assert.equal(result.recommendedUnit, 3);
    assert.equal(result.correctCount, 9);
    assert.deepEqual(
      result.units.map((u) => u.passed),
      [true, true, false, true],
    );
  });
  it("all wrong → Unit 1; all right → last unit", () => {
    assert.equal(
      scorePlacement(
        [1, 2, 3, 4].flatMap((u) => answer(u, 0)),
        [1, 2, 3, 4],
        2,
      ).recommendedUnit,
      1,
    );
    assert.equal(
      scorePlacement(
        [1, 2, 3, 4].flatMap((u) => answer(u, 3)),
        [1, 2, 3, 4],
        2,
      ).recommendedUnit,
      4,
    );
  });
});

describe("recommendations", () => {
  const config = GAMIFICATION.recommendations;
  const base = {
    hearts: 5,
    openMistakes: [],
    unfinishedLessons: [],
    lessonStats: [],
    nextLesson: { lessonId: "l9", title: "Numbers" },
  };
  it("nothing to fix → next lesson", () => {
    assert.deepEqual(
      buildRecommendations(base, config).map((r) => r.type),
      ["next-lesson"],
    );
  });
  it("applies every rule in priority order", () => {
    const types = buildRecommendations(
      {
        hearts: 0,
        openMistakes: [
          { exerciseId: "e1", prompt: "అ", wrongCount: 3, lessonTitle: "Vowels" },
          { exerciseId: "e2", prompt: "ఆ", wrongCount: 1, lessonTitle: "Vowels" },
        ],
        unfinishedLessons: [{ lessonId: "l2", title: "Vowels: i and ii", done: 2, total: 4 }],
        lessonStats: [
          { lessonId: "l1", title: "Greetings", accuracy: 55, answers: 9, status: "COMPLETED" },
          { lessonId: "l3", title: "Family", accuracy: 90, answers: 9, status: "COMPLETED" },
          { lessonId: "l4", title: "Food", accuracy: 50, answers: 2, status: "COMPLETED" },
        ],
        nextLesson: { lessonId: "l2", title: "Vowels: i and ii" },
      },
      { ...config, maxItems: 10 },
    ).map((r) => r.type);
    assert.deepEqual(types, [
      "earn-hearts",
      "repeated-mistakes",
      "unfinished-lesson",
      "weak-topic",
      "review",
    ]);
  });
  it("is cut at maxItems", () => {
    const many = {
      ...base,
      unfinishedLessons: [1, 2].map((n) => ({
        lessonId: `u${n}`,
        title: `U${n}`,
        done: 1,
        total: 4,
      })),
      openMistakes: [{ exerciseId: "e", prompt: "x", wrongCount: 5, lessonTitle: "L" }],
    };
    assert.equal(buildRecommendations(many, { ...config, maxItems: 2 }).length, 2);
  });
});
