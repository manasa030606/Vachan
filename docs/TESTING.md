# Vachan — Testing guide (Phase 8)

Vachan is tested at five levels. Everything except the optional AI evaluations runs **offline**
(test doubles for the LLM, speech-to-text and text-to-speech — no API key, no quota used).

| Level                      | Command                                 | Tests                        | What it covers                                                                                                                                                       |
| -------------------------- | --------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend unit               | `npm run test -w backend`               | 156                          | answer checker, lesson status, XP/levels/streaks/hearts, placement scoring, chunking, ranking, prompt safety, WAV parsing, speech scoring, exercise rules, passwords |
| API (HTTP)                 | `npm run test:api -w backend`           | 37                           | auth, validation, ownership, lessons, attempts, progress, review, gamification, placement                                                                            |
| RAG retrieval              | `npm run test:rag -w backend`           | 8                            | real embeddings + pgvector: language filter, level, relevance                                                                                                        |
| AI tutor                   | `npm run test:tutor -w backend`         | 11                           | grounded answers with sources, "not in my notes", injection refusals, history, limits                                                                                |
| Speech & role-play         | `npm run test:speech -w backend`        | 18                           | upload limits, transcribe → evaluate, TTS cache, conversation start/reply/end                                                                                        |
| Admin & analytics          | `npm run test:admin -w backend`         | 19                           | 401/403/200 on admin routes, publish visibility, guards, exercise validation, knowledge publish/re-index, analytics has no personal data, audit log                  |
| Full journey (API)         | `npm run test:flow -w backend`          | 13                           | register → language → placement → lesson → XP → progress → review → tutor → speaking → conversation → logout → login → data persisted                                |
| Frontend unit              | `npm run test -w frontend`              | 24                           | lesson reducer, client answer checks, WAV encoder, option buttons, admin exercise helpers                                                                            |
| Postman / newman           | see §3                                  | 157 requests, 359 assertions | every endpoint incl. the admin folder                                                                                                                                |
| Browser E2E                | `cd e2e && npm test`                    | 11 steps                     | the full learner journey in Chromium, desktop and phone width                                                                                                        |
| AI quality (real provider) | `rag:eval`, `tutor:eval`, `speech:eval` | —                            | retrieval hit@3 98.2 %, MRR 96.4 %; tutor grounded 100 %; speech checks — see the *_EVALUATION.md files                                                              |

`npm run test:all -w backend` runs every backend integration suite in order.

## 1. Before running the integration tests

```bash
npm run db:migrate -w backend   # local database up to date
npm run db:seed -w backend      # course content
npm run rag:index -w backend    # knowledge base (needed by test:rag, test:tutor, test:admin, test:flow)
```

The integration tests create their own throw-away users (`…@example.com`) and delete them afterwards.
They raise the login/register rate limits through environment variables in the npm scripts.
Never run them against the deployed database.

## 2. Everything at once (the "check" used before a commit)

```bash
npm run check          # prettier check → typecheck → lint → unit tests → production build
npm run test:all -w backend
```

## 3. Postman / newman

```bash
npm run dev            # backend with LLM_PROVIDER=mock … if you don't want to use your AI quota
npx newman run postman/Vachan.postman_collection.json \
  -e postman/Vachan.local.postman_environment.json --working-dir postman
# with the admin folder (an account you granted with admin:grant):
#   … --env-var adminEmail=you@example.com --env-var adminPassword='…'
```

Without `adminEmail` the admin folder is skipped and the rest still passes. Import instructions: README → _API testing with Postman_.

## 4. Browser end-to-end test

```bash
# terminal 1 — offline AI so the test is repeatable
LLM_PROVIDER=mock STT_PROVIDER=mock TTS_PROVIDER=mock npm run dev -w backend
# terminal 2
npm run dev -w frontend
# terminal 3
cd e2e && npm install && npx playwright install chromium && npm test
W=390 npm test                 # phone width
E2E_SHOTS=/tmp/shots npm test  # save a screenshot per step
```

The script refuses to run against anything other than `localhost`. Steps:

1. Landing → register → onboarding
2. Language (Telugu) + self-assessment
3. Placement test → recommended Unit 3 accepted → path shows 8 / 16
4. Lesson with one wrong answer → completed
5. XP and streak in the top bar
6. Review clears the mistake
7. AI Tutor answer with sources
8. Speaking exercise: record (fake microphone) → transcript → feedback
9. Role-play: reply → partner answer → summary
10. Profile: 9 of 16 lessons, badges
11. Logout → login again → lessons, XP, streak, tutor chat and role-play are all still there

## 5. Results of the final Phase 8 run

| Suite                             | Result                                                                                                             |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Backend unit                      | 156 / 156 ✅                                                                                                       |
| API / RAG / tutor / speech        | 37 / 8 / 11 / 18 ✅                                                                                                |
| Admin / full flow                 | 19 / 13 ✅                                                                                                         |
| Frontend unit                     | 24 / 24 ✅                                                                                                         |
| newman (with admin)               | 157 requests, 359 assertions, 0 failures ✅                                                                        |
| Browser E2E 1280 px and 390 px    | 11 / 11 steps ✅                                                                                                   |
| Admin UI check (Playwright)       | analytics, content, lesson + exercise editor, validation, vocabulary, knowledge publish, audit, learner blocked ✅ |
| `rag:eval`                        | all 5 checks pass (hit@3 98.2 %)                                                                                   |
| Typecheck, lint, production build | ✅                                                                                                                 |
