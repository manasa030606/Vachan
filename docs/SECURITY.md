# Vachan — Security review (Phase 8)

What protects Vachan today, how it was checked, and the risks that remain. Written for a student
project that runs on free hosting — the remaining risks are listed honestly, not hidden.

## 1. Summary

| Area                | Status | How it is handled                                                                                                               |
| ------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Authentication      | ✅     | JWT (HS256) in an **httpOnly** cookie (browser) or `Authorization: Bearer` (Postman); `tokenVersion` revokes on logout          |
| Authorization       | ✅     | `requireAuth` on every learner route; `requireAdmin` on `/api/admin/*`, role read **from the database** per request             |
| Passwords           | ✅     | scrypt + random salt, constant-time compare; never stored or logged in plain text; 8–128 characters                             |
| Brute force         | ✅     | Login: 10 / minute and 50 / hour per (IP + email); register: 20 / hour per IP; same timing for unknown e-mails                  |
| Input validation    | ✅     | Zod schema on every body/query (`.strict()` on admin input); IDs are opaque strings, never SQL                                  |
| CORS                | ✅     | Exact allow-list (`CORS_ORIGIN`); in production the browser uses the same-origin `/api` proxy                                   |
| Rate limiting       | ✅     | Per user: tutor, role-play, speech, text-to-speech, admin (300/min); per IP: register; per IP+email: login                      |
| Secrets             | ✅     | Server-side env only; `.env*` git-ignored; nothing secret in `NEXT_PUBLIC_*`; `/api/health` and status endpoints expose no keys |
| Database            | ✅     | Prisma (parameterised queries); schema changes only through migrations; DB not exposed in Docker Compose                        |
| XSS                 | ✅*    | React escapes all text; no `dangerouslySetInnerHTML`; markdown from admins is rendered as text; token unreadable by JS          |
| Injection (SQL)     | ✅     | Prisma queries; the few raw queries use tagged templates (`$queryRaw\`…${value}\``) = bound parameters                          |
| AI prompt injection | ✅*    | Pattern check before retrieval/LLM, user text wrapped and tag-neutralised, answers only from retrieved notes                    |
| Audio uploads       | ✅     | Memory-only (never written to disk/DB), 1 file, size limit, WAV header parsed and validated, duration limits                    |
| Error leakage       | ✅     | One error shape; 500s say "Something went wrong" in production; stack traces only in the server log                             |
| Security headers    | ✅*    | API: CSP `default-src 'none'`, nosniff, DENY framing, no-referrer, HSTS (prod). Web: framing denied, Permissions-Policy         |
| Admin actions       | ✅     | Every change is written to `AdminAuditLog` (who, what, when); admins are granted only from a terminal                           |
| Analytics privacy   | ✅     | Aggregates only — no names, e-mails or user ids leave the server; no new tracking was added                                     |

\* = see remaining risks (section 4).

## 2. Details

### Authentication & sessions

- `POST /auth/login` returns a JWT signed with `JWT_SECRET` (≥ 32 characters, refused if it is the
  example value) and sets the `vachan_token` cookie: `httpOnly`, `SameSite=Lax`, `Secure` in production.
- Logout increments `User.tokenVersion`, so the old token stops working everywhere (tested: 401 after logout).
- Unknown e-mail and wrong password give the **same** message and take the same time (a dummy scrypt
  hash is checked for unknown e-mails), so attackers can't discover which e-mails are registered.

### Authorization

- Learner data is always loaded with `where: { userId: req.auth.userId }` — one learner can never read
  another learner's progress, chats or recordings (tested in `test:api`, `test:speech`).
- Admin: `requireAuth` → `requireAdmin` (`role === "ADMIN"`, read from the database on each request, so
  revoking takes effect immediately). There is **no API to become admin**: `npm run admin:grant`.
- Learner endpoints never send exercise answers before an answer is checked; the admin lesson editor
  is the only place answers are returned (tested in Postman: "Answers are hidden from learners").
- Unpublished languages/courses/units/lessons are invisible and unreachable for learners (404).

### Destructive admin actions

- Deleting something learners have used is refused (`409 HAS_LEARNER_DATA`) unless the admin
  confirms a second time (`?force=true`); unpublishing is offered instead. Exercises used by the
  placement test can't be deleted. A published lesson can't become empty.
- The knowledge base is re-indexed **per document in a transaction**: the old chunks stay searchable
  until the new ones are saved; failures are recorded and the old chunks are kept; one indexing job at
  a time (`409 INDEX_BUSY`).

### AI-specific protections

- API keys exist only in `backend/.env` / the hosting dashboard. The frontend never talks to Gemini or Groq.
- Prompt injection (e.g. "ignore previous instructions", "reveal your system prompt", role-play
  jailbreaks) is detected **before** retrieval or any LLM call and answered with a fixed refusal; the
  attempt is logged without the question text.
- The tutor answers only from retrieved notes ("Not in my notes" when nothing relevant was found),
  so it cannot be talked into giving unrelated content; output is shown as plain text.
- Per-learner minute/day limits protect the free AI quota; quota errors from the provider are shown
  as friendly messages, never as raw provider errors.

### Audio uploads

`multer` memory storage, `limits: { fileSize, files: 1, fields: 12, fieldSize: 4096 }`; only WAV is
accepted; the RIFF header is parsed (format, channels, sample rate) and too short / too long / silent
recordings are rejected before any AI call. The recording is **never stored** — only the transcript
and scores are saved.

## 3. How it was checked

- Automated: `test:api` (auth, ownership, validation, logout), `test:admin` (401/403/200 on every admin
  route, guards, validation), `test:speech` (upload limits, wrong types), `test:tutor` (injection
  refusals), Postman (`Learner token is refused (403 ADMIN_ONLY)`, answers hidden, analytics has no e-mails).
- Manual: 11 wrong logins in a minute → 11th answered `429`; headers inspected with `curl -I`;
  `git grep` for keys/secrets in tracked files (none); production build checked for `GEMINI`/`JWT` strings (none).
- Dependencies: `npm audit --omit=dev` — see section 5.

## 4. Remaining risks (honest list)

| Risk                                                                                                   | Impact | Why it is accepted now / what would fix it                                                                                                       |
| ------------------------------------------------------------------------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Rate limits are in memory** (one server process)                                                     | Medium | Reset on restart and not shared between instances. Fine for one Render instance; use Redis for several.                                          |
| **IP-based limits behind proxies**: someone calling the Render URL directly can fake `X-Forwarded-For` | Low    | Only the register limit is per-IP; login is per IP + e-mail. Fix: accept traffic only from the frontend (private network / secret header).       |
| **No full Content-Security-Policy on the web app**                                                     | Medium | Next.js needs inline scripts unless nonces are added to every page. React escaping is the main XSS defence. Fix: nonce-based CSP via middleware. |
| **JWT can't be revoked per device**                                                                    | Low    | Logout revokes all of a user's tokens (tokenVersion). Per-device sessions would need a session table.                                            |
| No e-mail verification, no password reset by e-mail, no 2FA                                            | Medium | Out of scope for the capstone; a reset link needs an e-mail provider.                                                                            |
| Prompt-injection detection is pattern-based                                                            | Low    | Clever wording can pass the filter, but the model only sees retrieved course notes and has no tools or private data to leak.                     |
| Admin accounts are as strong as their passwords                                                        | Medium | Use a long unique password; 2FA for admins is future work.                                                                                       |
| AI output may contain mistakes                                                                         | Low    | Answers are grounded with sources and labelled; learners are told to check with the sources.                                                     |
| Free hosting has no backups / monitoring                                                               | Medium | See DATABASE.md §13 (backups) and DEPLOYMENT.md; paid plans add point-in-time recovery and alerts.                                               |
| CSRF                                                                                                   | Low    | `SameSite=Lax` cookie + JSON-only API + exact CORS. A CSRF token would add defence in depth.                                                     |

## 5. Dependency audit

`npm audit --omit=dev` on the final Phase 8 code (October 2026): **7 findings (3 high, 4 moderate)**, all in
third-party packages Vachan uses only indirectly:

| Package (via)                                                | Severity | Does it affect Vachan?                                                                                                                                                                      |
| ------------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sharp` / libvips (via `@huggingface/transformers`)          | high     | Image decoding. Vachan only embeds **text**; no learner image ever reaches sharp. The fix is a breaking major upgrade of transformers (4.x) → planned with the next embedding-model change. |
| `onnxruntime-node` → `global-agent` → `roarr` → `sprintf-js` | moderate | Denial of service through crafted format strings in a logging helper; no learner input reaches it.                                                                                          |
| `source-map-js` (via PostCSS / Next.js build)                | high     | Build-time only (CSS source maps); not part of the running server. `npm audit fix` updates it without breaking changes.                                                                     |

Re-run before each release: `npm audit --omit=dev`, and apply non-breaking fixes with `npm audit fix`.

## 6. Checklist before going live

1. `JWT_SECRET`: a fresh `openssl rand -hex 32` (never reuse the local one).
2. `CORS_ORIGIN` = the exact frontend URL.
3. `NODE_ENV=production` (secure cookies, generic errors, HSTS).
4. Keys only in the hosting dashboard; `git status` shows no `.env` file.
5. Grant admin only to people who need it: `npm run admin:list -w backend` to review.
6. Database backups switched on (paid plan) or a scheduled `pg_dump` (DATABASE.md §13).
