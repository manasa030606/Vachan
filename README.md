# Vachan

**Learn India's languages. One word at a time.**

Vachan is an AI-powered, gamified platform for learning Indian languages: Hindi, Telugu, Tamil, Malayalam, Kannada and Bengali. It's a college capstone project, built in phases.

> **Current status: Phase 0, Project Setup.** This phase contains only the technical foundation: frontend, backend, database connection, tooling and a health check. Learning features start in later phases (see [Roadmap](#roadmap)).

---

## Table of contents

1. [Tech stack](#tech-stack)
2. [Project structure](#project-structure)
3. [Architecture](#architecture)
4. [Prerequisites](#prerequisites)
5. [Setup: step by step](#setup-step-by-step)
6. [Running the project](#running-the-project)
7. [Testing the API in Postman](#testing-the-api-in-postman)
8. [npm scripts](#npm-scripts)
9. [Environment variables](#environment-variables)
10. [Database (PostgreSQL + Prisma)](#database-postgresql--prisma)
11. [Troubleshooting](#troubleshooting)
12. [Architecture decisions](#architecture-decisions)
13. [Roadmap](#roadmap)

---

## Tech stack

| Layer      | Technology                                        |
| ---------- | ------------------------------------------------- |
| Frontend   | Next.js 16 (App Router), React 19, Tailwind CSS 4 |
| Backend    | Node.js, Express 5                                |
| Language   | TypeScript 5.9 (strict mode) everywhere           |
| Database   | PostgreSQL 16                                     |
| ORM        | Prisma 7 (with the`pg` driver adapter)          |
| Validation | Zod 4                                             |
| Tooling    | ESLint 9, Prettier 3, npm workspaces              |

## Project structure

```
Vachan/
├── package.json              # Root: npm workspaces + scripts that run both apps
├── docker-compose.yml        # Optional: local PostgreSQL via Docker
├── .prettierrc.json          # Code formatting rules (shared)
├── postman/
│   └── Vachan.postman_collection.json
│
├── backend/                  # Express REST API
│   ├── .env.example          # Template for backend/.env
│   ├── prisma.config.ts      # Prisma CLI configuration (reads DATABASE_URL)
│   ├── prisma/
│   │   └── schema.prisma     # Database schema (no models yet; they arrive in Phase 2)
│   └── src/
│       ├── server.ts         # Entry point: starts the HTTP server
│       ├── app.ts            # Builds the Express app (middleware + routes)
│       ├── config/env.ts     # Loads and validates env variables with Zod
│       ├── lib/prisma.ts     # Shared Prisma Client + database check
│       ├── routes/
│       │   ├── index.ts          # Mounts all routers under /api
│       │   └── health.routes.ts  # GET /api/health
│       ├── middleware/
│       │   ├── not-found.ts      # JSON 404 for unknown routes
│       │   └── error-handler.ts  # JSON error responses
│       └── generated/prisma/ # Auto-generated Prisma Client (git-ignored)
│
└── frontend/                 # Next.js web app
    ├── .env.example          # Template for frontend/.env.local
    └── src/
        ├── app/
        │   ├── layout.tsx    # Root HTML layout
        │   ├── page.tsx      # Placeholder home page
        │   └── globals.css   # Tailwind import + base styles
        ├── components/
        │   └── backend-status.tsx  # Shows backend + database status
        └── lib/
            ├── config.ts     # Reads NEXT_PUBLIC_API_URL
            └── api.ts        # Typed fetch helpers for the backend
```

## Architecture

Vachan is a **modular monolith**: one frontend app and one backend API in one repository. No microservices. A separate Python AI service is added only in a later phase, and only if the AI workload needs it.

```
┌──────────────────────┐   HTTP (JSON)   ┌──────────────────────┐   SQL    ┌──────────────┐
│  Frontend            │ ──────────────► │  Backend             │ ───────► │  PostgreSQL  │
│  Next.js + React     │                 │  Express + TS        │  Prisma  │              │
│  localhost:3000      │ ◄────────────── │  localhost:4000/api  │ ◄─────── │  :5432       │
└──────────────────────┘                 └──────────────────────┘          └──────────────┘
```

- The **frontend** only renders UI and calls the backend. It never talks to the database and never holds secrets.
- The **backend** owns business logic, validation (Zod) and database access (Prisma).
- Inside the backend, each concern has its own folder: `config` → `lib` → `routes` → `middleware`. Later phases add `services/` (business logic) and `schemas/` (Zod request validation).

## Prerequisites

Install these once on your machine:

| Tool                          | Version                                     | Check with        |
| ----------------------------- | ------------------------------------------- | ----------------- |
| [Node.js](https://nodejs.org/) | **20.19+ or 22.12+** (22 LTS is best) | `node -v`       |
| npm                           | 10+ (comes with Node.js)                    | `npm -v`        |
| Git                           | any recent version                          | `git --version` |
| PostgreSQL                    | **16** (15+ works)                    | see step 3 below  |

Pick **one** way to run PostgreSQL:

- **Option A: Docker Desktop.** Easiest, one command. Install from https://www.docker.com/products/docker-desktop/
- **Option B: Postgres.app** (macOS). Install from https://postgresapp.com/
- **Option C: Homebrew** (macOS): `brew install postgresql@16`

## Setup: step by step

Run every command from the **project root** (the `Vachan/` folder) unless stated otherwise.

### 1. Install dependencies

```bash
npm install
```

This installs packages for the root, `backend/` and `frontend/` in one go (npm workspaces), then automatically runs `prisma generate`.

**Expected result:** ends with `added ... packages` and `✔ Generated Prisma Client (7.10.0) to ./src/generated/prisma`. Some `npm warn deprecated` lines are normal.

### 2. Create your environment files

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

The defaults work as-is with Docker (Option A). With Postgres.app or Homebrew, edit `DATABASE_URL` in `backend/.env` (see step 3).

### 3. Start PostgreSQL and create the database

The project expects:

| Setting  | Value                                                        |
| -------- | ------------------------------------------------------------ |
| Host     | `localhost`                                                |
| Port     | `5432`                                                     |
| Database | `vachan_dev`                                               |
| User     | `vachan` (Docker) or your own user                         |
| Password | `vachan_dev_password` (Docker, local dev only) or your own |

**Option A: Docker**

```bash
npm run db:up
```

This starts a `postgres:16-alpine` container named `vachan-postgres`. It creates the `vachan` user and `vachan_dev` database automatically. Data survives restarts because it's stored in a Docker volume. Nothing else to do.

Check it's running with `docker ps`. You should see `vachan-postgres` with status `Up`.

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

Then set `DATABASE_URL` in `backend/.env` the same way as Option B. If `createdb` is "command not found", run `brew link postgresql@16 --force` or use the full path `$(brew --prefix postgresql@16)/bin/createdb`.

> Phase 0 has **no tables**, so there's nothing to migrate or seed yet. The backend only checks that it can connect.

### 4. Start the app

```bash
npm run dev
```

This starts the backend and the frontend together (their logs are prefixed `[backend]` and `[frontend]`).

**Expected result:**

```
[backend] 🚀 Vachan API running at http://localhost:4000 (development)
[backend]    Health check: http://localhost:4000/api/health
[backend] ✅ Database connected
[frontend] ▲ Next.js 16.3.7
[frontend] - Local:         http://localhost:3000
[frontend] ✓ Ready in ...
```

### 5. Check that it works

- Open **http://localhost:3000**. The "System status" card should show **Backend API ✓ Running** and **Database ✓ Connected**.
- Open **http://localhost:4000/api/health**. You should see JSON with `"status":"ok"`.
- Or from a terminal: `curl http://localhost:4000/api/health`

## Running the project

| What                          | Command                                                | URL                              |
| ----------------------------- | ------------------------------------------------------ | -------------------------------- |
| Start PostgreSQL (Docker)     | `npm run db:up`                                      | localhost:5432                   |
| Backend + frontend (dev mode) | `npm run dev`                                        | :3000 and :4000                  |
| Backend only                  | `npm run dev:backend`                                | http://localhost:4000/api/health |
| Frontend only                 | `npm run dev:frontend`                               | http://localhost:3000            |
| Production build (both)       | `npm run build`                                      | —                               |
| Run production build          | `npm run start:backend` / `npm run start:frontend` | same ports                       |
| Stop PostgreSQL (Docker)      | `npm run db:down`                                    | —                               |

Startup order: **PostgreSQL → backend → frontend.** The backend still starts without the database, but it reports `degraded`. Stop the dev servers with `Ctrl + C`.

## Testing the API in Postman

### Import the collection

1. Open Postman → **Import** → select `postman/Vachan.postman_collection.json`.
2. The collection **Vachan API** appears, with a variable `baseUrl = http://localhost:4000`. If you change `PORT`, edit this variable: click the collection → **Variables**.
3. Make sure the backend is running (`npm run dev` or `npm run dev:backend`).

### Endpoint: health check

| Field           | Value                                                |
| --------------- | ---------------------------------------------------- |
| Method          | `GET`                                              |
| URL             | `http://localhost:4000/api/health`                 |
| Headers         | none required (optional`Accept: application/json`) |
| Auth            | none                                                 |
| Body            | none                                                 |
| Expected status | `200 OK`                                           |

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

**Error response: database not reachable (503 Service Unavailable).** The API is running, but PostgreSQL is stopped or `DATABASE_URL` is wrong:

```json
{
  "status": "degraded",
  "service": "vachan-backend",
  "environment": "development",
  "uptimeSeconds": 42,
  "timestamp": "2026-09-30T10:00:00.000Z",
  "database": { "status": "disconnected" }
}
```

**Error response: unknown route (404),** e.g. `GET http://localhost:4000/api/does-not-exist`:

```json
{ "error": { "code": "NOT_FOUND", "message": "Route GET /api/does-not-exist does not exist" } }
```

**Backend not running at all:** Postman shows _"Could not send request / ECONNREFUSED"_. Start the backend.

Each request in the collection has built-in tests. After you click **Send**, open the **Test Results** tab: all tests should pass.

## npm scripts

Run from the project root:

| Script                        | What it does                                                      |
| ----------------------------- | ----------------------------------------------------------------- |
| `npm run dev`               | Start backend (auto-restart on save) and frontend together        |
| `npm run dev:backend`       | Start only the backend                                            |
| `npm run dev:frontend`      | Start only the frontend                                           |
| `npm run build`             | Compile backend to`backend/dist/` and build the frontend        |
| `npm run typecheck`         | TypeScript type checking for both apps                            |
| `npm run lint`              | ESLint for both apps                                              |
| `npm run format`            | Format all files with Prettier                                    |
| `npm run format:check`      | Check formatting without changing files                           |
| `npm run check`             | format:check + typecheck + lint + build (run before every commit) |
| `npm run db:up`/`db:down` | Start/stop the Docker PostgreSQL container                        |
| `npm run db:generate`       | Regenerate Prisma Client after changing`schema.prisma`          |
| `npm run db:studio`         | Open Prisma Studio (a database browser) in your web browser       |

## Environment variables

Real `.env` files are **never committed** (they're in `.gitignore`). Only the `.env.example` templates are.

### `backend/.env` (copy from `backend/.env.example`)

| Variable         | Required      | Example                                                                             | Purpose                                     |
| ---------------- | ------------- | ----------------------------------------------------------------------------------- | ------------------------------------------- |
| `NODE_ENV`     | no            | `development`                                                                     | `development` / `test` / `production` |
| `PORT`         | no            | `4000`                                                                            | Port the API listens on                     |
| `DATABASE_URL` | **yes** | `postgresql://vachan:vachan_dev_password@localhost:5432/vachan_dev?schema=public` | PostgreSQL connection string                |
| `CORS_ORIGIN`  | no            | `http://localhost:3000`                                                           | Frontend URL(s) allowed to call the API     |

`DATABASE_URL` format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public`

The backend validates these at startup (`backend/src/config/env.ts`). If one is missing or invalid, it stops and tells you exactly which one.

### `frontend/.env.local` (copy from `frontend/.env.example`)

| Variable                | Required | Example                   | Purpose                    |
| ----------------------- | -------- | ------------------------- | -------------------------- |
| `NEXT_PUBLIC_API_URL` | no       | `http://localhost:4000` | Where the backend API runs |

⚠️ Anything starting with `NEXT_PUBLIC_` is visible in the browser. Never put secrets there. API keys (e.g. for AI in later phases) belong only in `backend/.env`.

**Local vs production:** locally the defaults above are enough. In production (Phase 8), `NODE_ENV=production`, a real `DATABASE_URL`, and the deployed frontend URL in `CORS_ORIGIN` / `NEXT_PUBLIC_API_URL` are required.

## Database (PostgreSQL + Prisma)

**Phase 0 status:** Prisma is configured and the backend checks the connection. The schema has **no models yet**, so there are no migrations and no seed data. The full data model (User, Language, Course, Unit, Lesson, Exercise, ...) is created in **Phase 2**.

How Prisma is wired:

- `backend/prisma/schema.prisma` defines the database schema.
- `backend/prisma.config.ts` is read by the Prisma CLI and loads `DATABASE_URL` from `backend/.env`.
- `backend/src/lib/prisma.ts` holds the single Prisma Client used by the app. It connects through `@prisma/adapter-pg`.
- `npm install` automatically runs `prisma generate`. Run `npm run db:generate` yourself after editing the schema.

Useful commands (from the project root):

```bash
npm run db:generate                          # regenerate Prisma Client
npm run db:studio                            # browse the database in the browser
cd backend && npx prisma migrate dev --name x   # (Phase 2+) create + apply a migration
cd backend && npx prisma migrate reset          # (Phase 2+) wipe + re-create the dev database
```

**Reset the Docker database completely:** `docker compose down -v`, then `npm run db:up`. This deletes all local data.

## Troubleshooting

| Problem                                                                | Likely cause                                                | Fix                                                                                                                                                         |
| ---------------------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend prints`❌ Invalid environment configuration`                 | `backend/.env` is missing or a value is wrong             | `cp backend/.env.example backend/.env`, then check the variable named in the message                                                                      |
| Health returns`503` / page shows **Database ✗ Not connected** | PostgreSQL isn't running                                    | Docker:`npm run db:up` and check `docker ps`. Postgres.app: click Start. Homebrew: `brew services start postgresql@16`                                |
| Still`503` although PostgreSQL is running                            | `DATABASE_URL` is wrong (user, password, port or DB name) | Compare with the table in step 3. Test with`psql "<your DATABASE_URL without ?schema=public>" -c "select 1"`                                              |
| `database "vachan_dev" does not exist`                               | Database not created (Options B/C)                          | `createdb vachan_dev`                                                                                                                                     |
| `❌ Port 4000 is already in use`                                     | Another process uses the port                               | macOS/Linux:`lsof -i :4000`, then `kill <PID>`. Or change `PORT` in `backend/.env` **and** `NEXT_PUBLIC_API_URL` in `frontend/.env.local` |
| Next.js says port 3000 is in use                                       | Another dev server is running                               | Stop it, or Next.js will pick 3001. Then add that URL to`CORS_ORIGIN`                                                                                     |
| Page shows**"Could not reach the backend"**                      | Backend not running, or wrong`NEXT_PUBLIC_API_URL`        | Start the backend. Check the URL. Restart`npm run dev` after editing `.env.local`                                                                       |
| Browser console shows a**CORS** error                            | Frontend URL not in`CORS_ORIGIN`                          | Put the exact frontend URL (e.g.`http://localhost:3000`) in `CORS_ORIGIN` and restart the backend                                                       |
| `Cannot find module '../generated/prisma/client'`                    | Prisma Client wasn't generated                              | `npm run db:generate`                                                                                                                                     |
| `prisma generate` fails downloading engines (403 / network)          | Firewall or proxy blocks`binaries.prisma.sh`              | Use a different network, then run`npm run db:generate` again                                                                                              |
| Docker:`port is already allocated` on 5432                           | A local PostgreSQL already uses 5432                        | Stop the local one, or change the left side of`"5432:5432"` in `docker-compose.yml` (e.g. `"5433:5432"`) and the port in `DATABASE_URL`             |
| Something is weird after pulling new code                              | Stale dependencies or generated client                      | `npm install`, then restart `npm run dev`                                                                                                               |

## Architecture decisions

Short record of the important choices made in Phase 0:

1. **Modular monolith + npm workspaces.** One repo, two apps (`frontend`, `backend`), one `npm install`. Easy to run and explain, with no extra tools like Turborepo or Nx.
2. **Backend port 4000 (not 5000).** On macOS, port 5000 is used by AirPlay Receiver, which causes confusing 403 errors.
3. **TypeScript 5.9, not 7.** `typescript-eslint` doesn't support TypeScript 7 yet.
4. **Prisma 7 stable (7.10), not the 8.0 release candidate.** Prisma 7 uses a driver adapter (`@prisma/adapter-pg`) and a `prisma.config.ts` file. The connection URL no longer lives in `schema.prisma`.
5. **Environment validated with Zod at startup.** Misconfiguration fails immediately with a readable message.
6. **Health endpoint returns 503 when the database is down.** The server keeps running, so you can tell "API broken" apart from "database broken".
7. **ESM backend with `.ts` import paths.** `rewriteRelativeImportExtensions` makes `tsc` output `.js` paths, so the same code runs with `tsx` (dev) and `node` (prod).
8. **Prettier + ESLint 9.** ESLint 9 because `eslint-config-next`'s React plugin doesn't support ESLint 10 yet.
9. **npm `overrides` for `mysql2` and `deepmerge-ts`.** These patch security advisories in Prisma CLI's own dependencies, so `npm audit` reports 0 vulnerabilities.
10. **System fonts for now.** Proper Indic-script fonts are part of the Phase 1 visual system.

## Roadmap

| Phase | Name                                                                                      | Status  |
| ----- | ----------------------------------------------------------------------------------------- | ------- |
| 0     | Project setup                                                                             | ✅ Done |
| 1     | UI/UX foundation (visual system, landing, auth screens, onboarding, lesson UI, mock data) | Next    |
| 2     | Database & backend (Prisma models, auth, languages/courses/lessons/progress APIs)         | —      |
| 3     | Real learning system                                                                      | —      |
| 4     | Placement & gamification                                                                  | —      |
| 5     | RAG knowledge base                                                                        | —      |
| 6     | AI tutor                                                                                  | —      |
| 7     | Speaking & AI conversation                                                                | —      |
| 8     | Admin, analytics & polish (Docker, CI/CD, deployment)                                     | —      |

### Known limitations (Phase 0)

- No database tables, migrations or seed data yet (Phase 2).
- No automated test suite yet. Phase 0 is verified with typecheck, lint, build and the health check. Tests get added once there's business logic.
- The home page is a placeholder that only shows system status. The real UI comes in Phase 1.
