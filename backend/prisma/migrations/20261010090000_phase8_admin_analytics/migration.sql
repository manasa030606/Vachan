-- CreateEnum
CREATE TYPE "KnowledgeOrigin" AS ENUM ('FILE', 'COURSE', 'ADMIN');

-- CreateEnum
CREATE TYPE "KnowledgeStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "KnowledgeDocument" ADD COLUMN     "body" TEXT,
ADD COLUMN     "contentType" "KnowledgeContentType",
ADD COLUMN     "lastIndexError" TEXT,
ADD COLUMN     "level" "KnowledgeLevel",
ADD COLUMN     "needsReindex" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "origin" "KnowledgeOrigin" NOT NULL DEFAULT 'FILE',
ADD COLUMN     "skill" "KnowledgeSkill",
ADD COLUMN     "status" "KnowledgeStatus" NOT NULL DEFAULT 'PUBLISHED',
ADD COLUMN     "topic" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "AdminAuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminAuditLog_createdAt_idx" ON "AdminAuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AdminAuditLog_entityType_entityId_idx" ON "AdminAuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "UserExerciseAttempt_createdAt_idx" ON "UserExerciseAttempt"("createdAt");

-- CreateIndex
CREATE INDEX "UserDailyActivity_date_idx" ON "UserDailyActivity"("date");

-- AddForeignKey
ALTER TABLE "AdminAuditLog" ADD CONSTRAINT "AdminAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Data: documents built from the course vocabulary are marked as such (the indexer creates
-- them with origin COURSE from now on).
UPDATE "KnowledgeDocument" SET "origin" = 'COURSE' WHERE "id" LIKE 'course/%';
