# Vachan

**Learn India's languages. One word at a time.**

Vachan (वचन, "speech / word") is an AI-powered, gamified platform for learning Indian languages —
Hindi, Telugu, Tamil, Malayalam, Kannada and Bengali — from English. Learners follow a short-lesson
path with seven exercise types, earn XP and streaks, review their mistakes, ask an AI tutor that
answers **only from a curated knowledge base (RAG) with sources**, practise listening and speaking
with speech-to-text feedback, and hold role-play conversations. Content teams manage everything in an
admin dashboard with privacy-friendly analytics. It is a college capstone project (BTech CS-AI),
built in nine phases.

- **Live demo:** https://vachan-eta.vercel.app · API health: https://vachan-api.onrender.com/api/health
  (free hosting — the API sleeps after ~15 minutes; the first request can take a minute)
- **Status:** ✅ Phases 0–8 complete (Phase 8: admin dashboard, analytics, security & performance review, tests, Docker, documentation).

![Learning path](docs/screenshots/learning-path.png)

## Contents

1. [Features](#features) · 2. [Screenshots](#screenshots) · 3. [Architecture](#architecture) ·
2. [Tech stack](#tech-stack) · 5. [Setup](#setup) (PostgreSQL, Prisma, environment) ·
3. [Commands](#commands) · 7. [API testing with Postman](#api-testing-with-postman) ·
4. [AI setup](#ai-setup) · 9. [RAG architecture](#rag-architecture) · 10. [Admin dashboard](#admin-dashboard) ·
5. [Testing](#testing) · 12. [Deployment](#deployment) · 13. [Troubleshooting](#troubleshooting) ·
6. [Limitations](#limitations) · 15. [Future work](#future-work) · 16. [Documentation index](#documentation-index)

---

## Features

| Area                 | What learners / admins get                                                                                                                                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accounts             | Register, login, logout (token revoked), profile & settings, protected pages                                                                                                                                                           |
| Onboarding           | Language, motivation, daily goal, self-assessment → placement test or Unit 1                                                                                                                                                           |
| Learning path        | 6 languages × 4 units × 16 lessons (script → first words → everyday phrases); completed / current / available / locked states; resume where you left off                                                                               |
| Exercises (7 types)  | character → sound, character recognition, multiple choice, matching, fill in the blank, typed translation (typo-tolerant), word order — checked **on the server** with explanations                                                    |
| Placement test       | 12 questions → score per unit → "You are ready for Unit N" → start there (earlier lessons marked _Placement_) or from Unit 1                                                                                                           |
| Gamification         | XP and levels, daily goal, streak (learner's time zone), hearts with refill, 8 badges, rule-based practice recommendations                                                                                                             |
| Review               | Every mistake is kept; review sessions clear them; words learned list                                                                                                                                                                  |
| AI Tutor (RAG)       | Ask about words, grammar, pronunciation; answers at your level **only from Vachan's notes, with sources**; "not in my notes" instead of guessing; prompt-injection refusal; chat history; "Ask the tutor why" inside lessons           |
| Listening & speaking | Text-to-speech (cached) with 1× / 0.75× / 0.5×, listening quiz; record or upload → speech-to-text → content match, experimental AI pronunciation notes, fluency (kept separate)                                                        |
| Conversation         | 6 role-play scenarios (restaurant, market, travel…), typed or spoken replies, gentle corrections, session summary — grounded in course vocabulary + RAG notes                                                                          |
| Admin dashboard      | Languages, courses, units, lessons, exercises (all 7 types with validation), vocabulary: create / edit / reorder / publish / unpublish / delete — **no code changes**. RAG knowledge base management with safe re-indexing. Audit log. |
| Analytics            | Active learners, completion & drop-off, accuracy by type, common mistakes, language usage, streaks, AI Tutor and speaking usage — aggregates only, no personal data                                                                    |
| Quality              | 286 automated tests + 359 Postman assertions + browser E2E; security & performance reviews; Docker; deployment guides                                                                                                                  |

## Screenshots

| Learning path                                        | AI Tutor (RAG, with sources)                       | Speaking practice                                       |
| ---------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------- |
| ![Learning path](docs/screenshots/learning-path.png) | ![AI Tutor](docs/screenshots/ai-tutor.png)         | ![Speaking](docs/screenshots/speaking.png)              |
| **Role-play conversation**                           | **Admin analytics**                                | **Admin knowledge base**                                |
| ![Conversation](docs/screenshots/conversation.png)   | ![Analytics](docs/screenshots/admin-analytics.png) | ![Knowledge base](docs/screenshots/admin-knowledge.png) |

More: [lesson exercise](docs/screenshots/lesson-exercise.png) · [admin content tree](docs/screenshots/admin-content.png).

## Architecture

```
                     Browser (Next.js app: learner UI + /admin)
                                   │  same-origin /api/* (httpOnly cookie)
                                   ▼
        ┌──────────────────────────────────────────────────────────────────┐
        │ Express API (modular monolith, TypeScript)                       │
        │  routes (Zod validation, auth, rate limits)                      │
        │   → services: auth · courses/lessons · answer checker · progress │
        │               gamification · placement · review · admin · analytics
        │   → rag/: clean → chunk → embed (local e5-small) → pgvector search│
        │   → ai/:  tutor · role-play  ──► LLM provider (Gemini / Groq)    │
        │   → speech/: WAV checks → STT / TTS (Gemini / Whisper) → scoring │
        └──────────────────────────────┬───────────────────────────────────┘
                                       │ Prisma 7 (pg driver adapter)
                                       ▼
                 PostgreSQL 16 + pgvector — 28 tables, one schema for all languages
```

- **Modular monolith**: one frontend, one backend, one database — simple to run, test and deploy.
- **Backend layers**: `routes/` (HTTP + Zod) → `services/` (logic, pure functions where possible) →
  Prisma. Errors are `HttpError`s turned into one JSON shape.
- **Deployed**: Vercel (Next.js, forwards `/api/*`) → Render (Express) → Neon (PostgreSQL + pgvector).
  The browser only talks to the Vercel domain, so the login cookie is first-party.
- **Answers never reach the browser before the learner answers**; all checking is server-side.
- Database design: [docs/DATABASE.md §10](docs/DATABASE.md). API: [docs/API.md](docs/API.md).

## Tech stack

| Layer      | Technology                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------- |
| Frontend   | Next.js 16 (App Router), React 19, Tailwind CSS 4, lucide-react, self-hosted Nunito + Baloo fonts |
| Backend    | Node.js 22, Express 5, TypeScript (strict), Zod 4, multer (audio upload)                          |
| Database   | PostgreSQL 16 + **pgvector**, Prisma 7 (migrations, `@prisma/adapter-pg`)                         |
| Auth       | scrypt (Node crypto), JWT in an httpOnly cookie / Bearer header, `tokenVersion` logout            |
| AI         | Gemini (default, free tier) or Groq via `fetch`; offline test double; fallback model              |
| Embeddings | `Xenova/multilingual-e5-small` (384-d) running locally with Transformers.js / ONNX                |
| Speech     | Gemini speech-to-text & text-to-speech (Groq Whisper optional), WAV processing without libraries  |
| Testing    | `node:test` via tsx, Postman / newman, Playwright (browser E2E)                                   |
| Tooling    | npm workspaces, ESLint 9, Prettier 3, Docker / Docker Compose                                     |
| Hosting    | Vercel · Render · Neon (or one Docker host)                                                       |

## Setup

Prerequisites: **Node.js 20.19+ / 22.12+**, npm, Git, **PostgreSQL 16 with pgvector**.

### 1. PostgreSQL

macOS (Homebrew):

```bash
brew install postgresql@16 pgvector
brew services start postgresql@16
createdb vachan_dev
```

Or Docker: `npm run db:up` (image `pgvector/pgvector:pg16`, user `vachan` / `vachan_dev_password`).
Windows/Linux and troubleshooting: [docs/DATABASE.md](docs/DATABASE.md).

### 2. Environment files

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
echo "JWT_SECRET=$(openssl rand -hex 32)" >> backend/.env
```

Edit `backend/.env`: `DATABASE_URL=postgresql://<you>@localhost:5432/vachan_dev?schema=public`
(Docker: `postgresql://vachan:vachan_dev_password@localhost:5432/vachan_dev?schema=public`) and, for
the AI features, `GEMINI_API_KEY` (see [AI setup](#ai-setup)).

| Variable (backend)                                                                                                    | Required | Purpose                                                            |
| --------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------ |
| `DATABASE_URL`                                                                                                        | **yes**  | PostgreSQL connection                                              |
| `JWT_SECRET`                                                                                                          | **yes**  | signs login tokens (≥ 32 random characters, secret)                |
| `JWT_EXPIRES_IN`, `PORT`, `NODE_ENV`, `CORS_ORIGIN`                                                                   | no       | `7d`, `4000`, `development`, `http://localhost:3000`               |
| `LLM_PROVIDER`, `GEMINI_API_KEY` / `GROQ_API_KEY`, `LLM_FALLBACK_MODEL`                                               | for AI   | tutor, role-play, speech — **server only**                         |
| `RAG_ENABLED`                                                                                                         | no       | knowledge-base search; default on locally, off in production (RAM) |
| `STT_PROVIDER`, `TTS_PROVIDER`, `PRONUNCIATION_NOTES`                                                                 | no       | speech options                                                     |
| `TUTOR_*`, `SPEECH_*`, `CONVERSATION_*`, `LOGIN_RATE_LIMIT_PER_MINUTE`, `REGISTER_RATE_LIMIT_PER_HOUR`, `TRUST_PROXY` | no       | rate limits / proxy hops                                           |

Frontend: `NEXT_PUBLIC_API_URL=http://localhost:4000` locally only (it is visible in the browser —
never put secrets in `NEXT_PUBLIC_*`); deployed builds use `BACKEND_URL` (server-side). Every variable
is explained in the `.env.example` files.

### 3. Install, Prisma, seed, knowledge base

```bash
npm install                     # also runs prisma generate
npm run db:migrate              # prisma migrate dev — creates/updates all 28 tables (7 migrations)
npm run db:seed                 # 6 languages, 96 lessons, 402 exercises, placement, badges, demo account
npm run rag:index -w backend    # chunks + embeds the knowledge base (first run downloads ~130 MB model)
npm run admin:grant -w backend -- you@example.com   # optional: make your account an admin (register first)
npm run dev                     # backend :4000 + frontend :3000
```

Open http://localhost:3000 → **Start learning**, or log in as `demo@vachan.dev` / `Vachan2026!`
(development only). Browse data with `npm run db:studio`.

Prisma in short: the schema is `backend/prisma/schema.prisma`; `db:migrate` creates migrations in
development; `db:deploy` only applies them (production); never edit tables by hand. Details, backups
and important tables: [docs/DATABASE.md §11b](docs/DATABASE.md).

## Commands

Root (both workspaces):

| Command                                      | What it does                                          |
| -------------------------------------------- | ----------------------------------------------------- |
| `npm run dev`                                | backend (auto-restart) + frontend                     |
| `npm run build`                              | compile backend to `backend/dist`, build the frontend |
| `npm run typecheck` / `lint` / `test`        | TypeScript, ESLint, unit tests                        |
| `npm run check`                              | format check + typecheck + lint + unit tests + build  |
| `npm run db:migrate` / `db:deploy`           | migrations (development / production)                 |
| `npm run db:seed` / `db:reset` / `db:studio` | seed (safe to repeat) / wipe + re-seed / data browser |

Backend (`-w backend`):

| Command                                                                     | What it does                                                   |
| --------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `npm run dev -w backend` / `start`                                          | development server / compiled server                           |
| `npm run test:all -w backend`                                               | every integration suite (api, rag, tutor, speech, admin, flow) |
| `npm run admin:grant` / `admin:revoke` / `admin:list`                       | manage admin accounts (`-- email`)                             |
| `npm run db:seed:reset-content`                                             | ⚠️ re-create course content from code (clears lesson progress) |
| `npm run rag:index` / `rag:search -- "…"` / `rag:eval`                      | build / try / evaluate the knowledge base                      |
| `npm run ai:check` / `tutor:eval`                                           | check the AI key and model / evaluate tutor quality            |
| `npm run speech:check` / `speech:eval` / `speech:prefetch -- --language te` | speech checks / evaluation / audio cache                       |

Frontend (`-w frontend`): `dev`, `build`, `start`, `lint`, `typecheck`, `test`.

## API testing with Postman

1. Postman → **Import** → `postman/Vachan.postman_collection.json` and
   `postman/Vachan.local.postman_environment.json` (or `.deployed.` for the live site). Select the environment.
2. Start the backend. Run folder **0. Health**, then **1. Auth → Register** (a random e-mail is created
   and the token saved automatically — every later request uses it).
3. Run the folders in order (Collection → **Run**) — 18 folders (0–17): health, auth, current user,
   courses, lessons, exercise attempts & resume, answer types, review, progress, XP/streak/hearts,
   achievements & recommendations, placement, RAG, AI tutor, speech, conversation,
   **16. Admin dashboard & analytics**, logout.
4. Admin folder: grant an account (`npm run admin:grant -w backend -- you@example.com`), then set
   the collection variables `adminEmail` / `adminPassword` (_Current value_ only). Empty = folder skipped.
5. Speech requests upload `postman/audio/*.wav`: set Postman's working directory to the `postman`
   folder (Settings → General) or run newman with `--working-dir postman`.

Command line: `npx newman run postman/Vachan.postman_collection.json -e postman/Vachan.local.postman_environment.json --working-dir postman`
→ 157 requests, 359 assertions with the admin folder. Every endpoint with expected responses and
errors: [docs/API.md](docs/API.md).

## AI setup

1. Get a free key at https://aistudio.google.com/apikey (Gemini; Groq: https://console.groq.com/keys).
2. In `backend/.env`: `LLM_PROVIDER=gemini`, `GEMINI_API_KEY=…`, recommended `LLM_FALLBACK_MODEL=gemini-3.5-flash-lite`.
   The key is used **only by the backend**; it is never sent to the browser or committed.
3. Check: `npm run ai:check -w backend` (one test call, key never printed) and `npm run speech:check -w backend`.
4. No key? Use `LLM_PROVIDER=mock STT_PROVIDER=mock TTS_PROVIDER=mock` — an offline test double that
   keeps the whole app clickable (clearly labelled "test mode", not a real AI).

How the AI is used:

```
Tutor        question → injection check → learner context (language, level, lesson) → RAG retrieval
             → enough evidence? no → "not in my notes" (no LLM call)
                                yes → prompt with the notes → LLM (JSON) → grounding checks → answer + sources
Role-play    scenario + level + course vocabulary + RAG notes → AI partner (JSON, checked) → feedback → summary
Speaking     WAV → audio checks (no AI) → speech-to-text → content match (text diff) + AI pronunciation notes
             (experimental) + fluency (timing) → feedback;  TTS clips generated once and cached
```

Per-learner rate limits protect the free quota. Details: [docs/AI_TUTOR.md](docs/AI_TUTOR.md), [docs/SPEECH.md](docs/SPEECH.md).

## RAG architecture

```
Sources:  backend/knowledge-base/<lang>/*.md   +  course vocabulary  +  notes written in the admin dashboard
   │
   ▼ clean (NFC) → parse front matter (language, level, topic, type, skill, source)
   ▼ chunk: one "## " section = one concept
   ▼ embed locally: multilingual-e5-small, 384-d (no API, content never leaves the server)
   ▼ store: KnowledgeChunk.embedding vector(384) in PostgreSQL (pgvector) — 430 chunks
Query:    embed question → cosine search with language as a HARD filter → re-rank (level, topic,
          exact native words) → "sufficient?" threshold → top chunks + metadata + scores
```

- Retrieval quality is measured (`npm run rag:eval`): **hit@3 98.2 %, MRR@5 96.4 %**, language
  precision 100 %, out-of-scope rejection 91.7 % ([docs/RAG_EVALUATION.md](docs/RAG_EVALUATION.md)).
- Safe re-indexing: unchanged documents are skipped (content hash); each document's chunks are
  swapped in one transaction; drafts are never indexed; unpublishing removes chunks at once; one
  indexing job at a time. Details: [docs/RAG.md](docs/RAG.md), [docs/ADMIN.md §6](docs/ADMIN.md).

## Admin dashboard

`/admin` (ADMIN role only; granted from a terminal with `npm run admin:grant`):
**Analytics · Content · Lesson editor · Vocabulary · Knowledge base · Audit log**. New content starts
unpublished; learners see a lesson only when language, course, unit and lesson are all published.
Deleting anything learners have used needs a second confirmation. Guide: [docs/ADMIN.md](docs/ADMIN.md).

## Testing

| Suite                    | Command                             | Result (final run)                |
| ------------------------ | ----------------------------------- | --------------------------------- |
| Backend unit             | `npm run test -w backend`           | 156 ✅                            |
| API integration          | `npm run test:api -w backend`       | 37 ✅                             |
| RAG retrieval            | `npm run test:rag -w backend`       | 8 ✅                              |
| AI tutor                 | `npm run test:tutor -w backend`     | 11 ✅                             |
| Speech & role-play       | `npm run test:speech -w backend`    | 18 ✅                             |
| Admin & analytics        | `npm run test:admin -w backend`     | 19 ✅                             |
| Full journey (API)       | `npm run test:flow -w backend`      | 13 ✅                             |
| Frontend unit            | `npm run test -w frontend`          | 24 ✅                             |
| Postman / newman         | see above                           | 157 requests, 359 assertions ✅   |
| Browser E2E (Playwright) | `cd e2e && npm install && npm test` | 11 / 11 steps, desktop + phone ✅ |

The integration and E2E tests use the offline AI test doubles (no key, no quota). The browser E2E
goes Landing → Register → Login → Language → Self-assessment → Placement → Learning path → Lesson →
Exercise → XP → Streak → Review → AI Tutor → Speaking → Conversation → Progress → Logout → Login again
and checks that everything persisted. How to run each suite: [docs/TESTING.md](docs/TESTING.md).

## Deployment

| Option                        | How                                                                                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Free cloud** (current demo) | Vercel (frontend, `frontend/vercel.json`) + Render (backend, `render.yaml`, migrations on each build) + Neon (PostgreSQL + pgvector) |
| **One server with Docker**    | `cp .env.production.example .env.production` → `docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build`  |

Migration strategy: `prisma migrate dev` creates migrations in development (committed to git);
production only ever runs `prisma migrate deploy` (Render build / container start) — additive,
never a reset. After the first deploy: seed once, `rag:index` against that database, grant an admin.
Step by step with screenshots-level detail: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Troubleshooting

| Problem                                                           | Fix                                                                                                   |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `❌ Invalid environment configuration … JWT_SECRET`               | `echo "JWT_SECRET=$(openssl rand -hex 32)" >> backend/.env`, restart                                  |
| `⚠️ Database NOT reachable` / `/api/health` 503                   | start PostgreSQL; check `DATABASE_URL` → [DATABASE.md §12](docs/DATABASE.md)                          |
| `extension "vector" is not available`                             | install pgvector for your PostgreSQL → [RAG.md §2](docs/RAG.md)                                       |
| `relation "…" does not exist` / missing columns                   | `npm run db:migrate`                                                                                  |
| "No course is available for this language yet"                    | `npm run db:seed` (or publish the course in `/admin`)                                                 |
| Prisma types out of date after pulling                            | `npm install` or `npm run db:generate`                                                                |
| Website: "Can't reach the server" / CORS errors                   | backend running? `NEXT_PUBLIC_API_URL` and `CORS_ORIGIN` must match; use `localhost`, not `127.0.0.1` |
| `429 Too many attempts` when logging in                           | wait a minute (brute-force protection), or raise `LOGIN_RATE_LIMIT_PER_MINUTE` locally                |
| `/admin` says "Admins only"                                       | `npm run admin:grant -w backend -- you@example.com`, reload                                           |
| Tutor: `KNOWLEDGE_BASE_EMPTY` / `EMBEDDING_MODEL_UNAVAILABLE`     | `npm run rag:index -w backend` (needs internet once for the model)                                    |
| Tutor / speech: `LLM_AUTH_FAILED` / `LLM_RATE_LIMITED`            | wrong key or free quota used → `npm run ai:check -w backend`; set `LLM_FALLBACK_MODEL`                |
| Microphone doesn't work                                           | allow it in the browser; it needs `https` or `localhost`; or upload a recording                       |
| Knowledge note published but the tutor doesn't find it (deployed) | search is off on Render free → run `rag:index` against that database from your computer               |
| Indian script shows boxes                                         | stop the server, delete `frontend/.next`, `npm run dev`                                               |
| Port 3000 / 4000 in use                                           | `lsof -i :4000` → `kill <PID>`                                                                        |

More: [DATABASE.md §12](docs/DATABASE.md), [API.md §7](docs/API.md), [DEPLOYMENT.md §6](docs/DEPLOYMENT.md),
[AI_TUTOR.md §9](docs/AI_TUTOR.md), [SPEECH.md](docs/SPEECH.md).

## Limitations

- **Free hosting**: the Render API sleeps after 15 minutes (30–60 s cold start) and has 512 MB RAM, so
  **knowledge-base search, the AI Tutor and RAG-grounded role-play notes are off on the free deployed
  server** (they run locally, or on a ≥ 1 GB instance / the Docker setup).
- **AI quota**: Gemini's free tier allows a limited number of requests per minute/day; the app shows a
  friendly message and supports a fallback model.
- **Speaking feedback is not true pronunciation scoring**: content match compares the transcript with
  the phrase; AI pronunciation notes are experimental; fluency is timing-based.
- **Content** covers the beginner path (16 lessons per language); more units are added through the
  admin dashboard.
- **Security trade-offs** (see [docs/SECURITY.md §4](docs/SECURITY.md)): in-memory rate limits, no full
  CSP on the web app, no e-mail verification / password reset e-mails / 2FA.
- **Knowledge base** is a curated demo-size set (≈ 11 notes per language) written for this project.
- Analytics are computed on request (fine for thousands of learners; see [docs/PERFORMANCE.md](docs/PERFORMANCE.md)).

## Future work

- Paid hosting with RAG on the server, backups and monitoring; Redis-backed rate limits.
- More units (sentence building → advanced), more languages (Marathi, Gujarati, Punjabi, Odia) via the dashboard.
- Phoneme-level pronunciation scoring; speaking XP; listening questions in the placement test.
- Spaced-repetition scheduling for review; streak freeze; optional leaderboard.
- Password reset e-mails, e-mail verification, 2FA for admins, nonce-based CSP.
- Interface in Indian languages; offline / PWA mode; mobile app on the same API.
- CI pipeline running `npm run check`, the integration suites and the E2E test on every push.

## Documentation index

| Guide                                                                                   | Contents                                                                    |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [DATABASE.md](docs/DATABASE.md)                                                         | PostgreSQL, Prisma, migrations (dev vs prod), seed, Studio, backups, schema |
| [API.md](docs/API.md)                                                                   | every endpoint, auth flow, Postman guide, errors                            |
| [ADMIN.md](docs/ADMIN.md)                                                               | admin dashboard, publishing rules, safe re-indexing, analytics              |
| [LEARNING_ENGINE.md](docs/LEARNING_ENGINE.md)                                           | course path, exercise types, answer checking, progress, review              |
| [GAMIFICATION.md](docs/GAMIFICATION.md)                                                 | placement, XP, levels, streak, hearts, badges, recommendations              |
| [RAG.md](docs/RAG.md) · [RAG_EVALUATION.md](docs/RAG_EVALUATION.md)                     | knowledge base, pgvector, retrieval, evaluation                             |
| [AI_TUTOR.md](docs/AI_TUTOR.md) · [AI_TUTOR_EVALUATION.md](docs/AI_TUTOR_EVALUATION.md) | tutor pipeline, prompts, safety, evaluation                                 |
| [SPEECH.md](docs/SPEECH.md) · [SPEECH_EVALUATION.md](docs/SPEECH_EVALUATION.md)         | listening, speech-to-text, feedback, role-play                              |
| [SECURITY.md](docs/SECURITY.md)                                                         | security review and remaining risks                                         |
| [PERFORMANCE.md](docs/PERFORMANCE.md)                                                   | measurements, indexes, AI-call review                                       |
| [TESTING.md](docs/TESTING.md)                                                           | every test suite and how to run it                                          |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md)                                                     | Vercel + Render + Neon, Docker, production checklist                        |

**Design:** Vachan has its own identity — indigo "neel" brand colour (#5A3BE0), marigold rewards,
kolam-inspired lesson tiles, native-glyph language icons, Nunito + Baloo fonts for all six scripts.
The UX is inspired by game-like language apps without copying any logos, mascots or artwork.
