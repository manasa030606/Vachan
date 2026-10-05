// Sanity checks for the mock content of all six languages: every demo lesson must be
// answerable, and the course paths must have exactly one "current" lesson.
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Exercise, ExerciseAnswer } from "@/types/exercise";
import { isAnswerCorrect } from "@/lib/exercises/check-answer";
import { LANGUAGES } from "./languages";
import { getCoursePath } from "./mock-course";
import { buildDemoLesson } from "./mock-lessons";

/** Builds the correct answer for an exercise, the way a perfect learner would. */
function perfectAnswer(exercise: Exercise): ExerciseAnswer {
  switch (exercise.type) {
    case "multiple-choice":
    case "character-recognition":
    case "fill-in-blank":
      return { type: "choice", optionId: exercise.correctOptionId };
    case "translation":
      return { type: "text", value: exercise.acceptedAnswers[0] };
    case "word-order":
      return { type: "order", tokenIds: exercise.correctOrder };
    case "matching":
      return { type: "matching", complete: true };
  }
}

for (const language of LANGUAGES) {
  describe(`${language.name} mock content`, () => {
    const lesson = buildDemoLesson(language.code, `${language.code}-u2-l2`);

    it("has one exercise of each of the six types", () => {
      const types = new Set(lesson.exercises.map((exercise) => exercise.type));
      assert.equal(types.size, 6);
    });

    it("has correct answers that exist in the options and check as correct", () => {
      for (const exercise of lesson.exercises) {
        if ("correctOptionId" in exercise) {
          assert.ok(
            exercise.options.some((option) => option.id === exercise.correctOptionId),
            exercise.id,
          );
        }
        if (exercise.type === "word-order") {
          for (const id of exercise.correctOrder) {
            assert.ok(
              exercise.tokens.some((token) => token.id === id),
              exercise.id,
            );
          }
        }
        assert.equal(isAnswerCorrect(exercise, perfectAnswer(exercise)), true, exercise.id);
      }
    });

    it("has exactly one current lesson in the path", () => {
      const current = getCoursePath(language.code)
        .flatMap((unit) => unit.lessons)
        .filter((item) => item.status === "current");
      assert.equal(current.length, 1);
    });
  });
}
