# Vachan — Placement & gamification (Phase 4)

Everything here uses **simple, visible rules** — no machine learning. All numbers live in one file, **`backend/src/config/gamification.ts`** (badges in `backend/src/config/achievements.ts`). Change a value, restart the backend, and the rules and the UI follow.

| Rule module (pure, unit-tested)                | What it decides                        |
| ---------------------------------------------- | -------------------------------------- |
| `services/gamification/placement-scoring.ts`   | starting unit from placement answers   |
| `services/gamification/xp.ts`                  | XP for an answer                       |
| `services/gamification/levels.ts`              | level from total XP                    |
| `services/gamification/streak.ts` + `dates.ts` | streak days in the learner's time zone |
| `services/gamification/hearts.ts`              | heart loss and refills                 |
| `services/gamification/achievements.ts`        | which badges are earned                |
| `services/gamification/recommendations.ts`     | practice recommendations               |

`services/stats.service.ts` applies them after every answer (inside the same database transaction).

## 1. Self-assessment

Asked during onboarding, stored in `UserProfile.selfAssessment` (validated: one of the six ids).

| id                     | Statement                                    | After onboarding       |
| ---------------------- | -------------------------------------------- | ---------------------- |
| `new`                  | Completely new — I know nothing              | Learn page (Unit 1)    |
| `few-words`            | I know a few words                           | Placement test offered |
| `knows-script`         | I know the alphabet/script but need practice | Placement test offered |
| `basic-sentences`      | I can understand basic sentences             | Placement test offered |
| `simple-conversations` | I can have simple conversations              | Placement test offered |
| `advanced`             | I'm comfortable and want advanced practice   | Placement test offered |

The test can always be skipped ("Start from Unit 1") and taken later from the Profile page. The self-assessment is saved with each test so results can be compared with it.

## 2. Placement test

- **Questions:** 12 — 3 per unit — re-using real course exercises (`PlacementQuestion` rows, seeded):
  - Unit 1 · script (vowels): character recognition and letter → sound
  - Unit 2 · script (consonants, vowel signs)
  - Unit 3 · vocabulary ×2 + translation (typed)
  - Unit 4 · sentence understanding ×2 + translation (typed)
  - Listening questions come with audio in Phase 7.
- During the test the learner doesn't see right/wrong. Placement answers **never** cost hearts, give XP or go to the review list.

**Scoring (transparent):**

1. A unit is **passed** with at least **2 of 3** correct (`placement.passMark`).
2. Units are checked in order; the recommendation is the **first unit not passed** (you can't skip a unit you haven't shown you know).
3. Everything passed → the last unit.

Example: Unit 1 3/3 ✓, Unit 2 2/3 ✓, Unit 3 1/3 ✗, Unit 4 3/3 ✓ → **"You are ready for Unit 3 — First words."**

**Accept or start from Unit 1:** accepting creates `UserLessonProgress` rows with `status = COMPLETED, placedOut = true` for every lesson before the chosen unit, so the path unlocks there. Placed-out lessons show a "Placement" label, give no XP and don't count for badges; finishing one for real turns it into a normal completed lesson.

## 3. XP

| Event                                               | XP  |
| --------------------------------------------------- | --- |
| First correct answer to an exercise in a lesson run | 2   |
| Finishing a lesson for the first time               | 10  |
| Finishing a lesson again (practice)                 | 5   |
| Perfect run (no wrong answers) — bonus              | 5   |
| Correct answer in the mistake review                | 2   |

A perfect first lesson of 4 exercises = 4 × 2 + 10 + 5 = **23 XP**. Every award is stored in `XpEvent` (amount + reason + local date), so the total can always be explained; `UserStats.totalXp` is the running total.

## 4. Levels

`levelThresholds = [0, 50, 120, 220, 350, 520, 750, 1050, 1450, 2000]` — the total XP needed to reach level 1, 2, 3 … 10. Level 10 is the top level. The API returns `level`, `xpIntoLevel`, `xpToNextLevel` and `leveledUp` after each answer.

## 5. Streak

- A **day** is the learner's local calendar day in `UserProfile.timeZone` (sent by the browser, e.g. `Asia/Kolkata`). Days are stored as `"YYYY-MM-DD"` strings and compared as calendar dates, so midnight, month ends and daylight-saving changes are safe.
- A day **counts** once the learner earns ≥ 1 XP that day.

| Situation                                | Result                                         |
| ---------------------------------------- | ---------------------------------------------- |
| First active day ever                    | streak = 1                                     |
| Active again the same day                | no change                                      |
| Active the day after the last active day | streak + 1                                     |
| One or more days missed                  | streak restarts at 1; longest streak is kept   |
| Reading the streak after a missed day    | shows 0 (it is broken) until the next activity |

`UserStats` keeps `currentStreak`, `longestStreak`, `lastActiveDate`; `UserDailyActivity` keeps one row per active day (the 7-day strip on the Home screen).

## 6. Hearts

| Setting           | Value | Meaning                                                    |
| ----------------- | ----- | ---------------------------------------------------------- |
| `max` / `initial` | 5 / 5 | limit and starting hearts                                  |
| `lossPerMistake`  | 1     | a wrong **lesson** answer costs 1 heart                    |
| `refillMinutes`   | 30    | one heart comes back every 30 minutes (calculated on read) |
| `reviewRestore`   | 1     | each correct review answer gives 1 heart back              |

With 0 hearts the server refuses lesson answers (`403 OUT_OF_HEARTS` with `nextHeartAt`). The mistake review always works — that's the way to earn hearts back. Review and placement answers never cost hearts.

## 7. Daily goal

Target XP per day from the learner's daily goal: casual 10 · regular 20 · serious 30 · intense 50. Progress = XP earned today (local day). When the target is reached the day is marked `goalMet` (once) and the "Goal Getter" badge is checked.

## 8. Achievements

| Badge                   | Rule                                |
| ----------------------- | ----------------------------------- |
| 🌱 First Lesson         | 1 lesson completed (not placed out) |
| ⚡ First 100 XP         | total XP ≥ 100                      |
| 🔥 3 Day Streak         | longest streak ≥ 3                  |
| 🪔 7 Day Streak         | longest streak ≥ 7                  |
| 🏆 First Unit Completed | every lesson of a unit completed    |
| 💎 Flawless             | a perfect lesson run                |
| 🩹 Mistake Mender       | a mistake fixed in the review       |
| 🎯 Goal Getter          | daily goal reached once             |

Badges are checked after every answer; new ones are returned in `rewards.newAchievements` and stored in `UserAchievement`. `GET /api/achievements` shows progress towards locked ones.

## 9. Recommendations (`GET /api/recommendations`)

In priority order, cut at 5:

1. **Out of hearts** → review mistakes (each fix gives a heart).
2. **Repeated mistakes** → open mistakes answered wrong **2+ times**.
3. **Unfinished lessons** → started but not finished (most recent first, max 2).
4. **Weak topics** → completed lessons with accuracy **below 70%** after **4+ answers** (max 2).
5. **Other mistakes** → the rest of the review list.
6. **Next lesson** → the next lesson on the path.

Each item has a `reason` sentence saying which rule picked it.

## 10. Testing day changes yourself

The app has no fake clock. To simulate days, change the learner's stats row (development only), then answer a new exercise correctly:

```sql
-- "yesterday" in the learner's time zone → next activity continues the streak
UPDATE "UserStats" s SET "currentStreak" = 2, "longestStreak" = 2,
  "lastActiveDate" = to_char((now() AT TIME ZONE 'Asia/Kolkata')::date - 1, 'YYYY-MM-DD')
FROM "User" u WHERE u.id = s."userId" AND u.email = 'you@example.com';

-- two days ago → GET /api/streak shows 0, next activity restarts at 1
UPDATE "UserStats" s SET "currentStreak" = 5, "longestStreak" = 5,
  "lastActiveDate" = to_char((now() AT TIME ZONE 'Asia/Kolkata')::date - 2, 'YYYY-MM-DD')
FROM "User" u WHERE u.id = s."userId" AND u.email = 'you@example.com';

-- no hearts → lesson answers return 403 OUT_OF_HEARTS
UPDATE "UserStats" s SET hearts = 0, "heartsUpdatedAt" = now()
FROM "User" u WHERE u.id = s."userId" AND u.email = 'you@example.com';
```

The automated version of these scenarios is `backend/tests/gamification.test.ts` (`npm run test:api`).
