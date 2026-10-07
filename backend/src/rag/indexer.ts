// Runs the whole ingestion pipeline:
//   content → cleaning → chunking → embeddings → vector storage
//
// Re-indexing is safe:
//   - each document has a hash of its chunks; unchanged documents are skipped (cheap re-runs)
//   - a document's chunks are replaced in one transaction, so search never sees a half-indexed one
//   - DRAFT documents are never indexed (their chunks are removed)
//   - deleted files are removed, but admin documents are not (their text lives in the database)
//   - only one indexing job runs at a time per server process (withIndexLock)
import type { PrismaClient } from "../generated/prisma/client.ts";
import { chunkDocument, sha256 } from "./chunking.ts";
import { RAG_CONFIG } from "./config.ts";
import { loadAdminDocuments, loadCourseDocuments, loadKnowledgeFiles } from "./content-loader.ts";
import { embedPassages } from "./embeddings.ts";
import type { SourceDocument } from "./types.ts";
import { saveDocument } from "./vector-store.ts";

export type IndexReport = {
  documents: number;
  embedded: string[];
  skipped: string[];
  removed: string[];
  drafts: string[];
  chunks: number;
  chunksEmbedded: number;
  seconds: number;
};

/** Where a document came from, based on its id prefix. */
function originOf(id: string): "FILE" | "COURSE" | "ADMIN" {
  if (id.startsWith("course/")) return "COURSE";
  if (id.startsWith("admin/")) return "ADMIN";
  return "FILE";
}

// One job at a time

let running: Promise<unknown> | null = null;

export class IndexBusyError extends Error {
  constructor() {
    super("Another indexing job is running — try again when it has finished.");
    this.name = "IndexBusyError";
  }
}

/** Runs `job` unless another indexing job is already running in this process. */
export async function withIndexLock<T>(job: () => Promise<T>): Promise<T> {
  if (running) throw new IndexBusyError();
  const promise = job();
  running = promise;
  try {
    return await promise;
  } finally {
    running = null;
  }
}

export const isIndexing = () => running !== null;

// Preparing documents

/** Chunks a document and computes one hash over all its chunks (and the model name). */
export function prepare(document: SourceDocument) {
  const chunks = chunkDocument(document);
  const contentHash = sha256(
    JSON.stringify([
      RAG_CONFIG.embedding.model,
      chunks.map((chunk) => [chunk.id, chunk.contentHash]),
    ]),
  );
  return { document, chunks, contentHash };
}

async function embedAndSave(prisma: PrismaClient, item: ReturnType<typeof prepare>) {
  const vectors = await embedPassages(item.chunks.map((chunk) => chunk.embeddingText));
  await saveDocument(
    prisma,
    {
      id: item.document.id,
      languageCode: item.document.languageCode,
      title: item.document.title,
      source: item.document.source,
      reference: item.document.reference,
      contentHash: item.contentHash,
      origin: originOf(item.document.id),
    },
    item.chunks,
    vectors,
  );
}

/** Removes the chunks of a draft document (keeps the document row and its text). */
export async function removeChunks(prisma: PrismaClient, documentId: string) {
  await prisma.$transaction([
    prisma.knowledgeChunk.deleteMany({ where: { documentId } }),
    prisma.knowledgeDocument.update({
      where: { id: documentId },
      data: { chunkCount: 0, contentHash: "" },
    }),
  ]);
}

// Full run (npm run rag:index)

export async function indexKnowledgeBase(
  prisma: PrismaClient,
  options: { force?: boolean; log?: (line: string) => void } = {},
): Promise<IndexReport> {
  return withIndexLock(async () => {
    const log = options.log ?? (() => {});
    const started = performance.now();

    // 1. Collect content.
    const sources: SourceDocument[] = [
      ...(await loadKnowledgeFiles()),
      ...(await loadCourseDocuments(prisma)),
      ...(await loadAdminDocuments(prisma)),
    ];
    const languages = new Set(
      (await prisma.language.findMany({ select: { code: true } })).map((l) => l.code),
    );
    const missing = [...new Set(sources.map((doc) => doc.languageCode))].filter(
      (code) => !languages.has(code),
    );
    if (missing.length > 0) {
      throw new Error(
        `Languages ${missing.join(", ")} are not in the database. Run: npm run db:seed -w backend`,
      );
    }

    // 2–3. Clean + chunk.
    const prepared = sources.map(prepare);
    const totalChunks = prepared.reduce((sum, item) => sum + item.chunks.length, 0);
    log(`Found ${prepared.length} documents → ${totalChunks} chunks`);

    const existing = new Map(
      (
        await prisma.knowledgeDocument.findMany({
          select: { id: true, contentHash: true, status: true, origin: true, chunkCount: true },
        })
      ).map((doc) => [doc.id, doc]),
    );

    const report: IndexReport = {
      documents: prepared.length,
      embedded: [],
      skipped: [],
      removed: [],
      drafts: [],
      chunks: totalChunks,
      chunksEmbedded: 0,
      seconds: 0,
    };

    // 4–5. Embed + store (only what changed; never drafts).
    for (const item of prepared) {
      const row = existing.get(item.document.id);
      if (row?.status === "DRAFT") {
        if (row.chunkCount > 0) await removeChunks(prisma, item.document.id);
        report.drafts.push(item.document.id);
        continue;
      }
      if (!options.force && row?.contentHash === item.contentHash) {
        report.skipped.push(item.document.id);
        continue;
      }
      await embedAndSave(prisma, item);
      report.embedded.push(item.document.id);
      report.chunksEmbedded += item.chunks.length;
      log(
        `  ✓ ${item.document.id.padEnd(26)} ${String(item.chunks.length).padStart(2)} chunks embedded`,
      );
    }

    // Remove file/course documents that no longer exist (admin documents live in the database).
    const current = new Set(prepared.map((item) => item.document.id));
    const stale = [...existing.values()]
      .filter((doc) => doc.origin !== "ADMIN" && !current.has(doc.id))
      .map((doc) => doc.id);
    if (stale.length > 0) {
      await prisma.knowledgeDocument.deleteMany({ where: { id: { in: stale } } }); // chunks cascade
      report.removed = stale;
    }

    report.seconds = Math.round((performance.now() - started) / 100) / 10;
    return report;
  });
}

/**
 * Re-indexes ONE document (admin dashboard). The old chunks stay searchable until the new
 * ones are saved in a single transaction; if anything fails, the error is stored on the
 * document and the old chunks are kept.
 */
export async function indexOneDocument(prisma: PrismaClient, source: SourceDocument) {
  return withIndexLock(async () => {
    const item = prepare(source);
    try {
      await embedAndSave(prisma, item);
    } catch (error) {
      await prisma.knowledgeDocument.update({
        where: { id: source.id },
        data: { lastIndexError: (error as Error).message.slice(0, 500) },
      });
      throw error;
    }
    return { id: source.id, chunks: item.chunks.length };
  });
}
