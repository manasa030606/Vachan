// Converts backend JSON into the types the UI components already use.
import type { Exercise, Lesson } from "@/types/exercise";
import type { LessonIcon, Unit, UnitColor } from "@/types/learning";
import type {
  CourseDetailDto,
  LessonDto,
  LessonKind,
  PublicExerciseDto,
  ReviewSessionDto,
} from "./types";

const optional = (value: string | null) => value ?? undefined;

function toChoices(options: Array<{ id: string; text: string; subtext: string | null }>) {
  return options.map((option) => ({
    id: option.id,
    text: option.text,
    subtext: optional(option.subtext),
  }));
}

export function toExercise(dto: PublicExerciseDto): Exercise {
  switch (dto.type) {
    case "multiple-choice":
      return {
        ...dto,
        promptSubtext: optional(dto.promptSubtext),
        options: toChoices(dto.options),
      };
    case "character-sound":
      return { ...dto, options: toChoices(dto.options) };
    case "character-recognition":
      return {
        ...dto,
        promptSubtext: optional(dto.promptSubtext),
        options: toChoices(dto.options),
      };
    case "fill-in-blank":
      return { ...dto, options: toChoices(dto.options) };
    case "translation":
      return { ...dto, promptSubtext: optional(dto.promptSubtext) };
    case "word-order":
      return { ...dto, tokens: toChoices(dto.tokens) };
    case "matching":
      return {
        ...dto,
        pairs: dto.pairs.map((pair) => ({ ...pair, leftSubtext: optional(pair.leftSubtext) })),
      };
  }
}

export function toLesson(dto: LessonDto): Lesson {
  return {
    id: dto.id,
    mode: "lesson",
    title: dto.title,
    unitTitle: dto.unit.title,
    introText: dto.introText,
    newWords: dto.vocabulary,
    exercises: dto.exercises.map(toExercise),
    progress: {
      status: dto.progress.status,
      completedExerciseIds: dto.progress.completedExerciseIds,
    },
  };
}

/** A review session is played with the same lesson player, in "review" mode. */
export function toReviewLesson(dto: ReviewSessionDto): Lesson {
  return {
    id: dto.id,
    mode: "review",
    title: dto.title,
    unitTitle: "Practice",
    introText: dto.introText,
    newWords: [],
    exercises: dto.exercises.map((exercise) => toExercise(exercise)),
    progress: { status: "NOT_STARTED", completedExerciseIds: [] },
  };
}

const ICON_BY_KIND: Record<LessonKind, LessonIcon> = {
  SCRIPT: "script",
  VOCABULARY: "words",
  PHRASES: "chat",
  CHECKPOINT: "trophy",
};

const UNIT_COLORS: UnitColor[] = ["brand", "teal", "rose"];

/** Turns GET /api/courses/:id into the units shown on the learning path. */
export function toUnits(course: CourseDetailDto): Unit[] {
  return course.units.map((unit, index) => ({
    id: unit.id,
    number: unit.number,
    title: unit.title,
    description: unit.description,
    stage: unit.stage
      .toLowerCase()
      .split("_")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" "),
    color: UNIT_COLORS[index % UNIT_COLORS.length],
    status: unit.status,
    lessons: unit.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      status: lesson.status,
      icon: ICON_BY_KIND[lesson.kind],
      exerciseCount: lesson.exerciseCount,
      placedOut: lesson.placedOut,
    })),
  }));
}
