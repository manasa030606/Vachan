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

| Command               | Runs                                     | Meaning                                                                                                                                                                                                |
| --------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run db:validate` | `prisma validate`                        | Checks the schema file for mistakes. Doesn't touch the database.                                                                                                                                       |
| `npm run db:migrate`  | `prisma migrate dev` + `prisma generate` | Applies every migration in `backend/prisma/migrations/` to your database (first time: creates all 11 tables). If you change `schema.prisma` later, it asks for a name and **creates a new migration**. |
| `npm run db:generate` | `prisma generate`                        | Rebuilds the TypeScript database client in `backend/src/generated/prisma` (git-ignored).                                                                                                               |
| `npm run db:seed`     | `prisma db seed` → `tsx prisma/seed.ts`  | Inserts demo content. Safe to run again.                                                                                                                                                               |
| `npm run db:deploy`   | `prisma migrate deploy`                  | Applies migrations without creating new ones (used for production in Phase 8).                                                                                                                         |

Expected seed output:

```
🌱 Seeding the Vachan database…
  ✓ Hindi      3 units · 5 lessons · 18 exercises · 10 vocabulary items
  ✓ Telugu     3 units · 5 lessons · 18 exercises · 10 vocabulary items
  ✓ Tamil      3 units · 5 lessons · 18 exercises · 10 vocabulary items
  ✓ Malayalam  3 units · 5 lessons · 18 exercises · 10 vocabulary items
  ✓ Kannada    3 units · 5 lessons · 18 exercises · 10 vocabulary items
  ✓ Bengali    3 units · 5 lessons · 18 exercises · 10 vocabulary items
  ✓ Demo account  demo@vachan.dev / Vachan2026!  (development only)
✅ Seed finished.
```

### What the seed creates

For **each of the six languages**: 1 language row, 1 course ("Telugu for English speakers"), 3 units, 5 lessons, 18 exercises (all six exercise types), 10 vocabulary items.

| Unit | Stage            | Lessons                   | Exercise types used                                         |
| ---- | ---------------- | ------------------------- | ----------------------------------------------------------- |
| 1    | Foundations      | Vowels · First consonant  | character recognition, multiple choice, matching            |
| 2    | First Words      | Greetings · Family & food | multiple choice, translation (typed), matching              |
| 3    | Everyday Phrases | Introductions             | multiple choice, fill in the blank, word order, translation |

IDs are readable so you can type them in Postman: language `lang-te`, course `te-course`, unit `te-u2`, lesson `te-u2-l1`, exercise `te-u2-l1-e3`, option `te-u2-l1-e3-o1`.

Plus one **demo account** for quick testing: `demo@vachan.dev` / `Vachan2026!` (Hindi, onboarding done). Development only.

Running the seed again **updates** languages, **re-creates** courses/vocabulary (which also clears lesson progress and attempts), and **keeps** user accounts.

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

Only content (keep users): `npm run db:seed`.

Docker full wipe: `docker compose down -v && npm run db:up && npm run db:migrate && npm run db:seed`.

---

## 9. The schema (11 tables, one set for all languages)

```
Language ─┬─ Course ── Unit ── Lesson ─┬─ Exercise ── ExerciseOption
          │                            └─ VocabularyItem   (words a lesson introduces, many-to-many)
          ├─ VocabularyItem
          └─ UserProfile.currentLanguage

User ─┬─ UserProfile            (1 : 1)
      ├─ UserLessonProgress     (one row per user per lesson)
      └─ UserExerciseAttempt    (one row per submitted answer)
```

| Model                 | Purpose                                           | Important fields                                                                      |
| --------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `User`                | Login account                                     | `email` (unique), `passwordHash` (scrypt), `role`, `tokenVersion` (for logout)        |
| `UserProfile`         | Learner settings from onboarding/profile          | `displayName`, `currentLanguageId`, `dailyGoal`, `showRomanization`, `onboardingDone` |
| `Language`            | Hindi, Telugu, Tamil, Malayalam, Kannada, Bengali | `code` (unique: hi/te/ta/ml/kn/bn), `nativeName`, `scriptName`                        |
| `Course`              | A course for one language                         | `languageId`, `title`, `isPublished`                                                  |
| `Unit`                | A stage of the learning journey                   | `stage` (FOUNDATIONS…ADVANCED), `sortOrder`                                           |
| `Lesson`              | A short lesson                                    | `kind` (SCRIPT/VOCABULARY/PHRASES/CHECKPOINT), `introText`, `sortOrder`               |
| `Exercise`            | One question                                      | `type` (6 types), `instruction`, `prompt`                                             |
| `ExerciseOption`      | Answer choices / accepted answers / words / pairs | `isCorrect`, `correctPosition` (word order), `matchText` (matching)                   |
| `VocabularyItem`      | Letters, words and phrases                        | `kind` (LETTER/WORD/PHRASE), `script`, `romanization`, `meaning`                      |
| `UserLessonProgress`  | Has the learner started/completed a lesson?       | `status` (IN_PROGRESS/COMPLETED), `completedAt`; unique per (user, lesson)            |
| `UserExerciseAttempt` | Every answer a learner submits                    | `answer` (JSON), `isCorrect`, `lessonId`                                              |

**Language-agnostic design:** there are no per-language tables. Every content row points to a `Language`. Adding a seventh language = adding rows (seed or, later, the admin CMS), not changing the schema.

**How the six exercise types fit one `ExerciseOption` table:**

| Exercise type                         | What each option row means                                    |
| ------------------------------------- | ------------------------------------------------------------- |
| multiple choice / character / fill-in | a choice; exactly one has `isCorrect = true`                  |
| translation                           | an accepted answer (never sent to the browser)                |
| word order                            | a word; `correctPosition` = 1, 2, 3… (null = distractor word) |
| matching                              | a pair: `text` (left) ↔ `matchText` (right)                   |

**Lesson unlocking rule:** lessons unlock in order. A lesson is open when every earlier lesson in the course is completed. A lesson is completed when every one of its exercises has been answered correctly at least once.

The migration that creates all of this is `backend/prisma/migrations/<timestamp>_init/migration.sql` (plain SQL you can read).

---

## 10. Database troubleshooting

| Problem                                                                 | Likely cause                                         | Fix                                                                                                                       |
| ----------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `Can't reach database server at localhost:5432` / health `503`          | PostgreSQL not running                               | `brew services start postgresql@16` (Docker: `npm run db:up`), then `brew services list`                                  |
| `role "vachan" does not exist`                                          | You use Homebrew but kept the Docker `DATABASE_URL`  | Use `postgresql://$(whoami)@localhost:5432/vachan_dev?schema=public`                                                      |
| `database "vachan_dev" does not exist`                                  | Database not created                                 | `createdb vachan_dev`                                                                                                     |
| `password authentication failed`                                        | Wrong user/password in `DATABASE_URL`                | Homebrew: no password. Docker: `vachan_dev_password`                                                                      |
| `P1001` / `P1000` from Prisma                                           | Same as the two rows above                           | Check PostgreSQL is running and `DATABASE_URL` is right                                                                   |
| `Drift detected` / migrate asks to reset                                | Tables were changed by hand, or an old schema exists | Development only: `npm run db:reset` (deletes data)                                                                       |
| `permission denied to create database` (shadow database)                | Your DB user can't create databases                  | Homebrew users can. Docker: the `vachan` user is a superuser. Otherwise: `psql postgres -c 'ALTER USER <user> CREATEDB;'` |
| `The table public.Language does not exist` / seed fails                 | Migrations not applied                               | `npm run db:migrate`, then `npm run db:seed`                                                                              |
| `Cannot find module '../generated/prisma/client'` / types look outdated | Prisma Client not generated after a schema change    | `npm run db:generate`, restart `npm run dev`                                                                              |
| `prisma generate` fails downloading engines (403 / network)             | Firewall or proxy blocks `binaries.prisma.sh`        | Use another network, then re-run                                                                                          |
| Seed: `DATABASE_URL is missing`                                         | No `backend/.env`                                    | Step 5                                                                                                                    |
| `Unique constraint failed` while seeding                                | Rare race / half-finished seed                       | Run `npm run db:seed` again (it cleans up first) or `npm run db:reset`                                                    |
