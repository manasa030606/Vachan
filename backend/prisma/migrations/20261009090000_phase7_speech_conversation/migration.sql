-- CreateEnum
CREATE TYPE "AudioInputSource" AS ENUM ('RECORDED', 'UPLOADED');

-- CreateEnum
CREATE TYPE "ConversationScenario" AS ENUM ('INTRODUCTIONS', 'RESTAURANT', 'SHOPPING', 'TRAVEL', 'DIRECTIONS', 'EVERYDAY');

-- CreateEnum
CREATE TYPE "ConversationStatus" AS ENUM ('ACTIVE', 'ENDED');

-- CreateEnum
CREATE TYPE "ConversationInputMode" AS ENUM ('TEXT', 'VOICE');

-- CreateTable
CREATE TABLE "AudioClip" (
    "id" TEXT NOT NULL,
    "cacheKey" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sampleRate" INTEGER NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "byteSize" INTEGER NOT NULL,
    "data" BYTEA NOT NULL,
    "hits" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AudioClip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpeechAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "vocabularyItemId" TEXT,
    "expectedText" TEXT NOT NULL,
    "expectedRomanization" TEXT NOT NULL,
    "transcript" TEXT NOT NULL,
    "contentScore" INTEGER NOT NULL,
    "contentVerdict" TEXT NOT NULL,
    "contentMatch" JSONB NOT NULL,
    "fluency" JSONB NOT NULL,
    "pronunciation" JSONB,
    "audioIssues" JSONB,
    "audioSource" "AudioInputSource" NOT NULL,
    "audioMimeType" TEXT NOT NULL,
    "audioBytes" INTEGER NOT NULL,
    "audioDurationMs" INTEGER NOT NULL,
    "audioSampleRate" INTEGER NOT NULL,
    "speechMs" INTEGER NOT NULL,
    "sttModel" TEXT NOT NULL,
    "latencyMs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpeechAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "scenario" "ConversationScenario" NOT NULL,
    "level" "KnowledgeLevel" NOT NULL,
    "status" "ConversationStatus" NOT NULL DEFAULT 'ACTIVE',
    "learnerTurns" INTEGER NOT NULL DEFAULT 0,
    "summary" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "ConversationSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationTurn" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" "AIMessageRole" NOT NULL,
    "text" TEXT NOT NULL,
    "romanization" TEXT,
    "translation" TEXT,
    "inputMode" "ConversationInputMode",
    "audio" JSONB,
    "feedback" JSONB,
    "suggestions" JSONB,
    "references" JSONB,
    "status" "AIAnswerStatus",
    "context" JSONB,
    "model" TEXT,
    "latencyMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationTurn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AudioClip_cacheKey_key" ON "AudioClip"("cacheKey");

-- CreateIndex
CREATE INDEX "AudioClip_languageCode_idx" ON "AudioClip"("languageCode");

-- CreateIndex
CREATE INDEX "SpeechAttempt_userId_createdAt_idx" ON "SpeechAttempt"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ConversationSession_userId_startedAt_idx" ON "ConversationSession"("userId", "startedAt");

-- CreateIndex
CREATE INDEX "ConversationTurn_sessionId_createdAt_idx" ON "ConversationTurn"("sessionId", "createdAt");

-- AddForeignKey
ALTER TABLE "AudioClip" ADD CONSTRAINT "AudioClip_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "Language"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeechAttempt" ADD CONSTRAINT "SpeechAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeechAttempt" ADD CONSTRAINT "SpeechAttempt_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "Language"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeechAttempt" ADD CONSTRAINT "SpeechAttempt_vocabularyItemId_fkey" FOREIGN KEY ("vocabularyItemId") REFERENCES "VocabularyItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationSession" ADD CONSTRAINT "ConversationSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationSession" ADD CONSTRAINT "ConversationSession_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "Language"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationTurn" ADD CONSTRAINT "ConversationTurn_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ConversationSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
