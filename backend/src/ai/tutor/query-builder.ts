// Builds the text that is sent to RAG retrieval.
//
// The learner's question is usually used as-is. Two cases need more context, otherwise retrieval
// would search for the wrong thing:
//   • follow-ups — "Give me another example.", "Why?", "Explain it more simply" say nothing about
//     the topic, so the previous question is added;
//   • "Why is my answer wrong?" with an exercise — that wording says nothing about the topic, so the
//     exercise itself is searched for (the word/letter, the correct answer and the lesson's note).
// No LLM is used for this (cheap, predictable, testable).

const FOLLOW_UP =
  /\b(another|again|more|simpler|simply|this|that|it|they|these|those|why|example|examples|same|difference)\b/i;

export type QueryInput = {
  question: string;
  previousQuestion?: string | null;
  lessonTitle?: string | null;
  /** The exercise as search text, e.g. "అ — a. అ is “a”: short “a”, like the u in “cup”." */
  exercise?: { searchText: string } | null;
};

export type BuiltQuery = { query: string; reasons: string[] };

export function isFollowUp(question: string): boolean {
  const words = question.trim().split(/\s+/).filter(Boolean);
  return words.length <= 8 && FOLLOW_UP.test(question);
}

/** "Why is my answer wrong?", "What did I do wrong?", "Is this correct?" … */
const ABOUT_MY_ANSWER = /\b(wrong|mistake|incorrect|correct|right|why)\b/i;

export function buildRetrievalQuery(input: QueryInput): BuiltQuery {
  const parts = [input.question.trim()];
  const reasons: string[] = [];

  if (input.exercise) {
    const generic =
      isFollowUp(input.question) ||
      (ABOUT_MY_ANSWER.test(input.question) && input.question.split(/\s+/).length <= 8);
    if (generic) {
      reasons.push("searched for the exercise instead of the generic question");
      return { query: input.exercise.searchText.slice(0, 500), reasons };
    }
    parts.push(input.exercise.searchText);
    reasons.push("added the exercise");
  }
  if (isFollowUp(input.question)) {
    if (input.previousQuestion) {
      parts.unshift(input.previousQuestion.trim());
      reasons.push("follow-up: added the previous question");
    } else if (input.lessonTitle && !input.exercise) {
      parts.push(input.lessonTitle);
      reasons.push("follow-up: added the lesson title");
    }
  }
  return { query: parts.join(" \n").slice(0, 500), reasons };
}
