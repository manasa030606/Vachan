// Placement test: a short test that recommends a starting unit.
//
// Questions: 3 per unit (12 for the 4-unit course), re-using real course exercises and
// covering script/character recognition, vocabulary, translation and sentence understanding.
// (Listening questions are added with audio in Phase 7.)
// Scoring: transparent rules in gamification/placement-scoring.ts — not machine learning.
// Placement answers never cost hearts, give XP or count as mistakes.
import { GAMIFICATION } from "../config/gamification.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import { HttpError, notFound } from "../lib/http-error.ts";
import { prisma } from "../lib/prisma.ts";
import type { AttemptAnswer } from "../schemas/content.schemas.ts";
import { checkAnswer } from "./answer-checker.ts";
import { scorePlacement } from "./gamification/placement-scoring.ts";
import { toPublicExercise } from "./lesson.service.ts";

const SELF_ASSESSMENT_LABELS: Record<string, string> = {
  new: "Completely new — I know nothing",
  "few-words": "I know a few words",
  "knows-script": "I know the alphabet/script but need practice",
  "basic-sentences": "I can understand basic sentences",
  "simple-conversations": "I can have simple conversations",
  advanced: "I'm comfortable and want advanced practice",
};

export const PLACEMENT_RULES = [
  `The test has ${GAMIFICATION.placement.questionsPerUnit} questions for each unit.`,
  `A unit is passed with at least ${GAMIFICATION.placement.passMark} correct answers out of ${GAMIFICATION.placement.questionsPerUnit}.`,
  "Units are checked in order: you start at the first unit you did not pass.",
  "If you pass every unit, you start at the last unit.",
  "You can always choose to start from Unit 1 instead.",
];

async function resolveLanguage(userId: string, languageCode?: string) {
  if (languageCode) {
    const language = await prisma.language.findUnique({ where: { code: languageCode } });
    if (!language)
      throw new HttpError(400, "UNKNOWN_LANGUAGE", `Language "${languageCode}" is not supported`);
    return language;
  }
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    include: { currentLanguage: true },
  });
  if (!profile?.currentLanguage) {
    throw new HttpError(
      400,
      "NO_LANGUAGE",
      "Choose a language first (PATCH /api/me with languageCode)",
    );
  }
  return profile.currentLanguage;
}

/** POST /api/placement/start */
export async function startPlacement(userId: string, languageCode?: string) {
  const language = await resolveLanguage(userId, languageCode);
  const questions = await prisma.placementQuestion.findMany({
    where: { languageId: language.id },
    orderBy: { sortOrder: "asc" },
    include: { exercise: { include: { options: true } } },
  });
  if (questions.length === 0) {
    throw notFound(
      "PLACEMENT_NOT_AVAILABLE",
      "No placement test for this language yet. Did you run the seed?",
    );
  }
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    select: { selfAssessment: true },
  });
  const test = await prisma.placementTest.create({
    data: { userId, languageId: language.id, selfAssessment: profile?.selfAssessment ?? null },
  });

  return {
    test: {
      id: test.id,
      status: test.status,
      language: { code: language.code, name: language.name },
      selfAssessment: test.selfAssessment,
      totalQuestions: questions.length,
    },
    questions: questions.map((question) => ({
      id: question.id,
      unit: question.unitNumber,
      skill: question.skill,
      exercise: toPublicExercise(question.exercise),
    })),
    rules: PLACEMENT_RULES,
  };
}

async function loadTest(userId: string, testId: string) {
  const test = await prisma.placementTest.findFirst({ where: { id: testId, userId } });
  if (!test) throw notFound("PLACEMENT_NOT_FOUND", "Placement test not found");
  return test;
}

/** POST /api/placement/answer — saves one answer. Correctness is only revealed in the result. */
export async function answerPlacement(
  userId: string,
  testId: string,
  questionId: string,
  answer: AttemptAnswer,
) {
  const test = await loadTest(userId, testId);
  if (test.status !== "IN_PROGRESS") {
    throw new HttpError(409, "PLACEMENT_FINISHED", "This placement test is already finished");
  }
  const question = await prisma.placementQuestion.findFirst({
    where: { id: questionId, languageId: test.languageId },
    include: { exercise: { include: { options: true } } },
  });
  if (!question) throw notFound("QUESTION_NOT_FOUND", "This question is not part of the test");

  const already = await prisma.placementAnswer.findUnique({
    where: { testId_questionId: { testId, questionId } },
  });
  if (already) throw new HttpError(409, "ALREADY_ANSWERED", "This question was already answered");

  const { isCorrect } = checkAnswer(question.exercise, answer);
  try {
    await prisma.placementAnswer.create({
      data: { testId, questionId, answer: answer as Prisma.InputJsonValue, isCorrect },
    });
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") {
      throw new HttpError(409, "ALREADY_ANSWERED", "This question was already answered");
    }
    throw error;
  }

  const [answered, total] = await Promise.all([
    prisma.placementAnswer.count({ where: { testId } }),
    prisma.placementQuestion.count({ where: { languageId: test.languageId } }),
  ]);
  const completed = answered >= total;
  if (completed) await finishPlacement(test.id, test.languageId);
  return { testId, answered, total, completed };
}

async function finishPlacement(testId: string, languageId: string) {
  const [answers, questions] = await Promise.all([
    prisma.placementAnswer.findMany({ where: { testId }, include: { question: true } }),
    prisma.placementQuestion.findMany({ where: { languageId }, select: { unitNumber: true } }),
  ]);
  const score = scorePlacement(
    answers.map((answer) => ({ unit: answer.question.unitNumber, isCorrect: answer.isCorrect })),
    [...new Set(questions.map((question) => question.unitNumber))],
    GAMIFICATION.placement.passMark,
  );
  await prisma.placementTest.update({
    where: { id: testId },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
      correctCount: score.correctCount,
      recommendedUnit: score.recommendedUnit,
    },
  });
}

async function courseUnits(languageId: string) {
  const course = await prisma.course.findFirst({
    where: { languageId, isPublished: true },
    orderBy: { sortOrder: "asc" },
    include: {
      units: {
        orderBy: { sortOrder: "asc" },
        include: {
          lessons: {
            where: { isPublished: true },
            orderBy: { sortOrder: "asc" },
            select: { id: true },
          },
        },
      },
    },
  });
  if (!course) throw notFound("COURSE_NOT_FOUND", "Course not found");
  return course.units;
}

/** GET /api/placement/result — a test id, or the latest test for the learner's current language. */
export async function getPlacementResult(userId: string, testId?: string) {
  let test;
  if (testId) {
    test = await loadTest(userId, testId);
  } else {
    const language = await resolveLanguage(userId);
    test = await prisma.placementTest.findFirst({
      where: { userId, languageId: language.id },
      orderBy: { startedAt: "desc" },
    });
    if (!test)
      throw notFound("PLACEMENT_NOT_FOUND", "You haven't taken a placement test for this language");
  }

  const [answers, questions, units, language] = await Promise.all([
    prisma.placementAnswer.findMany({ where: { testId: test.id }, include: { question: true } }),
    prisma.placementQuestion.findMany({ where: { languageId: test.languageId } }),
    courseUnits(test.languageId),
    prisma.language.findUniqueOrThrow({
      where: { id: test.languageId },
      select: { code: true, name: true },
    }),
  ]);

  if (test.status === "IN_PROGRESS") {
    throw new HttpError(409, "PLACEMENT_INCOMPLETE", "Answer every question to see your result", {
      answered: answers.length,
      total: questions.length,
    });
  }

  const score = scorePlacement(
    answers.map((answer) => ({ unit: answer.question.unitNumber, isCorrect: answer.isCorrect })),
    [...new Set(questions.map((question) => question.unitNumber))],
    GAMIFICATION.placement.passMark,
  );
  const titleOf = (unit: number) =>
    units.find((item) => item.sortOrder === unit)?.title ?? `Unit ${unit}`;
  const recommendedUnit = test.recommendedUnit ?? score.recommendedUnit;

  return {
    testId: test.id,
    status: test.status,
    language,
    selfAssessment: test.selfAssessment
      ? {
          id: test.selfAssessment,
          label: SELF_ASSESSMENT_LABELS[test.selfAssessment] ?? test.selfAssessment,
        }
      : null,
    correctCount: score.correctCount,
    totalQuestions: questions.length,
    units: score.units.map((unit) => ({
      ...unit,
      title: titleOf(unit.unit),
      skills: [...new Set(questions.filter((q) => q.unitNumber === unit.unit).map((q) => q.skill))],
    })),
    recommendedUnit,
    recommendedUnitTitle: titleOf(recommendedUnit),
    message: `You are ready for Unit ${recommendedUnit} — ${titleOf(recommendedUnit)}.`,
    chosenUnit: test.chosenUnit,
    rules: PLACEMENT_RULES,
  };
}

/**
 * POST /api/placement/decide
 *   "recommended" → lessons in the units before the recommended one are unlocked
 *                   (saved as COMPLETED + placedOut; no XP, not counted for badges)
 *   "beginning"   → start from Unit 1, nothing is unlocked
 */
export async function decidePlacement(
  userId: string,
  testId: string,
  choice: "recommended" | "beginning",
) {
  const test = await loadTest(userId, testId);
  if (test.status === "IN_PROGRESS") {
    throw new HttpError(409, "PLACEMENT_INCOMPLETE", "Finish the placement test first");
  }
  if (test.status === "ACCEPTED" || test.status === "DECLINED") {
    throw new HttpError(
      409,
      "PLACEMENT_ALREADY_DECIDED",
      "You already chose a starting unit for this test",
    );
  }

  const units = await courseUnits(test.languageId);
  const chosenUnit = choice === "recommended" ? (test.recommendedUnit ?? 1) : 1;
  const skippedLessonIds = units
    .filter((unit) => unit.sortOrder < chosenUnit)
    .flatMap((unit) => unit.lessons.map((lesson) => lesson.id));

  const now = new Date();
  const created = await prisma.$transaction(async (tx) => {
    const existing = await tx.userLessonProgress.findMany({
      where: { userId, lessonId: { in: skippedLessonIds } },
      select: { lessonId: true },
    });
    const have = new Set(existing.map((row) => row.lessonId));
    const toCreate = skippedLessonIds.filter((id) => !have.has(id));
    if (toCreate.length > 0) {
      await tx.userLessonProgress.createMany({
        data: toCreate.map((lessonId) => ({
          userId,
          lessonId,
          status: "COMPLETED",
          placedOut: true,
          startedAt: now,
          runStartedAt: now,
          lastActivityAt: now,
          completedAt: now,
        })),
      });
    }
    await tx.placementTest.update({
      where: { id: test.id },
      data: {
        status: choice === "recommended" ? "ACCEPTED" : "DECLINED",
        chosenUnit,
        decidedAt: now,
      },
    });
    return toCreate.length;
  });

  const startUnit = units.find((unit) => unit.sortOrder === chosenUnit);
  return {
    testId: test.id,
    status: choice === "recommended" ? "ACCEPTED" : "DECLINED",
    chosenUnit,
    startLessonId: startUnit?.lessons[0]?.id ?? null,
    lessonsUnlocked: created,
  };
}
