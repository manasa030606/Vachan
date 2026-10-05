// GET /api/recommendations — loads the inputs for the transparent rules in
// gamification/recommendations.ts for the learner's current (or given) language.
import { GAMIFICATION } from "../config/gamification.ts";
import { HttpError } from "../lib/http-error.ts";
import { prisma } from "../lib/prisma.ts";
import { getCourseDetail } from "./course.service.ts";
import { buildRecommendations } from "./gamification/recommendations.ts";
import { solvedInCurrentRun } from "./lesson.service.ts";
import { getReview } from "./review.service.ts";
import { getHearts } from "./stats.service.ts";

export const RECOMMENDATION_RULES = [
  "Out of hearts → review mistakes (each fixed mistake gives a heart back).",
  `Repeated mistakes → open mistakes answered wrong ${GAMIFICATION.recommendations.repeatedMistakeMin}+ times.`,
  "Unfinished lessons → lessons you started but didn't finish.",
  `Weak topics → completed lessons with accuracy below ${GAMIFICATION.recommendations.weakTopicAccuracyBelow}% (after ${GAMIFICATION.recommendations.weakTopicMinAnswers}+ answers).`,
  "Other mistakes → the rest of your review list.",
  "Next lesson → the next lesson on your path.",
];

export async function getRecommendations(userId: string, languageCode?: string) {
  let code = languageCode;
  if (!code) {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      select: { currentLanguage: { select: { code: true } } },
    });
    code = profile?.currentLanguage?.code;
  }
  if (!code) throw new HttpError(400, "NO_LANGUAGE", "Choose a language first");

  const course = await prisma.course.findFirst({
    where: { language: { code }, isPublished: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true },
  });
  if (!course) throw new HttpError(404, "COURSE_NOT_FOUND", "No course for this language");

  const [review, hearts, detail, rows] = await Promise.all([
    getReview(userId, code),
    getHearts(userId),
    getCourseDetail(course.id, userId),
    prisma.userLessonProgress.findMany({
      where: { userId, placedOut: false, lesson: { unit: { courseId: course.id } } },
      orderBy: { lastActivityAt: "desc" },
      include: { lesson: { select: { title: true, _count: { select: { exercises: true } } } } },
    }),
  ]);

  const unfinished = await Promise.all(
    rows
      .filter((row) => row.status === "IN_PROGRESS")
      .map(async (row) => ({
        lessonId: row.lessonId,
        title: row.lesson.title,
        done: (await solvedInCurrentRun(prisma, userId, row.lessonId, row.runStartedAt)).length,
        total: row.lesson._count.exercises,
      })),
  );
  const lessons = detail.units.flatMap((unit) => unit.lessons);
  const next = lessons.find((lesson) => lesson.id === detail.progress.currentLessonId) ?? null;

  return {
    languageCode: code,
    recommendations: buildRecommendations(
      {
        hearts: hearts.current,
        openMistakes: review.mistakes.map((mistake) => ({
          exerciseId: mistake.exerciseId,
          prompt: mistake.prompt,
          wrongCount: mistake.wrongCount,
          lessonTitle: mistake.lessonTitle,
        })),
        unfinishedLessons: unfinished,
        lessonStats: rows.map((row) => ({
          lessonId: row.lessonId,
          title: row.lesson.title,
          accuracy: row.accuracy,
          answers: row.correctAttempts + row.incorrectAttempts,
          status: row.status,
        })),
        nextLesson: next ? { lessonId: next.id, title: next.title } : null,
      },
      GAMIFICATION.recommendations,
    ),
    rules: RECOMMENDATION_RULES,
  };
}
