# Learning engine

How lessons, answer checking, progress, review, placement and gamification work. All numbers below
live in `backend/src/config/gamification.ts`, so they can be changed in one place.

## Course path

Each language has one course with **16 units and 95 lessons** (about 1,340 exercises, 8–15 per
lesson) that go from the alphabet to short everyday conversations:

| Unit | Stage             | Title                            | Lessons                                                                                                                         |
| ---- | ----------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Foundations       | Vowels                           | Vowels 1–5 · Vowel review                                                                                                       |
| 2    | Foundations       | Consonants                       | Consonants 1–6                                                                                                                  |
| 3    | Foundations       | Vowel signs & reading            | Vowel signs 1–3 · Reading words · Script review                                                                                 |
| 4    | First words       | First words                      | Greetings · Yes, no & polite words · Everyday things · Common actions · This, that & questions · Review                         |
| 5    | Everyday phrases  | Introducing yourself             | My name is… · How are you? · Where are you from? · Nice to meet you · I don't understand · Review                               |
| 6    | First words       | Family & people                  | Parents & children · Brothers, sisters & partners · Grandparents & relatives · People · Describing people · Review              |
| 7    | First words       | Food & drinks                    | Everyday food · Drinks · Fruits, vegetables & more · Hungry & thirsty · Ordering food · Review                                  |
| 8    | First words       | Numbers, time & dates            | Numbers 1–10 · 11–20 · Tens & big numbers · Age & phone numbers · Time of day · Days of the week · Review                       |
| 9    | Sentence building | Daily life                       | Morning & evening · Study, work & play · Sit, stand & wait · What are you doing? · My day · Review                              |
| 10   | Sentence building | Places & directions              | Places in town · More places · Near, far, left & right · Asking for directions · Where are you going? · Review                  |
| 11   | Everyday phrases  | Shopping & money                 | Money & prices · Colours · Clothes · At the shop · Review                                                                       |
| 12   | Everyday phrases  | Travel & transport               | Getting around · Tickets & stations · When & how long? · Travel phrases · Review                                                |
| 13   | Conversation      | Everyday conversations           | Meeting someone new · Meeting a friend · At college · On the phone · Asking for help · Review                                   |
| 14   | Grammar           | Grammar & sentence building      | Pronouns · Word order & the present · Past & future · Questions & negatives · My, your & small words · Polite & casual · Review |
| 15   | Speaking          | Feelings, health & relationships | How do you feel? · I'm okay, don't worry · The body · At the doctor · Love & friendship · Review                                |
| 16   | Conversation      | Practical communication          | Weather · College & work · Hobbies & likes · Plans & invitations · Requests & help · Final review                               |

Lessons build on each other: "Hello" → "How are you?" → "My name is…" → "Where are you from?" →
"What are you doing?" → "I am studying", and every unit ends with a review that mixes the earlier
lessons. Conversation lessons use short dialogues ("what comes next?") and reply choices.

### Where the content comes from

| File                                         | What it holds                                                                                                                                                         |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `backend/prisma/content/curriculum.ts`       | The shared curriculum: 482 concepts (words and phrases), their topics, the 16 units and 95 lessons, and 10 dialogue outlines                                          |
| `backend/prisma/content/languages/<code>.ts` | How each concept is said naturally in that language (script, romanization, usage notes such as formal/casual forms), extra language-specific words, and the dialogues |
| `backend/prisma/content/script.ts`           | The alphabet lessons: letters are built from each script's Unicode block, so every letter is exact                                                                    |
| `backend/prisma/course-builder.ts`           | Turns the curriculum + a language file into lessons and exercises (deterministic ids, no duplicate questions in a lesson)                                             |
| `backend/prisma/content-sync.ts`             | Writes a course into the database without deleting learner data (see [DATABASE.md](DATABASE.md))                                                                      |

Check a language file with `npm run content:check -w backend` (script ranges, romanization,
duplicates, missing concepts).

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

1. 18 questions from six key units (1, 2, 4, 5, 7 and 9): letters and sounds for the script units, and a word, a sentence and a translation for the others. They are taken from the course's own exercises.
2. A unit is **passed** with at least 2 of 3 correct.
3. The recommended starting unit is the first tested unit that is not passed (all units before it are unlocked).
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
