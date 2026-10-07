// Development seed: run with `npm run db:seed` (from the project root).
//
// Creates for each of the six languages (see course-builder.ts for the lesson plan):
//   1 language · 1 course · 4 units · 16 lessons · 67 exercises · 34 vocabulary items
//   · 12 placement questions
// plus the badge definitions (src/config/achievements.ts) and one demo account.
//
// Safe to run again (Phase 8): languages, badges and the demo account are updated in place, and
// a language's course content is only created when that language has NO course yet — so
// content edited in the admin dashboard and learners' progress are never overwritten.
//
//   npm run db:seed:reset-content -w backend   ⚠️ deletes and re-creates ALL course content and
//                                        vocabulary (and therefore learners' lesson progress
//                                        and answers). Development only.
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { ACHIEVEMENTS } from "../src/config/achievements.ts";
import { hashPassword } from "../src/lib/password.ts";
import { buildCourse } from "./course-builder.ts";
import { DEMO_USER, SEED_LANGUAGES } from "./seed-data.ts";

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is missing. Create backend/.env first (see README).");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const resetContent = process.argv.includes("--reset-content");

async function seedLanguage(index: number) {
  const data = SEED_LANGUAGES[index];
  const course = buildCourse(data);

  const language = await prisma.language.upsert({
    where: { code: data.code },
    // Names only — never isActive/sortOrder, which admins may have changed in the dashboard.
    update: {
      name: data.name,
      nativeName: data.nativeName,
      scriptName: data.scriptName,
      description: data.description,
    },
    create: {
      id: `lang-${data.code}`,
      code: data.code,
      name: data.name,
      nativeName: data.nativeName,
      scriptName: data.scriptName,
      description: data.description,
      sortOrder: index + 1,
    },
  });

  const existing = await prisma.course.count({ where: { languageId: language.id } });
  if (existing > 0 && !resetContent) {
    console.log(
      `  – ${data.name.padEnd(10)} has content already — kept (re-create: npm run db:seed:reset-content -w backend)`,
    );
    return;
  }

  // Start this language's content from a clean slate (cascades to units, lessons, exercises, progress).
  await prisma.course.deleteMany({ where: { languageId: language.id } });
  await prisma.vocabularyItem.deleteMany({ where: { languageId: language.id } });

  await prisma.vocabularyItem.createMany({
    data: course.vocabulary.map((item) => ({ ...item, languageId: language.id })),
  });

  await prisma.course.create({
    data: {
      id: course.id,
      languageId: language.id,
      title: course.title,
      description: course.description,
      sortOrder: 1,
      units: {
        create: course.units.map((unit, unitIndex) => ({
          id: unit.id,
          title: unit.title,
          description: unit.description,
          stage: unit.stage,
          sortOrder: unitIndex + 1,
          lessons: {
            create: unit.lessons.map((lesson, lessonIndex) => ({
              id: lesson.id,
              title: lesson.title,
              introText: lesson.introText,
              kind: lesson.kind,
              sortOrder: lessonIndex + 1,
              vocabulary: { connect: lesson.vocabularyIds.map((id) => ({ id })) },
              exercises: {
                create: lesson.exercises.map((exercise, exerciseIndex) => ({
                  id: exercise.id,
                  type: exercise.type,
                  sortOrder: exerciseIndex + 1,
                  instruction: exercise.instruction,
                  prompt: exercise.prompt,
                  promptSubtext: exercise.promptSubtext,
                  sentenceBefore: exercise.sentenceBefore,
                  sentenceAfter: exercise.sentenceAfter,
                  translation: exercise.translation,
                  explanation: exercise.explanation,
                  options: {
                    create: exercise.options.map((option, optionIndex) => ({
                      id: `${exercise.id}-o${optionIndex + 1}`,
                      text: option.text,
                      subtext: option.subtext,
                      isCorrect: option.isCorrect ?? false,
                      correctPosition: option.correctPosition,
                      matchText: option.matchText,
                      sortOrder: optionIndex + 1,
                    })),
                  },
                })),
              },
            })),
          },
        })),
      },
    },
  });

  await prisma.placementQuestion.createMany({
    data: course.placementQuestions.map((question, index) => ({
      id: `${data.code}-pq${index + 1}`,
      languageId: language.id,
      exerciseId: question.exerciseId,
      unitNumber: question.unitNumber,
      skill: question.skill,
      sortOrder: index + 1,
    })),
  });

  const lessons = course.units.flatMap((unit) => unit.lessons);
  const exercises = lessons.flatMap((lesson) => lesson.exercises);
  console.log(
    `  ✓ ${data.name.padEnd(10)} ${course.units.length} units · ${lessons.length} lessons · ${exercises.length} exercises · ${course.vocabulary.length} vocabulary items · ${course.placementQuestions.length} placement questions`,
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
  console.log("🌱 Seeding the Vachan database…");
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
  console.log("✅ Seed finished.");
}

main()
  .catch((error: unknown) => {
    console.error("❌ Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
