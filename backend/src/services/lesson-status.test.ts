import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { computeLessonStatuses } from "./lesson-status.ts";

const lessons = ["l1", "l2", "l3", "l4"];
const statuses = (completed: string[]) => [
  ...computeLessonStatuses(lessons, new Set(completed)).values(),
];

describe("computeLessonStatuses", () => {
  it("new learner: first lesson current, the rest locked", () => {
    assert.deepEqual(statuses([]), ["current", "locked", "locked", "locked"]);
  });
  it("after two lessons: third is current", () => {
    assert.deepEqual(statuses(["l1", "l2"]), ["completed", "completed", "current", "locked"]);
  });
  it("everything done: all completed", () => {
    assert.deepEqual(statuses(lessons), ["completed", "completed", "completed", "completed"]);
  });
  it("a completed lesson after a gap stays locked (lessons unlock in order)", () => {
    assert.deepEqual(statuses(["l1", "l3"]), ["completed", "current", "locked", "locked"]);
  });
});
