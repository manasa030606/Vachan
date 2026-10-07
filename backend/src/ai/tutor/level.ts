// Learner level for the tutor: beginner · elementary · intermediate.
// A simple rule, not ML: the request may set it; otherwise it comes from the onboarding
// self-assessment (the same answer the placement test uses).
import type { KnowledgeLevelName } from "../../rag/config.ts";

const FROM_SELF_ASSESSMENT: Record<string, KnowledgeLevelName> = {
  new: "beginner",
  "few-words": "beginner",
  "knows-script": "beginner",
  "basic-sentences": "elementary",
  "simple-conversations": "elementary",
  advanced: "intermediate",
};

export type LevelDecision = {
  level: KnowledgeLevelName;
  source: "request" | "self-assessment" | "default";
};

export function decideLevel(
  requested: KnowledgeLevelName | undefined,
  selfAssessment: string | null | undefined,
): LevelDecision {
  if (requested) return { level: requested, source: "request" };
  const fromProfile = selfAssessment ? FROM_SELF_ASSESSMENT[selfAssessment] : undefined;
  if (fromProfile) return { level: fromProfile, source: "self-assessment" };
  return { level: "beginner", source: "default" };
}
