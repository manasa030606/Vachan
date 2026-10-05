import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Exercise } from "@/types/exercise";
import { isAnswerReady, toAttemptAnswer } from "./check-answer";

const translation: Exercise = {
  id: "t1",
  type: "translation",
  instruction: "Write this in English",
  prompt: "धन्यवाद",
};

const matching: Exercise = {
  id: "m1",
  type: "matching",
  instruction: "Tap the matching pairs",
  pairs: [{ id: "p1", left: "अ", right: "a" }],
};

describe("isAnswerReady", () => {
  it("is false for empty text and true once something is typed", () => {
    assert.equal(isAnswerReady(translation, { type: "text", value: "   " }), false);
    assert.equal(isAnswerReady(translation, { type: "text", value: "hi" }), true);
  });

  it("matching is ready only when every pair is matched", () => {
    assert.equal(
      isAnswerReady(matching, { type: "matching", complete: false, matchedIds: [] }),
      false,
    );
    assert.equal(
      isAnswerReady(matching, { type: "matching", complete: true, matchedIds: ["p1"] }),
      true,
    );
  });
});

describe("toAttemptAnswer", () => {
  it("builds the request body the backend expects", () => {
    assert.deepEqual(toAttemptAnswer({ type: "choice", optionId: "o1" }), { optionId: "o1" });
    assert.deepEqual(toAttemptAnswer({ type: "text", value: "thank you" }), { text: "thank you" });
    assert.deepEqual(toAttemptAnswer({ type: "order", tokenIds: ["a", "b"] }), {
      optionIds: ["a", "b"],
    });
    assert.deepEqual(toAttemptAnswer({ type: "matching", complete: true, matchedIds: ["p1"] }), {
      pairs: [{ leftId: "p1", rightId: "p1" }],
    });
  });
});
