import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Exercise } from "@/types/exercise";
import {
  createInitialLessonState,
  getAccuracy,
  lessonReducer,
  type LessonState,
} from "./lesson-reducer";

const exercises: Exercise[] = ["e1", "e2"].map((id) => ({
  id,
  type: "multiple-choice",
  instruction: "Pick",
  prompt: id,
  options: [
    { id: "right", text: "Right" },
    { id: "wrong", text: "Wrong" },
  ],
}));

/** Simulates the server's verdict: "right" is the correct option in these tests. */
function check(state: LessonState): LessonState {
  const isCorrect = state.answer?.type === "choice" && state.answer.optionId === "right";
  return lessonReducer(state, {
    type: "CHECK",
    isCorrect,
    typoCorrection: null,
    correctAnswer: "Right",
  });
}

function answer(state: LessonState, optionId: string): LessonState {
  let next = lessonReducer(state, { type: "ANSWER_CHANGED", answer: { type: "choice", optionId } });
  next = check(next);
  return lessonReducer(next, { type: "CONTINUE" });
}

describe("lessonReducer", () => {
  it("completes a lesson when every answer is correct", () => {
    let state = lessonReducer(createInitialLessonState(exercises, 5), { type: "START" });
    state = answer(state, "right");
    state = answer(state, "right");
    assert.equal(state.phase, "complete");
    assert.equal(state.hearts, 5);
    assert.equal(getAccuracy(state), 100);
  });

  it("costs a heart and repeats the exercise after a mistake", () => {
    let state = lessonReducer(createInitialLessonState(exercises, 5), { type: "START" });
    state = answer(state, "wrong"); // e1 wrong → re-queued
    assert.equal(state.hearts, 4);
    assert.equal(state.queue.length, 3);
    state = answer(state, "right"); // e2
    state = answer(state, "right"); // e1 again
    assert.equal(state.phase, "complete");
    assert.deepEqual(state.mistakeIds, ["e1"]);
    assert.equal(getAccuracy(state), 67);
  });

  it("ends the lesson when hearts run out", () => {
    let state = lessonReducer(createInitialLessonState(exercises, 1), { type: "START" });
    state = answer(state, "wrong");
    assert.equal(state.phase, "out-of-hearts");
  });

  it("does not let the answer change after checking", () => {
    let state = lessonReducer(createInitialLessonState(exercises, 5), { type: "START" });
    state = lessonReducer(state, {
      type: "ANSWER_CHANGED",
      answer: { type: "choice", optionId: "right" },
    });
    state = check(state);
    const after = lessonReducer(state, {
      type: "ANSWER_CHANGED",
      answer: { type: "choice", optionId: "wrong" },
    });
    assert.equal(after, state);
  });

  it("resumes: exercises already done in this run are skipped but counted", () => {
    let state = createInitialLessonState(exercises, 3, { alreadyCompletedIds: ["e1"] });
    assert.equal(state.queue.length, 1);
    assert.deepEqual(state.completedIds, ["e1"]);
    state = lessonReducer(state, { type: "START" });
    state = answer(state, "right");
    assert.equal(state.phase, "complete");
    assert.equal(state.completedIds.length, 2);
  });

  it("review mode: mistakes cost no hearts and the explanation is kept until Continue", () => {
    let state = createInitialLessonState(exercises, 1, { heartsEnabled: false });
    state = lessonReducer(state, { type: "START" });
    state = lessonReducer(state, {
      type: "ANSWER_CHANGED",
      answer: { type: "choice", optionId: "wrong" },
    });
    state = lessonReducer(state, {
      type: "CHECK",
      isCorrect: false,
      typoCorrection: null,
      correctAnswer: "Right",
      explanation: "Because.",
    });
    assert.equal(state.hearts, 1);
    assert.equal(state.explanation, "Because.");
    state = lessonReducer(state, { type: "CONTINUE" });
    assert.equal(state.phase, "exercise");
    assert.equal(state.explanation, null);
  });

  it("uses the server's heart count and stops when the server says there are none", () => {
    let state = lessonReducer(createInitialLessonState(exercises, 5), {
      type: "BEGIN",
      exercises,
      hearts: 2,
      alreadyCompletedIds: [],
    });
    assert.equal(state.hearts, 2);
    state = lessonReducer(state, {
      type: "ANSWER_CHANGED",
      answer: { type: "choice", optionId: "wrong" },
    });
    state = lessonReducer(state, {
      type: "CHECK",
      isCorrect: false,
      typoCorrection: null,
      correctAnswer: "Right",
      hearts: 1,
    });
    assert.equal(state.hearts, 1);
    assert.equal(lessonReducer(state, { type: "OUT_OF_HEARTS" }).phase, "out-of-hearts");
    const empty = lessonReducer(createInitialLessonState(exercises, 5), {
      type: "BEGIN",
      exercises,
      hearts: 0,
      alreadyCompletedIds: [],
    });
    assert.equal(empty.phase, "out-of-hearts");
  });
});
