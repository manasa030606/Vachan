// The learning-path rules: which lessons are locked, available, current or completed.
// Pure functions (no database) so they are easy to unit-test.
//
// Rules (Phase 3):
//   1. Lessons unlock in order. A lesson is unlocked when it is the first lesson of the
//      course, when the lesson before it is completed, or when the learner already has
//      progress in it.
//   2. Each unlocked lesson gets one status:
//        completed — every exercise was answered correctly in one run (stays completed)
//        current   — started but not finished yet ("Continue")
//        available — unlocked but not started yet ("Start")
//        locked    — not reachable yet
//   3. The recommended lesson ("Up next") is the most recently active `current` lesson,
//      otherwise the first `available` one.

export type LessonStatus = "completed" | "current" | "available" | "locked";

export type LessonProgressInfo = {
  status: "IN_PROGRESS" | "COMPLETED";
  lastActivityAt: Date;
};

/**
 * @param orderedLessonIds every lesson of a course, in learning order (unit 1 lesson 1 first)
 * @param progress this learner's progress rows, by lesson id
 */
export function computeLessonStatuses(
  orderedLessonIds: string[],
  progress: ReadonlyMap<string, LessonProgressInfo>,
): Map<string, LessonStatus> {
  const statuses = new Map<string, LessonStatus>();
  let previousCompleted = true; // the first lesson is always unlocked

  for (const lessonId of orderedLessonIds) {
    const row = progress.get(lessonId);
    if (row?.status === "COMPLETED") {
      statuses.set(lessonId, "completed");
    } else if (row) {
      statuses.set(lessonId, "current");
    } else if (previousCompleted) {
      statuses.set(lessonId, "available");
    } else {
      statuses.set(lessonId, "locked");
    }
    previousCompleted = row?.status === "COMPLETED";
  }
  return statuses;
}

/** The lesson to show as "Up next", or null when the course is finished. */
export function pickRecommendedLesson(
  orderedLessonIds: string[],
  statuses: ReadonlyMap<string, LessonStatus>,
  progress: ReadonlyMap<string, LessonProgressInfo>,
): string | null {
  const inProgress = orderedLessonIds
    .filter((id) => statuses.get(id) === "current")
    .sort(
      (a, b) =>
        (progress.get(b)?.lastActivityAt.getTime() ?? 0) -
        (progress.get(a)?.lastActivityAt.getTime() ?? 0),
    );
  if (inProgress.length > 0) return inProgress[0];
  return orderedLessonIds.find((id) => statuses.get(id) === "available") ?? null;
}

export const isUnlocked = (status: LessonStatus | undefined) =>
  status !== undefined && status !== "locked";
