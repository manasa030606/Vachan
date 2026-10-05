// Checks the seed content for all six languages: structure, ids, and that every
// exercise is answerable with the server's own answer checker.
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { checkAnswer } from "../src/services/answer-checker.ts";
import type { AttemptAnswer } from "../src/schemas/content.schemas.ts";
import { buildCourse, shuffleFor, type ExerciseSeed } from "./course-builder.ts";
import { SEED_LANGUAGES, consonantGlyph, syllableGlyph, vowelGlyph } from "./seed-data.ts";

function withIds(exercise: ExerciseSeed) {
  return exercise.options.map((option, index) => ({
    id: `o${index + 1}`,
    text: option.text,
    isCorrect: option.isCorrect ?? false,
    correctPosition: option.correctPosition ?? null,
    matchText: option.matchText ?? null,
  }));
}

function perfectAnswer(exercise: ExerciseSeed): AttemptAnswer {
  const options = withIds(exercise);
  switch (exercise.type) {
    case "TRANSLATION":
      return { text: options.find((option) => option.isCorrect)!.text };
    case "WORD_ORDER":
      return {
        optionIds: options
          .filter((option) => option.correctPosition !== null)
          .sort((a, b) => a.correctPosition! - b.correctPosition!)
          .map((option) => option.id),
      };
    case "MATCHING":
      return { pairs: options.map((option) => ({ leftId: option.id, rightId: option.id })) };
    default:
      return { optionId: options.find((option) => option.isCorrect)!.id };
  }
}

const SINGLE_CHOICE = [
  "MULTIPLE_CHOICE",
  "CHARACTER_RECOGNITION",
  "CHARACTER_SOUND",
  "FILL_IN_BLANK",
];

describe("script helpers", () => {
  it("builds the right letters from each Unicode block", () => {
    assert.equal(vowelGlyph(0x0c00, "aa"), "ఆ");
    assert.equal(consonantGlyph(0x0900, "ka"), "क");
    assert.equal(consonantGlyph(0x0b80, "na"), "ந");
    assert.equal(syllableGlyph(0x0c00, "ka", "i"), "కి");
    assert.equal(syllableGlyph(0x0980, "ka", "aa"), "কা");
  });

  it("shuffles predictably and keeps every item", () => {
    const items = ["a", "b", "c"];
    assert.deepEqual(shuffleFor("x", items), shuffleFor("x", items));
    assert.deepEqual([...shuffleFor("te-u1-l1-e1", items)].sort(), items);
  });
});

for (const language of SEED_LANGUAGES) {
  describe(`${language.name} seed course`, () => {
    const course = buildCourse(language);
    const lessons = course.units.flatMap((unit) => unit.lessons);
    const exercises = lessons.flatMap((lesson) => lesson.exercises);

    it("has 4 units of small lessons and all seven exercise types", () => {
      assert.equal(course.units.length, 4);
      assert.equal(lessons.length, 16);
      for (const lesson of lessons) {
        assert.ok(lesson.exercises.length >= 4 && lesson.exercises.length <= 5, lesson.id);
      }
      assert.equal(new Set(exercises.map((exercise) => exercise.type)).size, 7);
    });

    it("teaches at most two new letters per script lesson", () => {
      for (const lesson of lessons.filter((item) => item.kind === "SCRIPT")) {
        assert.ok(lesson.vocabularyIds.length <= 3, lesson.id);
      }
    });

    it("every exercise is answerable and explained", () => {
      for (const exercise of exercises) {
        const options = withIds(exercise);
        if (SINGLE_CHOICE.includes(exercise.type)) {
          assert.equal(options.filter((option) => option.isCorrect).length, 1, exercise.id);
        }
        assert.equal(
          new Set(options.map((option) => option.text)).size,
          options.length,
          `${exercise.id}: option texts must be unique`,
        );
        if (exercise.type === "MATCHING") {
          assert.equal(
            new Set(options.map((option) => option.matchText)).size,
            options.length,
            `${exercise.id}: matching answers must be unique`,
          );
        }
        assert.ok(exercise.explanation.length > 0, exercise.id);
        assert.equal(
          checkAnswer({ type: exercise.type, options }, perfectAnswer(exercise)).isCorrect,
          true,
          exercise.id,
        );
      }
    });

    it("has unique ids and unique vocabulary per language", () => {
      const ids = [
        ...lessons.map((lesson) => lesson.id),
        ...exercises.map((exercise) => exercise.id),
      ];
      assert.equal(new Set(ids).size, ids.length);
      assert.equal(
        new Set(course.vocabulary.map((item) => item.script)).size,
        course.vocabulary.length,
      );
      for (const lesson of lessons) {
        for (const id of lesson.vocabularyIds) {
          assert.ok(
            course.vocabulary.some((item) => item.id === id),
            `${lesson.id} → ${id}`,
          );
        }
      }
    });
  });
}
