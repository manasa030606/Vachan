// Checks the generated course for all six languages: the content files are complete, the
// structure matches the curriculum, ids are unique, and every exercise is answerable with the
// server's own answer checker.
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { checkAnswer } from "../src/services/answer-checker.ts";
import type { AttemptAnswer } from "../src/schemas/content.schemas.ts";
import { buildCourse, shuffleFor, type ExerciseSeed } from "./course-builder.ts";
import { checkContent } from "./content/check.ts";
import { CURRICULUM, PLACEMENT_UNITS } from "./content/curriculum.ts";
import { SEED_LANGUAGES } from "./content/index.ts";
import { SCRIPT_PLANS, consonantLetter, syllable, vowelLetter } from "./content/script.ts";

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

const EXERCISE_TYPES = [
  "MULTIPLE_CHOICE",
  "TRANSLATION",
  "MATCHING",
  "WORD_ORDER",
  "FILL_IN_BLANK",
  "CHARACTER_RECOGNITION",
  "CHARACTER_SOUND",
];

describe("script helpers", () => {
  it("builds the right letters from each Unicode block", () => {
    assert.equal(vowelLetter(SCRIPT_PLANS.te!, "aa").script, "ఆ");
    assert.equal(consonantLetter(SCRIPT_PLANS.hi!, "ka").script, "क");
    assert.equal(consonantLetter(SCRIPT_PLANS.ta!, "ka").script, "க");
    assert.equal(syllable(SCRIPT_PLANS.te!, "ka", "i").script, "కి");
    assert.equal(syllable(SCRIPT_PLANS.bn!, "ka", "aa").script, "কা");
    assert.equal(syllable(SCRIPT_PLANS.ml!, "ka", "e").script, "കേ");
  });

  it("shuffles predictably and keeps every item", () => {
    const items = ["a", "b", "c"];
    assert.deepEqual(shuffleFor("x", items), shuffleFor("x", items));
    assert.deepEqual([...shuffleFor("te-u1-l1-e01", items)].sort(), items);
  });
});

for (const language of SEED_LANGUAGES) {
  describe(`${language.name} course`, () => {
    const course = buildCourse(language, language.content);
    const lessons = course.units.flatMap((unit) => unit.lessons);
    const exercises = lessons.flatMap((lesson) => lesson.exercises);

    it("content file is complete and uses the right script", () => {
      assert.deepEqual(checkContent(language.content), []);
    });

    it("follows the curriculum: 16 units, 95 lessons, 8–15 exercises each, all seven types", () => {
      assert.equal(course.units.length, CURRICULUM.length);
      assert.equal(lessons.length, CURRICULUM.flatMap((unit) => unit.lessons).length);
      for (const lesson of lessons) {
        assert.ok(
          lesson.exercises.length >= 8 && lesson.exercises.length <= 15,
          `${lesson.id}: ${lesson.exercises.length}`,
        );
      }
      assert.deepEqual(
        new Set(exercises.map((exercise) => exercise.type)),
        new Set(EXERCISE_TYPES),
      );
    });

    it("teaches hundreds of words and phrases", () => {
      const words = course.vocabulary.filter((item) => item.kind === "WORD").length;
      const phrases = course.vocabulary.filter((item) => item.kind === "PHRASE").length;
      assert.ok(words + phrases >= 500, `${words} words + ${phrases} phrases`);
      assert.ok(phrases >= 200, `${phrases} phrases`);
    });

    it("has 3 placement questions per placement unit, all pointing at real exercises", () => {
      const ids = new Set(exercises.map((exercise) => exercise.id));
      assert.equal(course.placementQuestions.length, PLACEMENT_UNITS.length * 3);
      for (const unit of PLACEMENT_UNITS) {
        assert.equal(course.placementQuestions.filter((q) => q.unitNumber === unit).length, 3);
      }
      for (const question of course.placementQuestions) {
        assert.ok(ids.has(question.exerciseId), question.exerciseId);
        assert.ok(question.exerciseId.includes(`-u${question.unitNumber}-`), question.exerciseId);
      }
    });
    it("never asks the same question twice in one lesson", () => {
      for (const lesson of lessons) {
        const keys = lesson.exercises.map((exercise) => {
          const answer = exercise.options
            .filter(
              (option) => option.isCorrect || option.correctPosition != null || option.matchText,
            )
            .map((option) => `${option.text}=${option.matchText ?? option.correctPosition ?? ""}`)
            .sort()
            .join(",");
          return `${exercise.type}|${exercise.prompt}|${answer}`;
        });
        assert.equal(new Set(keys).size, keys.length, lesson.id);
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
      assert.equal(
        new Set(course.vocabulary.map((item) => item.id)).size,
        course.vocabulary.length,
      );
      const optionIds = exercises.flatMap((exercise) =>
        exercise.options.map((_, index) => `${exercise.id}-o${index + 1}`),
      );
      assert.equal(new Set(optionIds).size, optionIds.length);
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
