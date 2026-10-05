// Placement scoring — transparent rules, NOT machine learning:
//   1. The test has the same number of questions for each unit (config: questionsPerUnit).
//   2. A unit is PASSED with at least `passMark` correct answers.
//   3. Units are checked in order. The recommended starting unit is the FIRST unit that
//      was not passed — you can't skip a unit you haven't shown you know.
//   4. If every unit is passed, the recommendation is the last unit.

export type PlacementUnitScore = {
  unit: number;
  correct: number;
  total: number;
  passed: boolean;
};

export function scorePlacement(
  answers: Array<{ unit: number; isCorrect: boolean }>,
  unitNumbers: number[],
  passMark: number,
): { units: PlacementUnitScore[]; recommendedUnit: number; correctCount: number } {
  const units = [...unitNumbers]
    .sort((a, b) => a - b)
    .map((unit) => {
      const mine = answers.filter((answer) => answer.unit === unit);
      const correct = mine.filter((answer) => answer.isCorrect).length;
      return { unit, correct, total: mine.length, passed: correct >= passMark };
    });
  const firstGap = units.find((unit) => !unit.passed);
  return {
    units,
    recommendedUnit: firstGap ? firstGap.unit : units[units.length - 1].unit,
    correctCount: answers.filter((answer) => answer.isCorrect).length,
  };
}
