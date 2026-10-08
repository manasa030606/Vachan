// Validation for the admin API. Every admin input is checked here before it reaches the
// database, just like learner requests.
import { z } from "zod";
import { CONTENT_TYPES, SKILLS } from "../rag/types.ts";
import { KNOWLEDGE_LEVELS } from "../rag/config.ts";

const text = (max: number, label = "This field") =>
  z.string().trim().min(1, `${label} is required`).max(max, `${label} is too long (max ${max})`);
const optionalText = (max: number) => z.string().trim().max(max).nullish();

export const LEARNING_STAGES = [
  "FOUNDATIONS",
  "FIRST_WORDS",
  "EVERYDAY_PHRASES",
  "SENTENCE_BUILDING",
  "GRAMMAR",
  "LISTENING",
  "SPEAKING",
  "CONVERSATION",
  "ADVANCED",
] as const;
export const LESSON_KINDS = ["SCRIPT", "VOCABULARY", "PHRASES", "CHECKPOINT"] as const;
export const EXERCISE_TYPES = [
  "MULTIPLE_CHOICE",
  "CHARACTER_RECOGNITION",
  "CHARACTER_SOUND",
  "MATCHING",
  "FILL_IN_BLANK",
  "TRANSLATION",
  "WORD_ORDER",
] as const;
export const VOCABULARY_KINDS = ["LETTER", "WORD", "PHRASE"] as const;

export const languageCreateSchema = z
  .object({
    code: z
      .string()
      .trim()
      .regex(/^[a-z]{2,3}$/, "Use the 2–3 letter ISO 639 code, e.g. mr"),
    name: text(60, "Name"),
    nativeName: text(60, "Native name"),
    scriptName: text(60, "Script name"),
    description: text(300, "Description"),
    sortOrder: z.number().int().min(0).max(1000).optional(),
  })
  .strict();
export const languageUpdateSchema = languageCreateSchema.omit({ code: true }).partial().strict();

export const courseCreateSchema = z
  .object({
    languageCode: z.string().trim().min(2).max(3),
    title: text(120, "Title"),
    description: text(500, "Description"),
    sortOrder: z.number().int().min(0).max(1000).optional(),
  })
  .strict();
export const courseUpdateSchema = courseCreateSchema
  .omit({ languageCode: true })
  .partial()
  .strict();

export const unitCreateSchema = z
  .object({
    courseId: text(100),
    title: text(120, "Title"),
    description: text(500, "Description"),
    stage: z.enum(LEARNING_STAGES),
  })
  .strict();
export const unitUpdateSchema = unitCreateSchema.omit({ courseId: true }).partial().strict();

export const lessonCreateSchema = z
  .object({
    unitId: text(100),
    title: text(120, "Title"),
    introText: text(1000, "Intro text"),
    kind: z.enum(LESSON_KINDS),
    vocabularyIds: z.array(text(100)).max(30).optional(),
  })
  .strict();
export const lessonUpdateSchema = lessonCreateSchema.omit({ unitId: true }).partial().strict();

const optionSchema = z
  .object({
    text: text(200, "Option text"),
    subtext: optionalText(200),
    isCorrect: z.boolean().optional(),
    correctPosition: z.number().int().min(1).max(20).nullish(),
    matchText: optionalText(200),
  })
  .strict();

export const exerciseSchema = z
  .object({
    type: z.enum(EXERCISE_TYPES),
    instruction: text(200, "Instruction"),
    prompt: z.string().trim().max(300),
    promptSubtext: optionalText(300),
    sentenceBefore: optionalText(300),
    sentenceAfter: optionalText(300),
    translation: optionalText(300),
    explanation: optionalText(1000),
    options: z.array(optionSchema).min(1).max(12),
  })
  .strict();
export const exerciseCreateSchema = exerciseSchema.extend({ lessonId: text(100) }).strict();

export const vocabularySchema = z
  .object({
    kind: z.enum(VOCABULARY_KINDS),
    script: text(120, "Script"),
    romanization: text(120, "Romanization"),
    meaning: text(200, "Meaning"),
    topic: text(60, "Topic"),
    /** Usage notes for learners and the AI tutor (formal/casual forms, alternatives…). */
    notes: optionalText(1000),
  })
  .strict();
export const vocabularyCreateSchema = vocabularySchema
  .extend({ languageCode: z.string().trim().min(2).max(3) })
  .strict();

export const publishSchema = z.object({ published: z.boolean() }).strict();
export const moveSchema = z.object({ direction: z.enum(["up", "down"]) }).strict();
export const forceQuerySchema = z.object({ force: z.enum(["true", "false"]).optional() });
export const languageQuerySchema = z.object({
  language: z.string().trim().min(2).max(3),
  search: z.string().trim().max(100).optional(),
});

// Knowledge base (RAG)

const slug = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use a lowercase slug like greetings or past-tense");

export const knowledgeCreateSchema = z
  .object({
    languageCode: z.string().trim().min(2).max(3),
    title: text(150, "Title"),
    source: text(150, "Source"),
    level: z.enum(KNOWLEDGE_LEVELS),
    topic: slug,
    contentType: z.enum(CONTENT_TYPES),
    skill: z.enum(SKILLS),
    /** Markdown: "## Heading" + text, one section per concept (see docs/AI.md). */
    body: z.string().trim().min(20, "Write at least one section").max(50_000),
  })
  .strict();
export const knowledgeUpdateSchema = knowledgeCreateSchema
  .omit({ languageCode: true })
  .partial()
  .strict();
export const knowledgeListQuerySchema = z.object({
  language: z.string().trim().min(2).max(3).optional(),
  origin: z.enum(["FILE", "COURSE", "ADMIN"]).optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
});

export const analyticsQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(365).default(30),
  language: z.string().trim().min(2).max(3).optional(),
});
