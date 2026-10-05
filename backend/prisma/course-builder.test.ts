// Checks the seed content for all six languages: every exercise must be answerable.
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { checkAnswer } from "../src/services/answer-checker.ts";
import type { AttemptAnswer } from "../src/schemas/content.schemas.ts";
import { buildCourse, type ExerciseSeed } from "./course-builder.ts";
import { SEED_LANGUAGES } from "./seed-data.ts";

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

for (const language of SEED_LANGUAGES) {
  describe(`${language.name} seed course`, () => {
    const course = buildCourse(language);
    const lessons = course.units.flatMap((unit) => unit.lessons);
    const exercises = lessons.flatMap((lesson) => lesson.exercises);

    it("has 3 units, 5 lessons and all six exercise types", () => {
      assert.equal(course.units.length, 3);
      assert.equal(lessons.length, 5);
      assert.equal(new Set(exercises.map((exercise) => exercise.type)).size, 6);
    });

    it("every exercise is answerable with exactly one correct choice where needed", () => {
      for (const exercise of exercises) {
        const options = withIds(exercise);
        if (["MULTIPLE_CHOICE", "CHARACTER_RECOGNITION", "FILL_IN_BLANK"].includes(exercise.type)) {
          assert.equal(options.filter((option) => option.isCorrect).length, 1, exercise.id);
        }
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
