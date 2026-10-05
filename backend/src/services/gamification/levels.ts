// Learner levels from total XP. Thresholds live in config/gamification.ts (levelThresholds).

export type LevelInfo = {
  level: number;
  /** XP needed to reach the current level. */
  levelStartXp: number;
  /** XP needed for the next level (null at the top level). */
  nextLevelXp: number | null;
  xpIntoLevel: number;
  /** XP still missing for the next level (0 at the top level). */
  xpToNextLevel: number;
  isMaxLevel: boolean;
};

export function levelFor(totalXp: number, thresholds: readonly number[]): LevelInfo {
  let index = 0;
  for (let i = 0; i < thresholds.length; i++) if (totalXp >= thresholds[i]) index = i;
  const levelStartXp = thresholds[index];
  const nextLevelXp = thresholds[index + 1] ?? null;
  return {
    level: index + 1,
    levelStartXp,
    nextLevelXp,
    xpIntoLevel: totalXp - levelStartXp,
    xpToNextLevel: nextLevelXp === null ? 0 : nextLevelXp - totalXp,
    isMaxLevel: nextLevelXp === null,
  };
}
