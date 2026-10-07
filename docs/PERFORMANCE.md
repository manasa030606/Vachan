# Vachan — Performance review (Phase 8)

Rule followed: **measure first, change only what a measurement shows.** Most of Vachan was already
fast enough; Phase 8 added two indexes for the new analytics and nothing else.

## 1. Measurements (local, MacBook-class machine, PostgreSQL 16)

### API response time and size (normal data)

| Endpoint                          | Size   | Time                 | Notes                                           |
| --------------------------------- | ------ | -------------------- | ----------------------------------------------- |
| `GET /courses/te-course`          | 3 KB   | 6–30 ms              | whole learning path (16 lessons) in one request |
| `GET /stats`                      | 1.3 KB | 13–81 ms             | XP, level, streak, hearts, daily goal           |
| `GET /progress`                   | 1.2 KB | 26 ms                |                                                 |
| `GET /admin/lessons/:id`          | 5 KB   | 14 ms                | lesson + exercises + answers                    |
| `GET /admin/knowledge`            | 29 KB  | 25 ms                | 73 documents, without text bodies               |
| `GET /admin/analytics?days=30`    | 4.5 KB | 53 ms                |                                                 |
| Postman collection (157 requests) | —      | avg 12 ms, max 98 ms |                                                 |

### Load check — 200,000 extra answers in the database

To see how the heaviest queries behave with a real school's worth of data, 200,000 synthetic
`UserExerciseAttempt` rows (spread over 60 days) were inserted, measured, and deleted again:

| Endpoint                        | Time with 200k extra rows |
| ------------------------------- | ------------------------- |
| `GET /admin/analytics?days=30`  | 0.17 s                    |
| `GET /admin/analytics?days=365` | 0.27 s                    |
| `GET /stats` (that learner)     | 0.013 s                   |
| `GET /progress` (that learner)  | 0.026 s                   |
| `GET /courses/te-course`        | 0.006 s                   |

Conclusion: no query needs work at this scale. Learner endpoints stay at a few milliseconds because
they always filter by `userId` (indexed).

## 2. Database

- **Indexes that matter** (all created by migrations): `UserExerciseAttempt(userId, exerciseId)`,
  `(userId, lessonId)`, `UserLessonProgress(userId, lessonId)` unique, `XpEvent(userId, createdAt)`,
  `UserDailyActivity(userId, date)` unique, `AIMessage(conversationId, createdAt)`,
  `SpeechAttempt(userId, createdAt)`, `KnowledgeChunk(languageCode, level)` / `(languageCode, topic)`.
- **Added in Phase 8** (because analytics filters by date across all learners):
  `UserExerciseAttempt(createdAt)` and `UserDailyActivity(date)`.
- **No N+1 queries** in the hot paths: the course tree, lesson, progress and analytics are each a
  small fixed number of queries (Prisma `include` / `groupBy`, plus a few aggregated `$queryRaw`).
- **Vector search has no ANN index** (HNSW/IVFFlat) on purpose: 430 chunks are searched exactly in
  a few milliseconds and exact search gives the best recall. Add `CREATE INDEX … USING hnsw` (in a
  migration) once the knowledge base passes ~50,000 chunks.

## 3. API responses

- Lists are bounded: audit log 100, tutor history per conversation, common mistakes top 10, vocabulary
  search, knowledge list without bodies (the body is loaded only when one document is opened).
- Learner lesson responses never include answers or admin data.
- Compression is left to the hosting proxy (Vercel / Render compress responses); responses are small.

## 4. AI calls (cost and speed)

| Feature          | LLM calls                                          | Avoided calls                                                                                            |
| ---------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| AI Tutor         | 1 per question                                     | **0** for prompt-injection attempts and when retrieval finds nothing relevant ("Not in my notes")        |
| Role-play        | 1 to open, 1 per reply, 1 review at the end        | no review call when the learner never replied; a reply that fails is retried once, not more              |
| Speaking         | 1 speech-to-text (+1 optional pronunciation notes) | too short/silent/long recordings are rejected before any call; `PRONUNCIATION_NOTES=false` saves the 2nd |
| Text-to-speech   | 1 per **new** phrase                               | every clip is cached in `AudioClip` and reused for all learners (`speech:prefetch` warms it)             |
| Embeddings (RAG) | local model, no API cost                           | unchanged documents are skipped by content hash; drafts are never embedded                               |

Per-learner minute/day limits and an optional fallback model (`LLM_FALLBACK_MODEL`) protect the free quota.

## 5. Frontend

- Pages load only the data they show; lists render a bounded number of rows (vocabulary picker 200).
- The `/stats` request re-runs on navigation so XP/streak in the top bar are always current; it is
  1.3 KB and ~15 ms, so it was kept (not worth a cache-invalidation scheme).
- Fonts are self-hosted (`@fontsource`), no external font requests; icons are tree-shaken (`lucide-react`).
- Admin pages keep the old data visible while reloading (no flicker, no reset of edit forms).
- Production build: 22 routes, all static except the two `[id]` pages; the largest JavaScript chunk is ~90 KB gzipped (React + Next.js runtime). The admin pages are separate route chunks, so learners never download admin code.

## 6. Things deliberately not optimised

- No Redis / caching layer — no measurement showed a need.
- No pagination on the course tree — a course is at most a few hundred lessons.
- No CDN for TTS audio — clips are small and cached in the database; a CDN/object storage is the
  next step if audio traffic grows.
- Render free sleeps after 15 minutes (cold start 30–60 s). This is a hosting limit, not a code issue;
  a paid instance or an uptime ping removes it.
