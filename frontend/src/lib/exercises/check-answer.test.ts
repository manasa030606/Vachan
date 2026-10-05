import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Exercise } from "@/types/exercise";
import {
  editDistance,
  evaluateAnswer,
  getCorrectAnswerText,
  isAnswerCorrect,
  isAnswerReady,
  normalizeText,
} from "./check-answer";

const choice: Exercise = {
  id: "c1",
  type: "multiple-choice",
  instruction: "Select the correct meaning",
  prompt: "नमस्ते",
  options: [
    { id: "a", text: "Hello" },
    { id: "b", text: "Water" },
  ],
  correctOptionId: "a",
};

const translation: Exercise = {
  id: "t1",
  type: "translation",
  instruction: "Write this in English",
  prompt: "धन्यवाद",
  acceptedAnswers: ["thank you", "thanks"],
};

const wordOrder: Exercise = {
  id: "w1",
  type: "word-order",
  instruction: "Build the sentence",
  prompt: "My name is Asha.",
  tokens: [
    { id: "x", text: "पानी" },
    { id: "1", text: "मेरा" },
    { id: "2", text: "नाम" },
  ],
  correctOrder: ["1", "2"],
};

describe("normalizeText", () => {
  it("ignores case, punctuation and extra spaces", () => {
    assert.equal(normalizeText("  Thank-You!! "), "thank you");
  });
});

describe("isAnswerCorrect", () => {
  it("checks choice answers", () => {
    assert.equal(isAnswerCorrect(choice, { type: "choice", optionId: "a" }), true);
    assert.equal(isAnswerCorrect(choice, { type: "choice", optionId: "b" }), false);
  });

  it("accepts any accepted translation, case-insensitively", () => {
    assert.equal(isAnswerCorrect(translation, { type: "text", value: "Thanks!" }), true);
    assert.equal(isAnswerCorrect(translation, { type: "text", value: "hello" }), false);
  });

  it("requires the exact word order", () => {
    assert.equal(isAnswerCorrect(wordOrder, { type: "order", tokenIds: ["1", "2"] }), true);
    assert.equal(isAnswerCorrect(wordOrder, { type: "order", tokenIds: ["2", "1"] }), false);
    assert.equal(isAnswerCorrect(wordOrder, { type: "order", tokenIds: ["1", "2", "x"] }), false);
  });

  it("returns false for a missing or mismatched answer", () => {
    assert.equal(isAnswerCorrect(choice, null), false);
    assert.equal(isAnswerCorrect(choice, { type: "text", value: "a" }), false);
  });
});

describe("typed answers", () => {
  it("ignores capital letters and spaces", () => {
    for (const value of [
      "THANK YOU",
      "Thank You",
      "THankyou",
      "ThaNkyou",
      "thankyou",
      "thank-you!",
    ]) {
      assert.deepEqual(
        evaluateAnswer(translation, { type: "text", value }),
        { isCorrect: true },
        value,
      );
    }
  });

  it("accepts a small typo and reports the correct spelling", () => {
    assert.deepEqual(evaluateAnswer(translation, { type: "text", value: "Thnak you" }), {
      isCorrect: true,
      typoCorrection: "thank you",
    });
  });

  it("still rejects a different word", () => {
    assert.equal(isAnswerCorrect(translation, { type: "text", value: "think yes" }), false);
  });
});

describe("editDistance", () => {
  it("counts a swap of neighbouring letters as one edit", () => {
    assert.equal(editDistance("thnak", "thank"), 1);
    assert.equal(editDistance("water", "water"), 0);
    assert.equal(editDistance("cat", "dog"), 3);
  });
});

describe("isAnswerReady", () => {
  it("is false for empty text", () => {
    assert.equal(isAnswerReady(translation, { type: "text", value: "   " }), false);
    assert.equal(isAnswerReady(translation, { type: "text", value: "hi" }), true);
  });
});

describe("getCorrectAnswerText", () => {
  it("shows the correct option or sentence", () => {
    assert.equal(getCorrectAnswerText(choice), "Hello");
    assert.equal(getCorrectAnswerText(wordOrder), "मेरा नाम");
  });
});
