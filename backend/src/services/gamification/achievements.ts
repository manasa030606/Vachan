// Badge rules (pure): a badge is unlocked when the learner's metric reaches its threshold.
import type { AchievementMetric } from "../../generated/prisma/enums.ts";

export type AchievementMetrics = Record<AchievementMetric, number>;

export type AchievementRule = { code: string; metric: AchievementMetric; threshold: number };

/** Codes of badges that are earned now but were not unlocked before. */
export function newlyEarned(
  rules: AchievementRule[],
  metrics: AchievementMetrics,
  alreadyUnlocked: ReadonlySet<string>,
): string[] {
  return rules
    .filter((rule) => !alreadyUnlocked.has(rule.code) && metrics[rule.metric] >= rule.threshold)
    .map((rule) => rule.code);
}

/** 0–1 progress towards a badge. */
export function progressTowards(rule: AchievementRule, metrics: AchievementMetrics): number {
  return Math.min(1, metrics[rule.metric] / rule.threshold);
}
