# Learning engine

How lessons, answer checking, progress, review, placement and gamification work. All numbers below
live in `backend/src/config/gamification.ts`, so they can be changed in one place.

## Course path

Each language has one course with 4 units and 16 short lessons:

| Unit | Stage            | Lessons                                                            |
| ---- | ---------------- | ------------------------------------------------------------------ |
| 1    | Foundations      | Vowels (two letters per lesson) → vowel review                     |
| 2    | Foundations      | Consonants → vowel signs                                           |
| 3    | First words      | Greetings, family, food & drink, numbers                           |
| 4    | Everyday phrases | Introductions, "how are you?", asking for things → sentence review |

The courses are generated from data (`backend/prisma/course-builder.ts`). Letters come from the
Unicode block of each script, so every alphabet is exact.

## Exercise types

1. **Character → sound** — see a letter, choose its sound
2. **Character recognition** — see a sound, choose the letter
3. **Multiple choice** — choose the meaning
4. **Matching** — match pairs
5. **Fill in the blank** — choose the missing word
6. **Translation** — type the answer
7. **Word order** — put the words in the right order

## Answer checking

All answers are checked on the server (`services/answer-checker.ts`). The browser never receives
the correct answers before the learner answers.

Typed answers are compared after normalising both sides: Unicode NFC, lower case, punctuation and
extra spaces removed. Small spelling mistakes are accepted with a "watch the spelling" note:

| Answer length   | Mistakes allowed |
| --------------- | ---------------- |
| up to 4 letters | 0                |
| 5–10 letters    | 1                |
| longer          | 2                |

## Lesson status and progress

| Status    | Meaning                                      |
| --------- | -------------------------------------------- |
| Locked    | The previous lesson isn't finished           |
| Available | Unlocked, not started ("Start")              |
| Current   | Started, not finished ("Continue")           |
| Completed | Every exercise answered correctly in one run |

- Lessons unlock in order.
- A wrong answer is repeated at the end of the lesson.
- Leaving half-way and coming back resumes where you stopped.
- Completed lessons can be practised again.

## Review

Every answer is saved in `UserExerciseAttempt`. A mistake stays "open" until it is answered
correctly in a review session. Review sessions don't cost hearts.

## Placement test

1. 12 questions: 3 from each unit, taken from the course's own exercises.
2. A unit is **passed** with at least 2 of 3 correct.
3. The recommended starting unit is the first unit that is not passed.
4. The learner chooses: start there (earlier lessons are marked "Placement") or start from Unit 1.

## Gamification

| Feature    | Rule                                                                                                                                |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| XP         | +2 per correct answer, +10 for finishing a lesson (+5 when practising again), +5 for a perfect lesson, +2 per correct review answer |
| Levels     | 10 levels at 0, 50, 120, 220, 350, 520, 750, 1050, 1450 and 2000 XP                                                                 |
| Daily goal | 10 / 20 / 30 / 50 XP (casual, regular, serious, intense)                                                                            |
| Streak     | A day counts when the learner earns XP, using the learner's own time zone                                                           |
| Hearts     | 5 hearts. A wrong lesson answer costs 1. One heart refills every 30 minutes, and a correct review answer gives one back             |
| Badges     | First Lesson, First 100 XP, 3- and 7-day streak, First Unit, Flawless, Mistake Mender, Goal Getter                                  |

Hearts refill when they are read (stored count + timestamp), so no background job is needed. Every
XP award is logged in `XpEvent`, so totals can always be explained.

## Recommendations

The "Recommended practice" list uses simple, explainable rules (not machine learning), in this order:

1. Out of hearts → review mistakes
2. Mistakes answered wrong at least twice
3. Unfinished lessons
4. Weak lessons (accuracy below 70 % after 4+ answers)
5. Other open mistakes
6. The next lesson on the path
