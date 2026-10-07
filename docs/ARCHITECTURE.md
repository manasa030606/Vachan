# Architecture

## Overview

Vachan is a **modular monolith**: one frontend, one backend and one database. This keeps it simple
to run, test and deploy, while the code is still split into clear modules.

```
Browser
  │  pages + /api/* (same domain, login cookie)
  ▼
Next.js frontend ──────────────► Express backend ──────────► PostgreSQL + pgvector
                                   │
                                   ├─► Gemini / Groq  (AI tutor, role-play, speech)
                                   └─► local embedding model (knowledge-base search)
```

In production the frontend runs on Vercel and forwards `/api/*` to the backend on Render, so the
browser only ever talks to one domain and the login cookie stays first-party.

## Backend

Every request goes through the same layers:

```
route  →  validation (Zod)  →  auth / rate limit  →  service  →  Prisma  →  PostgreSQL
```

| Folder            | Responsibility                                                                                |
| ----------------- | --------------------------------------------------------------------------------------------- |
| `src/routes/`     | HTTP endpoints. Thin: read the request, call a service, send JSON                             |
| `src/schemas/`    | Zod schemas that validate every request body and query                                        |
| `src/middleware/` | Login check, admin check, rate limiting, security headers, error handler                      |
| `src/services/`   | Business logic: lessons, answer checking, progress, placement, gamification, admin, analytics |
| `src/rag/`        | Knowledge base: cleaning, chunking, embeddings, vector search                                 |
| `src/ai/`         | LLM providers, AI tutor, role-play conversations                                              |
| `src/speech/`     | Audio checks, speech-to-text, text-to-speech, speaking feedback                               |
| `src/config/`     | Environment variables and all tunable numbers (XP, limits, thresholds)                        |
| `src/lib/`        | Small shared helpers: Prisma client, passwords, JWT, errors, audit log                        |
| `prisma/`         | Schema, migrations and seed data                                                              |

Errors are thrown as `HttpError` and turned into one JSON shape by a single error handler:
`{ "error": { "code": "…", "message": "…" } }`.

## Frontend

| Folder                    | Responsibility                                                                    |
| ------------------------- | --------------------------------------------------------------------------------- |
| `src/app/`                | Pages (Next.js App Router): learn, lesson, practice, speak, tutor, profile, admin |
| `src/components/`         | UI components, grouped by feature                                                 |
| `src/lib/api/`            | Typed functions for every API call                                                |
| `src/lib/exercises/`      | The lesson player as a pure reducer (easy to test)                                |
| `src/components/session/` | Who is logged in, and the guard that protects pages                               |

## Authentication

1. Passwords are hashed with **scrypt** (Node's built-in crypto). The plain password is never stored.
2. Login returns a **JWT**. The website receives it in an **httpOnly cookie** (JavaScript can't read
   it); Postman uses an `Authorization: Bearer` header.
3. Each user has a `tokenVersion`. Logging out increases it, so every older token stops working.
4. Admin routes also check `role = ADMIN`, read from the database on each request.

## Main design decisions

| Decision                                         | Why                                                                  |
| ------------------------------------------------ | -------------------------------------------------------------------- |
| One set of tables for all languages              | Adding a language means adding rows, not changing code               |
| Answers checked only on the server               | Correct answers never reach the browser before the learner answers   |
| Rules, not ML, for placement and recommendations | Easy to explain and test                                             |
| pgvector inside PostgreSQL                       | No separate vector database to run or back up                        |
| Local embedding model                            | Free, works for all six scripts, content never leaves the server     |
| RAG before every AI answer                       | The tutor can only use Vachan's notes, which reduces made-up answers |
| Offline test doubles for AI                      | Tests run without an API key or quota                                |

More detail: [LEARNING.md](LEARNING.md), [AI.md](AI.md), [DATABASE.md](DATABASE.md).
