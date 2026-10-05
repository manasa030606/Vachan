// Practice recommendations — transparent rules (NOT a machine-learning model).
// Thresholds live in config/gamification.ts (recommendations).
//
//   Rule 1  Out of hearts            → review mistakes (each correct review answer gives a heart back)
//   Rule 2  Repeated mistakes        → open mistakes answered wrong ≥ repeatedMistakeMin times
//   Rule 3  Unfinished lessons       → started, not finished (most recent first)
//   Rule 4  Weak topics              → lessons with accuracy < weakTopicAccuracyBelow % after ≥ weakTopicMinAnswers answers
//   Rule 5  Other open mistakes      → the rest of the review list
//   Rule 6  Next lesson              → the next lesson on the path
// The list is cut at maxItems.

export type RecommendationInput = {
  hearts: number;
  openMistakes: Array<{
    exerciseId: string;
    prompt: string;
    wrongCount: number;
    lessonTitle: string;
  }>;
  unfinishedLessons: Array<{ lessonId: string; title: string; done: number; total: number }>;
  lessonStats: Array<{
    lessonId: string;
    title: string;
    accuracy: number | null;
    answers: number;
    status: string;
  }>;
  nextLesson: { lessonId: string; title: string } | null;
};

export type RecommendationConfig = {
  repeatedMistakeMin: number;
  weakTopicAccuracyBelow: number;
  weakTopicMinAnswers: number;
  maxItems: number;
};

export type Recommendation = {
  type:
    | "earn-hearts"
    | "repeated-mistakes"
    | "unfinished-lesson"
    | "weak-topic"
    | "review"
    | "next-lesson";
  title: string;
  /** Why it is recommended — which rule fired, in plain words. */
  reason: string;
  action: { kind: "review" } | { kind: "lesson"; lessonId: string };
};

export function buildRecommendations(
  input: RecommendationInput,
  config: RecommendationConfig,
): Recommendation[] {
  const list: Recommendation[] = [];
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

  if (input.hearts <= 0 && input.openMistakes.length > 0) {
    list.push({
      type: "earn-hearts",
      title: "Earn hearts back",
      reason: "You're out of hearts. Each mistake you fix in the review gives one back.",
      action: { kind: "review" },
    });
  }

  const repeated = input.openMistakes.filter((m) => m.wrongCount >= config.repeatedMistakeMin);
  if (repeated.length > 0) {
    const worst = [...repeated].sort((a, b) => b.wrongCount - a.wrongCount)[0];
    list.push({
      type: "repeated-mistakes",
      title: `Fix ${plural(repeated.length, "repeated mistake")}`,
      reason: `You answered “${worst.prompt}” wrong ${worst.wrongCount} times (rule: ${config.repeatedMistakeMin}+ wrong answers).`,
      action: { kind: "review" },
    });
  }

  for (const lesson of input.unfinishedLessons.slice(0, 2)) {
    list.push({
      type: "unfinished-lesson",
      title: `Finish “${lesson.title}”`,
      reason:
        lesson.done > 0
          ? `You stopped half-way: ${lesson.done} of ${lesson.total} exercises done.`
          : "You started this lesson but haven't finished it yet.",
      action: { kind: "lesson", lessonId: lesson.lessonId },
    });
  }

  const weak = input.lessonStats
    .filter(
      (lesson) =>
        lesson.status === "COMPLETED" &&
        lesson.accuracy !== null &&
        lesson.accuracy < config.weakTopicAccuracyBelow &&
        lesson.answers >= config.weakTopicMinAnswers,
    )
    .sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0));
  for (const lesson of weak.slice(0, 2)) {
    list.push({
      type: "weak-topic",
      title: `Practise “${lesson.title}” again`,
      reason: `Weak topic: ${lesson.accuracy}% accuracy (below ${config.weakTopicAccuracyBelow}%).`,
      action: { kind: "lesson", lessonId: lesson.lessonId },
    });
  }

  const others = input.openMistakes.length - repeated.length;
  if (others > 0) {
    list.push({
      type: "review",
      title: `Review ${plural(input.openMistakes.length, "mistake")}`,
      reason: `${plural(others, "mistake")} from your lessons ${others === 1 ? "is" : "are"} waiting to be fixed.`,
      action: { kind: "review" },
    });
  }

  if (
    input.nextLesson &&
    !input.unfinishedLessons.some((l) => l.lessonId === input.nextLesson?.lessonId)
  ) {
    list.push({
      type: "next-lesson",
      title: `Start “${input.nextLesson.title}”`,
      reason: "The next lesson on your path.",
      action: { kind: "lesson", lessonId: input.nextLesson.lessonId },
    });
  }

  return list.slice(0, config.maxItems);
}
