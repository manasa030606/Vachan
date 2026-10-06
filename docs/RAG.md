# Vachan — RAG knowledge base (Phase 5)

Phase 5 builds the **retrieval** half of RAG, on its own and tested:

```
CONTENT ──► CLEANING ──► CHUNKING ──► EMBEDDINGS ──► VECTOR STORAGE ──► RETRIEVAL ──► METADATA FILTERING
 .md notes    NFC,        1 section     multilingual-   PostgreSQL +       question →      language (hard filter)
 + course     markdown    = 1 concept   e5-small        pgvector           vector →        level · topic · exact
 vocabulary   stripped    + metadata    384 numbers     vector(384)        nearest chunks  words (re-ranking)
```

There is **no chatbot UI and no LLM call** in this phase. The AI Tutor (Phase 6) will call the same function (`searchKnowledge`) and may only answer from the chunks it returns.

| Where                                                        | What                                                                                                                        |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `backend/knowledge-base/<lang>/*.md`                         | Curated notes — 10 files × 6 languages ([format](../backend/knowledge-base/README.md))                                      |
| `backend/src/rag/`                                           | The pipeline: `cleaning` → `document-parser` → `chunking` → `embeddings` → `vector-store` → `ranking` → `retrieval.service` |
| `backend/src/rag/cli/`                                       | `rag:index`, `rag:search`, `rag:eval` scripts                                                                               |
| `backend/src/routes/rag.routes.ts`                           | `POST /api/rag/search`, `GET /api/rag/stats`                                                                                |
| `backend/evaluation/retrieval-dataset.json`                  | Evaluation questions; results → `docs/RAG_EVALUATION.md`                                                                    |
| `prisma/migrations/20261007090000_phase5_rag_knowledge_base` | pgvector extension + `KnowledgeDocument` + `KnowledgeChunk` tables                                                          |

---

## 1. Knowledge-base structure

Two **approved** sources (spec §12: "prefer curated/verified learning content"):

1. **Curated notes** — `backend/knowledge-base/{hi,te,ta,ml,kn,bn}/`, the same 10 files for every language:

   | File                | Content type    | Example sections (Telugu)                                      |
   | ------------------- | --------------- | -------------------------------------------------------------- |
   | `alphabet.md`       | `alphabet`      | vowels అచ్చులు, consonants, vowel signs + talakattu, conjuncts |
   | `pronunciation.md`  | `pronunciation` | short vs long vowels, dental vs retroflex, aspiration          |
   | `phrases.md`        | `phrase`        | hello, thank you, how are you, my name is, goodbye, shopping   |
   | `vocabulary.md`     | `vocabulary`    | family, food, numbers 1–10, colours, time words                |
   | `grammar.md`        | `grammar`       | SOV word order, pronouns, case endings, questions, negation    |
   | `verbs.md`          | `verb-form`     | "to be", present/future, continuous, past, polite commands     |
   | `examples.md`       | `example`       | sentences with a word-by-word breakdown                        |
   | `idioms.md`         | `idiom`         | 3–4 common sayings with literal meaning and usage              |
   | `culture.md`        | `culture`       | forms of address, festivals, etiquette, where it is spoken     |
   | `beginner-guide.md` | `explanation`   | how to start, reading romanization, formal vs informal "you"   |

2. **Course content** — the words and letters the lessons already teach (`VocabularyItem` table), indexed as one document per language (`course/te/vocabulary`), so the tutor uses the exact spellings learners see in lessons.

Totals after indexing: **66 documents → 394 chunks** (hi 73 · te 60 · ta 63 · ml 67 · kn 62 · bn 69).
The notes were written for this project (AI-assisted, then checked against the course data and script blocks) — they are a demo-size curated set, not an external textbook; `source` says so on every chunk.

## 2. Setup: pgvector, model, index

### a) Install pgvector (once)

**Homebrew PostgreSQL 16 (your Mac).** Build pgvector from source for your exact PostgreSQL (≈1 minute; works for any version — Homebrew's own `pgvector` package is only built for some PostgreSQL versions). Needs the Xcode command-line tools (`xcode-select --install` if `make` is missing):

```bash
cd /tmp
git clone --branch v0.8.0 https://github.com/pgvector/pgvector.git
cd pgvector
export PG_CONFIG=/opt/homebrew/opt/postgresql@16/bin/pg_config   # Intel Mac: /usr/local/opt/postgresql@16/bin/pg_config
make
make install
brew services restart postgresql@16
```

**Enable it** (creating an extension needs a superuser — on Homebrew that is your Mac user, so run these _without_ `-U vachan`):

```bash
psql -d vachan_dev -c "CREATE EXTENSION IF NOT EXISTS vector;"
psql -d template1  -c "CREATE EXTENSION IF NOT EXISTS vector;"   # so the temporary "shadow" database of `prisma migrate dev` has it too
psql -d vachan_dev -c "SELECT extversion FROM pg_extension WHERE extname = 'vector';"   # expected: 0.8.0
```

| Other setups             | What to do                                                                                                                                                                                                |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Docker (`npm run db:up`) | `docker-compose.yml` now uses `pgvector/pgvector:pg16` (PostgreSQL 16 + pgvector). Recreate it: `npm run db:down && npm run db:up` (⚠️ a new image starts with an empty database → migrate + seed again). |
| Postgres.app             | pgvector is included — just run the `CREATE EXTENSION` lines above.                                                                                                                                       |
| Neon (deployed)          | pgvector is built in; the migration's `CREATE EXTENSION IF NOT EXISTS vector` enables it. Nothing to install.                                                                                             |

### b) Migrate, generate, seed

```bash
cd ~/Desktop/Vachan
npm install                  # adds @huggingface/transformers (runs prisma generate too)
npm run db:migrate           # applies 20261007090000_phase5_rag_knowledge_base
npm run db:seed              # only if your database isn't seeded (the course vocabulary is indexed too)
```

The migration creates: the `vector` extension, enums `KnowledgeLevel` / `KnowledgeContentType` / `KnowledgeSkill`, tables `KnowledgeDocument` and `KnowledgeChunk` (with `embedding vector(384)`), and indexes on `(languageCode, level)`, `(languageCode, topic)`. Tables are created **only** by this migration — never by hand.

### c) The embedding model

Downloaded automatically on the first `rag:index` / search into `backend/.cache/models/` (git-ignored, ~130 MB). You already have it there. No API key is involved.

### d) Build the index and check it

```bash
npm run rag:index -w backend     # ~30 s the first time; afterwards only changed documents are re-embedded
npm run rag:eval  -w backend     # retrieval quality report → docs/RAG_EVALUATION.md
npm run test:rag  -w backend     # API tests for /api/rag
npm run rag:search -w backend -- "How do I say hello in Telugu?"
```

Expected `rag:index` output ends with:

```
✅ Done in 30s — 66 documents, 394 chunks (66 documents embedded, 0 unchanged, 0 removed).
```

Run it again and it says `0 documents embedded, 66 unchanged` (nothing changed → nothing re-embedded). After editing a note, only that file is re-embedded. `-- --force` re-embeds everything.

### e) Environment variables (all optional — `backend/.env`)

| Variable             | Local                           | Deployed                    | Meaning                                                         |
| -------------------- | ------------------------------- | --------------------------- | --------------------------------------------------------------- |
| `RAG_ENABLED`        | unset (= on)                    | unset (= **off**) or `true` | Whether `POST /api/rag/search` may load the model (~550 MB RAM) |
| `RAG_MODEL_DIR`      | unset (`backend/.cache/models`) | unset                       | Where model files are stored                                    |
| `RAG_ALLOW_DOWNLOAD` | unset (`true`)                  | unset                       | `false` = never download, only use local files                  |

No secret is involved: the model is a public file, and nothing here goes into `NEXT_PUBLIC_*`.

## 3. Chunking

- **Rule: one `##` section = one concept = one chunk.** Sections are written self-contained (40–180 words, mention the language), so a retrieved chunk makes sense alone and a concept is never cut in half.
- Sections longer than **1200 characters** are split — at `###` sub-headings first, then between paragraphs — and every part keeps its heading. (No current section needs it: chunks are 80–917 characters.)
- **Cleaning before chunking** (`cleaning.ts`): Unicode **NFC** (the same Malayalam/Tamil letter can be typed as one or two code points), invisible characters removed (ZWJ/ZWNJ kept — they change how Malayalam/Bengali letters are drawn), markdown decoration and comments stripped, whitespace normalised.
- **Stable ids** from the heading's English letters: `te/phrases#hello-namaskaaram`. Ids don't change between runs, so the evaluation set and Phase 6 can point at them.
- **What is embedded** is the chunk plus its context: `Telugu — Telugu greetings and common phrases — Hello — నమస్కారం (namaskaaram)\n<text>`. What is **returned** is the clean text only.

## 4. Embeddings

|                   |                                                                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Model             | `Xenova/multilingual-e5-small` (ONNX export of `intfloat/multilingual-e5-small`), 8-bit quantised, via `@huggingface/transformers`                                                    |
| Output            | 384 numbers per text, mean-pooled and L2-normalised (so cosine similarity = dot product)                                                                                              |
| Languages         | ~100 incl. Hindi, Telugu, Tamil, Malayalam, Kannada, Bengali and English — a question in English finds notes written in English + native script, and native-script questions work too |
| Prefixes          | `passage: …` for chunks, `query: …` for questions (required by e5)                                                                                                                    |
| Cost              | Free, runs inside the backend process, no API key, content never leaves the server                                                                                                    |
| Speed (measured)  | model load ≈ 2.5 s (first request only), then ≈ 20 ms per question; indexing 394 chunks ≈ 30 s                                                                                        |
| Memory (measured) | ≈ 170 MB before → ≈ 550 MB after loading (the 250 000-token multilingual tokenizer alone is ≈ 240 MB of JS heap)                                                                      |

**Why not an API (OpenAI/Gemini)?** It would add a paid key, a network dependency, and send learning content to a third party for no gain at this size. The pipeline only touches the model in `embeddings.ts`, so swapping later is one file + a re-index (`embeddingModel` is stored per chunk, and search only compares vectors from the same model).

## 5. Vector database

**PostgreSQL + pgvector**, inside the existing Vachan database (local) and Neon (deployed): one database, one backup, normal joins with `Language`. No extra service.

```sql
"KnowledgeChunk" (
  id text PK,                    -- te/phrases#hello-namaskaaram
  "documentId" text → KnowledgeDocument,  "languageCode" text → Language(code),
  level "KnowledgeLevel", topic text, skill "KnowledgeSkill", "contentType" "KnowledgeContentType",
  source text, reference text, heading text, content text, "charCount" int, "contentHash" text,
  "embeddingModel" text,
  embedding vector(384)          -- written/read with raw SQL (Prisma calls it Unsupported)
)
```

Search (`vector-store.ts`):

```sql
SELECT id, …, 1 - (embedding <=> $query::vector) AS similarity      -- <=> = cosine distance
FROM "KnowledgeChunk"
WHERE embedding IS NOT NULL AND "embeddingModel" = $model AND "languageCode" = $language
ORDER BY embedding <=> $query::vector
LIMIT 40;
```

**No ANN index (HNSW/IVFFlat) on purpose:** with ~400 rows an exact scan takes about a millisecond and is 100 % accurate. Add one when the knowledge base grows past ~10 000 chunks (as a new migration):
`CREATE INDEX ON "KnowledgeChunk" USING hnsw (embedding vector_cosine_ops);`

## 6. Metadata

Every chunk carries:

| Field         | Values                                                                                                           | From                                   |
| ------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `language`    | `hi te ta ml kn bn`                                                                                              | folder / course language               |
| `level`       | `beginner` · `elementary` · `intermediate`                                                                       | front matter, per-section override     |
| `topic`       | slug, e.g. `greetings`, `vowels`, `pronouns`, `past-tense`, `food` (58 topics; list in `GET /api/rag/stats`)     | front matter / override / course topic |
| `skill`       | `script` `pronunciation` `vocabulary` `grammar` `conversation` `culture`                                         | front matter / override                |
| `contentType` | `alphabet` `pronunciation` `vocabulary` `grammar` `example` `phrase` `verb-form` `idiom` `culture` `explanation` | front matter / override                |
| `source`      | `Vachan curated notes` or `Vachan course content`                                                                | front matter / loader                  |
| `reference`   | `backend/knowledge-base/te/phrases.md#hello-namaskaaram` or `course:te (VocabularyItem table…)`                  | file path + section                    |

Unknown values stop the indexer with the file name (`te/x.md: level "expert" must be one of …`).

## 7. Retrieval

### Priority (spec) and how it is implemented

1. **Correct language** — a **hard filter in SQL**. From `language` in the request; if missing, inferred from the question ("… in **Telugu**" or native script like అమ్మ → Telugu); if still unknown, all languages are searched and the response says so.
2. **Learner level** — re-ranking: same level **+0.03**, easier **+0.015**, harder **−0.03**.
3. **Topic** — re-ranking: requested topic **+0.04**.
4. **Semantic similarity** — the base score (cosine similarity, 0–1).
   Plus **+0.04** when a native-script word from the question appears in the chunk (vocabulary questions).

`score = similarity + bonuses` → sort → top `limit`. The bonuses are small on purpose: they decide between chunks that are about equally relevant but can't lift an unrelated chunk over a relevant one (unit-tested). All numbers: `backend/src/rag/config.ts`.

**`sufficient`:** if the best similarity is below **0.81**, `retrieval.sufficient = false` — the knowledge base doesn't cover the question and the Phase 6 tutor must say so instead of inventing an answer. (e5 similarities sit in a narrow band; with 0.81 all 55 on-topic evaluation questions count as sufficient and 11 of 12 off-topic ones are rejected — see the evaluation report.)

Every search is logged for debugging (spec §12):

```
[rag] "How do I say hello in Telugu?" lang=te level=beginner topic=- → te/phrases#hello-namaskaaram (0.9462), … 19ms
```

### API

`POST /api/rag/search` (login required — Bearer token or the website cookie)

| Body field | Type                                   | Required | Meaning                                              |
| ---------- | -------------------------------------- | -------- | ---------------------------------------------------- |
| `query`    | string, 2–500 chars                    | **yes**  | learner question (English or the target language)    |
| `language` | `hi te ta ml kn bn`                    | no       | hard filter; inferred from the question when missing |
| `level`    | `beginner` `elementary` `intermediate` | no       | learner level (preferred, harder pushed down)        |
| `topic`    | slug                                   | no       | preferred topic                                      |
| `limit`    | 1–20                                   | no (5)   | how many chunks                                      |

Errors: `400 VALIDATION_ERROR` (bad/unknown field), `401` (no login), `503 KNOWLEDGE_BASE_EMPTY` (run `rag:index`), `503 EMBEDDING_MODEL_UNAVAILABLE` (model couldn't load/download), `503 RAG_DISABLED` (`RAG_ENABLED=false`, e.g. the free Render server).

`GET /api/rag/stats` → documents, chunks, chunks without embedding, model, dimensions, counts by language / content type / level, topics, and `searchEnabled`.

### Example (real response, trimmed to 1 of 3 results)

```http
POST http://localhost:4000/api/rag/search
Authorization: Bearer <token>
Content-Type: application/json

{ "query": "How do I say hello in Telugu?", "level": "beginner", "limit": 3 }
```

```json
{
  "query": "How do I say hello in Telugu?",
  "filters": {
    "language": { "code": "te", "source": "named-in-query" },
    "level": "beginner",
    "topic": null
  },
  "retrieval": {
    "model": "Xenova/multilingual-e5-small",
    "candidatesConsidered": 40,
    "minSimilarity": 0.81,
    "bestSimilarity": 0.9162,
    "sufficient": true,
    "tookMs": 19
  },
  "results": [
    {
      "rank": 1,
      "id": "te/phrases#hello-namaskaaram",
      "heading": "Hello — నమస్కారం (namaskaaram)",
      "content": "The usual way to say hello in Telugu is నమస్కారం (namaskaaram), often said with the palms pressed together. …",
      "metadata": {
        "language": "te",
        "level": "beginner",
        "topic": "greetings",
        "skill": "conversation",
        "contentType": "phrase",
        "source": "Vachan curated notes"
      },
      "reference": "backend/knowledge-base/te/phrases.md#hello-namaskaaram",
      "relevance": {
        "similarity": 0.9162,
        "levelMatch": "exact",
        "topicMatch": null,
        "matchedTerms": [],
        "boost": 0.03,
        "score": 0.9462
      }
    }
  ]
}
```

More real results:

| Request                                                                                                                                       | Top 3 (score)                                                                                                                                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `{"query": "What is this Telugu word? అమ్మ"}`                                                                                                 | `te/vocabulary#family-words` (0.958, word matched) · `course/te/vocabulary#course-vocabulary-family` (0.940) · `te/pronunciation#double-consonants-are-held-longer` (0.925 — uses అమ్మ as its example) |
| `{"query": "Explain this beginner grammar concept: why does the verb come at the end of a sentence?", "language": "te", "level": "beginner"}` | `te/grammar#word-order-subject-object-verb` (0.885) · `te/pronunciation#words-end-in-vowels` · `te/beginner-guide#reading-the-romanization`                                                            |
| `{"query": "What is the capital of France?"}`                                                                                                 | best similarity 0.747 → `"sufficient": false`                                                                                                                                                          |

### Postman

Collection folder **12. RAG knowledge base (Phase 5)** (`postman/Vachan.postman_collection.json`): log in first (folder 1), then run the folder. 9 requests, each with tests: stats · hello in Telugu (language inferred) · Telugu word అమ్మ · beginner grammar with level · Tamil topic filter · Hindi intermediate (ने) · out-of-scope → `sufficient: false` · empty query → 400 · `language: "fr"` → 400. The first search after starting the server takes ~3 s (model load).

## 8. Deployment

- **Migration:** runs on Neon automatically with the next Render build (`db:deploy`). Neon has pgvector built in.
- **Search is OFF on the free Render plan by default.** Loading the model needs ≈ 550 MB and Render free has 512 MB; turning it on there would crash the whole API. With `NODE_ENV=production` the default is `RAG_ENABLED=false` → `POST /api/rag/search` answers `503 RAG_DISABLED`, everything else is unaffected (≈ 170 MB).
- **To enable it** later: a server with ≥ 1 GB RAM (e.g. a paid Render instance) + `RAG_ENABLED=true`, and index Neon once from your Mac:
  ```bash
  cd ~/Desktop/Vachan
  export DATABASE_URL='<your Neon connection string>' NODE_ENV=production
  npm run rag:index -w backend
  unset DATABASE_URL NODE_ENV
  ```
  How production retrieval should run (bigger instance vs. a hosted embedding API) is a Phase 6 decision.

## 9. Troubleshooting

| Problem                                                                                 | Why                                                                                                                                                    | Fix                                                                                                                                                              |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Migration fails: `extension "vector" is not available`                                  | pgvector is not installed for this PostgreSQL                                                                                                          | §2a (build for `postgresql@16`), then `npm run db:migrate` again                                                                                                 |
| Migration fails: `permission denied to create extension "vector"`                       | `vachan` is not a superuser                                                                                                                            | Run `psql -d vachan_dev -c "CREATE EXTENSION IF NOT EXISTS vector;"` as your Mac user (and on `template1`), then migrate again                                   |
| `prisma migrate dev` fails in the shadow database with the same errors                  | the temporary database is created from `template1`                                                                                                     | `psql -d template1 -c "CREATE EXTENSION IF NOT EXISTS vector;"`                                                                                                  |
| `make: pg_config: No such file` / wrong version                                         | `PG_CONFIG` not set                                                                                                                                    | `export PG_CONFIG=/opt/homebrew/opt/postgresql@16/bin/pg_config` before `make`                                                                                   |
| A migration is stuck as failed (`P3009`)                                                | an earlier attempt failed half-way                                                                                                                     | Development: `npx prisma migrate resolve --rolled-back 20261007090000_phase5_rag_knowledge_base -w backend` (or `npm run db:reset`), fix pgvector, migrate again |
| `rag:index`: `Languages … are not in the database`                                      | not seeded                                                                                                                                             | `npm run db:seed`                                                                                                                                                |
| `EMBEDDING_MODEL_UNAVAILABLE` / `could not be loaded … fetch failed`                    | first run without internet, or `RAG_ALLOW_DOWNLOAD=false` without files                                                                                | Connect to the internet once, or copy the files into `backend/.cache/models/Xenova/multilingual-e5-small/`                                                       |
| `KNOWLEDGE_BASE_EMPTY` (503)                                                            | nothing indexed (for that language)                                                                                                                    | `npm run rag:index -w backend`                                                                                                                                   |
| `RAG_DISABLED` (503)                                                                    | `RAG_ENABLED=false` or `NODE_ENV=production`                                                                                                           | Expected on Render free; locally remove `RAG_ENABLED=false`                                                                                                      |
| `test:rag` / searches return 503 on your Mac, stats works, the SSL-mode warning appears | your terminal still has `NODE_ENV=production` and the Neon `DATABASE_URL` exported from the deployment steps (shell variables win over `backend/.env`) | `unset NODE_ENV DATABASE_URL RAG_ENABLED`, check with `echo $NODE_ENV $DATABASE_URL` (should print nothing), run again                                           |
| `rag:eval`: `expected chunk ids are not in the index`                                   | a heading was renamed (ids come from headings)                                                                                                         | Update `backend/evaluation/retrieval-dataset.json`, re-run                                                                                                       |
| `rag:index`: `te/x.md: level "…" must be one of …`                                      | invalid metadata in a note                                                                                                                             | Fix the front matter / `<!-- -->` comment                                                                                                                        |
| First search is slow (~3 s)                                                             | model loads on the first request                                                                                                                       | Normal; following searches ≈ 20 ms                                                                                                                               |
| `npm install` is slow / large                                                           | `onnxruntime-node` ships native binaries (~500 MB in `node_modules`)                                                                                   | Normal, once                                                                                                                                                     |
| TypeScript: `knowledgeChunk` does not exist on PrismaClient                             | old Prisma Client                                                                                                                                      | `npm run db:generate -w backend`                                                                                                                                 |

## 10. Inspecting the vectors yourself

`npm run db:studio` shows `KnowledgeDocument` and `KnowledgeChunk` (Prisma Studio hides the `embedding` column because Prisma can't read the vector type). For the vectors use SQL — `psql -d vachan_dev` locally or Neon → SQL Editor:

```sql
-- pgvector installed?
SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';

-- chunks per language, and how many have a vector (expected: hi 73 · te 60 · ta 63 · ml 67 · kn 62 · bn 69, all with a vector)
SELECT "languageCode", count(*) AS chunks, count(embedding) AS with_vector
FROM "KnowledgeChunk" GROUP BY 1 ORDER BY 1;

-- metadata + vector size of a few chunks (dims = 384)
SELECT id, level, topic, "contentType", source, vector_dims(embedding) AS dims, left(content, 50) AS starts_with
FROM "KnowledgeChunk" WHERE "languageCode" = 'te' ORDER BY id LIMIT 10;

-- the first 5 of the 384 numbers of one chunk
SELECT id, (embedding::real[])[1:5] AS first_5_numbers
FROM "KnowledgeChunk" WHERE id = 'te/phrases#hello-namaskaaram';

-- nearest neighbours of a chunk (vector search in pure SQL)
SELECT b.id, round((1 - (a.embedding <=> b.embedding))::numeric, 4) AS similarity
FROM "KnowledgeChunk" a JOIN "KnowledgeChunk" b ON b.id <> a.id
WHERE a.id = 'te/phrases#hello-namaskaaram'
ORDER BY a.embedding <=> b.embedding LIMIT 5;
```

The last query shows _why_ the language filter matters: the nearest neighbours of the Telugu "hello" chunk are the **Kannada, Malayalam, Tamil and Hindi** "hello" chunks (similarity 0.91–0.95) — the model understands meaning across languages, so without the filter a Telugu learner could get a Kannada answer.

## 11. Evaluation

`npm run rag:eval -w backend` runs `backend/evaluation/retrieval-dataset.json` — **55 questions** (40 written with the content + 15 harder paraphrased / native-language questions added after the first run) across all six languages and **12 out-of-scope questions** — twice: plain vector search vs. Vachan's filtered + re-ranked search. Results are written to [RAG_EVALUATION.md](RAG_EVALUATION.md). The command exits with an error if a threshold is missed.

Latest run: hit@1 **94.5 %** (vector only 74.5 %), hit@3 **98.2 %** (85.5 %), MRR **0.964** (0.81), language precision **100 %** (63.3 %), out-of-scope rejected **91.7 %**. Known misses are listed in the report (e.g. "How should I talk politely to my grandmother?" returns the polite "how are you" chunk instead of the formal/informal "you" note).
