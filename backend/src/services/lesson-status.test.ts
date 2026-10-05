import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  computeLessonStatuses,
  pickRecommendedLesson,
  type LessonProgressInfo,
} from "./lesson-status.ts";

const lessons = ["l1", "l2", "l3", "l4"];

function progressOf(rows: Record<string, readonly ["IN_PROGRESS" | "COMPLETED", number]>) {
  return new Map<string, LessonProgressInfo>(
    Object.entries(rows).map(([id, [status, minute]]) => [
      id,
      { status, lastActivityAt: new Date(2026, 0, 1, 0, minute) },
    ]),
  );
}
const statuses = (rows: Record<string, readonly ["IN_PROGRESS" | "COMPLETED", number]>) => [
  ...computeLessonStatuses(lessons, progressOf(rows)).values(),
];

describe("computeLessonStatuses", () => {
  it("new learner: first lesson available, the rest locked", () => {
    assert.deepEqual(statuses({}), ["available", "locked", "locked", "locked"]);
  });

  it("a started lesson is current", () => {
    assert.deepEqual(statuses({ l1: ["IN_PROGRESS", 1] }), [
      "current",
      "locked",
      "locked",
      "locked",
    ]);
  });

  it("completing a lesson makes the next one available", () => {
    assert.deepEqual(statuses({ l1: ["COMPLETED", 1], l2: ["COMPLETED", 2] }), [
      "completed",
      "completed",
      "available",
      "locked",
    ]);
  });

  it("everything done: all completed", () => {
    const all = Object.fromEntries(lessons.map((id, i) => [id, ["COMPLETED", i] as const]));
    assert.deepEqual(statuses(all), ["completed", "completed", "completed", "completed"]);
  });

  it("an unfinished lesson keeps the next one locked", () => {
    assert.deepEqual(statuses({ l1: ["COMPLETED", 1], l2: ["IN_PROGRESS", 2] }), [
      "completed",
      "current",
      "locked",
      "locked",
    ]);
  });
});

describe("pickRecommendedLesson", () => {
  it("prefers the most recently active lesson in progress", () => {
    const progress = progressOf({ l1: ["IN_PROGRESS", 5], l2: ["IN_PROGRESS", 9] });
    const map = computeLessonStatuses(lessons, progress);
    assert.equal(pickRecommendedLesson(lessons, map, progress), "l2");
  });

  it("otherwise the first available lesson", () => {
    const progress = progressOf({ l1: ["COMPLETED", 1] });
    const map = computeLessonStatuses(lessons, progress);
    assert.equal(pickRecommendedLesson(lessons, map, progress), "l2");
  });

  it("null when the course is finished", () => {
    const progress = progressOf(
      Object.fromEntries(lessons.map((id, i) => [id, ["COMPLETED", i] as const])),
    );
    const map = computeLessonStatuses(lessons, progress);
    assert.equal(pickRecommendedLesson(lessons, map, progress), null);
  });
});
