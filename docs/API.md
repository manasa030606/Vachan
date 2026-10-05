# Vachan — API reference & Postman testing guide (Phase 2)

Base URL: **`http://localhost:4000/api`** · All bodies are JSON · All errors look like:

```json
{ "error": { "code": "SOME_CODE", "message": "Human-readable explanation", "details": [ … optional … ] } }
```

---

## 1. Endpoint list

| #   | Method | URL                          | Auth         | Purpose                                         |
| --- | ------ | ---------------------------- | ------------ | ----------------------------------------------- |
| 0   | GET    | `/api/health`                | none         | API + database status                           |
| 1   | POST   | `/api/auth/register`         | none         | Create an account (logs you in)                 |
| 2   | POST   | `/api/auth/login`            | none         | Log in, get a token                             |
| 3   | POST   | `/api/auth/logout`           | **required** | Log out (old tokens stop working)               |
| 4   | GET    | `/api/me`                    | **required** | Current user + profile                          |
| 5   | PATCH  | `/api/me`                    | **required** | Update profile (onboarding, settings, language) |
| 6   | GET    | `/api/languages`             | none         | The six languages                               |
| 7   | GET    | `/api/courses`               | none         | All courses (`?languageCode=te` to filter)      |
| 8   | GET    | `/api/courses/:id`           | optional     | Course → units → lessons with status            |
| 9   | GET    | `/api/lessons/:id`           | **required** | Lesson + exercises (no answers)                 |
| 10  | POST   | `/api/exercises/:id/attempt` | **required** | Submit an answer; server checks it              |
| 11  | GET    | `/api/progress`              | **required** | My overall progress                             |
| 12  | GET    | `/api/progress/:lessonId`    | **required** | My progress in one lesson                       |

`PATCH /api/me` is from the spec's API table (section 11) and is needed so onboarding and settings are saved.

---

## 2. Authentication flow

```
Register / Login  ──►  backend checks password (scrypt hash)  ──►  creates a JWT { sub: userId, ver: tokenVersion }
                                                                      signed with JWT_SECRET, valid JWT_EXPIRES_IN
        │
        ├─► response body: { user, token }                ← Postman uses this:  Authorization: Bearer <token>
        └─► Set-Cookie: vachan_token=<token>; HttpOnly    ← the website uses this (JavaScript can't read it)

Every protected request ──► auth middleware reads the Bearer header OR the cookie
                        ──► verifies the signature + expiry
                        ──► loads the user; token's "ver" must equal user.tokenVersion
                        ──► req.auth = { userId, email, role }   (otherwise 401 UNAUTHORIZED)

Logout ──► tokenVersion + 1  ──► every token issued before is now invalid, and the cookie is cleared
```

- **Passwords** are hashed with **scrypt** (built into Node.js) + a random salt. Stored as `scrypt:<salt>:<hash>`. The plain password is never stored or logged.
- **Responses never include** `passwordHash` or `tokenVersion`.
- **Login errors** say "Email or password is incorrect" for both cases, so nobody can probe which emails exist.
- **Correct answers never leave the server** before you answer: `GET /api/lessons/:id` strips `isCorrect`, accepted translations and word positions.
- **Validation:** every body/param is checked with Zod → `400 VALIDATION_ERROR` with a `details` list.
- **Secrets:** `JWT_SECRET` and `DATABASE_URL` live only in `backend/.env`. The frontend only knows the API URL.

---

## 3. Postman setup (once)

1. Start everything: `npm run dev` (backend on 4000, frontend on 3000). Database migrated and seeded (see `docs/DATABASE.md`).
2. Postman → **Import** → choose `postman/Vachan.postman_collection.json`.
3. Open the collection **Vachan API** → **Variables** tab. You'll see `baseUrl = http://localhost:4000/api`, `token` (empty), `email`, `password`, `courseId = te-course`, `lessonId = te-u1-l1`.
4. The collection's **Authorization** tab is set to **Bearer Token → `{{token}}`**. Every request inherits it, except register/login/health/languages/courses, which use "No Auth".
5. **You never copy the token by hand:** the **Register** and **Login** requests have a small _Tests_ script that saves `token` automatically.

Run it all at once: right-click the collection → **Run collection** → **Run Vachan API**. All 33 requests should be green (58 tests).

> If "Get me before logging in" returns 200 instead of 401: Postman kept a `vachan_token` cookie from an earlier run. Click **Cookies** (under the Send button) → `localhost` → delete `vachan_token`.

---

## 4. Testing order

```
Health → Register → Login → Get me → Update me (pick Telugu) → Get languages → Get courses
→ Get course → Get lesson → Submit answers (wrong, then right) → Check progress → Logout → Get me (401)
```

Lessons unlock in order, so test attempts on `te-u1-l1` first. The rest of this guide follows that order. For every request: **Headers** = `Content-Type: application/json` (only when there is a body) and, for protected endpoints, `Authorization: Bearer {{token}}`.

---

## 5. Requests, expected responses and errors

### 0 · Health — `GET {{baseUrl}}/health`

- Auth: none · Body: none · **Expected: `200`**

```json
{
  "status": "ok",
  "service": "vachan-backend",
  "environment": "development",
  "uptimeSeconds": 42,
  "timestamp": "2026-10-05T10:00:00.000Z",
  "database": { "status": "connected" }
}
```

Errors: `503` with `"status": "degraded"` → PostgreSQL is not reachable.

---

### 1 · Register — `POST {{baseUrl}}/auth/register`

- Auth: none
- Body:

```json
{ "name": "Manasa", "email": "manasa@example.com", "password": "learn1234" }
```

Rules: name 2–60 chars · valid email (stored lower-case) · password ≥ 8 chars with at least one number.

**Expected: `201 Created`**

```json
{
  "user": {
    "id": "cmuuzapya000hlp7d3kcjpboy",
    "email": "manasa@example.com",
    "role": "LEARNER",
    "createdAt": "2026-10-05T08:19:12.226Z",
    "profile": {
      "displayName": "Manasa",
      "currentLanguage": null,
      "interfaceLanguage": "en",
      "learningGoal": null,
      "dailyGoal": "regular",
      "selfAssessment": null,
      "showRomanization": true,
      "soundEffects": true,
      "onboardingDone": false
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…"
}
```

Errors:

| Status | Code                       | When                                                                              |
| ------ | -------------------------- | --------------------------------------------------------------------------------- |
| 400    | `VALIDATION_ERROR`         | e.g. `{"name":"M","email":"bad","password":"short"}` → `details` lists each field |
| 409    | `EMAIL_ALREADY_REGISTERED` | Same email again (case-insensitive)                                               |
| 400    | `INVALID_JSON`             | Broken JSON (missing quote/comma)                                                 |

---

### 2 · Login — `POST {{baseUrl}}/auth/login`

- Auth: none · Body:

```json
{ "email": "manasa@example.com", "password": "learn1234" }
```

**Expected: `200 OK`** — same shape as register (`user` + `token`). The Postman test saves `token`.

Errors: `401 INVALID_CREDENTIALS` (wrong email **or** password) · `400 VALIDATION_ERROR` (missing fields).

Demo account from the seed: `demo@vachan.dev` / `Vachan2026!`.

---

### 4 · Get current user — `GET {{baseUrl}}/me`

- Auth: **Bearer token** · Body: none · **Expected: `200`** → `{ "user": { …same as register… } }`

Errors: `401 UNAUTHORIZED` — no token, expired token, tampered token, or logged out.

---

### 5 · Update profile — `PATCH {{baseUrl}}/me`

- Auth: **Bearer token** · Send only the fields you want to change:

```json
{
  "languageCode": "te",
  "learningGoal": "travel",
  "dailyGoal": "regular",
  "selfAssessment": "new",
  "onboardingDone": true
}
```

Other fields: `displayName` (2–60), `showRomanization` (true/false), `soundEffects` (true/false). `dailyGoal` is one of `casual | regular | serious | intense`. `languageCode` is one of `hi te ta ml kn bn`.

**Expected: `200`** → `{ "user": { … "currentLanguage": { "code": "te", "name": "Telugu", "nativeName": "తెలుగు" }, … } }`

Errors: `400 UNKNOWN_LANGUAGE` (`"languageCode": "xx"`) · `400 VALIDATION_ERROR` (empty body, unknown field, wrong type) · `401`.

---

### 6 · Languages — `GET {{baseUrl}}/languages`

- Auth: none · **Expected: `200`**

```json
{ "languages": [
  { "id": "lang-hi", "code": "hi", "name": "Hindi", "nativeName": "हिन्दी", "scriptName": "Devanagari",
    "description": "Spoken widely across North and Central India, written in Devanagari." },
  { "id": "lang-te", "code": "te", "name": "Telugu", "nativeName": "తెలుగు", … },
  … 6 in total (hi, te, ta, ml, kn, bn) …
] }
```

---

### 7 · Courses — `GET {{baseUrl}}/courses` or `GET {{baseUrl}}/courses?languageCode=te`

- Auth: none · Query (optional): `languageCode` = 2-letter code · **Expected: `200`**

```json
{ "courses": [
  { "id": "te-course", "title": "Telugu for English speakers",
    "description": "Start from the Telugu script letters and build up to your first sentence.",
    "language": { "id": "lang-te", "code": "te", "name": "Telugu", … },
    "unitCount": 3, "lessonCount": 5 }
] }
```

Unknown language code → `200` with `"courses": []`. Code not 2 letters → `400 VALIDATION_ERROR`.

---

### 8 · Course detail — `GET {{baseUrl}}/courses/te-course`

- Auth: optional (with a token you get **your** lesson statuses; without, only lesson 1 is open)
- **Expected: `200`**

```json
{ "course": {
  "id": "te-course", "title": "Telugu for English speakers", "description": "…",
  "language": { "code": "te", … },
  "progress": { "completedLessons": 0, "totalLessons": 5, "currentLessonId": "te-u1-l1" },
  "units": [
    { "id": "te-u1", "number": 1, "title": "Script foundations", "stage": "FOUNDATIONS",
      "description": "Read and pronounce your first Telugu script letters.",
      "lessons": [
        { "id": "te-u1-l1", "title": "Vowels", "kind": "SCRIPT", "exerciseCount": 3, "status": "current" },
        { "id": "te-u1-l2", "title": "First consonant", "kind": "SCRIPT", "exerciseCount": 3, "status": "locked" }
      ] },
    … units 2 and 3 …
  ] } }
```

`status` is `completed`, `current` or `locked`. Errors: `404 COURSE_NOT_FOUND`.

---

### 9 · Lesson — `GET {{baseUrl}}/lessons/te-u1-l1`

- Auth: **Bearer token** · **Expected: `200`**

```json
{ "lesson": {
  "id": "te-u1-l1", "title": "Vowels", "introText": "Here are your first two vowels. Say each sound aloud.",
  "kind": "SCRIPT", "status": "current",
  "unit": { "id": "te-u1", "number": 1, "title": "Script foundations" },
  "course": { "id": "te-course", "title": "Telugu for English speakers", "language": { "code": "te", "name": "Telugu" } },
  "vocabulary": [
    { "id": "te-v01-letter-a", "kind": "LETTER", "script": "అ", "romanization": "a", "meaning": "Vowel", "topic": "Script" },
    { "id": "te-v02-letter-aa", "kind": "LETTER", "script": "ఆ", "romanization": "aa", "meaning": "Vowel", "topic": "Script" }
  ],
  "exercises": [
    { "id": "te-u1-l1-e1", "type": "character-recognition", "instruction": "What sound does this letter make?",
      "character": "ఆ",
      "options": [ { "id": "te-u1-l1-e1-o1", "text": "ka", "subtext": null },
                   { "id": "te-u1-l1-e1-o2", "text": "a",  "subtext": null },
                   { "id": "te-u1-l1-e1-o3", "text": "aa", "subtext": null } ] },
    …
  ],
  "progress": { "completedExerciseIds": [], "totalExercises": 3 }
} }
```

Notice: **no `isCorrect`** anywhere — the answers stay on the server.

Exercise shapes by `type`:

| type                    | fields                                               |
| ----------------------- | ---------------------------------------------------- |
| `multiple-choice`       | `prompt`, `promptSubtext`, `options[]`               |
| `character-recognition` | `character`, `options[]`                             |
| `fill-in-blank`         | `before`, `after`, `translation`, `options[]`        |
| `translation`           | `prompt`, `promptSubtext` (type the English meaning) |
| `word-order`            | `prompt` (English sentence), `tokens[]`              |
| `matching`              | `pairs[]` = `{ id, left, leftSubtext, right }`       |

Errors: `403 LESSON_LOCKED` (try `/lessons/te-u3-l1` as a new user) · `404 LESSON_NOT_FOUND` · `401`.

---

### 10 · Submit an answer — `POST {{baseUrl}}/exercises/:id/attempt`

- Auth: **Bearer token** · Path parameter `:id` = exercise id
- Body — the shape depends on the exercise type:

| Exercise type                                         | Body                                                                                            |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| multiple-choice, character-recognition, fill-in-blank | `{ "answer": { "optionId": "te-u1-l1-e1-o3" } }`                                                |
| translation                                           | `{ "answer": { "text": "thank you" } }`                                                         |
| word-order                                            | `{ "answer": { "optionIds": ["te-u3-l1-e3-o3", "te-u3-l1-e3-o4", "te-u3-l1-e3-o1"] } }`         |
| matching                                              | `{ "answer": { "pairs": [ { "leftId": "te-u1-l2-e2-o1", "rightId": "te-u1-l2-e2-o1" }, … ] } }` |

**Step-by-step for lesson `te-u1-l1`** (Telugu, same ids pattern for every language):

| Request            | URL                              | Body                                       | Expect                                         |
| ------------------ | -------------------------------- | ------------------------------------------ | ---------------------------------------------- |
| Wrong answer       | `/exercises/te-u1-l1-e1/attempt` | `{"answer":{"optionId":"te-u1-l1-e1-o1"}}` | 201, `isCorrect: false`, `correctAnswer: "aa"` |
| Exercise 1 correct | `/exercises/te-u1-l1-e1/attempt` | `{"answer":{"optionId":"te-u1-l1-e1-o3"}}` | 201, `isCorrect: true`                         |
| Exercise 2 correct | `/exercises/te-u1-l1-e2/attempt` | `{"answer":{"optionId":"te-u1-l1-e2-o3"}}` | 201, `isCorrect: true`                         |
| Exercise 3 correct | `/exercises/te-u1-l1-e3/attempt` | `{"answer":{"optionId":"te-u1-l1-e3-o2"}}` | 201, `lessonProgress.status: "COMPLETED"`      |

**Expected: `201 Created`**

```json
{
  "attempt": {
    "id": "cmuuzaq2h000klp7dzqn6hfqu",
    "exerciseId": "te-u1-l1-e1",
    "isCorrect": true,
    "typoCorrection": null,
    "correctAnswer": "aa",
    "createdAt": "2026-10-05T08:19:12.377Z"
  },
  "lessonProgress": {
    "lessonId": "te-u1-l1",
    "status": "IN_PROGRESS",
    "completedAt": null,
    "completedExercises": 1,
    "totalExercises": 3,
    "accuracy": 100
  }
}
```

Typed answers ignore capitals, spaces and punctuation (`"THankyou"` ✓), and accept small typos (`"Thnak you"` ✓ with `"typoCorrection": "thank you"`).

Errors:

| Status | Code                    | Example                                              |
| ------ | ----------------------- | ---------------------------------------------------- |
| 400    | `VALIDATION_ERROR`      | `{}` or `{"answer": 5}`                              |
| 400    | `INVALID_ANSWER_FORMAT` | `{"answer":{"text":"aa"}}` sent to a choice exercise |
| 400    | `UNKNOWN_OPTION`        | `{"answer":{"optionId":"zzz"}}`                      |
| 403    | `LESSON_LOCKED`         | exercise in a lesson you haven't unlocked            |
| 404    | `EXERCISE_NOT_FOUND`    | `/exercises/nope/attempt`                            |
| 401    | `UNAUTHORIZED`          | no / invalid token                                   |

---

### 11 · My progress — `GET {{baseUrl}}/progress`

- Auth: **Bearer token** · **Expected: `200`**

```json
{ "progress": {
  "totals": { "lessonsCompleted": 1, "lessonsStarted": 1, "exercisesAnswered": 4, "correctAnswers": 3, "accuracy": 75 },
  "courses": [ { "courseId": "te-course", "title": "Telugu for English speakers",
                 "language": { "code": "te", "name": "Telugu" }, "completedLessons": 1, "totalLessons": 5 }, … ],
  "lessons": [ { "lessonId": "te-u1-l1", "title": "Vowels", "courseId": "te-course", "languageCode": "te",
                 "status": "COMPLETED", "startedAt": "…", "completedAt": "…" } ]
} }
```

### 12 · Progress in one lesson — `GET {{baseUrl}}/progress/te-u1-l1`

- Auth: **Bearer token** · **Expected: `200`**

```json
{ "progress": {
  "lessonId": "te-u1-l1", "title": "Vowels", "status": "COMPLETED",
  "startedAt": "…", "completedAt": "…", "completedExercises": 3, "totalExercises": 3, "accuracy": 75,
  "exercises": [ { "exerciseId": "te-u1-l1-e1", "type": "character-recognition", "attempts": 2, "correctAttempts": 1, "solved": true }, … ]
} }
```

A lesson you never touched returns `"status": "NOT_STARTED"`. Unknown lesson → `404 LESSON_NOT_FOUND`.

---

### 3 · Logout — `POST {{baseUrl}}/auth/logout`

- Auth: **Bearer token** · Body: none · **Expected: `200`**

```json
{ "message": "Logged out. Your previous token no longer works." }
```

Then **Get me** again → `401 UNAUTHORIZED` (the token is now invalid). Log in again to get a new one.

---

## 6. Automated version of this guide

```bash
npm run test:api     # runs the same flow (15 steps) against your running database
```

## 7. API troubleshooting

| Symptom                                          | Cause                                             | Fix                                                                                                           |
| ------------------------------------------------ | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Postman: "Could not send request / ECONNREFUSED" | Backend not running                               | `npm run dev` (look for `🚀 Vachan API running at http://localhost:4000`)                                     |
| Backend exits: `JWT_SECRET is required`          | Phase 2 variable missing                          | `echo "JWT_SECRET=$(openssl rand -hex 32)" >> backend/.env`                                                   |
| `401 UNAUTHORIZED` on every protected request    | No/old token                                      | Run **Login** again; check the collection **Authorization** is `Bearer {{token}}`                             |
| `401` right after restarting the backend         | You changed `JWT_SECRET` (old tokens are invalid) | Log in again                                                                                                  |
| `403 LESSON_LOCKED`                              | Lessons unlock in order                           | Finish the previous lesson (see step 10 table)                                                                |
| `404 COURSE_NOT_FOUND` / empty `courses`         | Database not seeded                               | `npm run db:seed`                                                                                             |
| `400 VALIDATION_ERROR`                           | Body doesn't match the rules                      | Read `error.details` — it names the field                                                                     |
| `400 INVALID_JSON`                               | Typo in the raw body                              | Body tab → **raw** + **JSON**; check quotes and commas                                                        |
| `500 INTERNAL_SERVER_ERROR`                      | Bug or DB down                                    | Read the backend terminal; check `GET /api/health`                                                            |
| Website: CORS error in browser console           | `CORS_ORIGIN` doesn't match the website address   | `CORS_ORIGIN=http://localhost:3000` in `backend/.env` (exact, no trailing slash), restart                     |
| Website: "Can't reach the Vachan server"         | Backend down or wrong `NEXT_PUBLIC_API_URL`       | Start the backend; `frontend/.env.local` → `NEXT_PUBLIC_API_URL=http://localhost:4000`; restart `npm run dev` |
| Website keeps sending you to /login              | Cookie blocked or `127.0.0.1` vs `localhost` mix  | Open the site at **http://localhost:3000** (not 127.0.0.1) so the cookie is sent                              |
| `EADDRINUSE` / "Port 4000 is already in use"     | Another backend still running                     | `lsof -i :4000` → `kill <PID>`                                                                                |
