// Calendar-day helpers for streaks and daily goals.
//
// A "day" is the learner's LOCAL calendar day in their time zone (UserProfile.timeZone),
// stored as a plain "YYYY-MM-DD" string. Comparing those strings as calendar dates (not as
// timestamps) avoids daylight-saving and midnight-UTC bugs.

/** The learner's local date for an instant, e.g. 2026-10-05T20:00Z in Asia/Kolkata → "2026-10-06". */
export function localDate(at: Date, timeZone: string): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(at);
}

/** Days since 1970-01-01 for a "YYYY-MM-DD" date (time-zone free). */
function dayNumber(date: string): number {
  const [year, month, day] = date.split("-").map(Number);
  return Math.round(Date.UTC(year, month - 1, day) / 86_400_000);
}

/** Whole calendar days from `from` to `to` ("2026-10-05" → "2026-10-06" = 1). */
export function daysBetween(from: string, to: string): number {
  return dayNumber(to) - dayNumber(from);
}

export function addDays(date: string, days: number): string {
  return new Date((dayNumber(date) + days) * 86_400_000).toISOString().slice(0, 10);
}

/** The last `count` dates ending with `today`, oldest first. */
export function lastDates(today: string, count: number): string[] {
  return Array.from({ length: count }, (_, index) => addDays(today, index - (count - 1)));
}

export function isValidTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat("en", { timeZone });
    return true;
  } catch {
    return false;
  }
}
