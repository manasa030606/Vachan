// Phase 8 — admin content management: languages → courses → units → lessons → exercises, and
// vocabulary. Everything a developer used to change in prisma/seed-data.ts can be done here.
//
// Rules:
//   • learners only see published content (Language.isActive, Course/Unit/Lesson.isPublished)
//   • deleting something learners have used is refused (409 HAS_LEARNER_DATA) unless `force`
//     is set — unpublishing is the safe alternative and keeps everyone's progress
//   • exercises are validated with the same rules the answer checker uses (exercise-rules.ts)
//   • every change is written to AdminAuditLog
import type {
  ExerciseType,
  LearningStage,
  LessonKind,
  VocabularyKind,
} from "../../generated/prisma/client.ts";
import { audit } from "../../lib/audit.ts";
import { HttpError, notFound } from "../../lib/http-error.ts";
import { prisma } from "../../lib/prisma.ts";
import { exerciseProblems, type OptionInput } from "./exercise-rules.ts";

type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

const conflict = (code: string, message: string, details?: unknown) =>
  new HttpError(409, code, message, details);

/** Refuses to delete learner data unless the admin explicitly asked for it. */
function guardLearnerData(count: number, what: string, force: boolean) {
  if (count > 0 && !force) {
    throw conflict(
      "HAS_LEARNER_DATA",
      `${count} learner record(s) belong to this ${what}. Unpublish it instead (keeps their progress), or delete with force=true to remove their progress too.`,
      { learnerRecords: count },
    );
  }
}

/** The RAG "course vocabulary" document must be rebuilt after vocabulary changes. */
async function markCourseVocabularyStale(languageCode: string) {
  await prisma.knowledgeDocument.updateMany({
    where: { id: `course/${languageCode}/vocabulary` },
    data: { needsReindex: true },
  });
}

// ── Overview tree ───────────────────────────────────────────────

export async function listLanguages() {
  const languages = await prisma.language.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { courses: true, vocabulary: true, learners: true, knowledgeDocuments: true },
      },
    },
  });
  return languages.map(({ _count, ...language }) => ({
    ...language,
    counts: {
      courses: _count.courses,
      vocabulary: _count.vocabulary,
      learners: _count.learners,
      knowledgeDocuments: _count.knowledgeDocuments,
    },
  }));
}

/** Courses → units → lessons of one language, with counts (no learner identities). */
export async function getContentTree(languageCode: string) {
  const language = await prisma.language.findUnique({
    where: { code: languageCode },
    include: {
      courses: {
        orderBy: { sortOrder: "asc" },
        include: {
          units: {
            orderBy: { sortOrder: "asc" },
            include: {
              lessons: {
                orderBy: { sortOrder: "asc" },
                include: {
                  _count: { select: { exercises: true, vocabulary: true, progress: true } },
                },
              },
            },
          },
        },
      },
    },
  });
  if (!language) throw notFound("LANGUAGE_NOT_FOUND", "Language not found");
  return {
    language: {
      id: language.id,
      code: language.code,
      name: language.name,
      isActive: language.isActive,
    },
    courses: language.courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      sortOrder: course.sortOrder,
      isPublished: course.isPublished,
      units: course.units.map((unit) => ({
        id: unit.id,
        title: unit.title,
        description: unit.description,
        stage: unit.stage,
        sortOrder: unit.sortOrder,
        isPublished: unit.isPublished,
        lessons: unit.lessons.map(({ _count, ...lesson }) => ({
          id: lesson.id,
          title: lesson.title,
          kind: lesson.kind,
          sortOrder: lesson.sortOrder,
          isPublished: lesson.isPublished,
          exercises: _count.exercises,
          vocabulary: _count.vocabulary,
          learnersStarted: _count.progress,
        })),
      })),
    })),
  };
}

// ── Languages ───────────────────────────────────────────────────

export type LanguageInput = {
  code: string;
  name: string;
  nativeName: string;
  scriptName: string;
  description: string;
  sortOrder?: number;
};

export async function createLanguage(adminId: string, input: LanguageInput) {
  const sortOrder = input.sortOrder ?? (await prisma.language.count()) + 1;
  const language = await prisma.language.create({
    // New languages start hidden until they have content.
    data: { ...input, sortOrder, isActive: false },
  });
  await audit(adminId, "language.create", {
    type: "language",
    id: language.code,
    summary: language.name,
  });
  return language;
}

export async function updateLanguage(
  adminId: string,
  code: string,
  input: Partial<Omit<LanguageInput, "code">>,
) {
  const language = await prisma.language.update({ where: { code }, data: input }).catch(() => {
    throw notFound("LANGUAGE_NOT_FOUND", "Language not found");
  });
  await audit(adminId, "language.update", { type: "language", id: code, summary: language.name });
  return language;
}

export async function setLanguageActive(adminId: string, code: string, isActive: boolean) {
  const language = await prisma.language.findUnique({
    where: { code },
    include: { courses: { where: { isPublished: true }, select: { id: true } } },
  });
  if (!language) throw notFound("LANGUAGE_NOT_FOUND", "Language not found");
  if (isActive && language.courses.length === 0) {
    throw conflict("LANGUAGE_EMPTY", "Publish a course for this language before making it visible");
  }
  await prisma.language.update({ where: { code }, data: { isActive } });
  await audit(adminId, isActive ? "language.publish" : "language.unpublish", {
    type: "language",
    id: code,
    summary: language.name,
  });
  return { code, isActive };
}

export async function deleteLanguage(adminId: string, code: string, force: boolean) {
  const language = await prisma.language.findUnique({
    where: { code },
    include: { _count: { select: { learners: true, courses: true } } },
  });
  if (!language) throw notFound("LANGUAGE_NOT_FOUND", "Language not found");
  guardLearnerData(language._count.learners, "language", force);
  if (language._count.courses > 0 && !force) {
    throw conflict("LANGUAGE_NOT_EMPTY", "Delete or move this language's courses first");
  }
  await prisma.language.delete({ where: { code } });
  await audit(adminId, "language.delete", { type: "language", id: code, summary: language.name });
}

// ── Courses ─────────────────────────────────────────────────────

export type CourseInput = { title: string; description: string; sortOrder?: number };

export async function createCourse(adminId: string, languageCode: string, input: CourseInput) {
  const language = await prisma.language.findUnique({ where: { code: languageCode } });
  if (!language) throw notFound("LANGUAGE_NOT_FOUND", "Language not found");
  const course = await prisma.course.create({
    data: { ...input, languageId: language.id, isPublished: false },
  });
  await audit(adminId, "course.create", { type: "course", id: course.id, summary: course.title });
  return course;
}

export async function updateCourse(adminId: string, id: string, input: Partial<CourseInput>) {
  const course = await prisma.course.update({ where: { id }, data: input }).catch(() => {
    throw notFound("COURSE_NOT_FOUND", "Course not found");
  });
  await audit(adminId, "course.update", { type: "course", id, summary: course.title });
  return course;
}

async function progressCount(where: { lesson: object }) {
  const [progress, attempts] = await Promise.all([
    prisma.userLessonProgress.count({ where }),
    prisma.userExerciseAttempt.count({ where: { exercise: where } }),
  ]);
  return progress + attempts;
}

export async function deleteCourse(adminId: string, id: string, force: boolean) {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw notFound("COURSE_NOT_FOUND", "Course not found");
  guardLearnerData(await progressCount({ lesson: { unit: { courseId: id } } }), "course", force);
  await prisma.course.delete({ where: { id } });
  await audit(adminId, "course.delete", { type: "course", id, summary: course.title });
}

// ── Units ───────────────────────────────────────────────────────

export type UnitInput = { title: string; description: string; stage: LearningStage };

export async function createUnit(adminId: string, courseId: string, input: UnitInput) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw notFound("COURSE_NOT_FOUND", "Course not found");
  const last = await prisma.unit.findFirst({ where: { courseId }, orderBy: { sortOrder: "desc" } });
  const unit = await prisma.unit.create({
    data: { ...input, courseId, sortOrder: (last?.sortOrder ?? 0) + 1, isPublished: false },
  });
  await audit(adminId, "unit.create", { type: "unit", id: unit.id, summary: unit.title });
  return unit;
}

export async function updateUnit(adminId: string, id: string, input: Partial<UnitInput>) {
  const unit = await prisma.unit.update({ where: { id }, data: input }).catch(() => {
    throw notFound("UNIT_NOT_FOUND", "Unit not found");
  });
  await audit(adminId, "unit.update", { type: "unit", id, summary: unit.title });
  return unit;
}

export async function deleteUnit(adminId: string, id: string, force: boolean) {
  const unit = await prisma.unit.findUnique({ where: { id } });
  if (!unit) throw notFound("UNIT_NOT_FOUND", "Unit not found");
  guardLearnerData(await progressCount({ lesson: { unitId: id } }), "unit", force);
  await prisma.unit.delete({ where: { id } });
  await audit(adminId, "unit.delete", { type: "unit", id, summary: unit.title });
}

// ── Lessons ─────────────────────────────────────────────────────

export type LessonInput = {
  title: string;
  introText: string;
  kind: LessonKind;
  vocabularyIds?: string[];
};

export async function getLessonForEditing(id: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      unit: { include: { course: { include: { language: true } } } },
      vocabulary: { orderBy: { id: "asc" } },
      exercises: {
        orderBy: { sortOrder: "asc" },
        include: {
          options: { orderBy: { sortOrder: "asc" } },
          _count: { select: { attempts: true, placementQuestions: true } },
        },
      },
      _count: { select: { progress: true } },
    },
  });
  if (!lesson) throw notFound("LESSON_NOT_FOUND", "Lesson not found");
  const { unit, exercises, _count, ...rest } = lesson;
  return {
    ...rest,
    unit: { id: unit.id, title: unit.title, isPublished: unit.isPublished },
    course: { id: unit.course.id, title: unit.course.title },
    language: { code: unit.course.language.code, name: unit.course.language.name },
    learnersStarted: _count.progress,
    exercises: exercises.map(({ _count: counts, ...exercise }) => ({
      ...exercise,
      attempts: counts.attempts,
      usedInPlacement: counts.placementQuestions > 0,
    })),
  };
}

async function checkVocabularyLanguage(vocabularyIds: string[], languageId: string) {
  if (vocabularyIds.length === 0) return;
  const count = await prisma.vocabularyItem.count({
    where: { id: { in: vocabularyIds }, languageId },
  });
  if (count !== new Set(vocabularyIds).size) {
    throw new HttpError(
      400,
      "VOCABULARY_MISMATCH",
      "Some words don't exist or belong to another language",
    );
  }
}

export async function createLesson(adminId: string, unitId: string, input: LessonInput) {
  const unit = await prisma.unit.findUnique({ where: { id: unitId }, include: { course: true } });
  if (!unit) throw notFound("UNIT_NOT_FOUND", "Unit not found");
  await checkVocabularyLanguage(input.vocabularyIds ?? [], unit.course.languageId);
  const last = await prisma.lesson.findFirst({ where: { unitId }, orderBy: { sortOrder: "desc" } });
  const lesson = await prisma.lesson.create({
    data: {
      unitId,
      title: input.title,
      introText: input.introText,
      kind: input.kind,
      sortOrder: (last?.sortOrder ?? 0) + 1,
      // A new lesson has no exercises yet, so it starts unpublished.
      isPublished: false,
      vocabulary: { connect: (input.vocabularyIds ?? []).map((id) => ({ id })) },
    },
  });
  await audit(adminId, "lesson.create", { type: "lesson", id: lesson.id, summary: lesson.title });
  return lesson;
}

export async function updateLesson(adminId: string, id: string, input: Partial<LessonInput>) {
  const existing = await prisma.lesson.findUnique({
    where: { id },
    include: { unit: { include: { course: true } } },
  });
  if (!existing) throw notFound("LESSON_NOT_FOUND", "Lesson not found");
  if (input.vocabularyIds)
    await checkVocabularyLanguage(input.vocabularyIds, existing.unit.course.languageId);
  const { vocabularyIds, ...fields } = input;
  const lesson = await prisma.lesson.update({
    where: { id },
    data: {
      ...fields,
      ...(vocabularyIds ? { vocabulary: { set: vocabularyIds.map((vid) => ({ id: vid })) } } : {}),
    },
  });
  await audit(adminId, "lesson.update", { type: "lesson", id, summary: lesson.title });
  return lesson;
}

export async function deleteLesson(adminId: string, id: string, force: boolean) {
  const lesson = await prisma.lesson.findUnique({ where: { id } });
  if (!lesson) throw notFound("LESSON_NOT_FOUND", "Lesson not found");
  guardLearnerData(await progressCount({ lesson: { id } }), "lesson", force);
  await prisma.lesson.delete({ where: { id } });
  await audit(adminId, "lesson.delete", { type: "lesson", id, summary: lesson.title });
}

// ── Publish / unpublish (course, unit, lesson) ──────────────────

export async function setPublished(
  adminId: string,
  type: "course" | "unit" | "lesson",
  id: string,
  isPublished: boolean,
) {
  let title: string;
  if (type === "lesson") {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: { _count: { select: { exercises: true } } },
    });
    if (!lesson) throw notFound("LESSON_NOT_FOUND", "Lesson not found");
    if (isPublished && lesson._count.exercises === 0) {
      throw conflict("LESSON_EMPTY", "Add at least one exercise before publishing this lesson");
    }
    await prisma.lesson.update({ where: { id }, data: { isPublished } });
    title = lesson.title;
  } else if (type === "unit") {
    const unit = await prisma.unit.update({ where: { id }, data: { isPublished } }).catch(() => {
      throw notFound("UNIT_NOT_FOUND", "Unit not found");
    });
    title = unit.title;
  } else {
    const course = await prisma.course
      .update({ where: { id }, data: { isPublished } })
      .catch(() => {
        throw notFound("COURSE_NOT_FOUND", "Course not found");
      });
    title = course.title;
  }
  await audit(adminId, `${type}.${isPublished ? "publish" : "unpublish"}`, {
    type,
    id,
    summary: title,
  });
  return { id, isPublished };
}

// ── Moving (sort order) ─────────────────────────────────────────

/** Swaps an item with its neighbour. sortOrder is unique per parent, so a temporary value is used. */
async function swap(
  tx: Tx,
  model: "unit" | "lesson" | "exercise",
  a: { id: string; sortOrder: number },
  b: { id: string; sortOrder: number },
) {
  const delegate = tx[model] as unknown as {
    update: (args: { where: { id: string }; data: { sortOrder: number } }) => Promise<unknown>;
  };
  await delegate.update({ where: { id: a.id }, data: { sortOrder: -1 } });
  await delegate.update({ where: { id: b.id }, data: { sortOrder: a.sortOrder } });
  await delegate.update({ where: { id: a.id }, data: { sortOrder: b.sortOrder } });
}

export async function move(
  adminId: string,
  type: "unit" | "lesson" | "exercise",
  id: string,
  direction: "up" | "down",
) {
  const find = {
    unit: () =>
      prisma.unit
        .findUnique({ where: { id } })
        .then((u) => u && { item: u, parent: { courseId: u.courseId } }),
    lesson: () =>
      prisma.lesson
        .findUnique({ where: { id } })
        .then((l) => l && { item: l, parent: { unitId: l.unitId } }),
    exercise: () =>
      prisma.exercise
        .findUnique({ where: { id } })
        .then((e) => e && { item: e, parent: { lessonId: e.lessonId } }),
  }[type];
  const found = await find();
  if (!found) throw notFound("NOT_FOUND", `${type} not found`);
  const { item, parent } = found;
  const where = {
    ...parent,
    sortOrder: direction === "up" ? { lt: item.sortOrder } : { gt: item.sortOrder },
  };
  const orderBy = { sortOrder: direction === "up" ? ("desc" as const) : ("asc" as const) };
  const neighbour =
    type === "unit"
      ? await prisma.unit.findFirst({ where, orderBy })
      : type === "lesson"
        ? await prisma.lesson.findFirst({ where, orderBy })
        : await prisma.exercise.findFirst({ where, orderBy });
  if (!neighbour) return { moved: false };
  await prisma.$transaction((tx) => swap(tx, type, item, neighbour));
  await audit(adminId, `${type}.move`, { type, id, summary: direction });
  return { moved: true };
}

// ── Exercises ───────────────────────────────────────────────────

export type ExerciseFields = {
  type: ExerciseType;
  instruction: string;
  prompt: string;
  promptSubtext?: string | null;
  sentenceBefore?: string | null;
  sentenceAfter?: string | null;
  translation?: string | null;
  explanation?: string | null;
  options: OptionInput[];
};

function validateExercise(input: ExerciseFields) {
  const problems = exerciseProblems(input);
  if (problems.length > 0) {
    throw new HttpError(400, "INVALID_EXERCISE", problems[0]!, { problems });
  }
}

const optionRows = (exerciseId: string, options: OptionInput[]) =>
  options.map((option, index) => ({
    exerciseId,
    text: option.text.trim(),
    subtext: option.subtext?.trim() || null,
    isCorrect: option.isCorrect ?? false,
    correctPosition: option.correctPosition ?? null,
    matchText: option.matchText?.trim() || null,
    sortOrder: index + 1,
  }));

export async function createExercise(adminId: string, lessonId: string, input: ExerciseFields) {
  validateExercise(input);
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) throw notFound("LESSON_NOT_FOUND", "Lesson not found");
  const last = await prisma.exercise.findFirst({
    where: { lessonId },
    orderBy: { sortOrder: "desc" },
  });
  const { options, ...fields } = input;
  const exercise = await prisma.$transaction(async (tx) => {
    const created = await tx.exercise.create({
      data: { ...fields, lessonId, sortOrder: (last?.sortOrder ?? 0) + 1 },
    });
    await tx.exerciseOption.createMany({ data: optionRows(created.id, options) });
    return created;
  });
  await audit(adminId, "exercise.create", {
    type: "exercise",
    id: exercise.id,
    summary: `${input.type} in ${lesson.title}`,
  });
  return exercise;
}

/**
 * Replaces an exercise's fields and options. Old answers keep their correct/incorrect result;
 * their "you answered …" text may show "?" because the old option ids are gone.
 */
export async function updateExercise(adminId: string, id: string, input: ExerciseFields) {
  validateExercise(input);
  const existing = await prisma.exercise.findUnique({ where: { id } });
  if (!existing) throw notFound("EXERCISE_NOT_FOUND", "Exercise not found");
  const { options, ...fields } = input;
  await prisma.$transaction(async (tx) => {
    await tx.exercise.update({ where: { id }, data: fields });
    await tx.exerciseOption.deleteMany({ where: { exerciseId: id } });
    await tx.exerciseOption.createMany({ data: optionRows(id, options) });
  });
  await audit(adminId, "exercise.update", { type: "exercise", id, summary: input.type });
  return prisma.exercise.findUnique({
    where: { id },
    include: { options: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function deleteExercise(adminId: string, id: string, force: boolean) {
  const exercise = await prisma.exercise.findUnique({
    where: { id },
    include: { _count: { select: { attempts: true, placementQuestions: true } } },
  });
  if (!exercise) throw notFound("EXERCISE_NOT_FOUND", "Exercise not found");
  if (exercise._count.placementQuestions > 0) {
    throw conflict(
      "USED_IN_PLACEMENT",
      "This exercise is used by the placement test and can't be deleted",
    );
  }
  guardLearnerData(exercise._count.attempts, "exercise", force);
  const remaining = await prisma.exercise.count({ where: { lessonId: exercise.lessonId } });
  await prisma.exercise.delete({ where: { id } });
  // A published lesson must never end up empty.
  if (remaining <= 1) {
    await prisma.lesson.update({ where: { id: exercise.lessonId }, data: { isPublished: false } });
  }
  await audit(adminId, "exercise.delete", { type: "exercise", id, summary: exercise.type });
}

// ── Vocabulary ──────────────────────────────────────────────────

export type VocabularyInput = {
  kind: VocabularyKind;
  script: string;
  romanization: string;
  meaning: string;
  topic: string;
};

export async function listVocabulary(languageCode: string, search?: string) {
  const items = await prisma.vocabularyItem.findMany({
    where: {
      language: { code: languageCode },
      ...(search
        ? {
            OR: [
              { script: { contains: search } },
              { romanization: { contains: search, mode: "insensitive" } },
              { meaning: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { _count: { select: { lessons: true } } },
    orderBy: [{ kind: "asc" }, { topic: "asc" }, { script: "asc" }],
    take: 500,
  });
  return items.map(({ _count, ...item }) => ({ ...item, lessons: _count.lessons }));
}

export async function createVocabulary(
  adminId: string,
  languageCode: string,
  input: VocabularyInput,
) {
  const language = await prisma.language.findUnique({ where: { code: languageCode } });
  if (!language) throw notFound("LANGUAGE_NOT_FOUND", "Language not found");
  const item = await prisma.vocabularyItem.create({
    data: { ...input, script: input.script.normalize("NFC"), languageId: language.id },
  });
  await markCourseVocabularyStale(languageCode);
  await audit(adminId, "vocabulary.create", {
    type: "vocabulary",
    id: item.id,
    summary: item.script,
  });
  return item;
}

export async function updateVocabulary(
  adminId: string,
  id: string,
  input: Partial<VocabularyInput>,
) {
  const item = await prisma.vocabularyItem
    .update({
      where: { id },
      data: { ...input, ...(input.script ? { script: input.script.normalize("NFC") } : {}) },
      include: { language: true },
    })
    .catch((error: unknown) => {
      if ((error as { code?: string }).code === "P2025")
        throw notFound("VOCABULARY_NOT_FOUND", "Word not found");
      throw error;
    });
  await markCourseVocabularyStale(item.language.code);
  await audit(adminId, "vocabulary.update", { type: "vocabulary", id, summary: item.script });
  return item;
}

export async function deleteVocabulary(adminId: string, id: string) {
  const item = await prisma.vocabularyItem.findUnique({
    where: { id },
    include: { language: true },
  });
  if (!item) throw notFound("VOCABULARY_NOT_FOUND", "Word not found");
  // Removing a word only unlinks it from lessons; exercises keep their own text.
  await prisma.vocabularyItem.delete({ where: { id } });
  await markCourseVocabularyStale(item.language.code);
  await audit(adminId, "vocabulary.delete", { type: "vocabulary", id, summary: item.script });
}

// ── Audit log ───────────────────────────────────────────────────

export async function listAuditLog(limit = 50) {
  const rows = await prisma.adminAuditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: Math.min(limit, 200),
    include: { user: { select: { email: true } } },
  });
  return rows.map(({ user, ...row }) => ({ ...row, admin: user?.email ?? "(deleted account)" }));
}
