# AI features

Vachan uses AI in four places: the knowledge-base search (RAG), the AI tutor, speaking practice and
role-play conversations. All AI calls happen on the backend; API keys never reach the browser.

## 1. RAG knowledge base

**Retrieval-augmented generation (RAG)** means the AI is first given relevant notes from our own
knowledge base, and must answer from those notes instead of from its general memory.

### Indexing (`npm run rag:index`)

```
notes ─► clean ─► split into chunks ─► embed ─► store in PostgreSQL (pgvector)
```

1. **Sources**:
   - curated markdown notes in `backend/knowledge-base/<language>/` — 23 files per language:
     alphabet, pronunciation, beginner guide, vocabulary, phrases, examples, grammar, verbs,
     conversation, idioms, culture, sentence patterns, questions, requests, emotions, food, travel,
     shopping, college, numbers & time, everyday life, common mistakes, and the course dialogues
     (`dialogues.md`, generated from the course with `npm run content:dialogues -w backend`);
   - the course itself (from the database): every word and phrase as its own section with its usage
     notes and the lesson that teaches it, plus word lists per topic;
   - notes written in the admin dashboard.

   Phrase sections end with an "Also asked as" line (other ways a learner might ask the same thing),
   so "How can I tell someone I love them?" finds the "I love you" note.

2. **Clean**: Unicode normalisation and metadata (language, level, topic, type, skill, source).
3. **Chunk**: every `## ` section is one chunk — one concept per chunk. Long sections are split.
4. **Embed**: each chunk becomes 384 numbers using `multilingual-e5-small`, a small model that runs
   inside Node. It is free, supports all six scripts, and the text never leaves the server.
5. **Store**: `KnowledgeChunk.embedding` is a `vector(384)` column (pgvector). About 5,300 chunks (≈880 per language).

Unchanged documents are skipped (content hash), so re-indexing is fast.

### Search

```
question ─► embed ─► cosine search, filtered by language ─► re-rank ─► good enough? ─► top 5 chunks
```

- **Language is a hard filter** — a Telugu question never gets Hindi notes.
- **Re-ranking** adds small bonuses: right level (+0.03), requested topic (+0.04), a native word from
  the question that appears in the chunk (+0.04), and a written explanation over a one-line course
  entry (+0.015).
- **"Good enough?"** — if the best similarity is below 0.83, the result is marked
  `sufficient: false` and the tutor will not answer from it. The threshold was measured, not
  guessed: with the larger knowledge base off-topic questions found closer near-misses (up to
  0.829), while beginner questions score 0.83–0.95. 0.83 rejects every off-topic question in the
  evaluation set and keeps all on-topic ones.

### Quality

Measured with 151 questions in 6 languages (including 16 typical beginner questions per language:
hello, I love you, I miss you, I am hungry / thirsty, where are you going, what are you doing,
I don't understand, please repeat, how much, introducing yourself, a word's meaning, another
example, formal vs casual, pronunciation, two words for "no") plus 20 off-topic questions
(`npm run rag:eval`):

| Metric                         | Result |
| ------------------------------ | ------ |
| Correct chunk in top 3 (hit@3) | 100 %  |
| Mean reciprocal rank (MRR@5)   | 94 %   |
| On-topic questions answerable  | 100 %  |
| Off-topic questions rejected   | 95 %   |

Full report: [evaluation/RAG.md](evaluation/RAG.md).

## 2. AI tutor

```
question ─► safety check ─► learner context ─► RAG search ─► enough evidence?
                                                    no  → "Not in my notes" (no AI call)
                                                    yes → prompt with notes ─► LLM ─► grounding check ─► answer + sources
```

1. **Safety check** — prompt-injection attempts ("ignore previous instructions…") are refused
   before any search or AI call.
2. **Context** — language, level (from the self-assessment), current unit and lesson, and the last
   exercise if the learner asked "why was my answer wrong?".
3. **RAG search** — as above.
4. **Prompt** — the retrieved notes and the question; the model must answer only from the notes and
   reply in JSON.
5. **Grounding check** — cited sources must be among the retrieved notes; otherwise the answer is
   replaced.
6. **Save** — every answer is stored with its sources (`AIConversation`, `AIMessage`).

**Providers:** Google Gemini (default, free tier) or Groq, called with plain `fetch`. A fallback
model can be set for when the free quota runs out. An offline "mock" provider is used in tests.

**Limits:** 6 questions per minute and 100 per day per learner.

Evaluation with the real model (`npm run tutor:eval`): correct status 100 %, grounded answers
100 %, relevant retrieval 91.7 %. Report: [evaluation/TUTOR.md](evaluation/TUTOR.md).

## 3. Speaking practice

| Part       | How it works                                                                                             |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| Listen     | Text-to-speech (Gemini). Each phrase is generated once and cached in `AudioClip`. Speeds 1×, 0.75×, 0.5× |
| Record     | The browser records the microphone and converts it to a WAV file                                         |
| Check      | The backend checks the audio (length, silence, volume) before any AI call                                |
| Transcribe | Speech-to-text with Gemini (or Groq Whisper)                                                             |
| Feedback   | Three separate parts, see below                                                                          |

1. **Content match** — compares the transcript with the expected phrase, word by word. Verdict:
   match, close, partial or different.
2. **Pronunciation notes** — short AI notes. Experimental, not a real pronunciation score.
3. **Fluency** — based on timing only: pauses and speaking speed.

Recordings are processed in memory and never stored; only the transcript and scores are saved.

## 4. Role-play conversations

Six scenarios: introductions, restaurant, shopping, travel, asking for directions, everyday chat.

- The AI plays a partner (for example a waiter) at the learner's level.
- Its replies use the course vocabulary and the matching knowledge-base notes.
- The learner replies by typing or speaking and gets gentle corrections.
- At the end there is a summary with what went well and what to practise.

## Running without an API key

Set `LLM_PROVIDER=mock`, `STT_PROVIDER=mock` and `TTS_PROVIDER=mock`. The app keeps working with
predictable fake answers and shows a "test mode" notice.

## On the free deployed server

Render's free plan has 512 MB of memory, which is not enough for the embedding model. So
knowledge-base search and the AI tutor are switched off there (`RAG_ENABLED=false`). Speech and
role-play still work. Everything works locally, or on a server with at least 1 GB of memory.
