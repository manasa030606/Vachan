// Step 5 of the pipeline: VECTOR STORAGE (PostgreSQL + pgvector).
//
// Chunks live in the KnowledgeChunk table next to the rest of Vachan's data. The `embedding`
// column has the pgvector type vector(384). Prisma can't write that type directly, so the
// vector is written and searched with raw SQL — everything else uses normal Prisma calls.
//
// `<=>` is pgvector's cosine-distance operator: 0 = same direction, 2 = opposite.
// similarity = 1 − distance.
import { Prisma, type PrismaClient } from "../generated/prisma/client.ts";
import { RAG_CONFIG } from "./config.ts";
import type { PreparedChunk } from "./types.ts";

/** [0.1, 0.2] → "[0.1,0.2]" — the text form pgvector accepts. */
export const toVectorLiteral = (vector: number[]) => `[${vector.join(",")}]`;

const toEnum = (value: string) => value.toUpperCase().replace(/-/g, "_");

/** Rows per INSERT statement when saving chunks. */
const INSERT_BATCH = 50;

/** Replaces a document and all of its chunks in one transaction. */
export async function saveDocument(
  prisma: PrismaClient,
  document: {
    id: string;
    languageCode: string;
    title: string;
    source: string;
    reference: string;
    contentHash: string;
    origin: "FILE" | "COURSE" | "ADMIN";
  },
  chunks: PreparedChunk[],
  vectors: number[][],
) {
  const model = RAG_CONFIG.embedding.model;
  const rows = chunks.map(
    (chunk, index) => Prisma.sql`(
      ${chunk.id}, ${chunk.documentId}, ${chunk.languageCode},
      ${toEnum(chunk.level)}::"KnowledgeLevel", ${chunk.topic},
      ${toEnum(chunk.skill)}::"KnowledgeSkill", ${toEnum(chunk.contentType)}::"KnowledgeContentType",
      ${chunk.source}, ${chunk.reference}, ${chunk.heading}, ${chunk.content},
      ${chunk.content.length}, ${chunk.contentHash},
      ${model}, ${toVectorLiteral(vectors[index]!)}::vector, NOW())`,
  );
  // One transaction: search sees either all the old chunks or all the new ones, never a mix
  // or an empty document. The status and body set by admins are not touched.
  // Chunks are inserted INSERT_BATCH rows per statement: a course document has ~200 chunks, and
  // one round trip per row is too slow over the network to a hosted database such as Neon.
  await prisma.$transaction(
    async (tx) => {
      await tx.knowledgeChunk.deleteMany({ where: { documentId: document.id } });
      const indexed = { chunkCount: chunks.length, needsReindex: false, lastIndexError: null };
      await tx.knowledgeDocument.upsert({
        where: { id: document.id },
        create: { ...document, ...indexed },
        update: { ...document, ...indexed, indexedAt: new Date() },
      });
      for (let start = 0; start < rows.length; start += INSERT_BATCH) {
        await tx.$executeRaw`
          INSERT INTO "KnowledgeChunk" (
            "id", "documentId", "languageCode", "level", "topic", "skill", "contentType",
            "source", "reference", "heading", "content", "charCount", "contentHash",
            "embeddingModel", "embedding", "updatedAt")
          VALUES ${Prisma.join(rows.slice(start, start + INSERT_BATCH))}`;
      }
    },
    { timeout: 60_000, maxWait: 10_000 },
  );
}

export type VectorMatch = {
  id: string;
  documentId: string;
  languageCode: string;
  level: string;
  topic: string;
  skill: string;
  contentType: string;
  source: string;
  reference: string;
  heading: string;
  content: string;
  similarity: number;
};

/**
 * Nearest-neighbour search. Language (when known) is a hard WHERE filter, so a Telugu question
 * can never return Hindi chunks. Level and topic are applied afterwards as re-ranking bonuses.
 */
export async function searchSimilar(
  prisma: PrismaClient,
  queryVector: number[],
  options: { languageCode?: string | null; limit: number },
): Promise<VectorMatch[]> {
  const vector = toVectorLiteral(queryVector);
  const languageFilter = options.languageCode
    ? Prisma.sql`AND "languageCode" = ${options.languageCode}`
    : Prisma.empty;

  const rows = await prisma.$queryRaw<Array<VectorMatch & { similarity: number | string }>>`
    SELECT "id", "documentId", "languageCode", "level"::text AS "level", "topic",
           "skill"::text AS "skill", "contentType"::text AS "contentType",
           "source", "reference", "heading", "content",
           1 - ("embedding" <=> ${vector}::vector) AS "similarity"
    FROM "KnowledgeChunk"
    WHERE "embedding" IS NOT NULL
      AND "embeddingModel" = ${RAG_CONFIG.embedding.model}
      ${languageFilter}
    ORDER BY "embedding" <=> ${vector}::vector
    LIMIT ${options.limit}`;

  return rows.map((row) => ({ ...row, similarity: Number(row.similarity) }));
}
