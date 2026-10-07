# Vachan — Database guide (PostgreSQL + Prisma)

This guide takes you from a machine with **nothing installed** to a running database with demo content. Every command is copy-pasteable. Run commands from the **project root** (the `Vachan/` folder) unless a step says otherwise.

---

## 1. What the project expects

| Setting           | Value                                                                        |
| ----------------- | ---------------------------------------------------------------------------- |
| Database software | PostgreSQL **16** (15 or 17 also work)                                       |
| Database name     | `vachan_dev`                                                                 |
| Database user     | Docker: `vachan` · Homebrew/Postgres.app: **your macOS username** (`whoami`) |
| Password          | Docker: `vachan_dev_password` · Homebrew/Postgres.app: none                  |
| Host              | `localhost`                                                                  |
| Port              | `5432`                                                                       |

`DATABASE_URL` format (in `backend/.env`):

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

| Your setup                | Exact value                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------- |
| Homebrew / Postgres.app   | `postgresql://YOUR_MAC_USERNAME@localhost:5432/vachan_dev?schema=public` (no password) |
| Docker (`docker-compose`) | `postgresql://vachan:vachan_dev_password@localhost:5432/vachan_dev?schema=public`      |

---

## 2. Install PostgreSQL (pick ONE option)

### Option C — Homebrew (macOS) ← the one you already use

```bash
brew install postgresql@16          # install (once)
brew services start postgresql@16   # start it now AND automatically at every login
```

Check it is running:

```bash
brew services list      # postgresql@16 should say "started"
```

### Option A — Docker Desktop

```bash
npm run db:up           # starts the "vachan-postgres" container (user, password and DB are created for you)
docker ps               # vachan-postgres should say "Up"
```

### Option B — Postgres.app (macOS)

Download from https://postgresapp.com → move to Applications → open → click **Initialize**.

---

## 3. Start / stop PostgreSQL

| Setup        | Start                               | Stop                               |
| ------------ | ----------------------------------- | ---------------------------------- |
| Homebrew     | `brew services start postgresql@16` | `brew services stop postgresql@16` |
| Docker       | `npm run db:up`                     | `npm run db:down`                  |
| Postgres.app | Open the app → **Start**            | **Stop** in the app                |

---

## 4. Create the database (Homebrew / Postgres.app only)

Docker creates it automatically. For Homebrew:

```bash
createdb vachan_dev
```

If you already did this in Phase 0, you'll see `database "vachan_dev" already exists` — that's fine.

If `createdb` is "command not found": `$(brew --prefix postgresql@16)/bin/createdb vachan_dev`.

Check you can connect:

```bash
psql vachan_dev -c "select 1"
```

---

## 5. Create / update `backend/.env`

If you don't have it yet:

```bash
cp backend/.env.example backend/.env
```

Then open `backend/.env` and make sure it contains **all** of these (Phase 2 adds the two `JWT_` lines):

```dotenv
NODE_ENV=development
PORT=4000
DATABASE_URL="postgresql://YOUR_MAC_USERNAME@localhost:5432/vachan_dev?schema=public"
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=<a long random value — see below>
JWT_EXPIRES_IN=7d
```

**Already have a Phase 0 `backend/.env`?** Just add the two new lines — this generates a random secret for you:

```bash
echo "JWT_SECRET=$(openssl rand -hex 32)" >> backend/.env
echo "JWT_EXPIRES_IN=7d" >> backend/.env
```

| Variable         | Required | What it is                                                                                  |
| ---------------- | -------- | ------------------------------------------------------------------------------------------- |
| `NODE_ENV`       | no       | `development`, `test` or `production`. Production turns on secure (HTTPS-only) cookies.     |
| `PORT`           | no       | Port of the API (default 4000).                                                             |
| `DATABASE_URL`   | **yes**  | How to reach PostgreSQL (format above).                                                     |
| `CORS_ORIGIN`    | no       | Website address(es) allowed to call the API with cookies (default `http://localhost:3000`). |
| `JWT_SECRET`     | **yes**  | Secret used to sign login tokens. ≥ 32 characters, random, **never commit or share it**.    |
| `JWT_EXPIRES_IN` | no       | How long a login lasts: `7d`, `12h`, `30m` (default `7d`).                                  |

The frontend's `frontend/.env.local` is unchanged (`NEXT_PUBLIC_API_URL=http://localhost:4000`). Secrets never go in the frontend.

---

## 6. Install packages, migrate, generate, seed

```bash
npm install            # installs the new backend packages (jsonwebtoken, cookie-parser)
npm run db:validate    # checks schema.prisma            → "The schema at prisma/schema.prisma is valid 🚀"
npm run db:migrate     # creates all tables              → "Your database is now in sync with your schema."
npm run db:generate    # regenerates Prisma Client       → "✔ Generated Prisma Client (7.10.0)"
npm run db:seed        # loads demo content + demo user  → "✅ Seed finished."
```

What each one does:

| Command               | Runs                                     | Meaning                                                                                                                                                                                                                   |
| --------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run db:validate` | `prisma validate`                        | Checks the schema file for mistakes. Doesn't touch the database.                                                                                                                                                          |
| `npm run db:migrate`  | `prisma migrate dev` + `prisma generate` | Applies every migration in `backend/prisma/migrations/` that your database doesn't have yet (first time: creates all 11 tables). If you change `schema.prisma` later, it asks for a name and **creates a new migration**. |
| `npm run db:generate` | `prisma generate`                        | Rebuilds the TypeScript database client in `backend/src/generated/prisma` (git-ignored).                                                                                                                                  |
| `npm run db:seed`     | `prisma db seed` → `tsx prisma/seed.ts`  | Inserts demo content. Safe to run again.                                                                                                                                                                                  |
| `npm run db:deploy`   | `prisma migrate deploy`                  | Applies migrations without creating new ones (used for production in Phase 8).                                                                                                                                            |

Expected seed output:

```
🌱 Seeding the Vachan database…
  ✓ Hindi      4 units · 16 lessons · 67 exercises · 34 vocabulary items
  ✓ Telugu     4 units · 16 lessons · 67 exercises · 34 vocabulary items
  ✓ Tamil      4 units · 16 lessons · 67 exercises · 34 vocabulary items
  ✓ Malayalam  4 units · 16 lessons · 67 exercises · 34 vocabulary items
  ✓ Kannada    4 units · 16 lessons · 67 exercises · 34 vocabulary items
  ✓ Bengali    4 units · 16 lessons · 67 exercises · 34 vocabulary items
  ✓ Demo account  demo@vachan.dev / Vachan2026!  (development only)
✅ Seed finished.
```

### What the seed creates

For **each of the six languages**: 1 language row, 1 course ("Telugu for English speakers"), 4 units, 16 small lessons, 67 exercises (all seven exercise types), 34 vocabulary items. Totals: 6 courses · 24 units · 96 lessons · 402 exercises · 1,320 options · 204 vocabulary items.

| Unit | Stage            | Lessons (4 each)                                                   | Teaches                                                                  |
| ---- | ---------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| 1    | Foundations      | Vowels a·aa → i·ii → u·uu → Vowel review (checkpoint)              | 6 vowels, short vs long sounds, pronunciation hints                      |
| 2    | Foundations      | Consonants ka·ma → na·pa → ra·la → Vowel signs                     | 6 consonants, the built-in vowel, how vowel signs work                   |
| 3    | First Words      | Greetings → Family & friends → Food & drink → Numbers 1–3          | 14 everyday words                                                        |
| 4    | Everyday Phrases | Introductions → How are you? → Asking for things → Sentence review | 5 sentences: my name / your name / how are you / I'm fine / I want water |

The alphabet is never dumped into one lesson: script lessons teach **two letters at a time**. Letters are generated from each script's Unicode block (all six scripts share the same layout), so every alphabet is exact. Each exercise has an `explanation` (the teaching note shown after answering).

IDs are readable so you can type them in Postman: language `lang-te`, course `te-course`, unit `te-u2`, lesson `te-u2-l1`, exercise `te-u2-l1-e3`, option `te-u2-l1-e3-o1`, vocabulary `te-v02-letter-aa`.

Plus one **demo account** for quick testing: `demo@vachan.dev` / `Vachan2026!` (Hindi, onboarding done). Development only.

Running the seed again is **safe** (Phase 8): it updates the badge definitions and the demo account, and creates a language's course only if that language has **no course yet**. Content edited in the admin dashboard and learners' progress are never overwritten. To throw the course content away and re-create it from code (development only — this also deletes learners' lesson progress and answers): `npm run db:seed:reset-content -w backend`.

---

## 7. Look at the data — Prisma Studio

```bash
npm run db:studio
```

It starts a local website and prints its address in the terminal (open it if the browser doesn't open by itself). Click a table on the left (e.g. **Lesson**, **UserExerciseAttempt**) to browse rows. After you register in the app or Postman, you'll see your **User** row with a `passwordHash` like `scrypt:…` — never the real password. Stop Studio with `Ctrl + C`.

Alternative: `psql vachan_dev` then `\dt` (list tables), `select email from "User";`, `\q` to quit. (Table names are case-sensitive, so use double quotes.)

---

## 8. Reset the development database

Deletes **everything** (all users and progress), re-applies the migrations and re-seeds:

```bash
npm run db:reset
```

Only content (keep user accounts, lose lesson progress): `npm run db:seed:reset-content -w backend`.

Docker full wipe: `docker compose down -v && npm run db:up && npm run db:migrate && npm run db:seed`.

---

## 9. Phase 3 migration — what changed

Phase 3 adds one migration: `backend/prisma/migrations/20261005120000_phase3_learning_system/migration.sql`. Apply it with:

```bash
npm run db:migrate     # applies only the new migration; your users stay
npm run db:seed        # loads the new 4-unit courses (clears old lesson progress — see above)
```

| Change                                                                       | Why                                                                                   |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| enum `ExerciseType` + `CHARACTER_SOUND`                                      | New exercise: letter → sound. `CHARACTER_RECOGNITION` is now sound → letter.          |
| `Exercise.explanation` (text, optional)                                      | Teaching note shown after answering; never sent before.                               |
| new enum `AttemptSource` (`LESSON`, `REVIEW`) + `UserExerciseAttempt.source` | Separates lesson answers from mistake-review answers.                                 |
| `UserLessonProgress.runStartedAt`                                            | Start of the current run → resume a half-finished lesson; "practise again" resets it. |
| `UserLessonProgress.lastActivityAt`                                          | Last activity (resume point, "last active").                                          |
| `UserLessonProgress.correctAttempts`, `incorrectAttempts`, `accuracy`        | Correct / incorrect counts and accuracy per lesson.                                   |
| `UserLessonProgress.timesCompleted`                                          | How many full runs the learner finished.                                              |
| 2 indexes                                                                    | Fast "recent activity" and "attempts per exercise" queries.                           |

The migration also back-fills these counters for any Phase 2 progress rows, so nothing breaks if you migrate without re-seeding.

---

## 9b. Phase 4 migration — what changed

One more migration: `backend/prisma/migrations/20261006090000_phase4_placement_gamification/migration.sql`.

```bash
npm run db:migrate     # applies the Phase 4 migration (existing users and progress are kept)
npm run db:seed        # adds the 8 badges + 12 placement questions per language
```

| Change                                    | Table / column                                                                       |
| ----------------------------------------- | ------------------------------------------------------------------------------------ |
| Learner's time zone (for streak days)     | `UserProfile.timeZone` (default `Asia/Kolkata`)                                      |
| Placement-unlocked lessons                | `UserLessonProgress.placedOut`                                                       |
| XP, hearts, streak, counters (1 per user) | **new** `UserStats`                                                                  |
| One row per active local day              | **new** `UserDailyActivity` (xpEarned, exercisesAnswered, lessonsCompleted, goalMet) |
| Every XP award                            | **new** `XpEvent` (amount, reason, localDate)                                        |
| Badge definitions / unlocked badges       | **new** `Achievement`, `UserAchievement`                                             |
| Placement questions / tests / answers     | **new** `PlacementQuestion`, `PlacementTest`, `PlacementAnswer`                      |
| New enums                                 | `XpReason`, `AchievementMetric`, `PlacementSkill`, `PlacementStatus`                 |

`UserStats` rows are created automatically the first time a learner is seen, so old accounts work without a backfill. Re-seeding re-creates content and placement questions (and, as before, clears lesson progress); XP, streaks and badges in `UserStats`/`UserAchievement` are kept.

The spec lists `Streak` and `DailyGoal` as separate models; here they are fields of `UserStats` / rows of `UserDailyActivity` (same data, fewer tables). Rules: [GAMIFICATION.md](GAMIFICATION.md).

**Inspect the Phase 4 records:**

```sql
SELECT s."totalXp", s.hearts, s."heartsUpdatedAt", s."currentStreak", s."longestStreak", s."lastActiveDate",
       s."perfectLessons", s."mistakesCleared", s."dailyGoalsMet"
FROM "UserStats" s JOIN "User" u ON u.id = s."userId" WHERE u.email = 'you@example.com';

SELECT d.date, d."xpEarned", d."exercisesAnswered", d."lessonsCompleted", d."goalMet"
FROM "UserDailyActivity" d JOIN "User" u ON u.id = d."userId" WHERE u.email = 'you@example.com' ORDER BY d.date;

SELECT x.reason, x.amount, x."lessonId", x."localDate" FROM "XpEvent" x JOIN "User" u ON u.id = x."userId"
WHERE u.email = 'you@example.com' ORDER BY x."createdAt";

SELECT a.code, ua."unlockedAt" FROM "UserAchievement" ua JOIN "Achievement" a ON a.id = ua."achievementId"
JOIN "User" u ON u.id = ua."userId" WHERE u.email = 'you@example.com';

SELECT t.status, t."selfAssessment", t."correctCount", t."recommendedUnit", t."chosenUnit"
FROM "PlacementTest" t JOIN "User" u ON u.id = t."userId" WHERE u.email = 'you@example.com';

SELECT "lessonId", status, "placedOut" FROM "UserLessonProgress" p JOIN "User" u ON u.id = p."userId"
WHERE u.email = 'you@example.com' AND p."placedOut";
```

After the full Postman run: `totalXp` 70, `currentStreak` 1, 4 badges (first-lesson, perfect-lesson, mistake-mender, goal-getter), one `ACCEPTED` placement test with `recommendedUnit` 3 and 8 Hindi lessons `placedOut`.

---

## 9c. Phase 5–7 migrations — what changed

- `20261007090000_phase5_rag_knowledge_base` — pgvector extension, `KnowledgeDocument`, `KnowledgeChunk` (see [RAG.md](RAG.md)).
- `20261008090000_phase6_ai_tutor` — `AIConversation`, `AIMessage` and the enums `AIMessageRole`, `AIAnswerStatus` (see [AI_TUTOR.md §4](AI_TUTOR.md#4-database-migration-20261008090000_phase6_ai_tutor), including SQL to inspect chats).
- `20261009090000_phase7_speech_conversation` — `AudioClip` (text-to-speech cache), `SpeechAttempt` (speaking attempts with transcript, scores and **audio metadata** — recordings are not stored), `ConversationSession` + `ConversationTurn` (role-plays), enums `AudioInputSource`, `ConversationScenario`, `ConversationStatus`, `ConversationInputMode` (see [SPEECH.md §12](SPEECH.md#12-database), including SQL).

## 9d. Phase 8 migration — what changed

`20261010090000_phase8_admin_analytics`:

- `Unit.isPublished` (default `true`) — units can be hidden like courses and lessons.
- `KnowledgeDocument`: `origin` (FILE / COURSE / ADMIN), `status` (DRAFT / PUBLISHED), `body` (text of dashboard notes), `level`, `topic`, `contentType`, `skill`, `needsReindex`, `lastIndexError`, `updatedAt`. Existing course-vocabulary documents are marked `COURSE` by the migration.
- New table `AdminAuditLog` (`userId` → User, `action`, `entityType`, `entityId`, `summary`, `createdAt`).
- Indexes for analytics: `UserExerciseAttempt(createdAt)`, `UserDailyActivity(date)`.

Nothing is deleted or renamed, so it applies to a database with real learners without data loss.

## 10. The schema (28 tables, one set for all languages)

```
Language ─┬─ Course ── Unit ── Lesson ─┬─ Exercise ── ExerciseOption
          │                            └─ VocabularyItem   (words a lesson introduces, many-to-many)
          ├─ VocabularyItem
          └─ UserProfile.currentLanguage

User ─┬─ UserProfile            (1 : 1)
      ├─ UserLessonProgress     (one row per user per lesson)
      └─ UserExerciseAttempt    (one row per submitted answer)
```

| Model                 | Purpose                                           | Important fields                                                                                                                                           |
| --------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `User`                | Login account                                     | `email` (unique), `passwordHash` (scrypt), `role`, `tokenVersion` (for logout)                                                                             |
| `UserProfile`         | Learner settings from onboarding/profile          | `displayName`, `currentLanguageId`, `dailyGoal`, `showRomanization`, `onboardingDone`                                                                      |
| `Language`            | Hindi, Telugu, Tamil, Malayalam, Kannada, Bengali | `code` (unique: hi/te/ta/ml/kn/bn), `nativeName`, `scriptName`                                                                                             |
| `Course`              | A course for one language                         | `languageId`, `title`, `isPublished`                                                                                                                       |
| `Unit`                | A stage of the learning journey                   | `stage` (FOUNDATIONS…ADVANCED), `sortOrder`                                                                                                                |
| `Lesson`              | A short lesson                                    | `kind` (SCRIPT/VOCABULARY/PHRASES/CHECKPOINT), `introText`, `sortOrder`                                                                                    |
| `Exercise`            | One question                                      | `type` (7 types), `instruction`, `prompt`, `explanation`                                                                                                   |
| `ExerciseOption`      | Answer choices / accepted answers / words / pairs | `isCorrect`, `correctPosition` (word order), `matchText` (matching)                                                                                        |
| `VocabularyItem`      | Letters, words and phrases                        | `kind` (LETTER/WORD/PHRASE), `script`, `romanization`, `meaning`                                                                                           |
| `UserLessonProgress`  | Started / completed, counters, resume point       | `status`, `runStartedAt`, `lastActivityAt`, `correctAttempts`, `incorrectAttempts`, `accuracy`, `timesCompleted`, `completedAt`; unique per (user, lesson) |
| `UserExerciseAttempt` | Every answer a learner submits                    | `answer` (JSON), `isCorrect`, `source` (LESSON/REVIEW), `lessonId`, `createdAt`                                                                            |

**Language-agnostic design:** there are no per-language tables. Every content row points to a `Language`. Adding a seventh language = adding rows (seed or, later, the admin CMS), not changing the schema.

**How the seven exercise types fit one `ExerciseOption` table:**

| Exercise type                                                         | What each option row means                                    |
| --------------------------------------------------------------------- | ------------------------------------------------------------- |
| multiple choice / character recognition / character → sound / fill-in | a choice; exactly one has `isCorrect = true`                  |
| translation                                                           | an accepted answer (never sent to the browser)                |
| word order                                                            | a word; `correctPosition` = 1, 2, 3… (null = distractor word) |
| matching                                                              | a pair: `text` (left) ↔ `matchText` (right)                   |

**Lesson rules (Phase 3):** lessons unlock in order. Status per learner: `completed` (every exercise answered correctly in one run), `current` (started, not finished), `available` (unlocked, not started), `locked`. Details: [LEARNING_ENGINE.md](LEARNING_ENGINE.md).

The migrations are plain SQL you can read: `…_init/migration.sql` (Phase 2) and `…_phase3_learning_system/migration.sql` (Phase 3).

---

## 11. Verify the records yourself (SQL)

Open a SQL prompt: `psql "postgresql://vachan:vachan_dev_password@localhost:5432/vachan_dev"` (or use Prisma Studio, section 7). Replace the email with the one you registered in Postman/the app.

**Content loaded?**

```sql
SELECT (SELECT count(*) FROM "Language") AS languages, (SELECT count(*) FROM "Course") AS courses,
       (SELECT count(*) FROM "Unit") AS units, (SELECT count(*) FROM "Lesson") AS lessons,
       (SELECT count(*) FROM "Exercise") AS exercises, (SELECT count(*) FROM "VocabularyItem") AS vocabulary;
-- expected: 6 | 6 | 24 | 96 | 402 | 204   (Phase 4 also: 72 PlacementQuestion rows, 8 Achievement rows)
```

**Lesson started / completed, counters, accuracy, last activity** (table `UserLessonProgress`):

```sql
SELECT p."lessonId", p.status, p."timesCompleted", p."correctAttempts", p."incorrectAttempts",
       p.accuracy, p."startedAt", p."runStartedAt", p."lastActivityAt", p."completedAt"
FROM "UserLessonProgress" p JOIN "User" u ON u.id = p."userId"
WHERE u.email = 'you@example.com' ORDER BY p."lessonId";
```

After the Postman run you should see `te-u1-l1 | COMPLETED | 1 | 4 | 1 | 80 | …`, `te-u1-l2` and `te-u1-l3` COMPLETED, `te-u1-l4` IN_PROGRESS.

**Every answer** (table `UserExerciseAttempt`):

```sql
SELECT a."exerciseId", a.source, a."isCorrect", a.answer, a."createdAt"
FROM "UserExerciseAttempt" a JOIN "User" u ON u.id = a."userId"
WHERE u.email = 'you@example.com' ORDER BY a."createdAt";
```

**Only the wrong answers** (what the review system reads):

```sql
SELECT a."exerciseId", a.answer, a."createdAt"
FROM "UserExerciseAttempt" a JOIN "User" u ON u.id = a."userId"
WHERE u.email = 'you@example.com' AND a."isCorrect" = false ORDER BY a."createdAt" DESC;
```

**Passwords are hashed:** `SELECT email, left("passwordHash", 20) FROM "User";` → `scrypt:…`, never the real password.

---

## 11b. Development vs production database (Phase 8)

### Migrations

| Situation                                     | Command                                   | What it does                                                                                                                                                                                            |
| --------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Development** — you changed `schema.prisma` | `npm run db:migrate -w backend`           | `prisma migrate dev`: creates a **new migration file** from your change, applies it, regenerates the client. Uses a temporary "shadow" database. Commit the new folder in `backend/prisma/migrations/`. |
| **Development** — pulled new code             | `npm run db:migrate -w backend`           | applies the migrations you don't have yet                                                                                                                                                               |
| **Production / staging**                      | `npm run db:deploy -w backend`            | `prisma migrate deploy`: applies pending migrations **only**; never creates migrations, never resets, never asks questions. Run by the Render build and by the Docker backend container on start.       |
| Check what's pending                          | `npx prisma migrate status` (in backend/) | lists applied / pending migrations                                                                                                                                                                      |

Rules: never edit tables by hand, never edit a migration that has already been applied anywhere, never
run `db:reset` or `migrate dev` against production. A failed production migration: fix the cause, then
`npx prisma migrate resolve --rolled-back <name>` and deploy again (see the Prisma docs for `migrate resolve`).

### Seed

| Database    | Seed?                                                                                                                                                                            |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Development | `npm run db:seed` — safe to repeat; demo account included                                                                                                                        |
| Production  | once, after the first `db:deploy`: `NODE_ENV=production npm run db:seed -w backend` (no demo account). After that, change content in the **admin dashboard**, not with the seed. |

### Prisma Studio

`npm run db:studio` opens a local data browser (Section 7). Against production only for reading:
`DATABASE_URL='<production url>' npm run db:studio -w backend` — edits there bypass validation and the
audit log, so make content changes in the admin dashboard instead.

### Backups

- **Neon (staging)**: the free plan keeps a short history (point-in-time restore for a limited window)
  and branches. Before a risky change, create a branch in the Neon console as a snapshot.
- **Any PostgreSQL** (including Docker Compose):
  ```bash
  pg_dump --format=custom --no-owner "$DATABASE_URL" > vachan-$(date +%F).dump        # backup
  pg_restore --clean --no-owner --dbname "$DATABASE_URL" vachan-2026-10-10.dump        # restore
  # Docker Compose:
  docker compose -f docker-compose.prod.yml exec postgres pg_dump -U vachan -Fc vachan > vachan.dump
  ```
- Schedule the dump daily (cron / a CI job) and keep copies **outside** the server. Test a restore once.
- The knowledge-base chunks can always be rebuilt with `npm run rag:index`; user accounts, progress
  and admin-written content can't — those are what backups protect.

### Important tables

| Table                                                                                       | Why it matters                                                |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `User`, `UserProfile`                                                                       | accounts (scrypt hashes, roles), learner settings             |
| `Language` → `Course` → `Unit` → `Lesson` → `Exercise` → `ExerciseOption`, `VocabularyItem` | course content (edited in the admin dashboard)                |
| `UserLessonProgress`, `UserExerciseAttempt`                                                 | progress and every answer (review, analytics)                 |
| `UserStats`, `XpEvent`, `UserDailyActivity`, `UserAchievement`                              | XP, streaks, hearts, daily goals, badges                      |
| `PlacementQuestion`, `PlacementTest`, `PlacementAnswer`                                     | placement test                                                |
| `KnowledgeDocument`, `KnowledgeChunk`                                                       | RAG knowledge base (chunks have 384-d pgvector embeddings)    |
| `AIConversation`, `AIMessage`                                                               | AI Tutor chats with their sources                             |
| `SpeechAttempt`, `AudioClip`                                                                | speaking results (no recordings), cached text-to-speech audio |
| `ConversationSession`, `ConversationTurn`                                                   | role-plays                                                    |
| `AdminAuditLog`                                                                             | who changed what in the dashboard                             |
| `_prisma_migrations`                                                                        | which migrations ran — never edit by hand                     |

---

## 12. Database troubleshooting

| Problem                                                                                                   | Likely cause                                                                            | Fix                                                                                                                       |
| --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `Can't reach database server at localhost:5432` / health `503`                                            | PostgreSQL not running                                                                  | `brew services start postgresql@16` (Docker: `npm run db:up`), then `brew services list`                                  |
| `role "vachan" does not exist`                                                                            | You use Homebrew but kept the Docker `DATABASE_URL`                                     | Use `postgresql://$(whoami)@localhost:5432/vachan_dev?schema=public`                                                      |
| `database "vachan_dev" does not exist`                                                                    | Database not created                                                                    | `createdb vachan_dev`                                                                                                     |
| `password authentication failed`                                                                          | Wrong user/password in `DATABASE_URL`                                                   | Homebrew: no password. Docker: `vachan_dev_password`                                                                      |
| `P1001` / `P1000` from Prisma                                                                             | Same as the two rows above                                                              | Check PostgreSQL is running and `DATABASE_URL` is right                                                                   |
| `Drift detected` / migrate asks to reset                                                                  | Tables were changed by hand, or an old schema exists                                    | Development only: `npm run db:reset` (deletes data)                                                                       |
| `permission denied to create database` (shadow database)                                                  | Your DB user can't create databases                                                     | Homebrew users can. Docker: the `vachan` user is a superuser. Otherwise: `psql postgres -c 'ALTER USER <user> CREATEDB;'` |
| `The table public.Language does not exist` / seed fails                                                   | Migrations not applied                                                                  | `npm run db:migrate`, then `npm run db:seed`                                                                              |
| `permission denied for schema public` / `User was denied access`                                          | The database belongs to another user (PostgreSQL 15+ only lets the owner create tables) | `psql postgres -c "ALTER DATABASE vachan_dev OWNER TO vachan;"`                                                           |
| `column "runStartedAt" does not exist` / `invalid input value for enum "ExerciseType": "CHARACTER_SOUND"` | Phase 3 migration not applied yet                                                       | `npm run db:migrate`                                                                                                      |
| Lessons still show 3 units / old content                                                                  | Content created by an older seed                                                        | Development only: `npm run db:seed:reset-content -w backend` (clears lesson progress)                                     |
| `Cannot find module '../generated/prisma/client'` / types look outdated                                   | Prisma Client not generated after a schema change                                       | `npm run db:generate`, restart `npm run dev`                                                                              |
| `prisma generate` fails downloading engines (403 / network)                                               | Firewall or proxy blocks `binaries.prisma.sh`                                           | Use another network, then re-run                                                                                          |
| Seed: `DATABASE_URL is missing`                                                                           | No `backend/.env`                                                                       | Step 5                                                                                                                    |
| `Unique constraint failed` while seeding                                                                  | Rare race / half-finished seed                                                          | Run `npm run db:seed` again (it cleans up first) or `npm run db:reset`                                                    |
