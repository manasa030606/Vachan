// Badge definitions. `npm run db:seed` copies them into the Achievement table;
// the backend unlocks a badge when the learner's `metric` reaches `threshold`.
// To add a badge: add a row here and re-run the seed.
import type { AchievementMetric } from "../generated/prisma/enums.ts";

export type AchievementDefinition = {
  code: string;
  title: string;
  description: string;
  /** Emoji shown in the UI. */
  icon: string;
  metric: AchievementMetric;
  threshold: number;
};

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    code: "first-lesson",
    title: "First Lesson",
    description: "Complete your first lesson",
    icon: "🌱",
    metric: "LESSONS_COMPLETED",
    threshold: 1,
  },
  {
    code: "xp-100",
    title: "First 100 XP",
    description: "Earn 100 XP",
    icon: "⚡",
    metric: "TOTAL_XP",
    threshold: 100,
  },
  {
    code: "streak-3",
    title: "3 Day Streak",
    description: "Learn 3 days in a row",
    icon: "🔥",
    metric: "LONGEST_STREAK",
    threshold: 3,
  },
  {
    code: "streak-7",
    title: "7 Day Streak",
    description: "Learn 7 days in a row",
    icon: "🪔",
    metric: "LONGEST_STREAK",
    threshold: 7,
  },
  {
    code: "first-unit",
    title: "First Unit Completed",
    description: "Complete every lesson in a unit",
    icon: "🏆",
    metric: "UNITS_COMPLETED",
    threshold: 1,
  },
  {
    code: "perfect-lesson",
    title: "Flawless",
    description: "Finish a lesson without a single mistake",
    icon: "💎",
    metric: "PERFECT_LESSONS",
    threshold: 1,
  },
  {
    code: "mistake-mender",
    title: "Mistake Mender",
    description: "Clear a mistake in the review",
    icon: "🩹",
    metric: "MISTAKES_CLEARED",
    threshold: 1,
  },
  {
    code: "goal-getter",
    title: "Goal Getter",
    description: "Reach your daily goal",
    icon: "🎯",
    metric: "DAILY_GOALS_MET",
    threshold: 1,
  },
];
