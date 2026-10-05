// The selected option must never look wrong (or right) before the server has answered.
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getOptionState } from "./option-button";

const a = { id: "a", text: "aa" };
const b = { id: "b", text: "i" };

describe("getOptionState", () => {
  it("shows the picked option as selected before Check", () => {
    assert.equal(
      getOptionState({ option: a, selectedId: "a", correctAnswer: null, isLocked: false }),
      "selected",
    );
    assert.equal(
      getOptionState({ option: b, selectedId: "a", correctAnswer: null, isLocked: false }),
      "idle",
    );
  });

  it("shows 'checking' (not incorrect) while waiting for the server", () => {
    assert.equal(
      getOptionState({ option: a, selectedId: "a", correctAnswer: null, isLocked: true }),
      "checking",
    );
    assert.equal(
      getOptionState({ option: b, selectedId: "a", correctAnswer: null, isLocked: true }),
      "dimmed",
    );
  });

  it("marks correct / incorrect once the server answered", () => {
    assert.equal(
      getOptionState({ option: a, selectedId: "a", correctAnswer: "aa", isLocked: true }),
      "correct",
    );
    assert.equal(
      getOptionState({ option: b, selectedId: "b", correctAnswer: "aa", isLocked: true }),
      "incorrect",
    );
    assert.equal(
      getOptionState({ option: a, selectedId: "b", correctAnswer: "aa", isLocked: true }),
      "correct",
    );
  });
});
