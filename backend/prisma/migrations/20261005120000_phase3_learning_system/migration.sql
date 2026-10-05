-- CreateEnum
CREATE TYPE "AttemptSource" AS ENUM ('LESSON', 'REVIEW');

-- AlterEnum
ALTER TYPE "ExerciseType" ADD VALUE 'CHARACTER_SOUND';

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "explanation" TEXT;

-- AlterTable
ALTER TABLE "UserLessonProgress" ADD COLUMN     "accuracy" INTEGER,
ADD COLUMN     "correctAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "incorrectAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "runStartedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "timesCompleted" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "UserExerciseAttempt" ADD COLUMN     "source" "AttemptSource" NOT NULL DEFAULT 'LESSON';

-- CreateIndex
CREATE INDEX "UserLessonProgress_userId_lastActivityAt_idx" ON "UserLessonProgress"("userId", "lastActivityAt");

-- CreateIndex
CREATE INDEX "UserExerciseAttempt_userId_exerciseId_idx" ON "UserExerciseAttempt"("userId", "exerciseId");

-- Backfill progress rows created in Phase 2 (safe to run on an empty table).
UPDATE "UserLessonProgress" SET "timesCompleted" = 1 WHERE "status" = 'COMPLETED';
UPDATE "UserLessonProgress" p SET
  "correctAttempts"   = s.correct,
  "incorrectAttempts" = s.incorrect,
  "accuracy"          = ROUND(100.0 * s.correct / NULLIF(s.correct + s.incorrect, 0)),
  "lastActivityAt"    = COALESCE(s.last_at, p."lastActivityAt"),
  "runStartedAt"      = p."startedAt"
FROM (
  SELECT "userId", "lessonId",
         COUNT(*) FILTER (WHERE "isCorrect")     AS correct,
         COUNT(*) FILTER (WHERE NOT "isCorrect") AS incorrect,
         MAX("createdAt")                        AS last_at
  FROM "UserExerciseAttempt"
  GROUP BY "userId", "lessonId"
) s
WHERE p."userId" = s."userId" AND p."lessonId" = s."lessonId";
