# Database

PostgreSQL 16 with the pgvector extension, accessed through Prisma. The schema is in
`backend/prisma/schema.prisma` (28 tables).

## Data model

One set of tables serves **all languages**: every piece of content points to a `Language` row, so
adding a seventh language means adding rows, not tables.

```
Language ── Course ── Unit ── Lesson ── Exercise ── ExerciseOption
   │                            └── VocabularyItem (words a lesson teaches)
   └── KnowledgeDocument ── KnowledgeChunk (text + 384-number embedding)

User ── UserProfile, UserStats
User ── UserLessonProgress, UserExerciseAttempt
User ── XpEvent, UserDailyActivity, UserAchievement
User ── PlacementTest ── PlacementAnswer
User ── AIConversation ── AIMessage
User ── SpeechAttempt, ConversationSession ── ConversationTurn
AdminAuditLog
```

| Table group    | Tables                                                                                 | Purpose                                                        |
| -------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Accounts       | `User`, `UserProfile`                                                                  | Login (scrypt hash, role, `tokenVersion`) and learner settings |
| Content        | `Language`, `Course`, `Unit`, `Lesson`, `Exercise`, `ExerciseOption`, `VocabularyItem` | The courses. Each level has an `isPublished` flag              |
| Progress       | `UserLessonProgress`, `UserExerciseAttempt`                                            | Lesson status and every answer submitted                       |
| Gamification   | `UserStats`, `XpEvent`, `UserDailyActivity`, `Achievement`, `UserAchievement`          | XP, hearts, streaks, daily goal, badges                        |
| Placement      | `PlacementQuestion`, `PlacementTest`, `PlacementAnswer`                                | Placement test                                                 |
| Knowledge base | `KnowledgeDocument`, `KnowledgeChunk`                                                  | RAG notes and their vector embeddings                          |
| AI tutor       | `AIConversation`, `AIMessage`                                                          | Tutor chats with the sources of each answer                    |
| Speech         | `SpeechAttempt`, `AudioClip`, `ConversationSession`, `ConversationTurn`                | Speaking results, cached audio, role-plays                     |
| Admin          | `AdminAuditLog`                                                                        | Who changed what in the admin dashboard                        |

### How seven exercise types fit one options table

| Exercise type                                                              | What each `ExerciseOption` row means                   |
| -------------------------------------------------------------------------- | ------------------------------------------------------ |
| Multiple choice, character recognition, character sound, fill in the blank | A choice; exactly one has `isCorrect = true`           |
| Translation                                                                | An accepted answer                                     |
| Word order                                                                 | A word with its `correctPosition` (empty = extra word) |
| Matching                                                                   | A pair: `text` on the left, `matchText` on the right   |

## Migrations

| Situation                                   | Command                                     | What it does                                                        |
| ------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------- |
| Development, after changing `schema.prisma` | `npm run db:migrate`                        | Creates a new migration file and applies it                         |
| Development, after pulling new code         | `npm run db:migrate`                        | Applies migrations you don't have yet                               |
| Production                                  | `npm run db:deploy`                         | Only applies existing migrations — never creates or resets anything |
| Check status                                | `npx prisma migrate status` (in `backend/`) | Lists applied and pending migrations                                |

Rules:

- Never create or change tables by hand — always through a migration.
- Never edit a migration that has already been applied somewhere.
- Never run `db:reset` or `migrate dev` against production.

There are 7 migrations in `backend/prisma/migrations/`, each plain SQL you can read.

## Seed data

`npm run db:seed` loads, for each of the six languages: 1 course, 4 units, 16 lessons, 67 exercises
and 34 vocabulary items, plus 12 placement questions, 8 badges and a demo account (development only).

The seed is **safe to run again**: it only creates a language's course if that language has none,
so content edited in the admin dashboard is never overwritten.
To throw content away and recreate it from code (development only, deletes lesson progress):
`npm run db:seed:reset-content -w backend`.

Readable ids make testing easy: course `te-course`, unit `te-u2`, lesson `te-u2-l1`,
exercise `te-u2-l1-e3`.

## Useful commands

| Command               | What it does                                                    |
| --------------------- | --------------------------------------------------------------- |
| `npm run db:studio`   | Opens Prisma Studio, a browser view of every table              |
| `npm run db:reset`    | Development only: delete everything, re-run migrations and seed |
| `npm run db:generate` | Regenerate the Prisma client after a schema change              |

## Backups

- **Neon** keeps a short history and lets you create a branch as a snapshot before risky changes.
- **Any PostgreSQL:**

  ```bash
  pg_dump --format=custom "$DATABASE_URL" > vachan-backup.dump     # backup
  pg_restore --clean --dbname "$DATABASE_URL" vachan-backup.dump   # restore
  ```

- The knowledge-base chunks can always be rebuilt with `npm run rag:index`. User accounts, progress
  and admin-written content cannot — those are what backups protect.

## Quick SQL checks

```sql
-- content loaded?
SELECT (SELECT count(*) FROM "Language") AS languages,
       (SELECT count(*) FROM "Lesson")   AS lessons,
       (SELECT count(*) FROM "Exercise") AS exercises;   -- 6 | 96 | 402

-- passwords are hashed
SELECT email, left("passwordHash", 10) FROM "User";        -- scrypt:…
```
