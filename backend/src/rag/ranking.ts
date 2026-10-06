// Step 7 of the pipeline: METADATA RE-RANKING.
//
// Priority asked for by the spec:
//   1. correct language     → hard filter in SQL (vector-store.ts), never a bonus
//   2. learner level        → bonus for the same level, small bonus for easier, penalty for harder
//   3. relevant topic       → bonus when the chunk's topic is the requested one
//   4. semantic similarity  → the base score (cosine similarity from pgvector)
// Plus: a bonus when the question contains a native-script word that appears in the chunk
// (e.g. "What does అమ్మ mean?"), because exact words matter for vocabulary questions.
//
// score = similarity + levelBonus + topicBonus + termBonus — simple and explainable.
import { KNOWLEDGE_LEVELS, RAG_CONFIG, type KnowledgeLevelName } from "./config.ts";

export type LevelMatch = "exact" | "easier" | "harder" | "not-requested";

export type Relevance = {
  /** Cosine similarity between the question and the chunk (0–1, higher = closer in meaning) */
  similarity: number;
  levelMatch: LevelMatch;
  topicMatch: boolean | null;
  /** Native-script words from the question found in the chunk */
  matchedTerms: string[];
  /** Sum of the metadata bonuses/penalties */
  boost: number;
  /** similarity + boost — results are sorted by this */
  score: number;
};

export type RankInput = {
  similarity: number;
  level: string; // "BEGINNER" (database) or "beginner"
  topic: string;
  content: string;
  heading: string;
};

export function compareLevels(
  chunkLevel: string,
  learnerLevel: KnowledgeLevelName | undefined,
): LevelMatch {
  if (!learnerLevel) return "not-requested";
  const chunk = KNOWLEDGE_LEVELS.indexOf(chunkLevel.toLowerCase() as KnowledgeLevelName);
  const learner = KNOWLEDGE_LEVELS.indexOf(learnerLevel);
  if (chunk === learner) return "exact";
  return chunk < learner ? "easier" : "harder";
}

const round = (value: number) => Math.round(value * 10_000) / 10_000;

export function scoreCandidate(
  candidate: RankInput,
  request: { level?: KnowledgeLevelName; topic?: string; terms: string[] },
): Relevance {
  const { boosts } = RAG_CONFIG.retrieval;
  const levelMatch = compareLevels(candidate.level, request.level);
  const topicMatch = request.topic ? candidate.topic === request.topic : null;
  const text = `${candidate.heading}\n${candidate.content}`;
  const matchedTerms = request.terms.filter((term) => text.includes(term));

  let boost = 0;
  if (levelMatch === "exact") boost += boosts.levelExact;
  if (levelMatch === "easier") boost += boosts.levelBelow;
  if (levelMatch === "harder") boost += boosts.levelAbove;
  if (topicMatch) boost += boosts.topicMatch;
  if (matchedTerms.length > 0) boost += boosts.termMatch;

  return {
    similarity: round(candidate.similarity),
    levelMatch,
    topicMatch,
    matchedTerms,
    boost: round(boost),
    score: round(candidate.similarity + boost),
  };
}

/** Scores and sorts candidates (highest score first; ties keep the vector-search order). */
export function rankCandidates<T extends RankInput>(
  candidates: T[],
  request: { level?: KnowledgeLevelName; topic?: string; terms: string[] },
): Array<T & { relevance: Relevance }> {
  return candidates
    .map((candidate, index) => ({
      candidate,
      index,
      relevance: scoreCandidate(candidate, request),
    }))
    .sort((a, b) => b.relevance.score - a.relevance.score || a.index - b.index)
    .map(({ candidate, relevance }) => ({ ...candidate, relevance }));
}
