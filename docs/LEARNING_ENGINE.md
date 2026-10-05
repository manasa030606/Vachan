# Vachan — Learning engine (Phase 3)

How a learner moves through a course, how answers are checked, how progress is stored and how mistakes come back for review. Everything here is deterministic — no AI is involved in teaching or checking.

## 1. The path

```
Language ─► Course ─► Unit ─► Lesson ─► Exercise
   te        te-course  te-u1   te-u1-l1  te-u1-l1-e1
```

Every language gets the same beginner path, with its own letters, words and sentences (`backend/prisma/course-builder.ts`):

| Unit | Stage            | Lessons                                                            | Exercises |
| ---- | ---------------- | ------------------------------------------------------------------ | --------- |
| 1    | Foundations      | Vowels a·aa · Vowels i·ii · Vowels u·uu · Vowel review             | 17        |
| 2    | Foundations      | Consonants ka·ma · na·pa · ra·la · Vowel signs                     | 18        |
| 3    | First words      | Greetings · Family & friends · Food & drink · Numbers 1–3          | 16        |
| 4    | Everyday phrases | Introductions · How are you? · Asking for things · Sentence review | 16        |

- **Small steps:** script lessons introduce at most two letters. The alphabet is never dumped into one lesson.
- **Pronunciation:** every letter carries a sound hint ("long “aa”, like the a in “father”"), shown on the intro screen, under the sound in character-recognition exercises and in the feedback after answering. Language-specific notes override the general hint (e.g. Bengali অ is "o", Tamil க softens between vowels).
- **Exact scripts:** the six scripts share one Unicode layout, so letters are generated from each script's block (`seed-data.ts`) instead of being typed by hand.
- **Lesson format (spec §5):** intro with 2–4 examples → practice → immediate feedback with an explanation → mistakes repeated at the end → completion summary.

## 2. Exercise types (7)

| Type (API)              | The learner…                                       | Answer sent                     |
| ----------------------- | -------------------------------------------------- | ------------------------------- |
| `character-sound`       | sees a letter (అ) and picks its sound              | `{ optionId }`                  |
| `character-recognition` | sees a sound ("aa" + hint) and picks the letter    | `{ optionId }`                  |
| `multiple-choice`       | picks a meaning, a word, a sentence or a reply     | `{ optionId }`                  |
| `matching`              | taps letter ↔ sound or word ↔ meaning pairs        | `{ pairs: [{leftId,rightId}] }` |
| `translation`           | types the English meaning — or a letter's sound    | `{ text }`                      |
| `fill-in-blank`         | completes a sentence with the right word           | `{ optionId }`                  |
| `word-order`            | builds a sentence from a word bank (+1 extra word) | `{ optionIds: [...] }`          |

Adding a type = one enum value in `schema.prisma`, one `case` in `toPublicExercise` and `checkAnswer` (backend), one component + one `case` in `exercise-renderer.tsx` (frontend).

## 3. Answer checking (`backend/src/services/answer-checker.ts`)

- Correct answers **never** go to the browser before answering; the server checks every answer.
- Choices: compare the option id with the one marked `isCorrect`.
- Typed answers: Unicode NFC → remove invisible joiners → lower case → punctuation (incl. `।`) becomes a space → spaces removed for comparison. So `"THankyou"`, `"thank-you!"` and `" Thank you "` are equal. Longer answers allow 1–2 typos (returned as `typoCorrection`); answers of ≤ 4 letters must be exact (so `"i"` ≠ `"ii"`).
- Word order: the exact sequence of word ids. Matching: every pair correct.
- The response carries `correctAnswer` and an `explanation` for the feedback banner.

## 4. Progress (`backend/src/services/progress.service.ts`)

| Tracked             | Where                                                                |
| ------------------- | -------------------------------------------------------------------- |
| Lesson started      | `POST /lessons/:id/start` creates `UserLessonProgress` (`startedAt`) |
| Every attempt       | `UserExerciseAttempt` (answer JSON, `isCorrect`, `source`, time)     |
| Correct / incorrect | `UserLessonProgress.correctAttempts` / `incorrectAttempts`           |
| Accuracy            | `UserLessonProgress.accuracy` = correct ÷ all lesson answers         |
| Lesson completion   | `status = COMPLETED`, `completedAt` (first time), `timesCompleted`   |
| Last activity       | `UserLessonProgress.lastActivityAt`; overall in `GET /progress`      |

**Runs and resuming.** `runStartedAt` marks the start of the current run. A run is finished when every exercise was answered correctly since then. Leaving half-way and starting again **resumes** (the server returns `completedExerciseIds`; the player skips them). Starting a completed lesson begins a fresh **practice run**; the lesson stays `COMPLETED`. `{ "restart": true }` starts over.

## 5. Lesson states (`backend/src/services/lesson-status.ts`)

| Status      | Rule                                                                        | UI                    |
| ----------- | --------------------------------------------------------------------------- | --------------------- |
| `completed` | progress row is COMPLETED                                                   | ✓ tile, replayable    |
| `current`   | progress row is IN_PROGRESS                                                 | glowing, "Continue"   |
| `available` | no progress yet, and it's the first lesson or the previous one is completed | glowing, "Start"      |
| `locked`    | everything else                                                             | grey, lock; API → 403 |

"Up next" = the most recently active `current` lesson, otherwise the first `available` one.

## 6. Review (`backend/src/services/review.service.ts`)

- **Open mistake** = an exercise answered wrong (lesson or review) and not answered correctly **in a review** since that wrong answer.
- `GET /review` → open mistakes (your answer, correct answer, explanation, lesson) + words learned. `GET /review/attempts` → every wrong answer. `GET /review/session` → up to 10 open mistakes as exercises.
- Review answers use the same attempt endpoint with `"mode": "review"`; they're stored with `source = REVIEW`, clear the mistake when correct, cost no hearts and don't change lesson counters.

## 7. What is still demo / later

Hearts, XP, streak, levels, badges and placement are **Phase 4**. Audio/speech is **Phase 7**. RAG and the AI tutor are **Phases 5–6**.
