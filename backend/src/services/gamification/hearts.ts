// Hearts rules (pure functions, unit-tested). Limits come from config/gamification.ts.
//   - New learners start with `initial` hearts (max `max`).
//   - A wrong LESSON answer costs `lossPerMistake`. Review and placement answers never cost hearts.
//   - One heart comes back every `refillMinutes` until the maximum (calculated when read,
//     so no background job is needed).
//   - A correct review answer gives back `reviewRestore` hearts.
//   - With 0 hearts, lesson answers are refused (403 OUT_OF_HEARTS); the review still works.

export type HeartsConfig = {
  max: number;
  refillMinutes: number;
};

export type HeartsState = { hearts: number; updatedAt: Date };

/** Applies time-based refills. `nextHeartAt` is null when hearts are full. */
export function refillHearts(
  stored: HeartsState,
  now: Date,
  config: HeartsConfig,
): HeartsState & { nextHeartAt: Date | null } {
  const refillMs = config.refillMinutes * 60_000;
  if (stored.hearts >= config.max) {
    return { hearts: config.max, updatedAt: stored.updatedAt, nextHeartAt: null };
  }
  const elapsed = Math.max(0, now.getTime() - stored.updatedAt.getTime());
  const gained = Math.floor(elapsed / refillMs);
  const hearts = Math.min(config.max, stored.hearts + gained);
  if (hearts >= config.max) return { hearts, updatedAt: now, nextHeartAt: null };
  // Keep the unused part of the timer so refills stay on schedule.
  const updatedAt = new Date(stored.updatedAt.getTime() + gained * refillMs);
  return { hearts, updatedAt, nextHeartAt: new Date(updatedAt.getTime() + refillMs) };
}

/** Adds (positive) or removes (negative) hearts after refills, staying within 0…max. */
export function changeHearts(
  stored: HeartsState,
  delta: number,
  now: Date,
  config: HeartsConfig,
): HeartsState & { nextHeartAt: Date | null } {
  const current = refillHearts(stored, now, config);
  const hearts = Math.max(0, Math.min(config.max, current.hearts + delta));
  // The refill timer starts when the learner drops below the maximum.
  const updatedAt = current.hearts >= config.max && hearts < config.max ? now : current.updatedAt;
  return refillHearts({ hearts, updatedAt }, now, config);
}
