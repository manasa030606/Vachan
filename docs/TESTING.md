# Testing

All tests run **offline**: the AI, speech-to-text and text-to-speech are replaced by test doubles,
so no API key or quota is needed.

## Test suites

| Suite         | Command                          | Tests        | What it covers                                                                                                                                                        |
| ------------- | -------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend unit  | `npm run test -w backend`        | 168          | Answer checking, lesson status, XP, streaks, hearts, placement scoring, chunking, ranking, prompt safety, audio processing, the generated course of all six languages |
| API           | `npm run test:api -w backend`    | 37           | Auth, validation, lessons, answers, progress, review, gamification, placement                                                                                         |
| RAG           | `npm run test:rag -w backend`    | 8            | Knowledge-base search with real embeddings                                                                                                                            |
| AI tutor      | `npm run test:tutor -w backend`  | 11           | Grounded answers, "not in my notes", injection refusal, history                                                                                                       |
| Speech        | `npm run test:speech -w backend` | 18           | Uploads, transcription, feedback, role-play                                                                                                                           |
| Admin         | `npm run test:admin -w backend`  | 19           | Admin access, publishing, validation, knowledge base, analytics                                                                                                       |
| Full journey  | `npm run test:flow -w backend`   | 13           | One learner from registration to logging in again                                                                                                                     |
| Frontend unit | `npm run test -w frontend`       | 24           | Lesson player, answer helpers, audio encoding, admin helpers                                                                                                          |
| Postman       | see [API.md](API.md)             | 158 requests | Every endpoint                                                                                                                                                        |
| Browser E2E   | `cd e2e && npm test`             | 11 steps     | The full journey in a real browser                                                                                                                                    |

Run every backend integration suite at once with `npm run test:all -w backend`.

## Before the integration tests

```bash
npm run db:migrate
npm run db:seed
npm run rag:index -w backend
```

## Content and AI quality checks

| Check           | Command                            | What it measures                                                                                                                                                                               |
| --------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Content files   | `npm run content:check -w backend` | Every concept present in every language, correct script block, romanization, no duplicate scripts                                                                                              |
| Course builder  | part of `npm run test -w backend`  | 16 units, 95 lessons, 8–15 exercises each, all 7 types, unique ids, every exercise answerable, no question repeated in a lesson, 18 placement questions                                        |
| Content numbers | `npm run content:stats -w backend` | Units, lessons, exercises, words, phrases, letters, knowledge-base documents/chunks and missing embeddings per language                                                                        |
| Retrieval       | `npm run rag:eval -w backend`      | 151 questions + 20 off-topic: hit@3, MRR, language precision, refusals ([report](evaluation/RAG.md))                                                                                           |
| AI tutor        | `npm run tutor:eval -w backend`    | 105 questions, 15 beginner questions per language: status, sources, grounding, length ([report](evaluation/TUTOR.md)). Uses the real AI when a key is set; `LLM_PROVIDER=mock` runs it offline |

The tests create temporary accounts and delete them afterwards. Never run them against the
production database.

## Browser end-to-end test

```bash
# terminal 1
LLM_PROVIDER=mock STT_PROVIDER=mock TTS_PROVIDER=mock npm run dev -w backend
# terminal 2
npm run dev -w frontend
# terminal 3
cd e2e && npm install && npx playwright install chromium && npm test
```

It only runs against `localhost` and checks this journey:

1. Landing page → register
2. Choose a language and self-assessment
3. Placement test → start at the recommended unit
4. Lesson with one wrong answer → completed
5. XP and streak updated
6. Review clears the mistake
7. AI tutor answers with sources
8. Speaking exercise: record → transcript → feedback
9. Role-play conversation → summary
10. Profile shows progress
11. Log out → log in again → everything is still there

Use `W=390 npm test` for a phone-sized screen.

## Before every commit

```bash
npm run check    # format check, typecheck, lint, unit tests, production build
```

## Results of the final run

| Check                             | Result                               |
| --------------------------------- | ------------------------------------ |
| Backend unit + integration        | 274 / 274 passed                     |
| Frontend unit                     | 24 / 24 passed                       |
| Postman                           | 158 requests, 369 checks, 0 failures |
| Retrieval evaluation              | hit@3 100 %, off-topic rejected 95 % |
| AI tutor evaluation (offline AI)  | 105 questions, all checks passed     |
| Browser E2E (desktop and phone)   | 11 / 11 steps passed                 |
| Typecheck, lint, production build | Passed                               |
