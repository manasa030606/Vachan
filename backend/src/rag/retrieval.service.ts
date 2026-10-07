// Step 6–7 of the pipeline: RETRIEVAL + METADATA FILTERING.
//
//   question ──embedQuery──► vector ──pgvector (language filter)──► 40 nearest chunks
//            ──rankCandidates (level, topic, exact words)──► top N + relevance details
//
// No LLM is called here. The AI tutor calls searchKnowledge() and builds its prompt only from
// the returned chunks.
import { HttpError } from "../lib/http-error.ts";
import { prisma } from "../lib/prisma.ts";
import { RAG_CONFIG, type KnowledgeLevelName } from "./config.ts";
import { embedQuery, EmbeddingModelError } from "./embeddings.ts";
import { inferLanguage, nativeTerms, type LanguageGuess } from "./language-detect.ts";
import { rankCandidates } from "./ranking.ts";
import type { LanguageCode } from "./types.ts";
import { searchSimilar } from "./vector-store.ts";

export type SearchRequest = {
  query: string;
  language?: LanguageCode;
  level?: KnowledgeLevelName;
  topic?: string;
  limit?: number;
  /** Turn off metadata re-ranking (used by the evaluation to compare with plain vector search). */
  vectorOnly?: boolean;
};

const fromEnum = (value: string) => value.toLowerCase().replace(/_/g, "-");

/** Explains where the language filter came from (shown in the response for debugging). */
function describeLanguageSource(request: SearchRequest, guess: LanguageGuess | null): string {
  if (request.vectorOnly) return "ignored (vector-only)";
  if (request.language) return "request";
  return guess?.reason ?? "not-detected (all languages searched)";
}

export async function searchKnowledge(request: SearchRequest) {
  const started = performance.now();
  const limit = Math.min(
    request.limit ?? RAG_CONFIG.retrieval.defaultLimit,
    RAG_CONFIG.retrieval.maxLimit,
  );

  // 1. Language: given by the caller, else inferred from the question, else all languages.
  const guess = request.language ? null : inferLanguage(request.query);
  const languageCode = request.vectorOnly ? null : (request.language ?? guess?.code ?? null);
  const languageSource = describeLanguageSource(request, guess);

  const indexed = await prisma.knowledgeChunk.count({
    where: languageCode ? { languageCode } : {},
  });
  if (indexed === 0) {
    throw new HttpError(
      503,
      "KNOWLEDGE_BASE_EMPTY",
      "The knowledge base has not been indexed yet. Run: npm run rag:index -w backend",
    );
  }

  // 2. Embed the question.
  let queryVector: number[];
  try {
    queryVector = await embedQuery(request.query);
  } catch (error) {
    if (error instanceof EmbeddingModelError) {
      throw new HttpError(503, "EMBEDDING_MODEL_UNAVAILABLE", error.message);
    }
    throw error;
  }

  // 3. Vector search (language is a hard filter).
  const candidates = await searchSimilar(prisma, queryVector, {
    languageCode,
    limit: request.vectorOnly ? limit : RAG_CONFIG.retrieval.candidatePool,
  });

  // 4. Re-rank with metadata (level, topic, exact native-script words).
  const ranked = request.vectorOnly
    ? rankCandidates(candidates, { terms: [] })
    : rankCandidates(candidates, {
        level: request.level,
        topic: request.topic,
        terms: nativeTerms(request.query),
      });
  const top = ranked.slice(0, limit);

  // 5. Is the best match close enough to answer from? (The tutor must not answer otherwise.)
  const bestSimilarity = Math.max(0, ...top.map((chunk) => chunk.relevance.similarity));
  const sufficient = bestSimilarity >= RAG_CONFIG.retrieval.minSimilarity;
  const tookMs = Math.round(performance.now() - started);

  const results = top.map((chunk, index) => ({
    rank: index + 1,
    id: chunk.id,
    heading: chunk.heading,
    content: chunk.content,
    metadata: {
      language: chunk.languageCode,
      level: fromEnum(chunk.level),
      topic: chunk.topic,
      skill: fromEnum(chunk.skill),
      contentType: fromEnum(chunk.contentType),
      source: chunk.source,
    },
    reference: chunk.reference,
    relevance: chunk.relevance,
  }));

  // Log the top results so retrieval problems are easy to debug.
  console.info(
    `[rag] "${request.query.slice(0, 80)}" lang=${languageCode ?? "*"} level=${request.level ?? "-"} ` +
      `topic=${request.topic ?? "-"} → ${results
        .slice(0, 3)
        .map((r) => `${r.id} (${r.relevance.score})`)
        .join(", ")} ${sufficient ? "" : "[insufficient] "}${tookMs}ms`,
  );

  return {
    query: request.query,
    filters: {
      language: { code: languageCode, source: languageSource },
      level: request.level ?? null,
      topic: request.topic ?? null,
    },
    retrieval: {
      model: RAG_CONFIG.embedding.model,
      candidatesConsidered: candidates.length,
      minSimilarity: RAG_CONFIG.retrieval.minSimilarity,
      bestSimilarity: Math.round(bestSimilarity * 10_000) / 10_000,
      sufficient,
      tookMs,
    },
    results,
  };
}

export type SearchResponse = Awaited<ReturnType<typeof searchKnowledge>>;

/** Counts for GET /api/rag/stats: what is in the knowledge base. */
export async function getKnowledgeStats() {
  const [documents, byLanguage, byType, byLevel, topics, missingEmbeddings] = await Promise.all([
    prisma.knowledgeDocument.count(),
    prisma.knowledgeChunk.groupBy({
      by: ["languageCode"],
      _count: { _all: true },
      orderBy: { languageCode: "asc" },
    }),
    prisma.knowledgeChunk.groupBy({
      by: ["contentType"],
      _count: { _all: true },
      orderBy: { contentType: "asc" },
    }),
    prisma.knowledgeChunk.groupBy({
      by: ["level"],
      _count: { _all: true },
      orderBy: { level: "asc" },
    }),
    prisma.knowledgeChunk.groupBy({
      by: ["topic"],
      _count: { _all: true },
      orderBy: { topic: "asc" },
    }),
    prisma.$queryRaw<
      [{ count: bigint }]
    >`SELECT COUNT(*) AS count FROM "KnowledgeChunk" WHERE "embedding" IS NULL`,
  ]);
  const chunks = byLanguage.reduce((sum, row) => sum + row._count._all, 0);
  return {
    documents,
    chunks,
    chunksWithoutEmbedding: Number(missingEmbeddings[0].count),
    embeddingModel: RAG_CONFIG.embedding.model,
    dimensions: RAG_CONFIG.embedding.dimensions,
    byLanguage: Object.fromEntries(byLanguage.map((row) => [row.languageCode, row._count._all])),
    byContentType: Object.fromEntries(
      byType.map((row) => [fromEnum(row.contentType), row._count._all]),
    ),
    byLevel: Object.fromEntries(byLevel.map((row) => [fromEnum(row.level), row._count._all])),
    topics: Object.fromEntries(topics.map((row) => [row.topic, row._count._all])),
  };
}
