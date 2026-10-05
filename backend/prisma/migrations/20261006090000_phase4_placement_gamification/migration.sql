-- CreateEnum
CREATE TYPE "XpReason" AS ENUM ('EXERCISE_CORRECT', 'LESSON_COMPLETED', 'LESSON_PRACTICED', 'PERFECT_LESSON', 'REVIEW_CORRECT');

-- CreateEnum
CREATE TYPE "AchievementMetric" AS ENUM ('LESSONS_COMPLETED', 'TOTAL_XP', 'LONGEST_STREAK', 'UNITS_COMPLETED', 'PERFECT_LESSONS', 'MISTAKES_CLEARED', 'DAILY_GOALS_MET');

-- CreateEnum
CREATE TYPE "PlacementSkill" AS ENUM ('SCRIPT', 'VOCABULARY', 'TRANSLATION', 'SENTENCE');

-- CreateEnum
CREATE TYPE "PlacementStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ACCEPTED', 'DECLINED');

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "timeZone" TEXT NOT NULL DEFAULT 'Asia/Kolkata';

-- AlterTable
ALTER TABLE "UserLessonProgress" ADD COLUMN     "placedOut" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "UserStats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalXp" INTEGER NOT NULL DEFAULT 0,
    "hearts" INTEGER NOT NULL DEFAULT 5,
    "heartsUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActiveDate" TEXT,
    "perfectLessons" INTEGER NOT NULL DEFAULT 0,
    "mistakesCleared" INTEGER NOT NULL DEFAULT 0,
    "dailyGoalsMet" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDailyActivity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "exercisesAnswered" INTEGER NOT NULL DEFAULT 0,
    "lessonsCompleted" INTEGER NOT NULL DEFAULT 0,
    "goalMet" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserDailyActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XpEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" "XpReason" NOT NULL,
    "lessonId" TEXT,
    "exerciseId" TEXT,
    "localDate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "XpEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "metric" "AchievementMetric" NOT NULL,
    "threshold" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlacementQuestion" (
    "id" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "unitNumber" INTEGER NOT NULL,
    "skill" "PlacementSkill" NOT NULL,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "PlacementQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlacementTest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "status" "PlacementStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "selfAssessment" TEXT,
    "correctCount" INTEGER,
    "recommendedUnit" INTEGER,
    "chosenUnit" INTEGER,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "decidedAt" TIMESTAMP(3),

    CONSTRAINT "PlacementTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlacementAnswer" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" JSONB NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlacementAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserStats_userId_key" ON "UserStats"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserDailyActivity_userId_date_key" ON "UserDailyActivity"("userId", "date");

-- CreateIndex
CREATE INDEX "XpEvent_userId_createdAt_idx" ON "XpEvent"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_code_key" ON "Achievement"("code");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_userId_achievementId_key" ON "UserAchievement"("userId", "achievementId");

-- CreateIndex
CREATE UNIQUE INDEX "PlacementQuestion_languageId_sortOrder_key" ON "PlacementQuestion"("languageId", "sortOrder");

-- CreateIndex
CREATE INDEX "PlacementTest_userId_languageId_idx" ON "PlacementTest"("userId", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "PlacementAnswer_testId_questionId_key" ON "PlacementAnswer"("testId", "questionId");

-- AddForeignKey
ALTER TABLE "UserStats" ADD CONSTRAINT "UserStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDailyActivity" ADD CONSTRAINT "UserDailyActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XpEvent" ADD CONSTRAINT "XpEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlacementQuestion" ADD CONSTRAINT "PlacementQuestion_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlacementQuestion" ADD CONSTRAINT "PlacementQuestion_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlacementTest" ADD CONSTRAINT "PlacementTest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlacementTest" ADD CONSTRAINT "PlacementTest_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlacementAnswer" ADD CONSTRAINT "PlacementAnswer_testId_fkey" FOREIGN KEY ("testId") REFERENCES "PlacementTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlacementAnswer" ADD CONSTRAINT "PlacementAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "PlacementQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
