// Languages and courses (the learning path).
import { notFound } from "../lib/http-error.ts";
import { prisma } from "../lib/prisma.ts";
import { computeLessonStatuses, type LessonStatus } from "./lesson-status.ts";

const languageSelect = {
  id: true,
  code: true,
  name: true,
  nativeName: true,
  scriptName: true,
  description: true,
} as const;

export async function listLanguages() {
  return prisma.language.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: languageSelect,
  });
}

export async function listCourses(languageCode?: string) {
  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
      language: { isActive: true, ...(languageCode ? { code: languageCode } : {}) },
    },
    orderBy: [{ language: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    include: {
      language: { select: languageSelect },
      units: { select: { _count: { select: { lessons: { where: { isPublished: true } } } } } },
    },
  });

  return courses.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    language: course.language,
    unitCount: course.units.length,
    lessonCount: course.units.reduce((sum, unit) => sum + unit._count.lessons, 0),
  }));
}

/** Loads a course with its units and lessons in learning order. */
async function loadCourseTree(courseId: string) {
  return prisma.course.findFirst({
    where: { id: courseId, isPublished: true },
    include: {
      language: { select: languageSelect },
      units: {
        orderBy: { sortOrder: "asc" },
        include: {
          lessons: {
            where: { isPublished: true },
            orderBy: { sortOrder: "asc" },
            select: {
              id: true,
              title: true,
              kind: true,
              sortOrder: true,
              _count: { select: { exercises: true } },
            },
          },
        },
      },
    },
  });
}

/** Lesson statuses for one learner in one course. Guests see only the first lesson open. */
export async function getStatusesForCourse(
  courseId: string,
  userId: string | null,
): Promise<Map<string, LessonStatus>> {
  const course = await loadCourseTree(courseId);
  if (!course) throw notFound("COURSE_NOT_FOUND", "Course not found");
  return statusesFor(course, userId);
}

async function statusesFor(
  course: NonNullable<Awaited<ReturnType<typeof loadCourseTree>>>,
  userId: string | null,
) {
  const orderedLessonIds = course.units.flatMap((unit) => unit.lessons.map((lesson) => lesson.id));
  const completed = userId
    ? await prisma.userLessonProgress.findMany({
        where: { userId, status: "COMPLETED", lessonId: { in: orderedLessonIds } },
        select: { lessonId: true },
      })
    : [];
  return computeLessonStatuses(orderedLessonIds, new Set(completed.map((row) => row.lessonId)));
}

export async function getCourseDetail(courseId: string, userId: string | null) {
  const course = await loadCourseTree(courseId);
  if (!course) throw notFound("COURSE_NOT_FOUND", "Course not found");

  const statuses = await statusesFor(course, userId);
  const allLessons = course.units.flatMap((unit) => unit.lessons);
  const completedLessons = allLessons.filter((lesson) => statuses.get(lesson.id) === "completed");
  const currentLesson = allLessons.find((lesson) => statuses.get(lesson.id) === "current") ?? null;

  return {
    id: course.id,
    title: course.title,
    description: course.description,
    language: course.language,
    progress: {
      completedLessons: completedLessons.length,
      totalLessons: allLessons.length,
      currentLessonId: currentLesson?.id ?? null,
    },
    units: course.units.map((unit) => ({
      id: unit.id,
      number: unit.sortOrder,
      title: unit.title,
      description: unit.description,
      stage: unit.stage,
      lessons: unit.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        kind: lesson.kind,
        exerciseCount: lesson._count.exercises,
        status: statuses.get(lesson.id) ?? "locked",
      })),
    })),
  };
}
