# Deployment

Vachan can be deployed in two ways:

- **Option A — free cloud:** Vercel + Render + Neon. This is how the live demo runs.
- **Option B — one server with Docker.**

## Option A: Vercel + Render + Neon

```
Browser ─► Vercel (Next.js) ──/api/*──► Render (Express API) ─► Neon (PostgreSQL + pgvector)
```

| Part     | Host   | Why                                      |
| -------- | ------ | ---------------------------------------- |
| Frontend | Vercel | Built for Next.js, deploys on every push |
| Backend  | Render | Runs Express as a normal Node server     |
| Database | Neon   | Free hosted PostgreSQL with pgvector     |

**Why the `/api` proxy?** The browser only talks to the Vercel domain, and Vercel forwards `/api/*`
to Render. That keeps the login cookie on the same site. If the browser called Render directly,
browsers like Safari would block the cookie.

### Environment variables

| Variable         | Where              | Secret? | Purpose                                  |
| ---------------- | ------------------ | ------- | ---------------------------------------- |
| `DATABASE_URL`   | Render             | Yes     | Neon connection string                   |
| `JWT_SECRET`     | Render (generated) | Yes     | Signs login tokens                       |
| `GEMINI_API_KEY` | Render             | Yes     | AI features                              |
| `CORS_ORIGIN`    | Render             | No      | The Vercel URL                           |
| `NODE_ENV`       | Render             | No      | `production`                             |
| `TRUST_PROXY`    | Render             | No      | `2` (Vercel + Render are two proxies)    |
| `BACKEND_URL`    | Vercel             | No      | The Render URL, used by the `/api` proxy |

Never put secrets in Vercel or in any `NEXT_PUBLIC_*` variable.

### Steps

1. **Neon** — create a project (region Singapore). In **Connect**, turn connection pooling off and
   copy the connection string (keep `?sslmode=require`).
2. **Create the tables** from your computer:
   ```bash
   DATABASE_URL='<neon url>' npm run db:deploy
   DATABASE_URL='<neon url>' NODE_ENV=production npm run db:seed
   ```
3. **Render** — **New → Blueprint** → choose the repository. It reads `render.yaml` and asks for
   `DATABASE_URL`, `CORS_ORIGIN` and `GEMINI_API_KEY`. Each build also applies new migrations.
4. **Vercel** — import the repository, set **Root Directory** to `frontend`, add `BACKEND_URL`
   (the Render URL without `/api`), deploy.
5. **Connect them** — set `CORS_ORIGIN` on Render to the exact Vercel URL.
6. **Admin and knowledge base** — register on the live site, then from your computer:
   ```bash
   DATABASE_URL='<neon url>' npm run admin:grant -w backend -- you@example.com
   DATABASE_URL='<neon url>' npm run rag:index -w backend
   ```
7. **Check** — open `https://<your-app>.vercel.app/api/health`. It should show `"database": {"status": "connected"}`.

### Updating

`git push` — Vercel and Render rebuild automatically, and Render applies new migrations first.

### Free plan limits

- Render sleeps after 15 minutes without visitors; the first request then takes 30–60 seconds.
- Render's 512 MB of memory is too small for the embedding model, so the AI tutor's knowledge-base
  search is off there (`RAG_ENABLED=false`). Speech and role-play work.

## Option B: Docker on one server

Needs a server with at least 2 GB of memory (so the AI tutor's search can run too).

```bash
cp .env.production.example .env.production      # fill in passwords, JWT_SECRET, GEMINI_API_KEY
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
docker compose -f docker-compose.prod.yml --env-file .env.production exec backend npm run db:seed -w backend
docker compose -f docker-compose.prod.yml --env-file .env.production exec backend npm run rag:index -w backend
docker compose -f docker-compose.prod.yml --env-file .env.production exec backend npm run admin:grant -w backend -- you@example.com
```

- Three containers: PostgreSQL (pgvector), the backend and the frontend. Only port 3000 is public.
- Migrations run automatically every time the backend container starts.
- For a public domain, put an HTTPS proxy such as Caddy in front of port 3000.

## Migration strategy

- In development, `npm run db:migrate` creates migration files, which are committed to git.
- In production, only `npm run db:deploy` runs. It applies new migrations and never resets data.
- All migrations so far only add tables or columns, so existing data is never lost.

## Troubleshooting

| Problem                                   | Fix                                                                               |
| ----------------------------------------- | --------------------------------------------------------------------------------- |
| Site says "Can't reach the server"        | `BACKEND_URL` is wrong or Render is asleep — open `/api/health` and wait a minute |
| `/api/health` on Vercel shows a 404 page  | `BACKEND_URL` was added after the build — redeploy on Vercel                      |
| Render build fails with `tsc: not found`  | The build command must use `npm ci --include=dev`                                 |
| Health shows the database as disconnected | Wrong `DATABASE_URL` or missing `?sslmode=require`                                |
| Logged in but immediately logged out      | Use the Vercel URL, and don't set `NEXT_PUBLIC_API_URL` on Vercel                 |
| Everyone gets `429` when registering      | Set `TRUST_PROXY=2` on Render                                                     |
| `/admin` shows "Admins only"              | Run `admin:grant` against the Neon database, then reload                          |
