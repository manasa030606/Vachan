-- Phase 5: RAG knowledge base.
-- pgvector adds the `vector` column type used for embeddings.
-- Local PostgreSQL: install pgvector first (see docs/RAG.md). Neon has it built in.
-- (Creating the extension needs a superuser locally - see docs/RAG.md §2 if this line fails.)
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateEnum
CREATE TYPE "KnowledgeLevel" AS ENUM ('BEGINNER', 'ELEMENTARY', 'INTERMEDIATE');

-- CreateEnum
CREATE TYPE "KnowledgeContentType" AS ENUM ('ALPHABET', 'PRONUNCIATION', 'VOCABULARY', 'GRAMMAR', 'EXAMPLE', 'PHRASE', 'VERB_FORM', 'IDIOM', 'CULTURE', 'EXPLANATION');

-- CreateEnum
CREATE TYPE "KnowledgeSkill" AS ENUM ('SCRIPT', 'PRONUNCIATION', 'VOCABULARY', 'GRAMMAR', 'CONVERSATION', 'CULTURE');

-- CreateTable
CREATE TABLE "KnowledgeDocument" (
    "id" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "chunkCount" INTEGER NOT NULL,
    "indexedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KnowledgeDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeChunk" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "level" "KnowledgeLevel" NOT NULL,
    "topic" TEXT NOT NULL,
    "skill" "KnowledgeSkill" NOT NULL,
    "contentType" "KnowledgeContentType" NOT NULL,
    "source" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "charCount" INTEGER NOT NULL,
    "contentHash" TEXT NOT NULL,
    "embeddingModel" TEXT NOT NULL,
    "embedding" vector(384),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeChunk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KnowledgeDocument_languageCode_idx" ON "KnowledgeDocument"("languageCode");

-- CreateIndex
CREATE INDEX "KnowledgeChunk_languageCode_level_idx" ON "KnowledgeChunk"("languageCode", "level");

-- CreateIndex
CREATE INDEX "KnowledgeChunk_languageCode_topic_idx" ON "KnowledgeChunk"("languageCode", "topic");

-- CreateIndex
CREATE INDEX "KnowledgeChunk_documentId_idx" ON "KnowledgeChunk"("documentId");

-- AddForeignKey
ALTER TABLE "KnowledgeDocument" ADD CONSTRAINT "KnowledgeDocument_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "Language"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeChunk" ADD CONSTRAINT "KnowledgeChunk_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "KnowledgeDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeChunk" ADD CONSTRAINT "KnowledgeChunk_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "Language"("code") ON DELETE CASCADE ON UPDATE CASCADE;
