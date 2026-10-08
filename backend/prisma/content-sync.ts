// Writes one language's generated course (course-builder.ts) into the database.
//
// The same function creates the course in an empty database and updates an existing one,
// WITHOUT deleting learners' accounts or progress:
//   - rows are matched by their stable ids (units "te-u5", lessons "te-u5-l2", …) and updated
//   - vocabulary is matched by its script, so words keep their id (speaking history stays linked)
//   - the 16-lesson course from the first version of Vachan is moved onto the matching new
//     lessons first (LEGACY_LESSONS), so learners keep their completed lessons
//   - lessons/exercises an admin created in the dashboard are kept (only generated ids are touched)
//   - generated lessons that no longer exist are deleted, or unpublished if learners used them
//   - exercises that no longer exist but were answered by learners move to a hidden
//     "Retired exercises" lesson, so answer history and open mistakes are kept
//   - placement questions are updated in place, so earlier placement answers are kept
// What is replaced: exercise options of generated exercises and the lesson↔word links.
import type { Prisma, PrismaClient } from "../src/generated/prisma/client.ts";
import { buildCourse, type CourseSeed, type ExerciseSeed } from "./course-builder.ts";
import type { SeedLanguage } from "./content/index.ts";

type Tx = Prisma.TransactionClient;

/** Lesson ids of the original 16-lesson course → the lesson that now teaches the same thing. */
const LEGACY_LESSONS: Record<string, string> = {
  "u1-l1": "u1-l1", // vowels a/aa
  "u1-l2": "u1-l2", // vowels i/ii
  "u1-l3": "u1-l3", // vowels u/uu
  "u1-l4": "u1-l6", // vowel review
  "u2-l1": "u2-l1", // first consonants
  "u2-l2": "u2-l2",
  "u2-l3": "u2-l3",
  "u2-l4": "u3-l1", // vowel signs
  "u3-l1": "u4-l1", // greetings
  "u3-l2": "u6-l1", // family
  "u3-l3": "u7-l1", // food & drink
  "u3-l4": "u8-l1", // numbers
  "u4-l1": "u5-l1", // introductions
  "u4-l2": "u5-l2", // how are you
  "u4-l3": "u7-l4", // asking for things (I want water)
  "u4-l4": "u5-l6", // sentence review
};

export type SyncSummary = {
  units: number;
  lessons: number;
  exercises: number;
  vocabulary: number;
  placementQuestions: number;
  legacyMoved: number;
  lessonsRemoved: number;
  lessonsUnpublished: number;
};

const CHUNK = 1000;
async function inChunks<T>(rows: T[], write: (chunk: T[]) => Promise<unknown>) {
  for (let start = 0; start < rows.length; start += CHUNK)
    await write(rows.slice(start, start + CHUNK));
}

export async function syncLanguage(
  prisma: PrismaClient,
  language: SeedLanguage,
  sortOrder: number,
): Promise<SyncSummary> {
  const course = buildCourse(language, language.content);
  return prisma.$transaction((tx) => writeCourse(tx, language, sortOrder, course), {
    timeout: 15 * 60_000,
    maxWait: 30_000,
  });
}

async function writeCourse(
  tx: Tx,
  meta: SeedLanguage,
  sortOrder: number,
  course: CourseSeed,
): Promise<SyncSummary> {
  const code = meta.code;
  const generatedLesson = new RegExp(`^${code}-u\\d+-l\\d+$`);
  const generatedExercise = new RegExp(`^${code}-u\\d+-l\\d+-e\\d+$`);

  // Language: names only — never isActive/sortOrder on update (admins may have changed them).
  const language = await tx.language.upsert({
    where: { code },
    update: {
      name: meta.name,
      nativeName: meta.nativeName,
      scriptName: meta.scriptName,
      description: meta.description,
    },
    create: {
      id: `lang-${code}`,
      code,
      name: meta.name,
      nativeName: meta.nativeName,
      scriptName: meta.scriptName,
      description: meta.description,
      sortOrder,
    },
  });

  // 1. Vocabulary (matched by script, so existing words keep their id).
  const vocabularyId = await syncVocabulary(tx, language.id, code, course);

  // 2. Course and units.
  await tx.course.upsert({
    where: { id: course.id },
    update: { title: course.title, description: course.description },
    create: {
      id: course.id,
      languageId: language.id,
      title: course.title,
      description: course.description,
      sortOrder: 1,
    },
  });
  const unitIds = course.units.map((unit) => unit.id);
  // Free every sortOrder first (the pair courseId + sortOrder must stay unique while moving).
  await tx.$executeRaw`UPDATE "Unit" u SET "sortOrder" = -t.rn FROM (SELECT id, row_number() OVER (ORDER BY "sortOrder") + 1000 AS rn FROM "Unit" WHERE "courseId" = ${course.id}) t WHERE u.id = t.id`;
  for (const [index, unit] of course.units.entries()) {
    await tx.unit.upsert({
      where: { id: unit.id },
      update: {
        title: unit.title,
        description: unit.description,
        stage: unit.stage,
        sortOrder: index + 1,
      },
      create: {
        id: unit.id,
        courseId: course.id,
        title: unit.title,
        description: unit.description,
        stage: unit.stage,
        sortOrder: index + 1,
      },
    });
  }
  const adminUnits = await tx.unit.findMany({
    where: { courseId: course.id, id: { notIn: unitIds } },
    orderBy: { sortOrder: "desc" }, // temp values are negative: most negative = last
  });
  for (const [index, unit] of adminUnits.reverse().entries()) {
    await tx.unit.update({
      where: { id: unit.id },
      data: { sortOrder: course.units.length + index + 1 },
    });
  }

  // 3. Lessons.
  const courseLessonIds = async () =>
    (
      await tx.lesson.findMany({ where: { unit: { courseId: course.id } }, select: { id: true } })
    ).map((l) => l.id);
  const existingLessonIds = new Set(await courseLessonIds());
  await tx.$executeRaw`UPDATE "Lesson" l SET "sortOrder" = -t.rn FROM (SELECT l2.id, row_number() OVER () + 1000 AS rn FROM "Lesson" l2 JOIN "Unit" u ON u.id = l2."unitId" WHERE u."courseId" = ${course.id}) t WHERE l.id = t.id`;

  // The original 16-lesson course: move each old lesson (and its learners' progress) onto the
  // lesson that now teaches the same thing. Detected by its last lesson, "Sentence review" in unit 4.
  let legacyMoved = 0;
  const legacyReview = await tx.lesson.findUnique({ where: { id: `${code}-u4-l4` } });
  if (legacyReview?.title === "Sentence review") {
    const moves = Object.entries(LEGACY_LESSONS).filter(([from]) =>
      existingLessonIds.has(`${code}-${from}`),
    );
    // Two passes through temporary ids, because old and new ids overlap (u3-l1 → u4-l1 → …).
    // Progress rows follow automatically (ON UPDATE CASCADE); the lessonId copied onto each
    // answer is a plain column, so it is moved the same way.
    for (const [from] of moves) {
      await tx.$executeRaw`UPDATE "Lesson" SET id = ${`tmp-${code}-${from}`} WHERE id = ${`${code}-${from}`}`;
      await tx.$executeRaw`UPDATE "UserExerciseAttempt" SET "lessonId" = ${`tmp-${code}-${from}`} WHERE "lessonId" = ${`${code}-${from}`}`;
    }
    for (const [from, to] of moves) {
      const unitId = `${code}-${to.split("-")[0]}`;
      await tx.$executeRaw`UPDATE "Lesson" SET id = ${`${code}-${to}`}, "unitId" = ${unitId} WHERE id = ${`tmp-${code}-${from}`}`;
      await tx.$executeRaw`UPDATE "UserExerciseAttempt" SET "lessonId" = ${`${code}-${to}`} WHERE "lessonId" = ${`tmp-${code}-${from}`}`;
      legacyMoved++;
    }
  }

  const lessons = course.units.flatMap((unit) =>
    unit.lessons.map((lesson, index) => ({ unit, lesson, index })),
  );
  const lessonIds = new Set(lessons.map(({ lesson }) => lesson.id));
  const nowExisting = new Set(await courseLessonIds());
  for (const { unit, lesson, index } of lessons) {
    const data = {
      unitId: unit.id,
      title: lesson.title,
      introText: lesson.introText,
      kind: lesson.kind,
      sortOrder: index + 1,
    };
    if (nowExisting.has(lesson.id)) await tx.lesson.update({ where: { id: lesson.id }, data });
    else await tx.lesson.create({ data: { id: lesson.id, ...data } });
  }

  // Generated lessons that are no longer in the course: delete, or unpublish if learners used them.
  let lessonsRemoved = 0;
  let lessonsUnpublished = 0;
  const leftovers = await tx.lesson.findMany({
    where: { unit: { courseId: course.id }, id: { notIn: [...lessonIds] } },
    include: { _count: { select: { progress: true } } },
    orderBy: { sortOrder: "desc" },
  });
  for (const leftover of leftovers) {
    if (generatedLesson.test(leftover.id) && leftover._count.progress === 0) {
      await tx.lesson.delete({ where: { id: leftover.id } });
      lessonsRemoved++;
    }
  }
  // Remaining extra lessons (admin-made, or old ones with progress) go after the generated ones.
  const kept = await tx.lesson.findMany({
    where: { unit: { courseId: course.id }, id: { notIn: [...lessonIds] } },
    orderBy: { sortOrder: "desc" },
  });
  const nextSort = new Map<string, number>();
  for (const unit of course.units) nextSort.set(unit.id, unit.lessons.length + 1);
  for (const lesson of kept.reverse()) {
    const order = nextSort.get(lesson.unitId) ?? 1000;
    nextSort.set(lesson.unitId, order + 1);
    const unpublish = generatedLesson.test(lesson.id);
    if (unpublish) lessonsUnpublished++;
    await tx.lesson.update({
      where: { id: lesson.id },
      data: { sortOrder: order, ...(unpublish ? { isPublished: false } : {}) },
    });
  }

  // 4. Exercises.
  const exercises = lessons.flatMap(({ lesson }) =>
    lesson.exercises.map((exercise, index) => ({
      lessonId: lesson.id,
      exercise,
      sortOrder: index + 1,
    })),
  );
  const exerciseIds = new Set(exercises.map(({ exercise }) => exercise.id));
  const existingExercises = await tx.exercise.findMany({
    where: { lesson: { unit: { courseId: course.id } } },
    select: { id: true, _count: { select: { attempts: true } } },
  });
  // Generated exercises the course no longer has. Ones that learners answered are kept (so their
  // answer history and open mistakes survive) in a hidden "Retired exercises" lesson; the rest are
  // deleted at the end, after the placement questions no longer point at them.
  const stale = existingExercises.filter(
    ({ id }) => generatedExercise.test(id) && !exerciseIds.has(id),
  );
  const retired = stale.filter((exercise) => exercise._count.attempts > 0).map(({ id }) => id);
  const unused = stale.filter((exercise) => exercise._count.attempts === 0).map(({ id }) => id);
  await tx.$executeRaw`UPDATE "Exercise" e SET "sortOrder" = -t.rn FROM (SELECT e2.id, row_number() OVER () + 1000 AS rn FROM "Exercise" e2 JOIN "Lesson" l ON l.id = e2."lessonId" JOIN "Unit" u ON u.id = l."unitId" WHERE u."courseId" = ${course.id}) t WHERE e.id = t.id`;
  if (retired.length) {
    const lastUnit = course.units.at(-1)!;
    const archiveId = `${code}-retired`;
    await tx.lesson.upsert({
      where: { id: archiveId },
      update: { unitId: lastUnit.id, isPublished: false, sortOrder: 900 },
      create: {
        id: archiveId,
        unitId: lastUnit.id,
        title: "Retired exercises",
        introText:
          "Exercises from an earlier version of the course, kept because learners answered them. Hidden from learners.",
        kind: "CHECKPOINT",
        isPublished: false,
        sortOrder: 900,
      },
    });
    for (const [index, id] of retired.entries()) {
      await tx.exercise.update({
        where: { id },
        data: { lessonId: archiveId, sortOrder: index + 1 },
      });
    }
  }
  const keptIds = new Set(
    existingExercises.map((exercise) => exercise.id).filter((id) => exerciseIds.has(id)),
  );
  const fields = (exercise: ExerciseSeed) => ({
    type: exercise.type,
    instruction: exercise.instruction,
    prompt: exercise.prompt,
    promptSubtext: exercise.promptSubtext ?? null,
    sentenceBefore: exercise.sentenceBefore ?? null,
    sentenceAfter: exercise.sentenceAfter ?? null,
    translation: exercise.translation ?? null,
    explanation: exercise.explanation,
  });
  for (const { lessonId, exercise, sortOrder: order } of exercises.filter(({ exercise }) =>
    keptIds.has(exercise.id),
  )) {
    await tx.exercise.update({
      where: { id: exercise.id },
      data: { lessonId, sortOrder: order, ...fields(exercise) },
    });
  }
  await inChunks(
    exercises.filter(({ exercise }) => !keptIds.has(exercise.id)),
    (chunk) =>
      tx.exercise.createMany({
        data: chunk.map(({ lessonId, exercise, sortOrder: order }) => ({
          id: exercise.id,
          lessonId,
          sortOrder: order,
          ...fields(exercise),
        })),
      }),
  );
  // Admin-made exercises inside generated lessons go after the generated ones.
  const adminExercises = await tx.exercise.findMany({
    where: { lessonId: { in: [...lessonIds] }, id: { notIn: [...exerciseIds] } },
    orderBy: { sortOrder: "desc" },
  });
  const nextExercise = new Map<string, number>();
  for (const { lesson } of lessons) nextExercise.set(lesson.id, lesson.exercises.length + 1);
  for (const exercise of adminExercises.reverse()) {
    const order = nextExercise.get(exercise.lessonId)!;
    nextExercise.set(exercise.lessonId, order + 1);
    await tx.exercise.update({ where: { id: exercise.id }, data: { sortOrder: order } });
  }

  // Options are simply re-created (nothing refers to an option row).
  const allExerciseIds = [...exerciseIds];
  await inChunks(allExerciseIds, (chunk) =>
    tx.exerciseOption.deleteMany({ where: { exerciseId: { in: chunk } } }),
  );
  const options = exercises.flatMap(({ exercise }) =>
    exercise.options.map((option, index) => ({
      id: `${exercise.id}-o${index + 1}`,
      exerciseId: exercise.id,
      text: option.text,
      subtext: option.subtext ?? null,
      isCorrect: option.isCorrect ?? false,
      correctPosition: option.correctPosition ?? null,
      matchText: option.matchText ?? null,
      sortOrder: index + 1,
    })),
  );
  await inChunks(options, (chunk) => tx.exerciseOption.createMany({ data: chunk }));

  // 5. Lesson ↔ vocabulary links (implicit many-to-many table: A = lesson, B = word).
  const generatedLessonIds = lessons.map(({ lesson }) => lesson.id);
  await tx.$executeRaw`DELETE FROM "_LessonToVocabularyItem" WHERE "A" = ANY(${generatedLessonIds})`;
  const links = lessons.flatMap(({ lesson }) =>
    [...new Set(lesson.vocabularyIds.map((id) => vocabularyId(id)))].map(
      (wordId) => [lesson.id, wordId] as const,
    ),
  );
  await inChunks(links, async (chunk) => {
    const a = chunk.map(([lessonId]) => lessonId);
    const b = chunk.map(([, wordId]) => wordId);
    await tx.$executeRaw`INSERT INTO "_LessonToVocabularyItem" ("A", "B") SELECT * FROM unnest(${a}::text[], ${b}::text[]) ON CONFLICT DO NOTHING`;
  });

  // 6. Placement questions: updated in place (same ids), so learners' earlier placement answers stay.
  for (const [index, question] of course.placementQuestions.entries()) {
    const data = {
      exerciseId: question.exerciseId,
      unitNumber: question.unitNumber,
      skill: question.skill,
    };
    await tx.placementQuestion.upsert({
      where: { id: `${code}-pq${index + 1}` },
      update: { ...data, sortOrder: index + 1 },
      create: {
        id: `${code}-pq${index + 1}`,
        languageId: language.id,
        ...data,
        sortOrder: index + 1,
      },
    });
  }
  await tx.placementQuestion.deleteMany({
    where: {
      languageId: language.id,
      sortOrder: { gt: course.placementQuestions.length },
      answers: { none: {} },
    },
  });

  // 7. Old generated exercises nobody answered (and that nothing points at any more).
  await inChunks(unused, (chunk) =>
    tx.exercise.deleteMany({ where: { id: { in: chunk }, placementQuestions: { none: {} } } }),
  );

  return {
    units: course.units.length,
    lessons: lessons.length,
    exercises: exercises.length,
    vocabulary: course.vocabulary.length,
    placementQuestions: course.placementQuestions.length,
    legacyMoved,
    lessonsRemoved,
    lessonsUnpublished,
  };
}

/**
 * Creates/updates the vocabulary. Returns a function mapping a generated id to the id actually
 * stored (an existing row with the same script keeps its old id).
 */
async function syncVocabulary(tx: Tx, languageId: string, code: string, course: CourseSeed) {
  const existing = await tx.vocabularyItem.findMany({ where: { languageId } });
  const byScript = new Map(existing.map((row) => [row.script, row]));
  const byId = new Map(existing.map((row) => [row.id, row]));
  const finalId = new Map<string, string>();
  const toCreate: Prisma.VocabularyItemCreateManyInput[] = [];

  for (const seed of course.vocabulary) {
    const data = {
      kind: seed.kind,
      romanization: seed.romanization,
      meaning: seed.meaning,
      topic: seed.topic,
      notes: seed.notes,
    };
    const sameScript = byScript.get(seed.script);
    const sameId = byId.get(seed.id);
    const row =
      sameScript ??
      (sameId && !course.vocabulary.some((v) => v.script === sameId.script) ? sameId : undefined);
    if (row) {
      finalId.set(seed.id, row.id);
      const changed =
        row.script !== seed.script ||
        row.kind !== data.kind ||
        row.romanization !== data.romanization ||
        row.meaning !== data.meaning ||
        row.topic !== data.topic ||
        row.notes !== data.notes;
      if (changed)
        await tx.vocabularyItem.update({
          where: { id: row.id },
          data: { ...data, script: seed.script },
        });
    } else {
      finalId.set(seed.id, seed.id);
      toCreate.push({ id: seed.id, languageId, script: seed.script, ...data });
    }
  }
  await inChunks(toCreate, (chunk) => tx.vocabularyItem.createMany({ data: chunk }));

  // Generated words that the course no longer teaches (old "te-v05-…" ids or removed items).
  const generatedId = new RegExp(`^${code}-(v\\d\\d|[wpxl])-`);
  const keepIds = new Set(finalId.values());
  const stale = existing
    .filter((row) => generatedId.test(row.id) && !keepIds.has(row.id))
    .map((row) => row.id);
  await inChunks(stale, (chunk) => tx.vocabularyItem.deleteMany({ where: { id: { in: chunk } } }));

  return (id: string) => finalId.get(id) ?? id;
}
