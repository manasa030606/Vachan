# Setup

How to run Vachan on your own computer.

## 1. Requirements

- Node.js 22 (20.19+ also works) and npm
- PostgreSQL 16 with the **pgvector** extension
- Optional: a free Google Gemini API key for the AI features

## 2. PostgreSQL

**macOS (Homebrew)**

```bash
brew install postgresql@16 pgvector
brew services start postgresql@16
createdb vachan_dev
```

**Docker** (any operating system)

```bash
npm run db:up      # starts pgvector/pgvector:pg16 on port 5432
```

## 3. Environment files

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Edit `backend/.env`:

| Variable             | Example                                                            | Notes                                  |
| -------------------- | ------------------------------------------------------------------ | -------------------------------------- |
| `DATABASE_URL`       | `postgresql://<your-user>@localhost:5432/vachan_dev?schema=public` | Docker: `vachan:vachan_dev_password@…` |
| `JWT_SECRET`         | output of `openssl rand -hex 32`                                   | Required, keep it secret               |
| `GEMINI_API_KEY`     | from https://aistudio.google.com/apikey                            | Needed for the AI tutor and speech     |
| `LLM_FALLBACK_MODEL` | `gemini-3.5-flash-lite`                                            | Optional, used when the quota runs out |

Every other variable is optional and explained in `backend/.env.example`.

`frontend/.env.local` only needs `NEXT_PUBLIC_API_URL=http://localhost:4000`.
Anything starting with `NEXT_PUBLIC_` is visible in the browser, so never put secrets there.

## 4. Install and prepare the database

```bash
npm install                     # also generates the Prisma client
npm run db:migrate              # create all tables
npm run db:seed                 # 6 languages × 95 lessons, ~3,400 words and phrases, badges
npm run rag:index -w backend    # build the knowledge base (~5,300 notes; downloads a ~130 MB model once, takes ~3 min)
npm run content:stats -w backend  # print the numbers per language
```

Already have a database with the older, smaller course? Upgrade it without losing accounts or
progress:

```bash
npm run db:migrate
npm run db:seed:sync
npm run rag:index -w backend
```

Check the AI key (optional):

```bash
npm run ai:check -w backend
npm run speech:check -w backend
```

## 5. Run

```bash
npm run dev
```

- Website: http://localhost:3000
- API health check: http://localhost:4000/api/health
- Demo account: `demo@vachan.dev` / `Vachan2026!` (created by the seed, development only)

To open the admin dashboard, register an account and run:

```bash
npm run admin:grant -w backend -- you@example.com
```

## 6. Running without an AI key

Set these in `backend/.env` to use offline test doubles instead of a real AI:

```
LLM_PROVIDER=mock
STT_PROVIDER=mock
TTS_PROVIDER=mock
```

The app shows a "test mode" notice. This is also what the automated tests use.

## 7. Troubleshooting

| Problem                                          | Fix                                                                 |
| ------------------------------------------------ | ------------------------------------------------------------------- |
| `Invalid environment configuration … JWT_SECRET` | Add `JWT_SECRET` to `backend/.env` and restart                      |
| `/api/health` returns 503                        | PostgreSQL is not running, or `DATABASE_URL` is wrong               |
| `extension "vector" is not available`            | Install pgvector for your PostgreSQL version                        |
| `relation "…" does not exist`                    | Run `npm run db:migrate`                                            |
| "No course is available for this language yet"   | Run `npm run db:seed`                                               |
| Website says "Can't reach the server"            | Start the backend; check `NEXT_PUBLIC_API_URL` and `CORS_ORIGIN`    |
| Logged in but sent back to the login page        | Use `localhost` (not `127.0.0.1`) for both URLs and clear cookies   |
| `429 Too many attempts` on login                 | Wait one minute (brute-force protection)                            |
| Tutor says the knowledge base is empty           | Run `npm run rag:index -w backend`                                  |
| `LLM_AUTH_FAILED` / `LLM_RATE_LIMITED`           | Wrong key or free quota used up — run `npm run ai:check -w backend` |
| `/admin` shows "Admins only"                     | Run `npm run admin:grant -w backend -- <email>` and reload          |
| Indian script shows empty boxes                  | Stop the server, delete `frontend/.next`, run `npm run dev` again   |
| Port 3000 or 4000 already in use                 | `lsof -i :4000` and stop that process                               |
