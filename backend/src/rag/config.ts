// Every number the RAG pipeline uses lives here, so it can be explained and tuned in one place.
import { fileURLToPath } from "node:url";

// Paths are relative to this file: src/rag/ (tsx) and dist/rag/ (built) are both two levels
// below backend/, so "../../" is always the backend folder.
const fromBackend = (path: string) => fileURLToPath(new URL(`../../${path}`, import.meta.url));

export const RAG_PATHS = {
  /** Curated markdown notes: backend/knowledge-base/<language>/<file>.md */
  knowledgeBase: fromBackend("knowledge-base/"),
  /** Retrieval evaluation questions + generated results */
  evaluation: fromBackend("evaluation/"),
  /** Where the embedding model files are downloaded/cached (git-ignored) */
  defaultModelDir: fromBackend(".cache/models/"),
};

export const RAG_CONFIG = {
  embedding: {
    /**
     * multilingual-e5-small: a small (≈118 MB quantised) sentence-embedding model trained on
     * ~100 languages, including all six Vachan languages and English. Runs inside Node with
     * ONNX Runtime — no API key, no paid service, content never leaves the server.
     */
    model: "Xenova/multilingual-e5-small",
    /** Length of every vector. Must match `vector(384)` in schema.prisma. */
    dimensions: 384,
    /** 8-bit quantised weights: ~4× smaller and faster, with almost the same quality. */
    dtype: "q8" as const,
    /** e5 models expect these prefixes (see the model card). */
    queryPrefix: "query: ",
    passagePrefix: "passage: ",
    batchSize: 16,
  },

  chunking: {
    /** A section longer than this is split (at ### headings, then at paragraphs). */
    maxChars: 1200,
  },

  retrieval: {
    defaultLimit: 5,
    maxLimit: 20,
    /** How many nearest neighbours to fetch from pgvector before re-ranking with metadata. */
    candidatePool: 40,
    /**
     * Below this cosine similarity the best match is treated as "not about this question":
     * the response says `sufficient: false` and the tutor (Phase 6) must not answer from it.
     * Calibrated on the evaluation set (docs/RAG_EVALUATION.md): the weakest on-topic question scored
     * 0.813, most off-topic questions 0.74–0.80. e5 similarities sit in a narrow band, so this is a
     * first safety net only — the Phase 6 prompt must also refuse when the chunks don't answer.
     */
    minSimilarity: 0.81,
    /**
     * Re-ranking bonuses added to the similarity (priority: language → level → topic → similarity).
     * Language is not a bonus: it is a hard filter.
     */
    boosts: {
      levelExact: 0.03, // chunk written for the learner's level
      levelBelow: 0.015, // easier chunk — still fine for the learner
      levelAbove: -0.03, // harder than the learner's level
      topicMatch: 0.04, // the requested topic
      termMatch: 0.04, // the question contains a native-script word that appears in the chunk
    },
  },
} as const;

export const KNOWLEDGE_LEVELS = ["beginner", "elementary", "intermediate"] as const;
export type KnowledgeLevelName = (typeof KNOWLEDGE_LEVELS)[number];
