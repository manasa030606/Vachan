# Vachan

**Learn India's languages. One word at a time.**

Vachan is an AI-powered, gamified platform for learning Indian languages: Hindi, Telugu, Tamil, Malayalam, Kannada and Bengali. It's a college capstone project, built in phases.

> **Current status: Phase 1, UI/UX Foundation.** The complete clickable frontend is built: landing page, auth screens, onboarding, learning path, lessons with six exercise types, practice and profile. It uses **mock data only**. There is no real login, no database tables and no real API calls yet; those arrive in Phase 2. See the [Roadmap](#roadmap).

---

## Table of contents

1. [Tech stack](#tech-stack)
2. [Project structure](#project-structure)
3. [Architecture](#architecture)
4. [Phase 1: screens and how to try them](#phase-1-screens-and-how-to-try-them)
5. [Design system](#design-system)
6. [Prerequisites](#prerequisites)
7. [Setup: step by step](#setup-step-by-step)
8. [Running the project](#running-the-project)
9. [Testing the API in Postman](#testing-the-api-in-postman)
10. [npm scripts](#npm-scripts)
11. [Environment variables](#environment-variables)
12. [Database (PostgreSQL + Prisma)](#database-postgresql--prisma)
13. [Troubleshooting](#troubleshooting)
14. [Architecture decisions](#architecture-decisions)
15. [Roadmap](#roadmap)

---

## Tech stack

| Layer      | Technology                                                      |
| ---------- | --------------------------------------------------------------- |
| Frontend   | Next.js 16 (App Router), React 19, Tailwind CSS 4, lucide-react |
| Fonts      | Nunito + the Baloo family (self-hosted via Fontsource)          |
| Backend    | Node.js, Express 5                                              |
| Language   | TypeScript 5.9 (strict mode) everywhere                         |
| Database   | PostgreSQL 16                                                   |
| ORM        | Prisma 7 (with the `pg` driver adapter)                         |
| Validation | Zod 4 (backend env + frontend forms)                            |
| Tests      | Node's built-in test runner (`node:test`) run through `tsx`     |
| Tooling    | ESLint 9, Prettier 3, npm workspaces                            |

## Project structure

```
Vachan/
├── package.json              # Root: npm workspaces + scripts that run both apps
├── docker-compose.yml        # Optional: local PostgreSQL via Docker
├── postman/                  # Postman collection for the backend API
│
├── backend/                  # Express REST API (unchanged in Phase 1)
│   ├── .env.example
│   ├── prisma.config.ts
│   ├── prisma/schema.prisma  # No models yet; they arrive in Phase 2
│   └── src/
│       ├── server.ts · app.ts
│       ├── config/env.ts     # Validated environment variables
│       ├── lib/prisma.ts     # Prisma Client + DB check
│       ├── routes/           # GET /api/health
│       └── middleware/       # JSON 404 + error handler
│
└── frontend/                 # Next.js web app
    ├── .env.example
    └── src/
        ├── app/                       # Routes (one folder = one URL)
        │   ├── page.tsx               # /            Landing
        │   ├── (auth)/                # /login /register /forgot-password (split-screen layout)
        │   ├── onboarding/            # /onboarding  4-step setup wizard
        │   ├── (app)/                 # Signed-in area with navigation
        │   │   ├── layout.tsx         #   sidebar + top stats bar + mobile bottom bar
        │   │   ├── learn/             #   /learn     learning path
        │   │   ├── practice/          #   /practice  mistakes, vocabulary, weak topics
        │   │   └── profile/           #   /profile   stats, achievements, settings
        │   ├── lesson/[lessonId]/     # /lesson/hi-u2-l2  full-screen lesson
        │   ├── status/                # /status      Phase 0 backend health check page
        │   ├── not-found.tsx · icon.svg · layout.tsx · globals.css (design tokens)
        │
        ├── components/
        │   ├── ui/            # Reusable building blocks: Button, Card, ProgressBar, TextField,
        │   │                  #   Switch, StatPill, HeartsCounter, LanguageTile
        │   ├── brand/         # Logo
        │   ├── landing/       # Hero, LanguageShowcase, HowItWorks, FeatureGrid, ...
        │   ├── auth/          # AuthCard, LoginForm, RegisterForm, ForgotPasswordForm, PasswordField
        │   ├── onboarding/    # OnboardingWizard + one component per step
        │   ├── navigation/    # SidebarNav, BottomNav, TopStatsBar, LanguageSwitcher
        │   ├── learn/         # LearnView, UnitSection, LessonNode, UpNextCard, ReviewCard
        │   ├── gamification/  # DailyGoalCard, StreakCard, LevelCard, HeartsCard
        │   ├── lesson/        # LessonPlayer, LessonIntro, LessonTopBar, LessonFooter,
        │   │                  #   LessonComplete, OutOfHearts, Confetti
        │   ├── exercises/     # ExerciseRenderer + the 6 exercise types (see below)
        │   ├── practice/      # PracticeView, RecommendedPractice, MistakesList, ...
        │   └── profile/       # ProfileView, ProfileHeader, AchievementsGrid, SettingsCard, ...
        │
        ├── data/              # ALL mock data lives here (no content inside components)
        │   ├── languages.ts           # The 6 languages
        │   ├── language-content.ts    # Letters, 5 words and 1 sentence per language
        │   ├── mock-course.ts         # Units → lessons with demo progress
        │   ├── mock-lessons.ts        # Builds a demo lesson for any language
        │   ├── mock-user.ts           # XP, streak, hearts, achievements
        │   ├── mock-practice.ts       # Mistakes, weak topics, vocabulary strength
        │   └── onboarding-options.ts  # Goals, daily goals, self-assessment levels
        │
        ├── lib/
        │   ├── exercises/check-answer.ts    # Pure answer-checking functions (+ tests)
        │   ├── exercises/lesson-reducer.ts  # Lesson state machine (+ tests)
        │   ├── learner-preferences.ts       # Mock session saved in localStorage
        │   └── validation/auth-schemas.ts   # Zod schemas for the auth forms
        ├── hooks/use-number-shortcuts.ts    # Press 1–4 to pick an answer
        └── types/                           # learning.ts, exercise.ts
```

## Architecture

Vachan is a **modular monolith**: one frontend app and one backend API in one repository. No microservices.

```
┌──────────────────────┐   HTTP (JSON)   ┌──────────────────────┐   SQL    ┌──────────────┐
│  Frontend            │ ──────────────► │  Backend             │ ───────► │  PostgreSQL  │
│  Next.js + React     │                 │  Express + TS        │  Prisma  │              │
│  localhost:3000      │ ◄────────────── │  localhost:4000/api  │ ◄─────── │  :5432       │
└──────────────────────┘                 └──────────────────────┘          └──────────────┘
```

**In Phase 1 the frontend does not call the backend** (except the developer page `/status`). Screens read typed mock data from `frontend/src/data/`. That data has the same shape the real API will return, so Phase 2 can replace each `data/` function with an API call without rewriting the components.

How the frontend is organised:

- **Pages** (`app/`) are thin. They pick a "view" component and set the page title.
- **Views** (`LearnView`, `PracticeView`, `ProfileView`, `LessonScreen`) read the data and lay out the screen.
- **Components** are small and reusable. The exercises all share one props contract (`ExerciseComponentProps`), and `ExerciseRenderer` picks the right one by `exercise.type`.
- **Logic** that isn't UI (answer checking, the lesson state machine) lives in plain TypeScript functions in `lib/` and has unit tests.

### The lesson flow

```
intro (new words) → exercise → [Check] → feedback → [Continue] → next exercise … → Lesson complete!
                                  │
                         wrong answer: −1 heart, exercise is repeated at the end
                         0 hearts → "Out of hearts" screen
```

All of these rules live in `lib/exercises/lesson-reducer.ts`.

## Phase 1: screens and how to try them

Start the app (`npm run dev`, or `npm run dev:frontend` for just the frontend) and open http://localhost:3000.

| Screen          | URL                            | What to try                                                                                                                                                                           |
| --------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Landing         | `/`                            | Hero, the six languages with a greeting in each script, how it works, features, call to action                                                                                        |
| Register        | `/register`                    | Submit empty to see validation. Then enter any name/email and a password with 8+ characters including a number → goes to onboarding                                                   |
| Login           | `/login`                       | Any email + password → goes to Learn (mock)                                                                                                                                           |
| Forgot password | `/forgot-password`             | Enter an email → "Check your inbox" confirmation (mock)                                                                                                                               |
| Onboarding      | `/onboarding`                  | Pick a language → goal → daily goal → self-assessment → summary → **Start learning**                                                                                                  |
| Learn           | `/learn`                       | Unit path with completed ✓, current (**Start**) and locked 🔒 lessons. XP, streak, hearts and daily goal. Switch language with the glyph button in the top bar                        |
| Lesson          | click **Continue** or a lesson | New-word intro, then 7 exercises covering all 6 types. Answer one wrong on purpose to see the feedback, the lost heart and the repeat at the end. Finish to see the completion screen |
| Practice        | `/practice`                    | Recommended review, recent mistakes, weak topics, vocabulary with filter buttons                                                                                                      |
| Profile         | `/profile`                     | Your name (from Register), stats, level, achievements, language, settings (romanization toggle, daily goal, log out)                                                                  |
| Status (dev)    | `/status`                      | Phase 0 backend + database health check                                                                                                                                               |

**The six exercise types** (`frontend/src/components/exercises/`):

| Type                  | Component                   | Example                                       |
| --------------------- | --------------------------- | --------------------------------------------- |
| Multiple choice       | `multiple-choice.tsx`       | "What does నమస్కారం mean?" → Hello            |
| Character recognition | `character-recognition.tsx` | Big letter "ఆ" → which sound? → aa            |
| Matching              | `matching.tsx`              | Tap pairs: script word ↔ English meaning      |
| Fill in the blank     | `fill-in-blank.tsx`         | "నా \_\_\_\_ ఆశ" → పేరు                       |
| Translation           | `translation.tsx`           | Type the English for ధన్యవాదాలు → "thank you" |
| Word ordering         | `word-order.tsx`            | Build "My name is Asha." from a word bank     |

**Typed answers:** capital letters, spaces and punctuation are ignored ("THankyou", "ThaNk you" and "thank-you!" all equal "thank you"). Small spelling slips are accepted with a friendly "Watch the spelling" note: 1 letter for answers of 5–10 characters, 2 for longer ones. "Thnak you" is accepted; a different word is not. See `allowedTypos()` in `lib/exercises/check-answer.ts`.

**Keyboard:** `1`–`4` pick an answer, `Enter` = Check, then `Enter` = Continue. `Shift+Enter` adds a new line in the translation box.

**Mock data notes:**

- Every lesson uses the same demo exercise set, built for the selected language by `data/mock-lessons.ts`.
- The language content (letters, 5 common words and the sentence "My name is Asha.") is real and checked for all six languages.
- Onboarding choices and settings are saved in the browser (localStorage) so the demo feels connected. Phase 2 replaces this with the real user profile. To reset, use **Profile → Log out**.

## Design system

Vachan has its own visual identity. The UX is inspired by game-like language apps, but no logos, mascots, illustrations, colours or exact layouts are copied.

| Element        | Choice                                                                                                                                                                                                                                        |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Logo           | Speech bubble with **व** (first letter of वचन, "word/speech") and a marigold bindu                                                                                                                                                            |
| Colours        | `brand` = deep indigo "neel" (#5A3BE0, matching the logo), `marigold` = rewards and XP, plus teal/rose unit colours, on a warm `paper` background. The whole theme can be changed in one place: the `--color-brand-*` values in `globals.css` |
| Fonts          | **Nunito** for English text. **Baloo 2 / Tammudu 2 / Thambi 2 / Chettan 2 / Tamma 2 / Da 2** (Ek Type) for headings and all six scripts                                                                                                       |
| Learning path  | Kolam-inspired **diamond** lesson tiles on a winding path                                                                                                                                                                                     |
| Language icons | A native glyph tile (हि, తె, த, മ, ಕ, বা) instead of flags, because languages aren't countries                                                                                                                                                |

All tokens (colours, fonts, radius, animations) are defined once in `frontend/src/app/globals.css` under `@theme`, and used as Tailwind classes like `bg-brand-600`, `text-marigold-700` and `font-display`.

**Accessibility:** mobile-first layout, keyboard support with visible focus rings, `aria-live` feedback, and correct/incorrect shown with an icon **and** text (not colour alone). Inputs have labels and error messages, onboarding uses real radio buttons, and animations are turned off when the OS "reduce motion" setting is on.

**Responsive navigation:**

- **Mobile (< 768px):** bottom tab bar, plus a top bar with language, streak, XP and hearts.
- **Tablet (768–1023px):** icon-only sidebar.
- **Desktop (≥ 1024px):** full sidebar with labels, plus a right-hand stats column on Learn.

## Prerequisites

Install these once on your machine:

| Tool                           | Version                               | Check with       |
| ------------------------------ | ------------------------------------- | ---------------- |
| [Node.js](https://nodejs.org/) | **20.19+ or 22.12+** (22 LTS is best) | `node -v`        |
| npm                            | 10+ (comes with Node.js)              | `npm -v`         |
| Git                            | any recent version                    | `git --version`  |
| PostgreSQL                     | **16** (15+ works)                    | see step 3 below |

Pick **one** way to run PostgreSQL:

- **Option A: Docker Desktop.** Easiest, one command. Install from https://www.docker.com/products/docker-desktop/
- **Option B: Postgres.app** (macOS). Install from https://postgresapp.com/
- **Option C: Homebrew** (macOS): `brew install postgresql@16`

> Phase 1 screens don't need PostgreSQL. You can try the whole UI with `npm run dev:frontend`. The database is only used by the backend health check.

## Setup: step by step

Run every command from the **project root** (the `Vachan/` folder) unless stated otherwise.

### 1. Install dependencies

```bash
npm install
```

This installs packages for the root, `backend/` and `frontend/` in one go (npm workspaces), then automatically runs `prisma generate`.

**Expected result:** ends with `added ... packages` and `✔ Generated Prisma Client (7.10.0) to ./src/generated/prisma`. Some `npm warn deprecated` lines are normal.

> **Already set up Phase 0?** Just run `npm install` again after pulling Phase 1. It adds the new frontend packages (fonts, icons, zod, tsx).

### 2. Create your environment files

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

The defaults work as-is with Docker (Option A). With Postgres.app or Homebrew, edit `DATABASE_URL` in `backend/.env` (see step 3). **Phase 1 adds no new environment variables.**

### 3. Start PostgreSQL and create the database

The project expects:

| Setting  | Value                                                      |
| -------- | ---------------------------------------------------------- |
| Host     | `localhost`                                                |
| Port     | `5432`                                                     |
| Database | `vachan_dev`                                               |
| User     | `vachan` (Docker) or your own user                         |
| Password | `vachan_dev_password` (Docker, local dev only) or your own |

**Option A: Docker**

```bash
npm run db:up
```

This starts a `postgres:16-alpine` container named `vachan-postgres`, with the `vachan` user and `vachan_dev` database already created. Check it with `docker ps`.

**Option B: Postgres.app**

1. Open Postgres.app and click **Initialize** / **Start**.
2. Create the database:
   ```bash
   /Applications/Postgres.app/Contents/Versions/latest/bin/createdb vachan_dev
   ```
3. In `backend/.env`, use your macOS username with no password:
   ```
   DATABASE_URL="postgresql://YOUR_MAC_USERNAME@localhost:5432/vachan_dev?schema=public"
   ```

**Option C: Homebrew**

```bash
brew install postgresql@16
brew services start postgresql@16
createdb vachan_dev
```

Then set `DATABASE_URL` in `backend/.env` the same way as Option B (find your username with `whoami`). If `createdb` is "command not found", use `$(brew --prefix postgresql@16)/bin/createdb vachan_dev`.

> There are **no tables** yet, so there's nothing to migrate or seed. The backend only checks that it can connect.

### 4. Start the app

```bash
npm run dev
```

**Expected result:**

```
[backend] 🚀 Vachan API running at http://localhost:4000 (development)
[backend] ✅ Database connected
[frontend] ▲ Next.js 16.3.7
[frontend] - Local:         http://localhost:3000
[frontend] ✓ Ready in ...
```

### 5. Check that it works

- **http://localhost:3000** shows the Vachan landing page. Click **Start learning** to walk through the whole flow.
- **http://localhost:3000/status** should show **Backend API ✓ Running** and **Database ✓ Connected**.
- **http://localhost:4000/api/health** returns JSON with `"status":"ok"`.

## Running the project

| What                          | Command                                            | URL                              |
| ----------------------------- | -------------------------------------------------- | -------------------------------- |
| Start PostgreSQL (Docker)     | `npm run db:up`                                    | localhost:5432                   |
| Backend + frontend (dev mode) | `npm run dev`                                      | :3000 and :4000                  |
| Frontend only (enough for UI) | `npm run dev:frontend`                             | http://localhost:3000            |
| Backend only                  | `npm run dev:backend`                              | http://localhost:4000/api/health |
| Production build (both)       | `npm run build`                                    | —                                |
| Run production build          | `npm run start:backend` / `npm run start:frontend` | same ports                       |
| Stop PostgreSQL (Docker)      | `npm run db:down`                                  | —                                |

Startup order: **PostgreSQL → backend → frontend.** Stop the dev servers with `Ctrl + C`.

**Testing different screen sizes:** in Chrome, open DevTools (`Cmd + Option + I`), then click the device toolbar icon (`Cmd + Shift + M`) and pick e.g. iPhone 14 Pro (mobile), iPad Air (tablet) or "Responsive" at 1440px (desktop).

## Testing the API in Postman

Phase 1 adds **no new API endpoints**. The only endpoint is still the health check.

1. Open Postman → **Import** → select `postman/Vachan.postman_collection.json`.
2. The collection **Vachan API** has a variable `baseUrl = http://localhost:4000`.
3. Make sure the backend is running (`npm run dev` or `npm run dev:backend`).

| Field           | Value                                               |
| --------------- | --------------------------------------------------- |
| Method          | `GET`                                               |
| URL             | `http://localhost:4000/api/health`                  |
| Headers         | none required (optional `Accept: application/json`) |
| Auth / Body     | none                                                |
| Expected status | `200 OK`                                            |

**Expected response (200):**

```json
{
  "status": "ok",
  "service": "vachan-backend",
  "environment": "development",
  "uptimeSeconds": 42,
  "timestamp": "2026-09-30T10:00:00.000Z",
  "database": { "status": "connected" }
}
```

- **503** with `"status": "degraded"` and `"database": { "status": "disconnected" }` means the API is running, but PostgreSQL is stopped or `DATABASE_URL` is wrong.
- **404** for unknown routes: `{ "error": { "code": "NOT_FOUND", "message": "Route GET /api/does-not-exist does not exist" } }`
- **"Could not send request / ECONNREFUSED"** means the backend isn't running.

## npm scripts

Run from the project root:

| Script                      | What it does                                                              |
| --------------------------- | ------------------------------------------------------------------------- |
| `npm run dev`               | Start backend (auto-restart on save) and frontend together                |
| `npm run dev:frontend`      | Start only the frontend                                                   |
| `npm run dev:backend`       | Start only the backend                                                    |
| `npm run build`             | Compile backend to `backend/dist/` and build the frontend                 |
| `npm run typecheck`         | TypeScript type checking for both apps                                    |
| `npm run lint`              | ESLint for both apps                                                      |
| `npm test`                  | Unit tests (answer checking, lesson rules, mock data for all 6 languages) |
| `npm run format`            | Format all files with Prettier                                            |
| `npm run format:check`      | Check formatting without changing files                                   |
| `npm run check`             | format:check + typecheck + lint + test + build (run before every commit)  |
| `npm run db:up` / `db:down` | Start/stop the Docker PostgreSQL container                                |
| `npm run db:generate`       | Regenerate Prisma Client after changing `schema.prisma`                   |
| `npm run db:studio`         | Open Prisma Studio (a database browser) in your web browser               |

## Environment variables

Real `.env` files are **never committed** (they're in `.gitignore`). Only the `.env.example` templates are. Phase 1 adds no new variables.

### `backend/.env` (copy from `backend/.env.example`)

| Variable       | Required | Example                                                                           | Purpose                                 |
| -------------- | -------- | --------------------------------------------------------------------------------- | --------------------------------------- |
| `NODE_ENV`     | no       | `development`                                                                     | `development` / `test` / `production`   |
| `PORT`         | no       | `4000`                                                                            | Port the API listens on                 |
| `DATABASE_URL` | **yes**  | `postgresql://vachan:vachan_dev_password@localhost:5432/vachan_dev?schema=public` | PostgreSQL connection string            |
| `CORS_ORIGIN`  | no       | `http://localhost:3000`                                                           | Frontend URL(s) allowed to call the API |

### `frontend/.env.local` (copy from `frontend/.env.example`)

| Variable              | Required | Example                 | Purpose                    |
| --------------------- | -------- | ----------------------- | -------------------------- |
| `NEXT_PUBLIC_API_URL` | no       | `http://localhost:4000` | Where the backend API runs |

⚠️ Anything starting with `NEXT_PUBLIC_` is visible in the browser. Never put secrets there.

## Database (PostgreSQL + Prisma)

**Status:** Prisma is configured and the backend checks the connection. The schema has **no models yet**, so there are no migrations or seed data. Phase 1 doesn't touch the database. The data model (User, Language, Course, Unit, Lesson, Exercise, ...) is created in **Phase 2**.

```bash
npm run db:generate                             # regenerate Prisma Client
npm run db:studio                               # browse the database in the browser
cd backend && npx prisma migrate dev --name x   # (Phase 2+) create + apply a migration
cd backend && npx prisma migrate reset          # (Phase 2+) wipe + re-create the dev database
```

## Troubleshooting

| Problem                                                          | Likely cause                                          | Fix                                                                                                                     |
| ---------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `Module not found: '@fontsource-variable/...'` or `lucide-react` | Phase 1 packages not installed yet                    | Run `npm install` in the project root, then restart `npm run dev`                                                       |
| Indian script text shows boxes (□□□)                             | Fonts didn't load (stale build cache)                 | Stop the server, delete `frontend/.next`, run `npm run dev` again                                                       |
| Learn page shows the wrong language or old name                  | Mock session saved in the browser                     | Profile → **Log out**, or DevTools → Application → Local Storage → delete `vachan.preferences.v1`                       |
| Lesson URL shows "We couldn't find that page"                    | The lesson id doesn't exist in the mock course        | Start lessons from the Learn page (ids look like `hi-u2-l2`)                                                            |
| "This lesson is locked"                                          | Locked lessons can't be opened (by design)            | Open the current lesson (the one marked **Start**)                                                                      |
| Hydration warning in the browser console                         | A browser extension changed the page (e.g. Grammarly) | Try an incognito window. Vachan itself renders the same on server and client                                            |
| Backend prints `❌ Invalid environment configuration`            | `backend/.env` is missing or a value is wrong         | `cp backend/.env.example backend/.env`, then check the variable named in the message                                    |
| `/status` or health shows **Database ✗ Not connected** (503)     | PostgreSQL isn't running, or `DATABASE_URL` is wrong  | Docker: `npm run db:up`. Homebrew: `brew services start postgresql@16`. Check the username in `DATABASE_URL` (`whoami`) |
| `❌ Port 4000 is already in use` / Next.js uses 3001             | Another process uses the port                         | `lsof -i :4000` (or `:3000`), then `kill <PID>`                                                                         |
| Browser console shows a **CORS** error on `/status`              | Frontend URL not in `CORS_ORIGIN`                     | Put the exact frontend URL in `CORS_ORIGIN` and restart the backend                                                     |
| `Cannot find module '../generated/prisma/client'`                | Prisma Client wasn't generated                        | `npm run db:generate`                                                                                                   |
| Something is weird after pulling new code                        | Stale dependencies or build cache                     | `npm install`, delete `frontend/.next`, restart `npm run dev`                                                           |

## Architecture decisions

**Phase 0**

1. **Modular monolith + npm workspaces.** One repo, two apps, one `npm install`.
2. **Backend port 4000 (not 5000).** On macOS, port 5000 is used by AirPlay Receiver.
3. **TypeScript 5.9, not 7.** `typescript-eslint` doesn't support TypeScript 7 yet.
4. **Prisma 7 stable (7.10)** with a driver adapter and `prisma.config.ts`.
5. **Environment validated with Zod at startup.**
6. **Health endpoint returns 503 when the database is down.**
7. **ESM backend with `.ts` import paths** (`rewriteRelativeImportExtensions`).
8. **ESLint 9**, because `eslint-config-next`'s React plugin doesn't support ESLint 10 yet.
9. **npm `overrides` for `mysql2` and `deepmerge-ts`** patch advisories in Prisma CLI's dependencies.

**Phase 1**

10. **Mock data in `src/data/`, never inside components.** Typed like future API responses, so Phase 2 swaps data sources, not components (spec: no lesson content hard-coded in React components).
11. **Self-hosted fonts (Fontsource) instead of Google Fonts.** Builds work offline, and the Baloo family covers all six scripts with one consistent look.
12. **Lesson logic as a pure reducer** (`lesson-reducer.ts`) and pure answer checking (`check-answer.ts`). Easy to explain and unit-test, and ready to move to the backend in Phase 3.
13. **Mock session in localStorage** via `useSyncExternalStore` (no extra state library). It's a demo convenience only, replaced by the real user profile in Phase 2.
14. **Gamification numbers** (perfect-lesson bonus, hearts) are kept in `data/mock-user.ts`, not scattered across components. They move to backend logic in Phase 4, as the spec requires.
15. **No new state, UI-kit or animation libraries.** Only `lucide-react` (icons), `zod` (form validation), Fontsource (fonts) and `tsx` (to run tests).
16. **Typo-tolerant typed answers** use edit distance (insert/delete/replace/swap). Short words must be exact, so a different word is never accepted by accident.
17. **"Recommended practice" is labelled as rules-based**, not AI or ML (spec: don't call a rule engine machine learning).

## Roadmap

| Phase | Name                                                                              | Status  |
| ----- | --------------------------------------------------------------------------------- | ------- |
| 0     | Project setup                                                                     | ✅ Done |
| 1     | UI/UX foundation (visual system, landing, auth screens, onboarding, lesson UI)    | ✅ Done |
| 2     | Database & backend (Prisma models, auth, languages/courses/lessons/progress APIs) | Next    |
| 3     | Real learning system                                                              | —       |
| 4     | Placement & gamification                                                          | —       |
| 5     | RAG knowledge base                                                                | —       |
| 6     | AI tutor                                                                          | —       |
| 7     | Speaking & AI conversation                                                        | —       |
| 8     | Admin, analytics & polish (Docker, CI/CD, deployment)                             | —       |

### Known limitations (Phase 1)

- **Everything is mock data.**
  - Login and register don't create accounts.
  - XP, streak, hearts and achievements don't change after a lesson.
  - Every lesson uses the same demo exercise set (per language).
- **No audio or speech yet** (Phase 7), and no placement test (Phase 4). The self-assessment answer is only shown in the onboarding summary.
- **Light theme only.** A dark theme isn't part of the MVP.
- **Interface language is English only**, as the spec requires for now.
- **`npm audit` reports a high-severity advisory in `braces`.** It comes from Next's ESLint plugin, a development-only lint tool. No patched version exists yet, and it isn't shipped to users (`npm audit --omit=dev` reports 0).
