# Vachan

**Learn India's languages. One word at a time.**

Vachan is an AI-powered, gamified platform for learning Indian languages: Hindi, Telugu, Tamil, Malayalam, Kannada and Bengali. It's a college capstone project, built in phases.

> **Current status: Phase 2, Database & Backend.** Real accounts (register, login, logout), a PostgreSQL database for all six languages, a REST API, and the website now uses it. Lessons, exercise checking and progress are saved in the database. XP, streaks, hearts, badges and the Practice page are still demo values (Phases 3–4). See the [Roadmap](#roadmap).

**Detailed guides:**

- 📘 [docs/DATABASE.md](docs/DATABASE.md): install PostgreSQL, `.env`, migrations, seed, Prisma Studio, reset, schema explanation, database troubleshooting.
- 📗 [docs/API.md](docs/API.md): every endpoint, authentication flow, a complete Postman guide with expected responses and errors.

---

## Table of contents

1. [Quick start (Phase 2)](#quick-start-phase-2)
2. [Tech stack](#tech-stack)
3. [Project structure](#project-structure)
4. [Architecture](#architecture)
5. [What works in the app](#what-works-in-the-app)
6. [Design system](#design-system)
7. [npm scripts](#npm-scripts)
8. [Environment variables](#environment-variables)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)
11. [Architecture decisions](#architecture-decisions)
12. [Roadmap](#roadmap)

---

## Quick start (Phase 2)

Prerequisites: Node.js 20.19+ or 22.12+, npm, Git, and PostgreSQL 16 (Homebrew: `brew install postgresql@16`). Full details are in [docs/DATABASE.md](docs/DATABASE.md).

```bash
cd ~/Desktop/Vachan

# 1. PostgreSQL running + database exists
brew services start postgresql@16
createdb vachan_dev                      # "already exists" is fine

# 2. Environment files (first time only)
cp backend/.env.example backend/.env     # then set DATABASE_URL (see below)
cp frontend/.env.example frontend/.env.local

# 2b. Coming from Phase 0/1? Add the two new auth variables to your existing backend/.env:
echo "JWT_SECRET=$(openssl rand -hex 32)" >> backend/.env
echo "JWT_EXPIRES_IN=7d" >> backend/.env

# 3. Install, create tables, load demo content
npm install
npm run db:validate
npm run db:migrate
npm run db:seed

# 4. Run
npm run dev
```

With Homebrew, `DATABASE_URL` in `backend/.env` is `postgresql://YOUR_MAC_USERNAME@localhost:5432/vachan_dev?schema=public` (find your username with `whoami`).

**Expected result:**

```
[backend] 🚀 Vachan API running at http://localhost:4000 (development)
[backend] ✅ Database connected
[frontend] - Local:         http://localhost:3000
```

Open **http://localhost:3000** → **Start learning** → create an account → onboarding → learn. Or log in with the demo account `demo@vachan.dev` / `Vachan2026!`. Explore the data with `npm run db:studio`. Test the API with Postman ([docs/API.md](docs/API.md)).

## Tech stack

| Layer      | Technology                                                                                          |
| ---------- | --------------------------------------------------------------------------------------------------- |
| Frontend   | Next.js 16 (App Router), React 19, Tailwind CSS 4, lucide-react                                     |
| Fonts      | Nunito + the Baloo family (self-hosted via Fontsource)                                              |
| Backend    | Node.js, Express 5                                                                                  |
| Auth       | scrypt password hashing (Node.js built-in), JWT (`jsonwebtoken`), httpOnly cookie (`cookie-parser`) |
| Database   | PostgreSQL 16                                                                                       |
| ORM        | Prisma 7 (with the `pg` driver adapter)                                                             |
| Validation | Zod 4 (backend requests, env variables, frontend forms)                                             |
| Tests      | Node's built-in test runner (`node:test`) run through `tsx`; Postman/Newman                         |
| Language   | TypeScript 5.9 (strict mode) everywhere                                                             |
| Tooling    | ESLint 9, Prettier 3, npm workspaces                                                                |

## Project structure

```
Vachan/
├── package.json · docker-compose.yml · postman/Vachan.postman_collection.json
├── docs/
│   ├── DATABASE.md                # database setup + schema
│   └── API.md                     # endpoints + Postman guide
│
├── backend/                       # Express REST API
│   ├── .env.example
│   ├── prisma.config.ts           # Prisma CLI config (DATABASE_URL, migrations, seed command)
│   ├── prisma/
│   │   ├── schema.prisma          # 11 models, one set for all languages
│   │   ├── migrations/            # SQL migrations (created by `prisma migrate dev`)
│   │   ├── seed.ts                # `npm run db:seed`
│   │   ├── seed-data.ts           # letters, words, sentence for the 6 languages
│   │   └── course-builder.ts      # turns seed-data into courses → units → lessons → exercises (+ tests)
│   ├── src/
│   │   ├── server.ts · app.ts
│   │   ├── config/env.ts          # validated environment variables
│   │   ├── lib/                   # prisma client, password hashing, JWT, auth cookie, HttpError
│   │   ├── middleware/            # requireAuth / optionalAuth, 404, JSON error handler
│   │   ├── schemas/               # Zod request validation
│   │   ├── services/              # business logic (auth, users, courses, lessons, progress, answer checking)
│   │   ├── routes/                # thin HTTP layer: /auth /me /languages /courses /lessons /exercises /progress /health
│   │   └── types/express.d.ts     # adds req.auth
│   └── tests/api.test.ts          # end-to-end API test (same order as Postman)
│
└── frontend/                      # Next.js website
    └── src/
        ├── app/                   # routes: /, /login, /register, /onboarding, /learn, /practice, /profile, /lesson/[id]
        ├── components/
        │   ├── session/           # SessionProvider (who is logged in) + RequireAuth (page guard)
        │   ├── ui/ brand/ landing/ auth/ onboarding/ navigation/ learn/ lesson/ exercises/ practice/ profile/ gamification/
        ├── lib/
        │   ├── api/               # client.ts (fetch wrapper) · endpoints.ts · types.ts · mappers.ts · health.ts
        │   ├── learner-preferences.ts   # profile settings via GET/PATCH /api/me
        │   └── exercises/         # lesson reducer + answer helpers (+ tests)
        ├── hooks/                 # useApi, useLanguages, useNumberShortcuts
        └── data/                  # static UI data: language themes, onboarding options, demo gamification
```

## Architecture

```
┌──────────────────────┐  fetch + httpOnly cookie  ┌──────────────────────────────┐  Prisma  ┌──────────────┐
│ Frontend (Next.js)   │ ────────────────────────► │ Backend (Express)            │ ───────► │ PostgreSQL   │
│ localhost:3000       │ ◄──────────────────────── │ routes → services → Prisma   │ ◄─────── │ vachan_dev   │
└──────────────────────┘          JSON             └──────────────────────────────┘          └──────────────┘
```

- **Modular monolith:** one frontend and one backend, no microservices.
- **Backend layers:**
  - `routes/` read and validate the request (Zod) and call a service.
  - `services/` hold the logic (lesson unlocking, answer checking, progress).
  - `lib/prisma.ts` talks to the database.
  - Errors are thrown as `HttpError` and turned into JSON by one error handler.
- **Security:**
  - Passwords are hashed with scrypt; the plain password is never stored.
  - Logins use a signed JWT, sent as an httpOnly cookie (website) or a Bearer header (Postman).
  - Logout invalidates old tokens (`tokenVersion`).
  - Correct answers never reach the browser before the learner answers.
  - Secrets stay in `backend/.env`.
- **Frontend:**
  - `SessionProvider` calls `GET /api/me` once to know who is logged in.
  - `RequireAuth` protects pages: guests go to `/login`, unfinished onboarding goes to `/onboarding`.
  - Pages load data with `useApi` and the functions in `lib/api/endpoints.ts`.

The full authentication flow is explained in [docs/API.md → Authentication flow](docs/API.md#2-authentication-flow).

## What works in the app

| Screen          | Phase 2 behaviour                                                                                                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Register        | Creates a real account (`POST /api/auth/register`) and logs you in; duplicate emails and invalid fields are shown                                                           |
| Login           | Real login (`POST /api/auth/login`); wrong passwords show an error; returns to the page you came from                                                                       |
| Forgot password | Still a preview: emails are not sent yet                                                                                                                                    |
| Onboarding      | Languages come from `GET /api/languages`; answers are saved with `PATCH /api/me`                                                                                            |
| Learn           | Your course from the database: units, lessons and **real** completed/current/locked status; course progress bar                                                             |
| Lesson          | Loaded from `GET /api/lessons/:id`; **Check** sends the answer to the server, which checks and saves it; completing all exercises completes the lesson and unlocks the next |
| Profile         | Real name, email, join date, lessons completed and accuracy (`GET /api/progress`); settings saved with `PATCH /api/me`; **Log out** calls `POST /api/auth/logout`           |
| Language switch | Top-bar language menu saves your course language to your profile                                                                                                            |
| Practice        | Preview with demo data (review of mistakes is Phase 3)                                                                                                                      |
| Gamification    | Streak, XP, level, hearts and achievements are demo values (Phase 4)                                                                                                        |

**Exercise types:** multiple choice, character recognition, matching, fill in the blank, translation (typed) and word order. **Typed answers** ignore capitals, spaces and punctuation ("THankyou" = "thank you") and accept small typos with a "Watch the spelling" note. All of this is checked on the server in `backend/src/services/answer-checker.ts`.

## Design system

Vachan has its own visual identity: the UX is inspired by game-like language apps, but no logos, mascots, illustrations or colours are copied.

- **Logo:** a speech bubble with **व** (from वचन) and a marigold bindu.
- **Colours:** `brand` = deep indigo "neel" (#5A3BE0), `marigold` for rewards, and teal/rose for units.
- **Fonts:** Nunito, plus the Baloo family for all six scripts.
- **Learning path:** kolam-inspired diamond lesson tiles.
- **Language icons:** native glyph tiles instead of flags.

All design tokens live in `frontend/src/app/globals.css`. The layout is mobile-first with a bottom tab bar on phones, an icon sidebar on tablets and a full sidebar on desktop. It is accessible: focus rings, `aria-live` feedback, and icons as well as colour.

## npm scripts

Run from the project root:

| Script                                 | What it does                                                                                |
| -------------------------------------- | ------------------------------------------------------------------------------------------- |
| `npm run dev`                          | Backend (auto-restart) + frontend together                                                  |
| `npm run dev:backend` / `dev:frontend` | Only one of them                                                                            |
| `npm run build`                        | Compile backend to `backend/dist/` and build the frontend                                   |
| `npm run typecheck`                    | TypeScript checks (backend + frontend)                                                      |
| `npm run lint`                         | ESLint (backend + frontend)                                                                 |
| `npm test`                             | Unit tests: backend (answer checking, lesson unlocking, passwords, seed content) + frontend |
| `npm run test:api`                     | End-to-end API test against your database (needs migrate + seed)                            |
| `npm run format` / `format:check`      | Prettier                                                                                    |
| `npm run check`                        | format:check + typecheck + lint + test + build (run before every commit)                    |
| `npm run db:validate`                  | Check `schema.prisma`                                                                       |
| `npm run db:migrate`                   | Apply migrations (and create a new one after you change the schema) + generate client       |
| `npm run db:generate`                  | Regenerate Prisma Client                                                                    |
| `npm run db:seed`                      | Load demo content for the six languages + demo account                                      |
| `npm run db:reset`                     | ⚠️ Delete all data, re-apply migrations, re-seed                                            |
| `npm run db:studio`                    | Browse the database in your web browser                                                     |
| `npm run db:deploy`                    | Apply migrations without creating new ones (production)                                     |
| `npm run db:up` / `db:down`            | Start/stop the optional Docker PostgreSQL                                                   |

## Environment variables

`backend/.env` (copy from `backend/.env.example`; never commit it):

| Variable         | Required | Example                                                       | Purpose                                      |
| ---------------- | -------- | ------------------------------------------------------------- | -------------------------------------------- |
| `NODE_ENV`       | no       | `development`                                                 | `production` turns on HTTPS-only cookies     |
| `PORT`           | no       | `4000`                                                        | API port                                     |
| `DATABASE_URL`   | **yes**  | `postgresql://manasa@localhost:5432/vachan_dev?schema=public` | PostgreSQL connection                        |
| `CORS_ORIGIN`    | no       | `http://localhost:3000`                                       | Website allowed to call the API with cookies |
| `JWT_SECRET`     | **yes**  | output of `openssl rand -hex 32`                              | Signs login tokens. ≥ 32 chars, secret       |
| `JWT_EXPIRES_IN` | no       | `7d`                                                          | Login lifetime (`7d`, `12h`, `30m`)          |

`frontend/.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:4000` (unchanged). Anything `NEXT_PUBLIC_` is visible in the browser, so no secrets ever go there.

**Local vs production:** locally the values above are enough. In production (Phase 8) you need `NODE_ENV=production`, a strong unique `JWT_SECRET`, the production `DATABASE_URL`, and the real site address in `CORS_ORIGIN` / `NEXT_PUBLIC_API_URL`.

## Testing

| What                | Command / tool                                  | Covers                                                                                                     |
| ------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Backend unit tests  | `npm test -w backend`                           | Answer checking (all 6 types, typos), lesson unlocking, password hashing, seed content for all 6 languages |
| Frontend unit tests | `npm test -w frontend`                          | Lesson flow reducer, answer helpers                                                                        |
| API end-to-end      | `npm run test:api` (backend + DB running)       | Register → login → me → languages → courses → lesson → attempts → progress → logout                        |
| Postman             | Import `postman/Vachan.postman_collection.json` | 33 requests with built-in tests (see [docs/API.md](docs/API.md))                                           |

## Troubleshooting

| Problem                                                                | Fix                                                                                                                                                              |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend stops with `❌ Invalid environment configuration … JWT_SECRET` | Add it: `echo "JWT_SECRET=$(openssl rand -hex 32)" >> backend/.env`, restart `npm run dev`                                                                       |
| `⚠️ Database NOT reachable` / `/api/health` 503                        | PostgreSQL isn't running (`brew services start postgresql@16`) or `DATABASE_URL` is wrong → [docs/DATABASE.md §10](docs/DATABASE.md#10-database-troubleshooting) |
| Learn page: "No course is available for this language yet"             | Run `npm run db:seed`                                                                                                                                            |
| Errors like `relation "Language" does not exist`                       | Tables missing → `npm run db:migrate`                                                                                                                            |
| Migration fails / "drift detected"                                     | Development only: `npm run db:reset`                                                                                                                             |
| TypeScript errors about Prisma types after pulling                     | `npm install` (runs `prisma generate`) or `npm run db:generate`                                                                                                  |
| Website: "Can't reach the server"                                      | Backend not running, or `NEXT_PUBLIC_API_URL` wrong in `frontend/.env.local` (restart after editing)                                                             |
| Browser console: CORS error                                            | `CORS_ORIGIN=http://localhost:3000` exactly, restart backend; open the site at `http://localhost:3000` (not `127.0.0.1`)                                         |
| Logged in but sent back to `/login`                                    | Cookie not sent: use `localhost` for both URLs; clear site cookies; log in again                                                                                 |
| Postman `401`                                                          | Run **Login** again (token saved automatically) — see [docs/API.md §7](docs/API.md#7-api-troubleshooting)                                                        |
| `Port 4000 / 3000 is already in use`                                   | `lsof -i :4000` → `kill <PID>`                                                                                                                                   |
| Indian script shows boxes (□□□)                                        | Stop the server, delete `frontend/.next`, `npm run dev`                                                                                                          |

## Architecture decisions

**Phase 0–1** (kept): modular monolith with npm workspaces, port 4000, TypeScript 5.9, Prisma 7 with driver adapter, Zod-validated env, health endpoint returning 503 when the database is down, self-hosted fonts, typed mock data separated from components, lesson logic as a pure reducer.

**Phase 2:**

1. **One content model for all languages.** Every course/vocabulary row belongs to a `Language`; no per-language tables.
2. **Readable seed IDs** (`te-u2-l1-e3`), so they can be typed straight into Postman and URLs.
3. **scrypt from Node.js** for password hashing, instead of a native `bcrypt` package (no compile problems on any OS).
4. **JWT in an httpOnly cookie for the website, plus a Bearer header for Postman.** The frontend never touches the token.
5. **Logout via `tokenVersion`.** Real invalidation without an extra sessions table.
6. **Answers are checked on the server.** Lessons are sent without correct answers. Matching sends its pairs for instant per-tap feedback, but the final result is still verified on the server.
7. **Simple, explainable progress rules.** A lesson is completed when each exercise has been answered correctly once. The next lesson unlocks in order. No "AI" claims.
8. **`PATCH /api/me`** (from the spec's API table) so onboarding and settings are saved.
9. **Thin routes, logic in services**, one JSON error format, and Zod on every input.

## Roadmap

| Phase | Name                                                                       | Status  |
| ----- | -------------------------------------------------------------------------- | ------- |
| 0     | Project setup                                                              | ✅ Done |
| 1     | UI/UX foundation                                                           | ✅ Done |
| 2     | Database & backend (models, auth, languages/courses/lessons/progress APIs) | ✅ Done |
| 3     | Real learning system (full content model, lesson progression, review)      | Next    |
| 4     | Placement & gamification                                                   | —       |
| 5     | RAG knowledge base                                                         | —       |
| 6     | AI tutor                                                                   | —       |
| 7     | Speaking & AI conversation                                                 | —       |
| 8     | Admin, analytics & polish (Docker, CI/CD, deployment)                      | —       |

### Known limitations (Phase 2)

- **Content is a small demo:** 5 lessons per language. The full curriculum is Phase 3.
- **Practice/review, mistakes and weak words are demo data** (Phase 3).
- **XP, streaks, hearts, levels and achievements are demo values and are not stored** (Phase 4). Hearts in a lesson are counted only on the page.
- **Forgot password** doesn't send emails yet.
- **No rate limiting on login yet** (Phase 8: security hardening).
- **`npm audit`** reports a dev-only advisory in `braces` (inside Next's ESLint plugin). `npm audit --omit=dev` reports 0.
