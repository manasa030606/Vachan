// Streak rules (pure functions, unit-tested):
//   - A day counts when the learner earns XP that day (their local calendar day).
//   - First active day ever          → streak 1
//   - Active again the same day      → no change
//   - Active the day after the last  → streak + 1
//   - A day (or more) was missed     → streak restarts at 1
//   - Longest streak = the best current streak ever.
// When READING, a streak whose last active day is before yesterday shows as 0 (it is broken;
// it is reset for real the next time the learner is active).
import { daysBetween } from "./dates.ts";

export type StreakState = {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
};

export type StreakChange = "first-day" | "same-day" | "continued" | "restarted";

export function recordActiveDay(
  state: StreakState,
  today: string,
): { state: StreakState; change: StreakChange } {
  if (!state.lastActiveDate) {
    return {
      state: {
        currentStreak: 1,
        longestStreak: Math.max(1, state.longestStreak),
        lastActiveDate: today,
      },
      change: "first-day",
    };
  }
  const gap = daysBetween(state.lastActiveDate, today);
  if (gap <= 0) return { state, change: "same-day" }; // same day (or clock went backwards)
  const currentStreak = gap === 1 ? state.currentStreak + 1 : 1;
  return {
    state: {
      currentStreak,
      longestStreak: Math.max(state.longestStreak, currentStreak),
      lastActiveDate: today,
    },
    change: gap === 1 ? "continued" : "restarted",
  };
}

/** The streak to SHOW today. */
export function visibleStreak(state: StreakState, today: string): number {
  if (!state.lastActiveDate) return 0;
  const gap = daysBetween(state.lastActiveDate, today);
  return gap <= 1 ? state.currentStreak : 0;
}
