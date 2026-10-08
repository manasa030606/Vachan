# API

REST API with JSON. Base URL: `http://localhost:4000/api` (local) or `https://<your-app>.vercel.app/api` (deployed).

## Authentication

- `POST /auth/register` or `POST /auth/login` returns a token and also sets an httpOnly cookie.
- The website uses the cookie automatically. Postman uses `Authorization: Bearer <token>`.
- `POST /auth/logout` makes every older token invalid.

## Errors

Every error has the same shape:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "…", "details": [] } }
```

| Status | Meaning                                           |
| ------ | ------------------------------------------------- |
| 400    | Invalid input (details list the fields)           |
| 401    | Not logged in                                     |
| 403    | Not allowed (for example, not an admin)           |
| 404    | Not found                                         |
| 409    | Conflict (for example, email already registered)  |
| 429    | Too many requests                                 |
| 503    | A service is not available (database, AI, search) |

## Endpoints

### Account

| Method | Path             | Description                           |
| ------ | ---------------- | ------------------------------------- |
| GET    | `/health`        | Server and database status (no login) |
| POST   | `/auth/register` | Create an account                     |
| POST   | `/auth/login`    | Log in                                |
| POST   | `/auth/logout`   | Log out                               |
| GET    | `/me`            | Current user and profile              |
| PATCH  | `/me`            | Update profile and settings           |

### Learning

| Method | Path                       | Description                                  |
| ------ | -------------------------- | -------------------------------------------- |
| GET    | `/languages`               | Available languages                          |
| GET    | `/courses?languageCode=te` | Courses                                      |
| GET    | `/courses/:id`             | Course with units, lessons and lesson status |
| GET    | `/lessons/:id`             | One lesson (without answers)                 |
| POST   | `/lessons/:id/start`       | Start or resume a lesson                     |
| POST   | `/exercises/:id/attempt`   | Submit an answer → result, explanation, XP   |
| GET    | `/progress`                | Overall progress                             |
| GET    | `/progress/:lessonId`      | Progress in one lesson                       |
| GET    | `/review?languageCode=te`  | Open mistakes and words learned              |
| GET    | `/review/attempts`         | Every wrong answer                           |
| GET    | `/review/session`          | Mistakes as a practice session               |

### Placement and gamification

| Method | Path                         | Description                                |
| ------ | ---------------------------- | ------------------------------------------ |
| POST   | `/placement/start`           | Start a placement test                     |
| POST   | `/placement/answer`          | Answer one question                        |
| GET    | `/placement/result?testId=…` | Score per unit and recommended unit        |
| POST   | `/placement/decide`          | Start at the recommended unit or at Unit 1 |
| GET    | `/stats`                     | XP, level, streak, hearts, daily goal      |
| GET    | `/streak`                    | Current and longest streak, last 7 days    |
| GET    | `/achievements`              | Badges                                     |
| GET    | `/recommendations`           | Practice suggestions                       |

### AI tutor and knowledge base

| Method       | Path                    | Description                             |
| ------------ | ----------------------- | --------------------------------------- |
| POST         | `/rag/search`           | Search the knowledge base               |
| GET          | `/rag/stats`            | What is indexed                         |
| POST         | `/ai/tutor`             | Ask the tutor → answer with sources     |
| GET          | `/ai/tutor/context`     | Learner context and suggested questions |
| GET          | `/ai/conversations`     | My tutor chats                          |
| GET / DELETE | `/ai/conversations/:id` | One chat / delete it                    |

### Speech and role-play

| Method       | Path                             | Description                                |
| ------------ | -------------------------------- | ------------------------------------------ |
| GET          | `/speech/status`                 | Which speech features are available        |
| GET          | `/speech/tts?text=…&language=te` | Audio of a phrase (WAV)                    |
| POST         | `/speech/transcribe`             | Upload a WAV → transcript                  |
| POST         | `/speech/evaluate`               | Upload a WAV for a phrase → feedback       |
| GET          | `/speech/phrases`                | Phrases to practise                        |
| GET          | `/speech/attempts`               | My speaking attempts                       |
| GET          | `/speech/listening`              | A listening quiz                           |
| POST         | `/speech/listening/answer`       | Check a listening answer                   |
| GET          | `/ai/conversation/scenarios`     | The six role-play scenarios                |
| POST         | `/ai/conversation`               | Start a role-play                          |
| GET          | `/ai/conversation`               | My role-plays                              |
| GET / DELETE | `/ai/conversation/:id`           | One role-play / delete it                  |
| POST         | `/ai/conversation/:id/reply`     | Send a reply → partner's answer + feedback |
| POST         | `/ai/conversation/:id/end`       | End → summary                              |

### Admin (ADMIN role only)

| Method                      | Path                                               | Description                                        |
| --------------------------- | -------------------------------------------------- | -------------------------------------------------- |
| GET                         | `/admin/analytics?days=30`                         | Learning analytics (totals only, no personal data) |
| GET / POST / PATCH          | `/admin/languages`                                 | List, create, edit languages                       |
| GET                         | `/admin/content?language=te`                       | Courses → units → lessons                          |
| POST / PATCH / DELETE       | `/admin/courses`, `/admin/units`, `/admin/lessons` | Create, edit, delete                               |
| POST                        | `/admin/{courses,units,lessons}/:id/publish`       | Publish or unpublish                               |
| POST                        | `/admin/{units,lessons,exercises}/:id/move`        | Change the order                                   |
| GET                         | `/admin/lessons/:id`                               | Lesson with exercises and answers                  |
| POST / PUT / DELETE         | `/admin/exercises`                                 | Create, replace, delete exercises                  |
| GET / POST / PATCH / DELETE | `/admin/vocabulary`                                | Manage vocabulary                                  |
| GET / POST / PATCH / DELETE | `/admin/knowledge`                                 | Manage knowledge-base notes                        |
| POST                        | `/admin/knowledge/:id/publish`                     | Publish (index) or unpublish a note                |
| POST                        | `/admin/knowledge/:id/reindex`                     | Re-index one note                                  |
| POST                        | `/admin/knowledge-reindex`                         | Re-index everything that changed                   |
| GET                         | `/admin/audit-log`                                 | Latest admin changes                               |

## Testing with Postman

1. In Postman choose **Import** and select `postman/Vachan.postman_collection.json` and
   `postman/Vachan.local.postman_environment.json`. Select the "Vachan — Local" environment.
2. Start the backend (`npm run dev`).
3. Run **0. Health**, then **1. Auth → Register**. A new account is created and its token is saved
   automatically, so every later request is logged in.
4. Run the whole collection with **Run collection**. The folders follow the learner's journey.
5. For the admin folder, grant an account (`npm run admin:grant -w backend -- you@example.com`) and
   set the collection variables `adminEmail` and `adminPassword`. If they are empty, that folder is skipped.
6. Speech requests upload files from `postman/audio/`. Set Postman's working directory to the
   `postman` folder (Settings → General).

From the command line:

```bash
npx newman run postman/Vachan.postman_collection.json \
  -e postman/Vachan.local.postman_environment.json --working-dir postman
```

Result of the final run: 158 requests, 369 checks, 0 failures.
