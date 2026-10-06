# Vachan — Deployment guide (Phase 4.5)

How the Phase 4 app runs on the internet, step by step. No previous deployment experience needed. Every service below has a free plan and lets you sign in with GitHub.

## 1. Architecture

```
 Browser
    │  https://<your-app>.vercel.app            (pages + /api/* on the SAME domain)
    ▼
 Vercel ── Next.js frontend
    │  /api/*  is forwarded (next.config.ts rewrite, BACKEND_URL)
    ▼
 Render ── Express API (backend/)           https://<your-api>.onrender.com/api/...
    │  Prisma Client (driver adapter: pg)
    ▼
 Neon ── PostgreSQL 16/17 (hosted)
```

| Part     | Host       | Why this host                                                                                                                                                                                      |
| -------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend | **Vercel** | Made for Next.js; deploys on every `git push`.                                                                                                                                                     |
| Backend  | **Render** | Runs the existing Express server as a normal long-running Node process (no rewrite into serverless functions). Free web service, monorepo "root directory", health checks, build + start commands. |
| Database | **Neon**   | Hosted PostgreSQL with a free plan, SSL, a web SQL editor, and a normal connection string for Prisma migrations.                                                                                   |

**Why the `/api` proxy?** The login token lives in an httpOnly cookie. If the browser called `*.onrender.com` directly from `*.vercel.app`, that cookie would be a _third-party_ cookie, which Safari (and privacy settings in other browsers) block — login would silently fail. With the proxy, the browser only talks to the Vercel domain, the cookie is first-party, and no cross-site CORS is needed. Locally nothing changes (`localhost:3000` → `localhost:4000`).

**Three databases, three purposes**

| Database                                  | Where                       | Used for                                                             |
| ----------------------------------------- | --------------------------- | -------------------------------------------------------------------- |
| Local                                     | PostgreSQL on your Mac      | Development, `npm run dev`, tests                                    |
| Staging / initial deployment (this phase) | Neon free project           | The public demo — real accounts, real data, but not mission-critical |
| Future final production                   | Paid/managed plan (Phase 8) | Backups, no sleeping, monitoring, migrations via CI                  |

Never point the deployed backend at your local database, and never run tests against the deployed one.

## 2. Environment variables

| Variable              | Where it is set                                | Visible in browser?              | Purpose                                                                     |
| --------------------- | ---------------------------------------------- | -------------------------------- | --------------------------------------------------------------------------- |
| `DATABASE_URL`        | Render (+ your terminal for migrate/seed)      | **No — secret**                  | Neon connection string                                                      |
| `JWT_SECRET`          | Render (auto-generated)                        | **No — secret**                  | Signs login tokens. Different from your local one.                          |
| `JWT_EXPIRES_IN`      | Render (`7d`)                                  | No                               | Login lifetime                                                              |
| `NODE_ENV`            | Render (`production`)                          | No                               | Secure cookies, generic 500 messages, no demo account in the seed           |
| `CORS_ORIGIN`         | Render                                         | No                               | Your Vercel URL (exact, no trailing slash)                                  |
| `PORT`                | Render sets it automatically                   | No                               | Don't set it yourself                                                       |
| `NODE_VERSION`        | Render (`22`)                                  | No                               | Node.js version for build and run                                           |
| `BACKEND_URL`         | Vercel                                         | **No** (server-only, build time) | Render URL, used by the `/api` proxy                                        |
| `NEXT_PUBLIC_API_URL` | **Not set on Vercel**; local `.env.local` only | Yes                              | Local only: `http://localhost:4000`. Unset in production = use `/api` proxy |

Templates with explanations: `backend/.env.example`, `frontend/.env.example`. Real values are typed only into the dashboards — never into Git.

## 3. Step-by-step

### Step 0 — Push the code to GitHub

```bash
cd ~/Desktop/Vachan
git status                 # backend/.env and frontend/.env.local must NOT be listed
git add .
git commit -m "Phase 4.5: deployment setup"
git push
```

### Step 1 — Create the database (Neon)

1. Go to **https://neon.tech** → **Sign up** → **Continue with GitHub**.
2. Create a project: **Project name** `vachan`, **Postgres version** the default (16 or 17), **Region** `AWS Asia Pacific (Singapore)` (closest to India and to the Render region below) → **Create project**.
3. On the project dashboard click **Connect** (or **Connection string**):
   - Database: `neondb` · Role: `neondb_owner`
   - **Turn "Connection pooling" OFF** (you need the _direct_ string — its host has **no** `-pooler` — so Prisma migrations work).
   - Copy the string. It looks like
     `postgresql://neondb_owner:********@ep-xxxx-xxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
   - Delete `&channel_binding=require` from the end, keep `?sslmode=require`.
4. Keep it private (password manager / notes). This is your production `DATABASE_URL`.

### Step 2 — Create the tables and load the course (from your Mac)

The database is empty. Use the existing Prisma migrations (never create tables by hand):

```bash
cd ~/Desktop/Vachan
export DATABASE_URL='postgresql://neondb_owner:********@ep-xxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
export NODE_ENV=production

npm run db:deploy      # prisma migrate deploy → applies the 3 migrations
npm run db:seed        # 6 languages, 96 lessons, 402 exercises, 72 placement questions, 8 badges
                       # (no demo account in production)

unset DATABASE_URL NODE_ENV    # back to your local database for everyday work
```

Expected: `All migrations have been successfully applied.` and `✅ Seed finished.` (with `– Demo account skipped (production)`).

Prisma Client is generated automatically by `npm install` / during the Render build (`postinstall`), so there is no separate step.

**Verify:** Neon dashboard → **SQL Editor** → run:

```sql
SELECT (SELECT count(*) FROM "Language") AS languages, (SELECT count(*) FROM "Lesson") AS lessons,
       (SELECT count(*) FROM "Exercise") AS exercises, (SELECT count(*) FROM "PlacementQuestion") AS placement,
       (SELECT count(*) FROM "Achievement") AS badges, (SELECT count(*) FROM "_prisma_migrations") AS migrations;
-- expected: 6 | 96 | 402 | 72 | 8 | 3
```

(Or **Tables** in the left menu to browse.)

### Step 3 — Deploy the backend (Render)

1. Go to **https://render.com** → **Get Started** → **GitHub**, and allow Render to see the `Vachan` repository.
2. **New +** → **Blueprint** → select the `Vachan` repo → Render finds `render.yaml` and shows a service **vachan-api** (Node, free, Singapore).
3. It asks for the two secrets marked `sync: false`:
   - `DATABASE_URL` → paste the Neon string from Step 1.
   - `CORS_ORIGIN` → type `https://example.com` for now (you'll replace it with the Vercel URL in Step 5).
   - `JWT_SECRET` is generated by Render automatically (a long random value). Don't copy your local one.
4. **Apply**. The first build takes ~3–5 minutes. What `render.yaml` runs:
   - Build: `npm ci --include=dev -w backend && npm run build -w backend && npm run db:deploy -w backend`
     (installs the backend workspace incl. TypeScript/Prisma CLI, compiles to `backend/dist`, applies any new migrations)
   - Start: `npm run start -w backend` → `node dist/server.js`
   - Health check: `/api/health` · Node 22 · root directory = repository root (npm workspaces lockfile)
5. When the status is **Live**, copy the URL at the top (e.g. `https://vachan-api.onrender.com` — yours may have a suffix).
6. Open `https://<your-api>.onrender.com/api/health`. Expected:
   ```json
   {
     "status": "ok",
     "service": "vachan-backend",
     "environment": "production",
     "database": { "status": "connected" }
   }
   ```

_No Blueprint?_ **New +** → **Web Service** → repo `Vachan` → Root Directory: _(empty)_ → Runtime **Node** → Build/Start commands from item 4 → Instance **Free** → Region Singapore → **Advanced** → Health Check Path `/api/health` → add the environment variables from section 2 (`JWT_SECRET`: run `openssl rand -hex 32` and paste) → **Create Web Service**.

### Step 4 — Deploy the frontend (Vercel)

1. Go to **https://vercel.com** → **Sign Up** → **Continue with GitHub**.
2. **Add New…** → **Project** → **Import** `Vachan`.
3. **Root Directory** → **Edit** → choose `frontend` → **Continue**.
4. Framework Preset: **Next.js** (detected). Build/Install commands: leave the defaults — `frontend/vercel.json` already sets
   - Install: `cd .. && npm ci -w frontend` (installs from the repository's lockfile, frontend only)
   - Build: `next build`
5. **Environment Variables** → add `BACKEND_URL` = `https://<your-api>.onrender.com` (no `/api`, no trailing slash). Do **not** add `NEXT_PUBLIC_API_URL`.
6. **Deploy** (~2 minutes). Copy the URL Vercel shows (e.g. `https://vachan-xxxx.vercel.app`; Project → **Domains** shows the main one).
7. Open `https://<your-app>.vercel.app/api/health` — the same JSON as Step 3, now through the proxy.

### Step 5 — Connect the two

1. Render → **vachan-api** → **Environment** → edit `CORS_ORIGIN` → `https://<your-app>.vercel.app` (exact, no trailing slash) → **Save Changes** (Render restarts the service).
2. Open the Vercel URL → **Start learning** → register → onboarding → a lesson. You're live.

## 4. Redeploying after code changes

```bash
git add . && git commit -m "…" && git push
```

- **Vercel** rebuilds the frontend automatically (every push; branches get preview URLs).
- **Render** rebuilds the backend automatically when `backend/**`, `package.json`, `package-lock.json` or `render.yaml` change, and the build applies **new migrations** (`prisma migrate deploy`) before the new version starts.
- **Seed:** only when course content changes, run Step 2 again. ⚠️ Re-seeding re-creates the courses and therefore **clears every learner's lesson progress** (accounts, XP and badges stay).
- Changed `BACKEND_URL` on Vercel? It's read at build time → Vercel → Deployments → **Redeploy**.

## 5. Free-plan behaviour (good to know)

- **Render free** sleeps after ~15 minutes without traffic. The first request afterwards takes ~30–60 s; the site may show "Can't reach the Vachan server" once — wait and reload. Open `/api/health` first before a demo.
- **Neon free** pauses the database when idle and wakes in about a second on the next query.
- Render free has no shell access → run migrations/seed from your Mac (Step 2) or rely on the build.

## 5b. Phase 5 (RAG) on the deployed site

- The next Render build applies the Phase 5 migration on Neon automatically (pgvector is built into Neon).
- **Knowledge-base search stays off on Render free** (`NODE_ENV=production` → `RAG_ENABLED` defaults to `false`, `POST /api/rag/search` → `503 RAG_DISABLED`): the embedding model needs ≈ 550 MB of RAM and the free plan has 512 MB. The rest of the app is unaffected. Details and how to enable it later: [RAG.md §8](RAG.md#8-deployment).

## 6. Troubleshooting

| Problem                                                                      | Why                                                                                     | Fix                                                                                                                                          |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Vercel build: `Couldn't find any pages or app directory` / wrong files       | Root Directory not `frontend`                                                           | Vercel → Settings → General → Root Directory = `frontend` → Redeploy                                                                         |
| Vercel install: `npm ci can only install with an existing package-lock.json` | Install ran inside `frontend/`                                                          | Keep `frontend/vercel.json` (`cd .. && npm ci -w frontend`); Settings → "Include files outside the root directory" must stay **enabled**     |
| Site loads but every action says "Can't reach the Vachan server"             | `BACKEND_URL` missing/wrong, or Render asleep                                           | Check `https://<app>.vercel.app/api/health`; fix `BACKEND_URL` and **Redeploy**; wait ~1 min for Render to wake                              |
| `/api/health` on Vercel returns the Next.js 404 page                         | `BACKEND_URL` was added after the build                                                 | Redeploy on Vercel                                                                                                                           |
| Render build: `tsc: not found` / `prisma: not found`                         | Dev dependencies skipped because `NODE_ENV=production`                                  | Build command must contain `npm ci --include=dev`                                                                                            |
| Render: `❌ Invalid environment configuration … DATABASE_URL / JWT_SECRET`   | Variable missing                                                                        | Render → Environment → add it → Save                                                                                                         |
| Render: `JWT_SECRET is still the example value`                              | Example secret copied                                                                   | Use Render's generated value or `openssl rand -hex 32`                                                                                       |
| Health: `"database": {"status": "disconnected"}` (503)                       | Wrong `DATABASE_URL`, `-pooler` host, missing `?sslmode=require`                        | Copy the direct Neon string again (Step 1)                                                                                                   |
| `P1001 Can't reach database server` during `db:deploy`                       | Typo in URL / Neon project paused or deleted                                            | Check the string; open the Neon dashboard (wakes it)                                                                                         |
| `P3009` / failed migration                                                   | A migration was interrupted                                                             | Neon SQL Editor: inspect `_prisma_migrations`; for a fresh staging DB the easiest fix is Neon → Branches → reset/recreate, then Step 2 again |
| `relation "Language" does not exist` / empty course list                     | Seed or migrations not run on Neon                                                      | Step 2                                                                                                                                       |
| Login "works" but you are immediately logged out                             | Opening the backend URL directly in the browser, or `NEXT_PUBLIC_API_URL` set on Vercel | Always use the Vercel URL; remove `NEXT_PUBLIC_API_URL` from Vercel and redeploy                                                             |
| CORS error in the console                                                    | Browser calling Render directly with an origin not in `CORS_ORIGIN`                     | Use the `/api` proxy; set `CORS_ORIGIN` to the exact Vercel URL                                                                              |
| Node version errors                                                          | Old Node                                                                                | Render `NODE_VERSION=22`; Vercel → Settings → Node.js Version 22.x                                                                           |
| Works locally, fails on Linux with "Module not found"                        | File name case differs (`Button.tsx` vs `button.tsx`)                                   | Match the import exactly (Linux is case-sensitive)                                                                                           |
