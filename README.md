# Vachan

Vachan is a web app for learning Indian languages — Hindi, Telugu, Tamil, Malayalam, Kannada and
Bengali — from English. Learners follow short lessons, earn XP and streaks, practise speaking, and
can ask an AI tutor that answers only from Vachan's own notes (retrieval-augmented generation).

Built as a final-year BTech CS-AI capstone project.

**Live demo:** https://vachan-eta.vercel.app

## Features

- **Lessons** — 16 lessons per language, from the alphabet to simple sentences, with 7 exercise types. Answers are checked on the server.
- **Placement test** — 12 questions that recommend where to start.
- **Gamification** — XP, levels, daily goal, streaks, hearts and badges.
- **Review** — every mistake is saved and can be practised again.
- **AI tutor** — answers questions using a RAG knowledge base and shows its sources.
- **Speaking practice** — listen to phrases, record yourself, and get feedback from speech-to-text.
- **Role-play** — short AI conversations in everyday situations (restaurant, shopping, travel…).
- **Admin dashboard** — manage all content and the knowledge base without touching code, plus learning analytics.

## Tech stack

| Part     | Technology                                           |
| -------- | ---------------------------------------------------- |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS       |
| Backend  | Node.js, Express 5, TypeScript, Zod                  |
| Database | PostgreSQL 16 with pgvector, Prisma ORM              |
| AI       | Google Gemini (or Groq), local embedding model (e5)  |
| Testing  | Node test runner, Postman/Newman, Playwright         |
| Hosting  | Vercel (frontend), Render (backend), Neon (database) |

## Project structure

```
Vachan/
├── frontend/        Next.js app (learner pages + /admin)
├── backend/         Express API
│   ├── prisma/          database schema, migrations, seed data
│   ├── knowledge-base/  notes used by the AI tutor (one folder per language)
│   └── src/
│       ├── routes/      HTTP endpoints
│       ├── services/    business logic
│       ├── rag/         chunking, embeddings, vector search
│       ├── ai/          AI tutor and role-play
│       └── speech/      speech-to-text, text-to-speech, feedback
├── e2e/             browser end-to-end test
├── postman/         API collection
└── docs/            documentation
```

## Getting started

You need Node.js 22, npm and PostgreSQL 16 with the pgvector extension.

```bash
npm install
cp backend/.env.example backend/.env           # then set DATABASE_URL and JWT_SECRET
cp frontend/.env.example frontend/.env.local
npm run db:migrate                             # create the tables
npm run db:seed                                # load the courses
npm run rag:index -w backend                   # build the AI tutor's knowledge base
npm run dev                                    # http://localhost:3000
```

Full steps, including the AI key and troubleshooting: [docs/SETUP.md](docs/SETUP.md).

## Common commands

| Command                                     | What it does                                  |
| ------------------------------------------- | --------------------------------------------- |
| `npm run dev`                               | Run the backend and frontend together         |
| `npm run check`                             | Format check, typecheck, lint, tests, build   |
| `npm run test:all -w backend`               | All backend integration tests                 |
| `npm run db:studio`                         | Browse the database                           |
| `npm run admin:grant -w backend -- <email>` | Give an account access to the admin dashboard |

## Documentation

| Document                                   | Contents                                          |
| ------------------------------------------ | ------------------------------------------------- |
| [Setup](docs/SETUP.md)                     | Local installation and troubleshooting            |
| [Architecture](docs/ARCHITECTURE.md)       | How the system is built                           |
| [Database](docs/DATABASE.md)               | Tables, migrations, seed data, backups            |
| [Learning engine](docs/LEARNING.md)        | Lessons, answer checking, placement, gamification |
| [AI features](docs/AI.md)                  | RAG, AI tutor, speech and role-play               |
| [API](docs/API.md)                         | Endpoints and Postman testing                     |
| [Admin dashboard](docs/ADMIN.md)           | Managing content and the knowledge base           |
| [Testing](docs/TESTING.md)                 | Test suites and results                           |
| [Security & performance](docs/SECURITY.md) | Security review and performance review            |
| [Deployment](docs/DEPLOYMENT.md)           | Vercel + Render + Neon, or Docker                 |

## Author

Manasa — BTech CS-AI, Rishihood University.
