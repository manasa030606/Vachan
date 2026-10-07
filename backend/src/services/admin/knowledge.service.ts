// Phase 8 — managing the RAG knowledge base from the admin dashboard.
//
//   origin FILE   backend/knowledge-base/*.md → text edited in git; publish/unpublish here
//   origin COURSE built from the course vocabulary → updated by re-indexing
//   origin ADMIN  written here: language, level, topic, type, skill, source + markdown sections
//
// SAFE RE-INDEXING
//   1. validate: the text is parsed with the same rules as the files (no "## " section → 400)
//   2. preview: see the chunks it will produce, without embedding anything
//   3. index ONE document; the old chunks stay searchable until the new ones are saved in one
//      transaction; failures are stored in lastIndexError and the old chunks are kept
//   4. one indexing job at a time (409 INDEX_BUSY)
//   5. unpublish = chunks removed immediately (works even where the embedding model is off)
// On servers with RAG search off (Render free), publishing marks the document "needs re-index"
// and you run `npm run rag:index -w backend` against that database from your computer.
import { ragEnabled } from "../../config/env.ts";
import { KnowledgeFormatError } from "../../rag/document-parser.ts";
import {
  adminDocumentSource,
  loadCourseDocuments,
  loadKnowledgeFiles,
} from "../../rag/content-loader.ts";
import { slugify } from "../../rag/chunking.ts";
import { EmbeddingModelError } from "../../rag/embeddings.ts";
import {
  IndexBusyError,
  indexKnowledgeBase,
  indexOneDocument,
  isIndexing,
  prepare,
  removeChunks,
} from "../../rag/indexer.ts";
import type { SourceDocument } from "../../rag/types.ts";
import { audit } from "../../lib/audit.ts";
import { HttpError, notFound } from "../../lib/http-error.ts";
import { prisma } from "../../lib/prisma.ts";

type Level = "BEGINNER" | "ELEMENTARY" | "INTERMEDIATE";
const toEnum = <T extends string>(value: string) => value.toUpperCase().replace(/-/g, "_") as T;

export type KnowledgeInput = {
  title: string;
  source: string;
  level: string;
  topic: string;
  contentType: string;
  skill: string;
  body: string;
};

function toHttp(error: unknown): never {
  if (error instanceof KnowledgeFormatError) {
    throw new HttpError(400, "INVALID_KNOWLEDGE_FORMAT", error.message.replace(/^[^:]+: /, ""));
  }
  if (error instanceof IndexBusyError) throw new HttpError(409, "INDEX_BUSY", error.message);
  if (error instanceof EmbeddingModelError) {
    throw new HttpError(503, "EMBEDDING_MODEL_UNAVAILABLE", error.message);
  }
  throw error;
}

function requireSearchServer() {
  if (!ragEnabled) {
    throw new HttpError(
      503,
      "RAG_DISABLED",
      "Indexing needs the embedding model, which is off on this server (RAG_ENABLED=false). Run `npm run rag:index -w backend` with this DATABASE_URL from your computer.",
    );
  }
}

const docSelect = {
  id: true,
  languageCode: true,
  title: true,
  source: true,
  reference: true,
  origin: true,
  status: true,
  level: true,
  topic: true,
  contentType: true,
  skill: true,
  chunkCount: true,
  needsReindex: true,
  lastIndexError: true,
  indexedAt: true,
  updatedAt: true,
} as const;

export async function listDocuments(filters: {
  language?: string;
  origin?: "FILE" | "COURSE" | "ADMIN";
  status?: "DRAFT" | "PUBLISHED";
}) {
  const documents = await prisma.knowledgeDocument.findMany({
    where: {
      ...(filters.language ? { languageCode: filters.language } : {}),
      ...(filters.origin ? { origin: filters.origin } : {}),
      ...(filters.status ? { status: filters.status } : {}),
    },
    select: docSelect,
    orderBy: [{ languageCode: "asc" }, { origin: "asc" }, { id: "asc" }],
  });
  const totals = await prisma.knowledgeChunk.count();
  return {
    documents,
    totals: { documents: documents.length, chunks: totals },
    indexing: isIndexing(),
    searchEnabled: ragEnabled,
  };
}

export async function getDocument(id: string) {
  const document = await prisma.knowledgeDocument.findUnique({
    where: { id },
    select: {
      ...docSelect,
      body: true,
      chunks: {
        select: {
          id: true,
          heading: true,
          content: true,
          level: true,
          topic: true,
          contentType: true,
          skill: true,
          charCount: true,
        },
        orderBy: { id: "asc" },
      },
    },
  });
  if (!document) throw notFound("DOCUMENT_NOT_FOUND", "Knowledge document not found");
  return document;
}

/** The text of a document as the indexer would see it (files and course vocabulary included). */
async function sourceOf(id: string): Promise<SourceDocument> {
  const row = await prisma.knowledgeDocument.findUnique({ where: { id } });
  if (!row) throw notFound("DOCUMENT_NOT_FOUND", "Knowledge document not found");
  try {
    if (row.origin === "ADMIN") return adminDocumentSource(row);
    const all =
      row.origin === "COURSE" ? await loadCourseDocuments(prisma) : await loadKnowledgeFiles();
    const found = all.find((doc) => doc.id === id);
    if (!found)
      throw new HttpError(
        404,
        "SOURCE_MISSING",
        "The source file of this document no longer exists",
      );
    return found;
  } catch (error) {
    return toHttp(error);
  }
}

/** Dry run: how the text will be chunked — nothing is embedded or saved. */
export function previewChunks(source: SourceDocument) {
  const { chunks } = prepare(source);
  return chunks.map((chunk) => ({
    id: chunk.id,
    heading: chunk.heading,
    level: chunk.level,
    topic: chunk.topic,
    contentType: chunk.contentType,
    skill: chunk.skill,
    characters: chunk.content.length,
    excerpt: chunk.content.slice(0, 200),
  }));
}

export async function previewDocument(id: string) {
  return { chunks: previewChunks(await sourceOf(id)) };
}

/** Validates new/edited admin text before it is saved (same parser as the files). */
function validateAdminText(row: Parameters<typeof adminDocumentSource>[0]) {
  try {
    return previewChunks(adminDocumentSource(row));
  } catch (error) {
    return toHttp(error);
  }
}

export async function createDocument(adminId: string, languageCode: string, input: KnowledgeInput) {
  const language = await prisma.language.findUnique({ where: { code: languageCode } });
  if (!language) throw notFound("LANGUAGE_NOT_FOUND", "Language not found");
  const base = `admin/${languageCode}/${slugify(input.title) || "note"}`;
  let id = base;
  for (let n = 2; await prisma.knowledgeDocument.findUnique({ where: { id } }); n++)
    id = `${base}-${n}`;
  const row = {
    id,
    languageCode,
    title: input.title,
    source: input.source,
    level: toEnum<Level>(input.level),
    topic: input.topic,
    contentType: toEnum<"PHRASE">(input.contentType),
    skill: toEnum<"VOCABULARY">(input.skill),
    body: input.body,
  };
  const chunks = validateAdminText(row);
  await prisma.knowledgeDocument.create({
    data: {
      ...row,
      reference: `admin-dashboard:${id}`,
      origin: "ADMIN",
      status: "DRAFT",
      contentHash: "",
      chunkCount: 0,
    },
  });
  await audit(adminId, "knowledge.create", { type: "knowledge", id, summary: input.title });
  return { ...(await getDocument(id)), preview: chunks };
}

export async function updateDocument(adminId: string, id: string, input: Partial<KnowledgeInput>) {
  const existing = await prisma.knowledgeDocument.findUnique({ where: { id } });
  if (!existing) throw notFound("DOCUMENT_NOT_FOUND", "Knowledge document not found");
  if (existing.origin !== "ADMIN") {
    throw new HttpError(
      409,
      "READ_ONLY_DOCUMENT",
      existing.origin === "FILE"
        ? `This note comes from ${existing.reference} — edit the file in git, then re-index.`
        : "Course vocabulary is edited in the Vocabulary section and updated by re-indexing.",
    );
  }
  const data = {
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.source !== undefined ? { source: input.source } : {}),
    ...(input.level !== undefined ? { level: toEnum<Level>(input.level) } : {}),
    ...(input.topic !== undefined ? { topic: input.topic } : {}),
    ...(input.contentType !== undefined
      ? { contentType: toEnum<"PHRASE">(input.contentType) }
      : {}),
    ...(input.skill !== undefined ? { skill: toEnum<"VOCABULARY">(input.skill) } : {}),
    ...(input.body !== undefined ? { body: input.body } : {}),
  };
  const chunks = validateAdminText({ ...existing, ...data });
  await prisma.knowledgeDocument.update({
    where: { id },
    // A published document keeps its OLD chunks searchable until it is re-indexed.
    data: { ...data, needsReindex: existing.status === "PUBLISHED" },
  });
  await audit(adminId, "knowledge.update", {
    type: "knowledge",
    id,
    summary: data.title ?? existing.title,
  });
  return { ...(await getDocument(id)), preview: chunks };
}

export async function reindexDocument(adminId: string, id: string) {
  requireSearchServer();
  const row = await prisma.knowledgeDocument.findUnique({ where: { id } });
  if (!row) throw notFound("DOCUMENT_NOT_FOUND", "Knowledge document not found");
  if (row.status === "DRAFT") {
    throw new HttpError(
      409,
      "DOCUMENT_IS_DRAFT",
      "Publish the document first — drafts are never indexed",
    );
  }
  const source = await sourceOf(id);
  const result = await indexOneDocument(prisma, source).catch(toHttp);
  await audit(adminId, "knowledge.reindex", {
    type: "knowledge",
    id,
    summary: `${result.chunks} chunks`,
  });
  return { id, indexed: true, chunks: result.chunks };
}

export async function setDocumentPublished(adminId: string, id: string, published: boolean) {
  const row = await prisma.knowledgeDocument.findUnique({ where: { id } });
  if (!row) throw notFound("DOCUMENT_NOT_FOUND", "Knowledge document not found");

  if (!published) {
    await prisma.knowledgeDocument.update({
      where: { id },
      data: { status: "DRAFT", needsReindex: false },
    });
    await removeChunks(prisma, id); // search stops finding it right away
    await audit(adminId, "knowledge.unpublish", { type: "knowledge", id, summary: row.title });
    return { id, status: "DRAFT" as const, indexed: false, chunks: 0 };
  }

  const source = await sourceOf(id); // validates the text before anything changes
  await prisma.knowledgeDocument.update({
    where: { id },
    data: { status: "PUBLISHED", needsReindex: true },
  });
  await audit(adminId, "knowledge.publish", { type: "knowledge", id, summary: row.title });
  if (!ragEnabled) {
    return {
      id,
      status: "PUBLISHED" as const,
      indexed: false,
      chunks: 0,
      message:
        "Published. Search on this server is off, so run `npm run rag:index -w backend` against this database to make it searchable.",
    };
  }
  const result = await indexOneDocument(prisma, source).catch(toHttp);
  return { id, status: "PUBLISHED" as const, indexed: true, chunks: result.chunks };
}

export async function deleteDocument(adminId: string, id: string) {
  const row = await prisma.knowledgeDocument.findUnique({ where: { id } });
  if (!row) throw notFound("DOCUMENT_NOT_FOUND", "Knowledge document not found");
  if (row.origin !== "ADMIN") {
    throw new HttpError(
      409,
      "READ_ONLY_DOCUMENT",
      "Only notes written in the dashboard can be deleted here — unpublish file notes instead",
    );
  }
  await prisma.knowledgeDocument.delete({ where: { id } }); // chunks cascade
  await audit(adminId, "knowledge.delete", { type: "knowledge", id, summary: row.title });
}

/** Re-indexes everything that changed (files, course vocabulary, admin notes) — like rag:index. */
export async function reindexAll(adminId: string) {
  requireSearchServer();
  const report = await indexKnowledgeBase(prisma).catch(toHttp);
  await audit(adminId, "knowledge.reindex-all", {
    type: "knowledge",
    id: "*",
    summary: `${report.embedded.length} embedded, ${report.skipped.length} unchanged, ${report.removed.length} removed`,
  });
  return report;
}
