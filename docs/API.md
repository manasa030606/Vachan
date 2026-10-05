# Vachan — API reference & Postman testing guide (Phase 4)

Base URL: **`http://localhost:4000/api`** locally · **`https://<your-api>.onrender.com/api`** deployed (see [DEPLOYMENT.md](DEPLOYMENT.md)) · All bodies are JSON · All errors look like:

```json
{ "error": { "code": "SOME_CODE", "message": "Human-readable explanation", "details": [ … optional … ] } }
```

---

## 1. Endpoint list

| #   | Method | URL                          | Auth         | Purpose                                                                                 |
| --- | ------ | ---------------------------- | ------------ | --------------------------------------------------------------------------------------- |
| 0   | GET    | `/api/health`                | none         | API + database status                                                                   |
| 1   | POST   | `/api/auth/register`         | none         | Create an account (logs you in)                                                         |
| 2   | POST   | `/api/auth/login`            | none         | Log in, get a token                                                                     |
| 27  | POST   | `/api/auth/logout`           | **required** | Log out (old tokens stop working)                                                       |
| 4   | GET    | `/api/me`                    | **required** | Current user + profile                                                                  |
| 5   | PATCH  | `/api/me`                    | **required** | Update profile (onboarding, settings, language)                                         |
| 6   | GET    | `/api/languages`             | none         | The six languages                                                                       |
| 7   | GET    | `/api/courses`               | none         | All courses (`?languageCode=te` to filter)                                              |
| 8   | GET    | `/api/courses/:id`           | optional     | Course → units → lessons with status                                                    |
| 9   | GET    | `/api/lessons/:id`           | **required** | Lesson + exercises (no answers) + my progress                                           |
| 10  | POST   | `/api/lessons/:id/start`     | **required** | start or resume a lesson                                                                |
| 11  | POST   | `/api/exercises/:id/attempt` | **required** | Submit an answer (lesson or review); server checks it, returns feedback + rewards (§18) |
| 12  | GET    | `/api/progress`              | **required** | My overall progress + resume point                                                      |
| 13  | GET    | `/api/progress/:lessonId`    | **required** | My progress in one lesson (per exercise)                                                |
| 14  | GET    | `/api/review`                | **required** | open mistakes + words learned                                                           |
| 15  | GET    | `/api/review/attempts`       | **required** | every incorrect answer                                                                  |
| 16  | GET    | `/api/review/session`        | **required** | Open mistakes as exercises to practise                                                  |
| 19  | GET    | `/api/stats`                 | **required** | **Phase 4** · XP, level, streak, hearts, daily goal, recent badges                      |
| 20  | GET    | `/api/streak`                | **required** | **Phase 4** · current/longest streak + last 7 days                                      |
| 21  | GET    | `/api/achievements`          | **required** | **Phase 4** · all badges with progress                                                  |
| 22  | GET    | `/api/recommendations`       | **required** | **Phase 4** · practice recommendations (transparent rules)                              |
| 23  | POST   | `/api/placement/start`       | **required** | **Phase 4** · start a placement test                                                    |
| 24  | POST   | `/api/placement/answer`      | **required** | **Phase 4** · answer one placement question                                             |
| 25  | GET    | `/api/placement/result`      | **required** | **Phase 4** · score per unit + recommended unit                                         |
| 26  | POST   | `/api/placement/decide`      | **required** | **Phase 4** · start at the recommended unit or Unit 1                                   |

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

**Local vs deployed.** The same collection runs against both; only `baseUrl` changes. Import one of the environments in `postman/` and pick it in the top-right environment menu:

| Environment file                           | `baseUrl`                                                    |
| ------------------------------------------ | ------------------------------------------------------------ |
| `Vachan.local.postman_environment.json`    | `http://localhost:4000/api`                                  |
| `Vachan.deployed.postman_environment.json` | `https://<your-api>.onrender.com/api` (edit after deploying) |

(`https://<your-app>.vercel.app/api` also works — that's the same backend through the website's proxy.) On the deployed backend the demo account doesn't exist, and the API may need ~1 minute to wake up — send **Health** first.

1. Start everything: `npm run dev` (backend on 4000, frontend on 3000). Database migrated and seeded (see `docs/DATABASE.md`).
2. Postman → **Import** → choose `postman/Vachan.postman_collection.json`.
3. Open the collection **Vachan API** → **Variables** tab. You'll see `baseUrl = http://localhost:4000/api`, `token` (empty), `email`, `password`, `courseId = te-course`, `lessonId = te-u1-l1`.
4. The collection's **Authorization** tab is set to **Bearer Token → `{{token}}`**. Every request inherits it, except register/login/health/languages/courses, which use "No Auth".
5. **You never copy the token by hand:** the **Register** and **Login** requests have a small _Tests_ script that saves `token` automatically.

Run it all at once: right-click the collection → **Run collection** → **Run Vachan API**. All 87 requests should be green (190 tests).

> If "Get me before logging in" returns 200 instead of 401: Postman kept a `vachan_token` cookie from an earlier run. Click **Cookies** (under the Send button) → `localhost` → delete `vachan_token`.

---

## 4. Testing order

```
0 Health → 1 Register / Login → 2 Me (pick Telugu) → 3 Languages & courses
→ 4 Lessons (locked 403, start te-u1-l1) → 5 Attempts (wrong → right → leave → resume → complete → unlock → practise again)
→ 6 More lessons + typed answers → 7 Review (mistakes → review answer clears one) → 8 Progress
→ 9 XP / level / streak / hearts / daily goal → 10 Achievements & recommendations → 11 Placement test (Hindi) → 12 Logout
```

Each folder builds on the one before (lessons unlock in order), so run them top to bottom. Starting again from scratch? Just run the whole collection again — Register creates a brand-new user each time. The rest of this guide follows that order. For every request: **Headers** = `Content-Type: application/json` (only when there is a body) and, for protected endpoints, `Authorization: Bearer {{token}}`.

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

Other fields: `displayName` (2–60), `showRomanization` (true/false), `soundEffects` (true/false), **`timeZone`** (IANA name like `"Asia/Kolkata"` — decides when a streak day starts; the website sends the browser's zone automatically). `selfAssessment` is one of `new · few-words · knows-script · basic-sentences · simple-conversations · advanced`. `dailyGoal` is one of `casual | regular | serious | intense`. `languageCode` is one of `hi te ta ml kn bn`.

**Expected: `200`** → `{ "user": { … "currentLanguage": { "code": "te", "name": "Telugu", "nativeName": "తెలుగు" }, … } }`

Errors: `400 UNKNOWN_LANGUAGE` (`"languageCode": "xx"`) · `400 VALIDATION_ERROR` (empty body, unknown field, wrong type, unknown time zone like `"Mars/Olympus"`, self-assessment not in the list) · `401`.

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
    "description": "From your first Telugu script letters to simple everyday sentences.",
    "language": { "id": "lang-te", "code": "te", "name": "Telugu", … },
    "unitCount": 4, "lessonCount": 16 }
] }
```

Unknown language code → `200` with `"courses": []`. Code not 2 letters → `400 VALIDATION_ERROR`.

---

### 8 · Course detail — `GET {{baseUrl}}/courses/{{courseId}}`

- Auth: optional (send the token to see **your** statuses; without it the first lesson is `available`, the rest `locked`)
- **Expected: `200`** (shortened to 1 unit / 2 lessons):

```json
{
  "course": {
    "id": "te-course",
    "title": "Telugu for English speakers",
    "description": "From your first Telugu script letters to simple everyday sentences.",
    "language": {
      "id": "lang-te",
      "code": "te",
      "name": "Telugu",
      "nativeName": "తెలుగు",
      "scriptName": "Telugu script",
      "description": "The language of Andhra Pradesh and Telangana, known for its rounded letters."
    },
    "progress": {
      "completedLessons": 0,
      "inProgressLessons": 0,
      "totalLessons": 16,
      "currentLessonId": "te-u1-l1"
    },
    "units": [
      {
        "id": "te-u1",
        "number": 1,
        "title": "Vowels",
        "description": "Read and pronounce six Telugu script vowels.",
        "stage": "FOUNDATIONS",
        "status": "active",
        "completedLessons": 0,
        "lessons": [
          {
            "id": "te-u1-l1",
            "title": "Vowels: a and aa",
            "kind": "SCRIPT",
            "exerciseCount": 4,
            "status": "available"
          },
          {
            "id": "te-u1-l2",
            "title": "Vowels: i and ii",
            "kind": "SCRIPT",
            "exerciseCount": 4,
            "status": "locked"
          }
        ]
      }
    ]
  }
}
```

| Field                      | Meaning                                                                                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lessons[].status`         | `completed` · `current` (started, not finished) · `available` (unlocked, not started) · `locked`                                                  |
| `units[].status`           | `locked` · `active` · `completed`                                                                                                                 |
| `progress.currentLessonId` | The recommended lesson ("Up next"): the most recently active unfinished lesson, otherwise the first available one; `null` when the course is done |

Errors: `404 COURSE_NOT_FOUND` (`/courses/nope`).

---

### 9 · Lesson — `GET {{baseUrl}}/lessons/{{lessonId}}`

- Auth: **Bearer token** · **Expected: `200`** (shortened to 1 word / 1 exercise):

```json
{
  "lesson": {
    "id": "te-u1-l1",
    "title": "Vowels: a and aa",
    "introText": "Your first two vowels. అ is short and ఆ is long — say each one aloud.",
    "kind": "SCRIPT",
    "status": "available",
    "unit": {
      "id": "te-u1",
      "number": 1,
      "title": "Vowels"
    },
    "course": {
      "id": "te-course",
      "title": "Telugu for English speakers",
      "language": {
        "code": "te",
        "name": "Telugu"
      }
    },
    "vocabulary": [
      {
        "id": "te-v01-letter-a",
        "kind": "LETTER",
        "script": "అ",
        "romanization": "a",
        "meaning": "Vowel: short “a”, like the u in “cup”",
        "topic": "Vowels"
      }
    ],
    "exercises": [
      {
        "id": "te-u1-l1-e3",
        "type": "character-recognition",
        "instruction": "Select the letter for this sound",
        "prompt": "aa",
        "promptSubtext": "long “aa”, like the a in “father”",
        "options": [
          {
            "id": "te-u1-l1-e3-o1",
            "text": "ఇ",
            "subtext": null
          },
          {
            "id": "te-u1-l1-e3-o2",
            "text": "ఆ",
            "subtext": null
          },
          {
            "id": "te-u1-l1-e3-o3",
            "text": "అ",
            "subtext": null
          }
        ]
      }
    ],
    "progress": {
      "lessonId": "te-u1-l1",
      "status": "NOT_STARTED",
      "startedAt": null,
      "runStartedAt": null,
      "lastActivityAt": null,
      "completedAt": null,
      "timesCompleted": 0,
      "correctAttempts": 0,
      "incorrectAttempts": 0,
      "accuracy": null,
      "completedExerciseIds": [],
      "completedExercises": 0,
      "totalExercises": 4
    }
  }
}
```

The exercise list **never** contains `isCorrect`, accepted translations, word positions or `explanation`. Exercise shapes by `type`:

| `type`                  | Fields                                                            | Answer to send                                     |
| ----------------------- | ----------------------------------------------------------------- | -------------------------------------------------- |
| `character-sound`       | `character` (a letter) + `options` (sounds)                       | `{ "optionId": "…" }`                              |
| `character-recognition` | `prompt` (a sound) + `promptSubtext` (hint) + `options` (letters) | `{ "optionId": "…" }`                              |
| `multiple-choice`       | `prompt`, `promptSubtext`, `options`                              | `{ "optionId": "…" }`                              |
| `fill-in-blank`         | `before`, `after`, `translation`, `options`                       | `{ "optionId": "…" }`                              |
| `translation`           | `prompt`, `promptSubtext` (type the meaning / the sound)          | `{ "text": "thank you" }`                          |
| `word-order`            | `prompt` (English), `tokens` (word bank + 1 extra)                | `{ "optionIds": ["…", "…"] }` in order             |
| `matching`              | `pairs` [`id`, `left`, `right`]                                   | `{ "pairs": [{ "leftId": "…", "rightId": "…" }] }` |

Errors: `403 LESSON_LOCKED` (e.g. `te-u1-l2` before finishing `te-u1-l1`) · `404 LESSON_NOT_FOUND` · `401`.

---

### 10 · Start / resume a lesson — `POST {{baseUrl}}/lessons/{{lessonId}}/start`

- Auth: **Bearer token** · Body: **optional**. `{ "restart": true }` starts the run over instead of resuming.
- **Expected: `200`**

First time → creates the progress row (**lesson started**):

```json
{
  "resumed": false,
  "progress": {
    "lessonId": "te-u1-l1",
    "status": "IN_PROGRESS",
    "startedAt": "2026-10-05T11:01:32.029Z",
    "runStartedAt": "2026-10-05T11:01:32.029Z",
    "lastActivityAt": "2026-10-05T11:01:32.029Z",
    "completedAt": null,
    "timesCompleted": 0,
    "correctAttempts": 0,
    "incorrectAttempts": 0,
    "accuracy": null,
    "completedExerciseIds": [],
    "completedExercises": 0,
    "totalExercises": 4
  }
}
```

Coming back later to a lesson you left half-way → `"resumed": true` and the exercises already done:

```json
{
  "resumed": true,
  "progress": {
    "lessonId": "te-u1-l1",
    "status": "IN_PROGRESS",
    "startedAt": "2026-10-05T11:01:32.029Z",
    "runStartedAt": "2026-10-05T11:01:32.029Z",
    "lastActivityAt": "2026-10-05T11:01:32.103Z",
    "completedAt": null,
    "timesCompleted": 0,
    "correctAttempts": 2,
    "incorrectAttempts": 1,
    "accuracy": 67,
    "completedExerciseIds": ["te-u1-l1-e1", "te-u1-l1-e2"],
    "completedExercises": 2,
    "totalExercises": 4
  }
}
```

On a **completed** lesson it starts a fresh practice run (`"resumed": false`, `completedExerciseIds: []`) and the status stays `COMPLETED`.

Errors: `403 LESSON_LOCKED` · `404 LESSON_NOT_FOUND` · `400 VALIDATION_ERROR` (e.g. `{"restart":"yes"}`).

---

### 11 · Submit an answer — `POST {{baseUrl}}/exercises/:id/attempt`

- Auth: **Bearer token**
- Body: `{ "answer": { … }, "mode": "lesson" }` — `mode` is optional (`lesson` by default, `review` on the review screen).

Example — **wrong** answer to `te-u1-l1-e1` (the letter అ; option `o2` is "aa"):

```json
{ "answer": { "optionId": "te-u1-l1-e1-o2" } }
```

**Expected: `201 Created`** — the attempt is saved and you get feedback:

```json
{
  "attempt": {
    "id": "cmuv53h900003nz7ddh7q179v",
    "exerciseId": "te-u1-l1-e1",
    "mode": "lesson",
    "isCorrect": false,
    "typoCorrection": null,
    "correctAnswer": "a",
    "explanation": "అ is “a”: short “a”, like the u in “cup”.",
    "createdAt": "2026-10-05T11:01:32.052Z"
  },
  "lessonProgress": {
    "lessonId": "te-u1-l1",
    "status": "IN_PROGRESS",
    "startedAt": "2026-10-05T11:01:32.029Z",
    "runStartedAt": "2026-10-05T11:01:32.029Z",
    "lastActivityAt": "2026-10-05T11:01:32.044Z",
    "completedAt": null,
    "timesCompleted": 0,
    "correctAttempts": 0,
    "incorrectAttempts": 1,
    "accuracy": 0,
    "completedExerciseIds": [],
    "completedExercises": 0,
    "totalExercises": 4,
    "justCompleted": false
  }
}
```

Since Phase 4 every attempt response also has **`rewards`** (XP, level, hearts, streak, daily goal, new badges) — see section 18. With **0 hearts** a lesson answer is refused: `403 OUT_OF_HEARTS` with `details.nextHeartAt` (review answers still work).

Answering the **last missing exercise** completes the lesson (`justCompleted: true`, `status: COMPLETED`, the next lesson becomes `available`):

```json
{
  "attempt": {
    "id": "cmuv53hbc0007nz7dxstjlhmw",
    "exerciseId": "te-u1-l1-e4",
    "mode": "lesson",
    "isCorrect": true,
    "typoCorrection": null,
    "correctAnswer": "అ",
    "explanation": "“a” is written అ.",
    "createdAt": "2026-10-05T11:01:32.136Z"
  },
  "lessonProgress": {
    "lessonId": "te-u1-l1",
    "status": "COMPLETED",
    "startedAt": "2026-10-05T11:01:32.029Z",
    "runStartedAt": "2026-10-05T11:01:32.029Z",
    "lastActivityAt": "2026-10-05T11:01:32.133Z",
    "completedAt": "2026-10-05T11:01:32.133Z",
    "timesCompleted": 1,
    "correctAttempts": 4,
    "incorrectAttempts": 1,
    "accuracy": 80,
    "completedExerciseIds": ["te-u1-l1-e1", "te-u1-l1-e2", "te-u1-l1-e3", "te-u1-l1-e4"],
    "completedExercises": 4,
    "totalExercises": 4,
    "justCompleted": true
  }
}
```

Correct option ids for the Telugu lessons used in Postman:

| Lesson     | Exercise → correct answer                                                                                              |
| ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| `te-u1-l1` | `e1` → `te-u1-l1-e1-o1` (a) · `e2` → `te-u1-l1-e2-o3` (aa) · `e3` → `te-u1-l1-e3-o2` (ఆ) · `e4` → `te-u1-l1-e4-o1` (అ) |
| `te-u1-l4` | `e5` (typed) → `"ii"` or `"ee"` (capitals / spaces ignored: `"EE"`, `" i i "`)                                         |

(Postman's folders 5–6 contain every answer, including matching and word order.)

**Answer checking is deterministic** (no AI): choices compare option ids; typed answers ignore capitals, spaces and punctuation, use Unicode NFC normalisation, drop invisible joiners, and allow 1–2 typos on longer answers (`"Thnak you"` → accepted with `typoCorrection`); word order must match exactly; matching needs every pair.

Errors:

| Status | Code                    | When                                                    |
| ------ | ----------------------- | ------------------------------------------------------- |
| 400    | `INVALID_ANSWER_FORMAT` | Wrong answer shape, e.g. `{ "text": "a" }` for a choice |
| 400    | `UNKNOWN_OPTION`        | `optionId` from another exercise                        |
| 400    | `VALIDATION_ERROR`      | Empty body, empty text, `mode` not lesson/review        |
| 403    | `LESSON_LOCKED`         | Exercise belongs to a locked lesson                     |
| 404    | `EXERCISE_NOT_FOUND`    | Unknown exercise id                                     |
| 401    | `UNAUTHORIZED`          | No / invalid token                                      |

---

### 12 · My progress — `GET {{baseUrl}}/progress`

- Auth: **Bearer token** · **Expected: `200`** (`courses` shortened to one):

```json
{
  "progress": {
    "totals": {
      "lessonsCompleted": 1,
      "lessonsInProgress": 0,
      "exercisesAnswered": 6,
      "correctAnswers": 5,
      "incorrectAnswers": 1,
      "accuracy": 83,
      "lastActivityAt": "2026-10-05T11:01:32.197Z"
    },
    "resume": null,
    "courses": [
      {
        "courseId": "te-course",
        "title": "Telugu for English speakers",
        "language": {
          "code": "te",
          "name": "Telugu"
        },
        "completedLessons": 1,
        "inProgressLessons": 0,
        "totalLessons": 16
      }
    ],
    "lessons": [
      {
        "lessonId": "te-u1-l1",
        "title": "Vowels: a and aa",
        "courseId": "te-course",
        "languageCode": "te",
        "status": "COMPLETED",
        "startedAt": "2026-10-05T11:01:32.029Z",
        "lastActivityAt": "2026-10-05T11:01:32.193Z",
        "completedAt": "2026-10-05T11:01:32.133Z",
        "timesCompleted": 1,
        "correctAttempts": 4,
        "incorrectAttempts": 1,
        "accuracy": 80,
        "totalExercises": 4
      }
    ]
  }
}
```

`resume` = the unfinished lesson you touched last (null when nothing is half-done). `lastActivityAt` = your latest answer or lesson start.

---

### 13 · Progress in one lesson — `GET {{baseUrl}}/progress/{{lessonId}}`

- Auth: **Bearer token** · **Expected: `200`** — the lesson counters plus one row per exercise:

```json
{
  "progress": {
    "title": "Vowels: a and aa",
    "lessonId": "te-u1-l1",
    "status": "COMPLETED",
    "startedAt": "2026-10-05T11:01:32.029Z",
    "runStartedAt": "2026-10-05T11:01:32.029Z",
    "lastActivityAt": "2026-10-05T11:01:32.193Z",
    "completedAt": "2026-10-05T11:01:32.133Z",
    "timesCompleted": 1,
    "correctAttempts": 4,
    "incorrectAttempts": 1,
    "accuracy": 80,
    "completedExerciseIds": ["te-u1-l1-e1", "te-u1-l1-e2", "te-u1-l1-e3", "te-u1-l1-e4"],
    "completedExercises": 4,
    "totalExercises": 4,
    "exercises": [
      {
        "exerciseId": "te-u1-l1-e1",
        "type": "character-sound",
        "attempts": 2,
        "correctAttempts": 1,
        "incorrectAttempts": 1,
        "reviewAttempts": 1,
        "solvedInCurrentRun": true,
        "lastAttemptAt": "2026-10-05T11:01:32.197Z",
        "lastAttemptCorrect": true
      }
    ]
  }
}
```

A lesson you never opened returns `"status": "NOT_STARTED"` with zero counters. Unknown lesson → `404 LESSON_NOT_FOUND`.

---

### 14 · Review — `GET {{baseUrl}}/review?languageCode=te`

- Auth: **Bearer token** · Query: `languageCode` (optional, filters to one language)
- **Rule:** an exercise is an **open mistake** when you answered it wrong (in a lesson or a review) and have not answered it correctly **in a review** since. Getting it right later in the same lesson doesn't clear it — that's the point of reviewing later.
- **Expected: `200`**:

```json
{
  "review": {
    "languageCode": "te",
    "openMistakes": 1,
    "resolvedMistakes": 0,
    "mistakes": [
      {
        "exerciseId": "te-u1-l1-e1",
        "type": "character-sound",
        "instruction": "What sound does this letter make?",
        "prompt": "అ",
        "promptSubtext": null,
        "yourAnswer": "aa",
        "correctAnswer": "a",
        "explanation": "అ is “a”: short “a”, like the u in “cup”.",
        "wrongCount": 1,
        "lastWrongAt": "2026-10-05T11:01:32.052Z",
        "lessonId": "te-u1-l1",
        "lessonTitle": "Vowels: a and aa",
        "unitTitle": "Vowels",
        "courseId": "te-course",
        "languageCode": "te"
      }
    ],
    "learnedVocabulary": [
      {
        "id": "te-v01-letter-a",
        "kind": "LETTER",
        "script": "అ",
        "romanization": "a",
        "meaning": "Vowel: short “a”, like the u in “cup”",
        "topic": "Vowels"
      }
    ]
  }
}
```

`learnedVocabulary` = letters, words and phrases of the lessons you completed.

### 15 · Incorrect attempts — `GET {{baseUrl}}/review/attempts?languageCode=te&limit=20`

Every wrong answer, newest first (`limit` 1–50, default 20). `stillOpen` says whether it is still on the review list.

```json
{
  "attempts": [
    {
      "attemptId": "cmuv53h900003nz7ddh7q179v",
      "exerciseId": "te-u1-l1-e1",
      "source": "LESSON",
      "prompt": "అ",
      "promptSubtext": null,
      "yourAnswer": "aa",
      "correctAnswer": "a",
      "createdAt": "2026-10-05T11:01:32.052Z",
      "stillOpen": true,
      "lessonId": "te-u1-l1",
      "lessonTitle": "Vowels: a and aa",
      "unitTitle": "Vowels",
      "courseId": "te-course",
      "languageCode": "te"
    }
  ]
}
```

### 16 · Review session — `GET {{baseUrl}}/review/session?languageCode=te`

Up to 10 open mistakes as exercises (same shapes as a lesson, **no answers**):

```json
{
  "session": {
    "id": "review",
    "title": "Review your mistakes",
    "introText": "Answer each one correctly to clear it from your list.",
    "totalOpen": 1,
    "exercises": [
      {
        "id": "te-u1-l1-e1",
        "type": "character-sound",
        "instruction": "What sound does this letter make?",
        "character": "అ",
        "options": [
          {
            "id": "te-u1-l1-e1-o1",
            "text": "a",
            "subtext": null
          },
          {
            "id": "te-u1-l1-e1-o2",
            "text": "aa",
            "subtext": null
          },
          {
            "id": "te-u1-l1-e1-o3",
            "text": "i",
            "subtext": null
          }
        ],
        "lessonTitle": "Vowels: a and aa"
      }
    ]
  }
}
```

Answer them with **`POST /exercises/:id/attempt`** and `"mode": "review"`:

```json
{ "answer": { "optionId": "te-u1-l1-e1-o1" }, "mode": "review" }
```

→ `201` with `"mode": "review"`. A correct review answer clears the mistake (`openMistakes` − 1, `resolvedMistakes` + 1). Review answers are saved (`source = REVIEW`) but **don't** change the lesson's correct/incorrect counters.

Errors for 14–16: `401` without a token · `400 VALIDATION_ERROR` (`languageCode` not 2 letters, `limit` out of range).

---

### 18 · Rewards after an answer (inside `POST /exercises/:id/attempt`)

The answer that finishes a perfect first lesson (`te-u1-l1-e4`) returns:

```json
{
  "rewards": {
    "xpEarned": 17,
    "awards": [
      {
        "reason": "EXERCISE_CORRECT",
        "amount": 2
      },
      {
        "reason": "LESSON_COMPLETED",
        "amount": 10
      },
      {
        "reason": "PERFECT_LESSON",
        "amount": 5
      }
    ],
    "totalXp": 23,
    "level": {
      "level": 1,
      "levelStartXp": 0,
      "nextLevelXp": 50,
      "xpIntoLevel": 23,
      "xpToNextLevel": 27,
      "isMaxLevel": false
    },
    "leveledUp": false,
    "hearts": {
      "current": 5,
      "max": 5,
      "nextHeartAt": null,
      "refillMinutes": 30
    },
    "streak": {
      "current": 1,
      "longest": 1,
      "change": "same-day"
    },
    "dailyGoal": {
      "targetXp": 20,
      "earnedToday": 23,
      "completed": true,
      "justCompleted": true
    },
    "newAchievements": [
      {
        "code": "first-lesson",
        "title": "First Lesson",
        "description": "Complete your first lesson",
        "icon": "🌱"
      },
      {
        "code": "perfect-lesson",
        "title": "Flawless",
        "description": "Finish a lesson without a single mistake",
        "icon": "💎"
      },
      {
        "code": "goal-getter",
        "title": "Goal Getter",
        "description": "Reach your daily goal",
        "icon": "🎯"
      }
    ]
  }
}
```

A wrong lesson answer: `xpEarned: 0`, `hearts.current` − 1 and `hearts.nextHeartAt` set. Rules: [GAMIFICATION.md](GAMIFICATION.md).

---

### 19 · Stats — `GET {{baseUrl}}/stats`

- Auth: **Bearer token** · Body: none · **Expected: `200`** (week and badges shortened):

```json
{
  "stats": {
    "xp": {
      "total": 23,
      "today": 23,
      "level": 1,
      "levelStartXp": 0,
      "nextLevelXp": 50,
      "xpIntoLevel": 23,
      "xpToNextLevel": 27,
      "isMaxLevel": false
    },
    "streak": {
      "current": 1,
      "longest": 1,
      "lastActiveDate": "2026-10-05",
      "today": "2026-10-05",
      "timeZone": "Asia/Kolkata",
      "activeToday": true,
      "week": [
        {
          "date": "2026-10-04",
          "xpEarned": 0,
          "active": false,
          "goalMet": false
        },
        {
          "date": "2026-10-05",
          "xpEarned": 23,
          "active": true,
          "goalMet": true
        }
      ]
    },
    "hearts": {
      "current": 4,
      "max": 5,
      "nextHeartAt": "2026-10-05T12:19:20.933Z",
      "refillMinutes": 30
    },
    "dailyGoal": {
      "date": "2026-10-05",
      "targetXp": 20,
      "earnedToday": 23,
      "completed": true
    },
    "achievements": {
      "unlockedCount": 3,
      "total": 8,
      "recent": [
        {
          "code": "first-lesson",
          "title": "First Lesson",
          "description": "Complete your first lesson",
          "icon": "🌱",
          "metric": "LESSONS_COMPLETED",
          "threshold": 1,
          "value": 1,
          "progress": 1,
          "unlocked": true,
          "unlockedAt": "2026-10-05T11:49:20.843Z"
        }
      ]
    },
    "rules": {
      "xp": {
        "exerciseCorrect": 2,
        "lessonCompleted": 10,
        "lessonPracticed": 5,
        "perfectLessonBonus": 5,
        "reviewCorrect": 2
      },
      "hearts": {
        "max": 5,
        "initial": 5,
        "lossPerMistake": 1,
        "refillMinutes": 30,
        "reviewRestore": 1
      },
      "levelThresholds": [0, 50, 120, 220, 350, 520, 750, 1050, 1450, 2000],
      "dailyGoalXp": {
        "CASUAL": 10,
        "REGULAR": 20,
        "SERIOUS": 30,
        "INTENSE": 50
      }
    }
  }
}
```

Errors: `401` without a token.

### 20 · Streak — `GET {{baseUrl}}/streak`

```json
{
  "streak": {
    "current": 1,
    "longest": 1,
    "lastActiveDate": "2026-10-05",
    "today": "2026-10-05",
    "timeZone": "Asia/Kolkata",
    "activeToday": true,
    "week": [
      {
        "date": "2026-10-04",
        "xpEarned": 0,
        "active": false,
        "goalMet": false
      },
      {
        "date": "2026-10-05",
        "xpEarned": 23,
        "active": true,
        "goalMet": true
      }
    ]
  }
}
```

`current` is 0 when the last active day is before yesterday (missed day). `today` is the learner's local date in `timeZone`.

### 21 · Achievements — `GET {{baseUrl}}/achievements`

```json
{
  "unlockedCount": 3,
  "total": 8,
  "achievements": [
    {
      "code": "first-lesson",
      "title": "First Lesson",
      "description": "Complete your first lesson",
      "icon": "🌱",
      "metric": "LESSONS_COMPLETED",
      "threshold": 1,
      "value": 1,
      "progress": 1,
      "unlocked": true,
      "unlockedAt": "2026-10-05T11:49:20.843Z"
    },
    {
      "code": "xp-100",
      "title": "First 100 XP",
      "description": "Earn 100 XP",
      "icon": "⚡",
      "metric": "TOTAL_XP",
      "threshold": 100,
      "value": 23,
      "progress": 0.23,
      "unlocked": false,
      "unlockedAt": null
    }
  ]
}
```

### 22 · Recommendations — `GET {{baseUrl}}/recommendations?languageCode=te`

```json
{
  "languageCode": "te",
  "recommendations": [
    {
      "type": "unfinished-lesson",
      "title": "Finish “Vowels: i and ii”",
      "reason": "You started this lesson but haven't finished it yet.",
      "action": {
        "kind": "lesson",
        "lessonId": "te-u1-l2"
      }
    },
    {
      "type": "review",
      "title": "Review 1 mistake",
      "reason": "1 mistake from your lessons is waiting to be fixed.",
      "action": {
        "kind": "review"
      }
    }
  ],
  "rules": [
    "Out of hearts → review mistakes (each fixed mistake gives a heart back).",
    "Repeated mistakes → open mistakes answered wrong 2+ times.",
    "Unfinished lessons → lessons you started but didn't finish.",
    "Weak topics → completed lessons with accuracy below 70% (after 4+ answers).",
    "Other mistakes → the rest of your review list.",
    "Next lesson → the next lesson on your path."
  ]
}
```

Errors: `400 NO_LANGUAGE` (no language chosen and no `languageCode`) · `404 COURSE_NOT_FOUND`.

---

### 23 · Placement start — `POST {{baseUrl}}/placement/start`

- Auth: **Bearer token** · Body (optional): `{ "languageCode": "hi" }` (default: your current language)
- **Expected: `201`** (shortened to 1 question):

```json
{
  "test": {
    "id": "cmuv6sz09000p597d23edkweh",
    "status": "IN_PROGRESS",
    "language": {
      "code": "hi",
      "name": "Hindi"
    },
    "selfAssessment": "knows-script",
    "totalQuestions": 12
  },
  "questions": [
    {
      "id": "hi-pq1",
      "unit": 1,
      "skill": "SCRIPT",
      "exercise": {
        "id": "hi-u1-l1-e3",
        "type": "character-recognition",
        "instruction": "Select the letter for this sound",
        "prompt": "aa",
        "promptSubtext": "long “aa”, like the a in “father”",
        "options": [
          {
            "id": "hi-u1-l1-e3-o1",
            "text": "आ",
            "subtext": null
          },
          {
            "id": "hi-u1-l1-e3-o2",
            "text": "अ",
            "subtext": null
          },
          {
            "id": "hi-u1-l1-e3-o3",
            "text": "इ",
            "subtext": null
          }
        ]
      }
    }
  ],
  "rules": [
    "The test has 3 questions for each unit.",
    "A unit is passed with at least 2 correct answers out of 3.",
    "Units are checked in order: you start at the first unit you did not pass.",
    "If you pass every unit, you start at the last unit.",
    "You can always choose to start from Unit 1 instead."
  ]
}
```

Save `test.id`. Question ids are readable: `hi-pq1` … `hi-pq12`. Errors: `400 UNKNOWN_LANGUAGE` · `400 NO_LANGUAGE` · `404 PLACEMENT_NOT_AVAILABLE` (not seeded).

### 24 · Placement answer — `POST {{baseUrl}}/placement/answer`

```json
{ "testId": "<test.id>", "questionId": "hi-pq1", "answer": { "optionId": "…" } }
```

`answer` has the same shapes as lesson answers. **Expected: `201`** — right/wrong is **not** revealed until the result:

```json
{
  "testId": "cmuv6sz09000p597d23edkweh",
  "answered": 1,
  "total": 12,
  "completed": false
}
```

Errors: `404 PLACEMENT_NOT_FOUND` (not your test) · `404 QUESTION_NOT_FOUND` (other language) · `409 ALREADY_ANSWERED` · `409 PLACEMENT_FINISHED` · `400 INVALID_ANSWER_FORMAT` / `UNKNOWN_OPTION` / `VALIDATION_ERROR`.

### 25 · Placement result — `GET {{baseUrl}}/placement/result?testId=<test.id>`

`testId` optional (default: your latest test for your current language). With units 1, 2, 4 right and unit 3 wrong:

```json
{
  "result": {
    "testId": "cmuv6sz09000p597d23edkweh",
    "status": "COMPLETED",
    "language": {
      "code": "hi",
      "name": "Hindi"
    },
    "selfAssessment": {
      "id": "knows-script",
      "label": "I know the alphabet/script but need practice"
    },
    "correctCount": 9,
    "totalQuestions": 12,
    "units": [
      {
        "unit": 1,
        "correct": 3,
        "total": 3,
        "passed": true,
        "title": "Vowels",
        "skills": ["SCRIPT"]
      },
      {
        "unit": 2,
        "correct": 3,
        "total": 3,
        "passed": true,
        "title": "Consonants & sounds",
        "skills": ["SCRIPT"]
      },
      {
        "unit": 3,
        "correct": 0,
        "total": 3,
        "passed": false,
        "title": "First words",
        "skills": ["VOCABULARY", "TRANSLATION"]
      },
      {
        "unit": 4,
        "correct": 3,
        "total": 3,
        "passed": true,
        "title": "Basic sentences",
        "skills": ["SENTENCE", "TRANSLATION"]
      }
    ],
    "recommendedUnit": 3,
    "recommendedUnitTitle": "First words",
    "message": "You are ready for Unit 3 — First words.",
    "chosenUnit": null,
    "rules": [
      "The test has 3 questions for each unit.",
      "A unit is passed with at least 2 correct answers out of 3.",
      "Units are checked in order: you start at the first unit you did not pass.",
      "If you pass every unit, you start at the last unit.",
      "You can always choose to start from Unit 1 instead."
    ]
  }
}
```

Errors: `409 PLACEMENT_INCOMPLETE` (with `details.answered` / `details.total`) · `404 PLACEMENT_NOT_FOUND`.

### 26 · Placement decision — `POST {{baseUrl}}/placement/decide`

```json
{ "testId": "<test.id>", "choice": "recommended" }
```

`choice`: `"recommended"` (start at the recommended unit — earlier lessons are unlocked as `placedOut`) or `"beginning"` (start from Unit 1). **Expected: `200`**:

```json
{
  "testId": "cmuv6sz09000p597d23edkweh",
  "status": "ACCEPTED",
  "chosenUnit": 3,
  "startLessonId": "hi-u3-l1",
  "lessonsUnlocked": 8
}
```

Errors: `409 PLACEMENT_INCOMPLETE` · `409 PLACEMENT_ALREADY_DECIDED` · `400 VALIDATION_ERROR` (e.g. `"choice": "unit7"`).

---

### 27 · Logout — `POST {{baseUrl}}/auth/logout`

- Auth: **Bearer token** · Body: none · **Expected: `200`**

```json
{ "message": "Logged out. Your previous token no longer works." }
```

Then **Get me** again → `401 UNAUTHORIZED` (the token is now invalid). Log in again to get a new one.

---

## 6. Automated version of this guide

```bash
npm run test:api     # 19 learning steps + 18 gamification/placement steps against your database
```

## 7. API troubleshooting

| Symptom                                                            | Cause                                                                  | Fix                                                                                                           |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Postman: "Could not send request / ECONNREFUSED"                   | Backend not running                                                    | `npm run dev` (look for `🚀 Vachan API running at http://localhost:4000`)                                     |
| Backend exits: `JWT_SECRET is required`                            | Phase 2 variable missing                                               | `echo "JWT_SECRET=$(openssl rand -hex 32)" >> backend/.env`                                                   |
| `401 UNAUTHORIZED` on every protected request                      | No/old token                                                           | Run **Login** again; check the collection **Authorization** is `Bearer {{token}}`                             |
| `401` right after restarting the backend                           | You changed `JWT_SECRET` (old tokens are invalid)                      | Log in again                                                                                                  |
| `403 LESSON_LOCKED`                                                | Lessons unlock in order                                                | Finish the previous lesson (run the folders in order)                                                         |
| Postman assertion fails on counts (e.g. `openMistakes` expected 2) | Requests run out of order or a folder was run twice with the same user | Run the whole collection from the top (Register makes a fresh user)                                           |
| `400 INVALID_ANSWER_FORMAT`                                        | Answer shape doesn't match the exercise type                           | See the table in section 9                                                                                    |
| Old content / 3 units / `CHARACTER_SOUND` error                    | Phase 3 migration or seed missing                                      | `npm run db:migrate && npm run db:seed`                                                                       |
| `404 COURSE_NOT_FOUND` / empty `courses`                           | Database not seeded                                                    | `npm run db:seed`                                                                                             |
| `400 VALIDATION_ERROR`                                             | Body doesn't match the rules                                           | Read `error.details` — it names the field                                                                     |
| `400 INVALID_JSON`                                                 | Typo in the raw body                                                   | Body tab → **raw** + **JSON**; check quotes and commas                                                        |
| `500 INTERNAL_SERVER_ERROR`                                        | Bug or DB down                                                         | Read the backend terminal; check `GET /api/health`                                                            |
| Website: CORS error in browser console                             | `CORS_ORIGIN` doesn't match the website address                        | `CORS_ORIGIN=http://localhost:3000` in `backend/.env` (exact, no trailing slash), restart                     |
| Website: "Can't reach the Vachan server"                           | Backend down or wrong `NEXT_PUBLIC_API_URL`                            | Start the backend; `frontend/.env.local` → `NEXT_PUBLIC_API_URL=http://localhost:4000`; restart `npm run dev` |
| Website keeps sending you to /login                                | Cookie blocked or `127.0.0.1` vs `localhost` mix                       | Open the site at **http://localhost:3000** (not 127.0.0.1) so the cookie is sent                              |
| `EADDRINUSE` / "Port 4000 is already in use"                       | Another backend still running                                          | `lsof -i :4000` → `kill <PID>`                                                                                |
