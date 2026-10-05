// Languages and courses (the learning path).
import { notFound } from "../lib/http-error.ts";
import { prisma } from "../lib/prisma.ts";
import {
  computeLessonStatuses,
  pickRecommendedLesson,
  type LessonProgressInfo,
  type LessonStatus,
} from "./lesson-status.ts";

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

type CourseTree = NonNullable<Awaited<ReturnType<typeof loadCourseTree>>>;

/** Lesson statuses for one learner in one course. Guests see only the first lesson open. */
export async function getStatusesForCourse(
  courseId: string,
  userId: string | null,
): Promise<Map<string, LessonStatus>> {
  const course = await loadCourseTree(courseId);
  if (!course) throw notFound("COURSE_NOT_FOUND", "Course not found");
  return (await statusesFor(course, userId)).statuses;
}

async function statusesFor(course: CourseTree, userId: string | null) {
  const orderedLessonIds = course.units.flatMap((unit) => unit.lessons.map((lesson) => lesson.id));
  const rows = userId
    ? await prisma.userLessonProgress.findMany({
        where: { userId, lessonId: { in: orderedLessonIds } },
        select: { lessonId: true, status: true, lastActivityAt: true },
      })
    : [];
  const progress = new Map<string, LessonProgressInfo>(rows.map((row) => [row.lessonId, row]));
  const statuses = computeLessonStatuses(orderedLessonIds, progress);
  return {
    statuses,
    recommendedLessonId: pickRecommendedLesson(orderedLessonIds, statuses, progress),
  };
}

/** A unit is locked until one of its lessons opens, and completed when every lesson is. */
function unitStatus(lessonStatuses: LessonStatus[]): "locked" | "active" | "completed" {
  if (lessonStatuses.every((status) => status === "completed")) return "completed";
  if (lessonStatuses.every((status) => status === "locked")) return "locked";
  return "active";
}

export async function getCourseDetail(courseId: string, userId: string | null) {
  const course = await loadCourseTree(courseId);
  if (!course) throw notFound("COURSE_NOT_FOUND", "Course not found");

  const { statuses, recommendedLessonId } = await statusesFor(course, userId);
  const statusOf = (lessonId: string) => statuses.get(lessonId) ?? "locked";
  const allLessons = course.units.flatMap((unit) => unit.lessons);
  const count = (status: LessonStatus) =>
    allLessons.filter((lesson) => statusOf(lesson.id) === status).length;

  return {
    id: course.id,
    title: course.title,
    description: course.description,
    language: course.language,
    progress: {
      completedLessons: count("completed"),
      inProgressLessons: count("current"),
      totalLessons: allLessons.length,
      /** The recommended next lesson ("Up next"); null when the course is finished. */
      currentLessonId: recommendedLessonId,
    },
    units: course.units.map((unit) => {
      const lessonStatuses = unit.lessons.map((lesson) => statusOf(lesson.id));
      return {
        id: unit.id,
        number: unit.sortOrder,
        title: unit.title,
        description: unit.description,
        stage: unit.stage,
        status: unitStatus(lessonStatuses),
        completedLessons: lessonStatuses.filter((status) => status === "completed").length,
        lessons: unit.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          kind: lesson.kind,
          exerciseCount: lesson._count.exercises,
          status: statusOf(lesson.id),
        })),
      };
    }),
  };
}
