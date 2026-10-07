// Unit tests for the admin dashboard's pure parts (Phase 8).
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { adminDocumentSource } from "../../rag/content-loader.ts";
import { KnowledgeFormatError } from "../../rag/document-parser.ts";
import { exerciseProblems, type ExerciseInput } from "./exercise-rules.ts";

const base: ExerciseInput = {
  type: "MULTIPLE_CHOICE",
  instruction: "Select the meaning",
  prompt: "నీళ్ళు",
  options: [{ text: "Water", isCorrect: true }, { text: "Milk" }],
};

describe("exercise rules (same as the answer checker)", () => {
  it("accepts a valid multiple choice", () => {
    assert.deepEqual(exerciseProblems(base), []);
  });

  it("multiple choice: exactly one correct, 2–6 different options", () => {
    assert.ok(exerciseProblems({ ...base, options: [{ text: "Water" }, { text: "Milk" }] }).length);
    assert.ok(exerciseProblems({ ...base, options: [{ text: "Water", isCorrect: true }] }).length);
    assert.ok(
      exerciseProblems({
        ...base,
        options: [{ text: "Water", isCorrect: true }, { text: "Water" }],
      }).some((p) => /different/.test(p)),
    );
  });

  it("fill in the blank needs sentence text", () => {
    assert.ok(exerciseProblems({ ...base, type: "FILL_IN_BLANK" }).some((p) => /sentence/.test(p)));
    assert.deepEqual(
      exerciseProblems({ ...base, type: "FILL_IN_BLANK", sentenceBefore: "నాకు" }),
      [],
    );
  });

  it("translation needs an accepted answer", () => {
    assert.ok(
      exerciseProblems({ ...base, type: "TRANSLATION", options: [{ text: "water" }] }).length,
    );
    assert.deepEqual(
      exerciseProblems({
        ...base,
        type: "TRANSLATION",
        options: [{ text: "water", isCorrect: true }],
      }),
      [],
    );
  });

  it("word order: positions 1..n without gaps; extra words allowed", () => {
    const words = (positions: Array<number | null>) =>
      positions.map((p, i) => ({ text: `w${i}`, correctPosition: p }));
    assert.deepEqual(
      exerciseProblems({ ...base, type: "WORD_ORDER", options: words([2, 1, null]) }),
      [],
    );
    assert.ok(exerciseProblems({ ...base, type: "WORD_ORDER", options: words([1, 3]) }).length);
    assert.ok(exerciseProblems({ ...base, type: "WORD_ORDER", options: words([1, 1]) }).length);
  });

  it("matching: every pair needs a different match", () => {
    const pairs = [
      { text: "అ", matchText: "a" },
      { text: "ఆ", matchText: "aa" },
    ];
    assert.deepEqual(
      exerciseProblems({ ...base, type: "MATCHING", prompt: "", options: pairs }),
      [],
    );
    assert.ok(
      exerciseProblems({
        ...base,
        type: "MATCHING",
        options: [pairs[0]!, { text: "ఇ", matchText: "a" }],
      }).length,
    );
  });
});

describe("admin knowledge notes use the same parser as the files", () => {
  const row = {
    id: "admin/te/station",
    languageCode: "te",
    title: "At the station",
    source: "Vachan admin notes",
    level: "ELEMENTARY",
    topic: "travel",
    contentType: "PHRASE",
    skill: "CONVERSATION",
    body: "## Platform\n\nWhich platform? ఏ ప్లాట్‌ఫాం?\n\n## Waiting room\n\n<!-- level: beginner -->\n\nవెయిటింగ్ రూమ్.",
  };

  it("builds sections with the document defaults and section overrides", () => {
    const doc = adminDocumentSource(row);
    assert.equal(doc.id, "admin/te/station");
    assert.equal(doc.reference, "admin-dashboard:admin/te/station");
    assert.equal(doc.defaults.level, "elementary");
    assert.equal(doc.defaults.contentType, "phrase");
    assert.equal(doc.sections.length, 2);
    assert.equal(doc.sections[1]!.overrides.level, "beginner");
  });

  it("rejects text without sections or with bad metadata", () => {
    assert.throws(() => adminDocumentSource({ ...row, body: "no sections" }), KnowledgeFormatError);
    assert.throws(
      () => adminDocumentSource({ ...row, body: "## A\n\n<!-- level: expert -->\n\ntext" }),
      KnowledgeFormatError,
    );
  });
});
