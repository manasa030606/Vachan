# Security and performance

## Security measures

| Area                | What Vachan does                                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------------------- |
| Passwords           | Hashed with scrypt and a random salt; never stored or logged in plain text                                |
| Login               | JWT in an httpOnly cookie, so page scripts can't read it; logout invalidates old tokens                   |
| Brute force         | Login limited to 10 tries per minute per IP + email; sign-ups limited per IP                              |
| Authorization       | Every learner query is filtered by the logged-in user's id; admin routes check the role from the database |
| Admin accounts      | Granted only from the terminal; every admin change is written to an audit log                             |
| Input validation    | Every request body and query is validated with Zod                                                        |
| SQL injection       | All queries go through Prisma, which uses parameters                                                      |
| XSS                 | React escapes all text; no raw HTML is rendered                                                           |
| CORS                | Only the configured frontend address is allowed                                                           |
| Secrets             | Only in server environment variables; never in frontend code or git                                       |
| Answers             | Correct answers are never sent to the browser before the learner answers                                  |
| AI prompt injection | Known attack phrases are refused before any AI call; the AI only sees retrieved notes                     |
| Audio uploads       | One WAV file, size and length limits, checked in memory, never stored                                     |
| Error messages      | Production errors are generic; details stay in the server log                                             |
| HTTP headers        | No framing (clickjacking), no MIME sniffing, strict referrer, HTTPS-only in production                    |
| Analytics           | Totals only — no names, emails or user ids                                                                |

## Remaining risks

| Risk                                                      | Why it is acceptable now                                                                               | How to fix it later                           |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------- |
| Rate limits are kept in memory                            | Fine for one server                                                                                    | Use Redis when running several servers        |
| No full Content-Security-Policy on the website            | React escaping is the main XSS protection                                                              | Add a nonce-based CSP                         |
| No email verification, password reset or 2FA              | Out of scope for the project                                                                           | Add an email provider and 2FA for admins      |
| Prompt-injection check is pattern-based                   | The AI has no private data or tools to misuse                                                          | Add a classifier model                        |
| Free hosting has no automatic backups                     | It is a demo                                                                                           | Paid plan or a scheduled `pg_dump`            |
| `npm audit` reports issues in `sharp` and `source-map-js` | `sharp` only processes images, which Vachan never sends it; `source-map-js` is only used at build time | Upgrade when compatible versions are released |

## Performance review

Rule followed: measure first, and only optimise what a measurement shows is slow.

### Measurements (local)

| Request                    | Size         | Time          |
| -------------------------- | ------------ | ------------- |
| Course with all lessons    | 3 KB         | 6–30 ms       |
| Stats (XP, streak, hearts) | 1.3 KB       | ~15 ms        |
| Admin analytics            | 4.5 KB       | ~50 ms        |
| Full Postman run           | 157 requests | average 12 ms |

**Load test:** with 200,000 extra answers in the database, admin analytics took 0.17–0.27 s and the
learner pages stayed under 30 ms.

### What was done

- Indexes on every column used to look up a learner's data (`userId`, `lessonId`, dates).
- Two indexes added for analytics, which filter all learners' answers by date.
- No N+1 queries: each page loads its data in a small, fixed number of queries.
- Lists are limited (audit log 100, common mistakes top 10).
- AI calls are avoided when possible: no AI call for refused questions or when no notes match,
  text-to-speech audio is cached, and silent or too-short recordings are rejected first.
- Admin pages are separate code chunks, so learners never download admin code.

### What was not optimised, and why

- **No vector index (HNSW)**: 430 chunks are searched exactly in a few milliseconds. Add an index
  once there are tens of thousands of chunks.
- **No cache layer**: no measurement showed a need.
- **Free hosting cold starts** (30–60 s) are a hosting limit, not a code problem.
