// Demo gamification values (streak, XP, hearts, achievements) shown in the UI.
// Real lesson progress comes from the backend since Phase 2; these values are replaced in Phase 4.

export const MOCK_PROGRESS = {
  username: "learner_2026",
  joinedLabel: "September 2026",
  totalXp: 1240,
  level: 7,
  xpIntoLevel: 140,
  xpForNextLevel: 250,
  streakDays: 12,
  longestStreak: 18,
  hearts: 4,
  maxHearts: 5,
  xpToday: 15,
  lessonsCompleted: 6,
  wordsLearned: 48,
  /** Mon → Sun: did the learner practise that day? (for the streak week view) */
  weekActivity: [true, true, true, false, true, true, false],
} as const;

export type Achievement = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  /** 0–1. 1 = earned. */
  progress: number;
  progressLabel: string;
};

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-lesson",
    emoji: "🌱",
    title: "First step",
    description: "Complete your first lesson",
    progress: 1,
    progressLabel: "Earned",
  },
  {
    id: "script-starter",
    emoji: "✍️",
    title: "Script starter",
    description: "Finish the script foundations unit",
    progress: 1,
    progressLabel: "Earned",
  },
  {
    id: "week-streak",
    emoji: "🔥",
    title: "On fire",
    description: "Reach a 7-day streak",
    progress: 1,
    progressLabel: "Earned",
  },
  {
    id: "xp-2000",
    emoji: "⚡",
    title: "XP collector",
    description: "Earn 2,000 XP",
    progress: 0.62,
    progressLabel: "1,240 / 2,000 XP",
  },
  {
    id: "perfect-lesson",
    emoji: "💎",
    title: "Flawless",
    description: "Finish 5 lessons without a mistake",
    progress: 0.4,
    progressLabel: "2 / 5 lessons",
  },
  {
    id: "month-streak",
    emoji: "🪔",
    title: "Steady flame",
    description: "Reach a 30-day streak",
    progress: 0.4,
    progressLabel: "12 / 30 days",
  },
];
