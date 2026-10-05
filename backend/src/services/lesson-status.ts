// Which lessons are completed, which one is next, and which are still locked.
// Pure function (no database) so it is easy to unit-test.
//
// Rule (Phase 2): lessons unlock in order. A lesson is open when every lesson
// before it in the course is completed. The first open, not-yet-completed
// lesson is the learner's "current" lesson.

export type LessonStatus = "completed" | "current" | "locked";

/**
 * @param orderedLessonIds every lesson of a course, in learning order (unit 1 lesson 1 first)
 * @param completedLessonIds lessons this learner has completed
 */
export function computeLessonStatuses(
  orderedLessonIds: string[],
  completedLessonIds: ReadonlySet<string>,
): Map<string, LessonStatus> {
  const statuses = new Map<string, LessonStatus>();
  let foundCurrent = false;

  for (const lessonId of orderedLessonIds) {
    if (!foundCurrent && completedLessonIds.has(lessonId)) {
      statuses.set(lessonId, "completed");
    } else if (!foundCurrent) {
      statuses.set(lessonId, "current");
      foundCurrent = true;
    } else {
      statuses.set(lessonId, "locked");
    }
  }
  return statuses;
}
