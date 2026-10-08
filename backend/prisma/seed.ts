// Seeds the database: `npm run db:seed` (from the project root).
//
// For each of the six languages it writes the full course built by course-builder.ts from
// content/curriculum.ts + content/languages/<code>.ts (16 units, 95 lessons, ~1,300 exercises
// and ~600 words and phrases per language), plus the badges and a demo account.
//
// Modes:
//   npm run db:seed                         creates the course for languages that have none yet
//                                           (an existing course is left alone)
//   npm run db:seed:sync -w backend          updates existing courses to the latest content and
//                                           KEEPS learners' accounts and progress (see content-sync.ts)
//   npm run db:seed:reset-content -w backend development only: deletes all course content and
//                                           learners' lesson progress, then creates it again
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { ACHIEVEMENTS } from "../src/config/achievements.ts";
import { hashPassword } from "../src/lib/password.ts";
import { SEED_LANGUAGES } from "./content/index.ts";
import { syncLanguage } from "./content-sync.ts";
import { DEMO_USER } from "./seed-data.ts";

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is missing. Create backend/.env first (see docs/SETUP.md).");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const resetContent = process.argv.includes("--reset-content");
const sync = process.argv.includes("--sync") || resetContent;

async function seedLanguage(index: number) {
  const language = SEED_LANGUAGES[index]!;
  const existing = await prisma.course.findFirst({
    where: { language: { code: language.code } },
    include: { _count: { select: { units: true } } },
  });

  if (existing && !sync) {
    console.log(
      `  – ${language.name.padEnd(10)} already has a course (${existing._count.units} units) — kept. Update it with: npm run db:seed:sync -w backend`,
    );
    return;
  }

  if (resetContent) {
    const row = await prisma.language.findUnique({ where: { code: language.code } });
    if (row) {
      // Cascades to units, lessons, exercises and learners' lesson progress and answers.
      await prisma.course.deleteMany({ where: { languageId: row.id } });
      await prisma.vocabularyItem.deleteMany({ where: { languageId: row.id } });
    }
  }

  const started = Date.now();
  const summary = await syncLanguage(prisma, language, index + 1);
  const moved = summary.legacyMoved ? ` · ${summary.legacyMoved} old lessons moved` : "";
  const removed =
    summary.lessonsRemoved || summary.lessonsUnpublished
      ? ` · ${summary.lessonsRemoved} old lessons removed, ${summary.lessonsUnpublished} unpublished`
      : "";
  console.log(
    `  ✓ ${language.name.padEnd(10)} ${summary.units} units · ${summary.lessons} lessons · ${summary.exercises} exercises · ${summary.vocabulary} words/phrases/letters · ${summary.placementQuestions} placement questions${moved}${removed} (${((Date.now() - started) / 1000).toFixed(1)} s)`,
  );
}

async function seedAchievements() {
  for (const [index, definition] of ACHIEVEMENTS.entries()) {
    await prisma.achievement.upsert({
      where: { code: definition.code },
      update: { ...definition, sortOrder: index + 1 },
      create: { ...definition, sortOrder: index + 1 },
    });
  }
  console.log(`  ✓ Badges       ${ACHIEVEMENTS.length} achievements`);
}

async function seedDemoUser() {
  const language = await prisma.language.findUniqueOrThrow({
    where: { code: DEMO_USER.languageCode },
  });
  const passwordHash = await hashPassword(DEMO_USER.password);

  await prisma.user.upsert({
    where: { email: DEMO_USER.email },
    update: { passwordHash },
    create: {
      email: DEMO_USER.email,
      passwordHash,
      profile: {
        create: {
          displayName: DEMO_USER.displayName,
          currentLanguageId: language.id,
          onboardingDone: true,
        },
      },
    },
  });
  console.log(`  ✓ Demo account  ${DEMO_USER.email} / ${DEMO_USER.password}  (development only)`);
}

async function main() {
  console.log(
    `🌱 Seeding the Vachan database${resetContent ? " (reset content)" : sync ? " (sync content, keeping learner data)" : ""}…`,
  );
  for (let index = 0; index < SEED_LANGUAGES.length; index++) {
    await seedLanguage(index);
  }
  await seedAchievements();
  // The demo account has a publicly documented password, so it is only created in
  // development — unless SEED_DEMO_USER=true is set on purpose.
  const seedDemo =
    process.env.SEED_DEMO_USER !== undefined
      ? process.env.SEED_DEMO_USER === "true"
      : process.env.NODE_ENV !== "production";
  if (seedDemo) await seedDemoUser();
  else console.log("  – Demo account skipped (production). Set SEED_DEMO_USER=true to create it.");
  console.log(
    "✅ Seed finished. Next: npm run rag:index -w backend (updates the AI tutor's knowledge base)",
  );
}

main()
  .catch((error: unknown) => {
    console.error("❌ Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
