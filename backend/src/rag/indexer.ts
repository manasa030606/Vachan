// Runs the whole ingestion pipeline:
//   content → cleaning → chunking → embeddings → vector storage
// Re-running is safe and cheap: a document whose cleaned chunks haven't changed is skipped,
// and documents that were deleted from the knowledge base are removed from the database.
import type { PrismaClient } from "../generated/prisma/client.ts";
import { chunkDocument, sha256 } from "./chunking.ts";
import { RAG_CONFIG } from "./config.ts";
import { loadCourseDocuments, loadKnowledgeFiles } from "./content-loader.ts";
import { embedPassages } from "./embeddings.ts";
import type { SourceDocument } from "./types.ts";
import { saveDocument } from "./vector-store.ts";

export type IndexReport = {
  documents: number;
  embedded: string[];
  skipped: string[];
  removed: string[];
  chunks: number;
  chunksEmbedded: number;
  seconds: number;
};

export async function indexKnowledgeBase(
  prisma: PrismaClient,
  options: { force?: boolean; log?: (line: string) => void } = {},
): Promise<IndexReport> {
  const log = options.log ?? (() => {});
  const started = performance.now();

  // 1. Collect content.
  const sources: SourceDocument[] = [
    ...(await loadKnowledgeFiles()),
    ...(await loadCourseDocuments(prisma)),
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
  const prepared = sources.map((document) => {
    const chunks = chunkDocument(document);
    const contentHash = sha256(
      JSON.stringify([
        RAG_CONFIG.embedding.model,
        chunks.map((chunk) => [chunk.id, chunk.contentHash]),
      ]),
    );
    return { document, chunks, contentHash };
  });
  const totalChunks = prepared.reduce((sum, item) => sum + item.chunks.length, 0);
  log(`Found ${prepared.length} documents → ${totalChunks} chunks`);

  const existing = new Map(
    (await prisma.knowledgeDocument.findMany({ select: { id: true, contentHash: true } })).map(
      (doc) => [doc.id, doc.contentHash],
    ),
  );

  const report: IndexReport = {
    documents: prepared.length,
    embedded: [],
    skipped: [],
    removed: [],
    chunks: totalChunks,
    chunksEmbedded: 0,
    seconds: 0,
  };

  // 4–5. Embed + store (only what changed).
  for (const { document, chunks, contentHash } of prepared) {
    if (!options.force && existing.get(document.id) === contentHash) {
      report.skipped.push(document.id);
      continue;
    }
    const vectors = await embedPassages(chunks.map((chunk) => chunk.embeddingText));
    await saveDocument(
      prisma,
      {
        id: document.id,
        languageCode: document.languageCode,
        title: document.title,
        source: document.source,
        reference: document.reference,
        contentHash,
      },
      chunks,
      vectors,
    );
    report.embedded.push(document.id);
    report.chunksEmbedded += chunks.length;
    log(`  ✓ ${document.id.padEnd(26)} ${String(chunks.length).padStart(2)} chunks embedded`);
  }

  // Remove documents that no longer exist in the knowledge base.
  const current = new Set(prepared.map((item) => item.document.id));
  const stale = [...existing.keys()].filter((id) => !current.has(id));
  if (stale.length > 0) {
    await prisma.knowledgeDocument.deleteMany({ where: { id: { in: stale } } }); // chunks cascade
    report.removed = stale;
  }

  report.seconds = Math.round((performance.now() - started) / 100) / 10;
  return report;
}
