import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  checkAnswer,
  correctAnswerText,
  describeAnswer,
  editDistance,
  normalizeText,
  toComparable,
  type CheckableOption,
} from "./answer-checker.ts";

const option = (
  id: string,
  text: string,
  extra: Partial<CheckableOption> = {},
): CheckableOption => ({
  id,
  text,
  isCorrect: false,
  correctPosition: null,
  matchText: null,
  ...extra,
});

describe("checkAnswer", () => {
  it("multiple choice: only the correct option passes", () => {
    const exercise = {
      type: "MULTIPLE_CHOICE" as const,
      options: [option("a", "Hello", { isCorrect: true }), option("b", "Water")],
    };
    assert.equal(checkAnswer(exercise, { optionId: "a" }).isCorrect, true);
    const wrong = checkAnswer(exercise, { optionId: "b" });
    assert.equal(wrong.isCorrect, false);
    assert.equal(wrong.correctAnswer, "Hello");
  });

  it("translation: ignores capitals, spaces and punctuation; accepts small typos", () => {
    const exercise = {
      type: "TRANSLATION" as const,
      options: [
        option("t1", "thank you", { isCorrect: true }),
        option("t2", "thanks", { isCorrect: true }),
      ],
    };
    for (const text of ["Thank You!", "THankyou", "thanks", "thank-you"]) {
      assert.deepEqual(checkAnswer(exercise, { text }), {
        isCorrect: true,
        typoCorrection: null,
        correctAnswer: "thank you",
      });
    }
    assert.equal(checkAnswer(exercise, { text: "Thnak you" }).typoCorrection, "thank you");
    assert.equal(checkAnswer(exercise, { text: "water" }).isCorrect, false);
  });

  it("word order: exact order of the sentence words, distractors excluded", () => {
    const exercise = {
      type: "WORD_ORDER" as const,
      options: [
        option("x", "పాని"),
        option("w2", "పేరు", { correctPosition: 2 }),
        option("w1", "నా", { correctPosition: 1 }),
      ],
    };
    assert.equal(checkAnswer(exercise, { optionIds: ["w1", "w2"] }).isCorrect, true);
    assert.equal(checkAnswer(exercise, { optionIds: ["w2", "w1"] }).isCorrect, false);
    assert.equal(checkAnswer(exercise, { optionIds: ["w1", "w2", "x"] }).isCorrect, false);
    assert.equal(checkAnswer(exercise, { optionIds: ["w1"] }).correctAnswer, "నా పేరు");
  });

  it("matching: every pair must match", () => {
    const exercise = {
      type: "MATCHING" as const,
      options: [option("p1", "అ", { matchText: "a" }), option("p2", "ఆ", { matchText: "aa" })],
    };
    const right = {
      pairs: [
        { leftId: "p1", rightId: "p1" },
        { leftId: "p2", rightId: "p2" },
      ],
    };
    const wrong = {
      pairs: [
        { leftId: "p1", rightId: "p2" },
        { leftId: "p2", rightId: "p1" },
      ],
    };
    assert.equal(checkAnswer(exercise, right).isCorrect, true);
    assert.equal(checkAnswer(exercise, wrong).isCorrect, false);
  });

  it("rejects an answer in the wrong shape", () => {
    const exercise = {
      type: "MULTIPLE_CHOICE" as const,
      options: [option("a", "Hello", { isCorrect: true })],
    };
    assert.throws(() => checkAnswer(exercise, { text: "Hello" }), /optionId/);
  });
});

describe("text helpers", () => {
  it("toComparable removes case, spaces and punctuation", () => {
    assert.equal(toComparable("  ThaNk-You! "), "thankyou");
  });
  it("editDistance counts a swap as one edit", () => {
    assert.equal(editDistance("thnak", "thank"), 1);
  });
});

describe("Phase 3 checking", () => {
  const letterChoice = {
    type: "CHARACTER_SOUND" as const,
    options: [
      { id: "o1", text: "ka", isCorrect: false, correctPosition: null, matchText: null },
      { id: "o2", text: "kaa", isCorrect: true, correctPosition: null, matchText: null },
    ],
  };

  it("checks character → sound like any single choice", () => {
    assert.equal(checkAnswer(letterChoice, { optionId: "o2" }).isCorrect, true);
    assert.equal(checkAnswer(letterChoice, { optionId: "o1" }).correctAnswer, "kaa");
  });

  it("normalizes Unicode, invisible joiners and the Devanagari full stop", () => {
    assert.equal(normalizeText("नमस्ते।"), "नमस्ते");
    assert.equal(normalizeText("క‍ా"), "కా");
    assert.equal(normalizeText("é"), "é"); // decomposed → composed (NFC)
  });

  it("describes stored answers and correct answers as text", () => {
    assert.equal(describeAnswer(letterChoice, { optionId: "o1" }), "ka");
    assert.equal(describeAnswer(letterChoice, { text: "Kaa" }), "Kaa");
    assert.equal(correctAnswerText(letterChoice), "kaa");
    const matching = {
      type: "MATCHING" as const,
      options: [
        { id: "m1", text: "అ", isCorrect: false, correctPosition: null, matchText: "a" },
        { id: "m2", text: "ఆ", isCorrect: false, correctPosition: null, matchText: "aa" },
      ],
    };
    assert.equal(describeAnswer(matching, { pairs: [{ leftId: "m1", rightId: "m2" }] }), "అ = aa");
  });
});
