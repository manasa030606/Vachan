import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { AdminExercise } from "./api/admin";
import { blankExercise, draftProblems, optionMode, toDraft, toRequestBody } from "./admin-exercise";

describe("admin exercise editor helpers", () => {
  it("maps every type to an option mode", () => {
    assert.equal(optionMode("MULTIPLE_CHOICE"), "choice");
    assert.equal(optionMode("FILL_IN_BLANK"), "choice");
    assert.equal(optionMode("TRANSLATION"), "accepted");
    assert.equal(optionMode("WORD_ORDER"), "order");
    assert.equal(optionMode("MATCHING"), "pairs");
  });

  it("a blank choice exercise has exactly one correct option and asks for text", () => {
    const draft = blankExercise("MULTIPLE_CHOICE");
    assert.equal(draft.options.filter((o) => o.isCorrect).length, 1);
    assert.ok(draftProblems(draft).includes("Every option needs text."));
    assert.ok(draftProblems(draft).includes("Write the prompt the learner sees."));
  });

  it("a blank word-order exercise numbers its words 1..n", () => {
    assert.deepEqual(
      blankExercise("WORD_ORDER").options.map((o) => o.correctPosition),
      [1, 2, 3],
    );
  });

  it("flags gaps in word positions and missing matches", () => {
    const order = blankExercise("WORD_ORDER");
    order.prompt = "I eat";
    order.options = [
      { text: "నేను", correctPosition: 1 },
      { text: "తింటాను", correctPosition: 3 },
    ];
    assert.deepEqual(draftProblems(order), ["Positions must be 1, 2, 3 … (extra words: empty)."]);
    const pairs = blankExercise("MATCHING");
    pairs.options = [
      { text: "అ", matchText: "a" },
      { text: "ఆ", matchText: "" },
    ];
    assert.deepEqual(draftProblems(pairs), ["Every pair needs a match."]);
  });

  it("builds a clean request body: trimmed, no option ids, unused fields cleared", () => {
    const exercise: AdminExercise = {
      id: "ex1",
      type: "MATCHING",
      sortOrder: 1,
      instruction: " Match the pairs ",
      prompt: "",
      promptSubtext: null,
      sentenceBefore: "should go",
      sentenceAfter: null,
      translation: null,
      explanation: "  ",
      options: [
        { id: "o1", text: " అ ", isCorrect: true, correctPosition: 2, matchText: " a " },
        { id: "o2", text: "ఆ", isCorrect: false, correctPosition: null, matchText: "aa" },
      ],
      attempts: 4,
      usedInPlacement: false,
    };
    const body = toRequestBody(toDraft(exercise));
    assert.equal(body.instruction, "Match the pairs");
    assert.equal(body.sentenceBefore, null);
    assert.equal(body.explanation, null);
    assert.deepEqual(body.options[0], {
      text: "అ",
      subtext: null,
      isCorrect: false,
      correctPosition: null,
      matchText: "a",
    });
    assert.ok(!("id" in body.options[0]!));
    assert.deepEqual(draftProblems(toDraft(exercise)), []);
  });
});
