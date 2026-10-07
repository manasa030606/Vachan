// Types and calls for the admin dashboard API (/api/admin/...).
// Only works for accounts with the ADMIN role; the server checks this on every request.
import { apiFetch } from "./client";

export type AdminLanguage = {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  scriptName: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  counts: { courses: number; vocabulary: number; learners: number; knowledgeDocuments: number };
};

// The course → unit → lesson tree shown on the Content page.
export type TreeLesson = {
  id: string;
  title: string;
  kind: LessonKind;
  sortOrder: number;
  isPublished: boolean;
  exercises: number;
  vocabulary: number;
  learnersStarted: number;
};
export type TreeUnit = {
  id: string;
  title: string;
  description: string;
  stage: string;
  sortOrder: number;
  isPublished: boolean;
  lessons: TreeLesson[];
};
export type TreeCourse = {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
  isPublished: boolean;
  units: TreeUnit[];
};
export type ContentTree = {
  language: { id: string; code: string; name: string; isActive: boolean };
  courses: TreeCourse[];
};

// Allowed values for dropdowns (they match the enums in the Prisma schema).
export const LESSON_KINDS = ["SCRIPT", "VOCABULARY", "PHRASES", "CHECKPOINT"] as const;
export type LessonKind = (typeof LESSON_KINDS)[number];
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
export const EXERCISE_TYPES = [
  "MULTIPLE_CHOICE",
  "CHARACTER_RECOGNITION",
  "CHARACTER_SOUND",
  "MATCHING",
  "FILL_IN_BLANK",
  "TRANSLATION",
  "WORD_ORDER",
] as const;
export type ExerciseType = (typeof EXERCISE_TYPES)[number];

/** One answer row of an exercise. Which fields matter depends on the exercise type. */
export type AdminOption = {
  id?: string;
  text: string;
  subtext?: string | null;
  isCorrect?: boolean;
  correctPosition?: number | null;
  matchText?: string | null;
};
export type AdminExercise = {
  id: string;
  type: ExerciseType;
  sortOrder: number;
  instruction: string;
  prompt: string;
  promptSubtext: string | null;
  sentenceBefore: string | null;
  sentenceAfter: string | null;
  translation: string | null;
  explanation: string | null;
  options: AdminOption[];
  attempts: number;
  usedInPlacement: boolean;
};
/** What the exercise form sends: the exercise without server-managed fields. */
export type ExerciseBody = Omit<AdminExercise, "id" | "sortOrder" | "attempts" | "usedInPlacement">;

export type AdminVocabulary = {
  id: string;
  kind: "LETTER" | "WORD" | "PHRASE";
  script: string;
  romanization: string;
  meaning: string;
  topic: string;
  lessons?: number;
};

export type AdminLesson = {
  id: string;
  title: string;
  introText: string;
  kind: LessonKind;
  isPublished: boolean;
  unit: { id: string; title: string; isPublished: boolean };
  course: { id: string; title: string };
  language: { code: string; name: string };
  learnersStarted: number;
  vocabulary: AdminVocabulary[];
  exercises: AdminExercise[];
};

// Tag values for knowledge-base notes (used by the AI tutor's search).
export const KNOWLEDGE_LEVELS = ["beginner", "elementary", "intermediate"] as const;
export const KNOWLEDGE_TYPES = [
  "alphabet",
  "pronunciation",
  "vocabulary",
  "grammar",
  "example",
  "phrase",
  "verb-form",
  "idiom",
  "culture",
  "explanation",
] as const;
export const KNOWLEDGE_SKILLS = [
  "script",
  "pronunciation",
  "vocabulary",
  "grammar",
  "conversation",
  "culture",
] as const;

export type KnowledgeDoc = {
  id: string;
  languageCode: string;
  title: string;
  source: string;
  reference: string;
  origin: "FILE" | "COURSE" | "ADMIN";
  status: "DRAFT" | "PUBLISHED";
  level: string | null;
  topic: string | null;
  contentType: string | null;
  skill: string | null;
  chunkCount: number;
  needsReindex: boolean;
  lastIndexError: string | null;
  indexedAt: string;
  updatedAt: string;
};
export type KnowledgeChunkPreview = {
  id: string;
  heading: string;
  level: string;
  topic: string;
  contentType: string;
  skill: string;
  characters?: number;
  charCount?: number;
  excerpt?: string;
  content?: string;
};
export type KnowledgeDocDetail = KnowledgeDoc & {
  body: string | null;
  chunks: KnowledgeChunkPreview[];
};
export type KnowledgeInput = {
  title: string;
  source: string;
  level: string;
  topic: string;
  contentType: string;
  skill: string;
  body: string;
};

/** Response of GET /admin/analytics (all numbers are aggregated, no personal data). */
export type Analytics = {
  window: { days: number; since: string; language: string | null };
  privacy: string;
  learners: { total: number; newInWindow: number };
  activeLearners: {
    today: number;
    last7Days: number;
    inWindow: number;
    perDay: Array<{ date: string; learners: number }>;
  };
  lessons: {
    completedInWindow: number;
    startedInWindow: number;
    completionRate: number | null;
    dropOff: {
      course: string | null;
      lessons: Array<{
        lessonId: string;
        label: string;
        started: number;
        completed: number;
        dropOffRate: number | null;
      }>;
    };
  };
  accuracy: {
    answers: number;
    percentCorrect: number | null;
    byExerciseType: Array<{ type: string; answers: number; percentCorrect: number | null }>;
  };
  commonMistakes: Array<{
    exerciseId: string;
    prompt: string;
    type: string;
    lesson: string;
    language: string;
    answers: number;
    wrong: number;
    percentWrong: number | null;
  }>;
  languages: Array<{
    code: string;
    name: string;
    isActive: boolean;
    learnersStudying: number;
    answersInWindow: number;
    activeLearnersInWindow: number;
  }>;
  streaks: {
    learnersWithStats: number;
    averageCurrent: number;
    longestEver: number;
    distribution: Array<{ label: string; learners: number }>;
  };
  tutor: {
    questions: number;
    averageAnswerMs: number | null;
    byStatus: Array<{ status: string; answers: number }>;
  };
  speaking: {
    attempts: number;
    averageContentScore: number | null;
    averageRecordingMs: number | null;
    byVerdict: Array<{ verdict: string; attempts: number }>;
    conversations: Array<{ scenario: string; sessions: number; ended: number; avgReplies: number }>;
  };
};

export type AuditEntry = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  summary: string | null;
  createdAt: string;
  admin: string;
};

// Small helpers that keep the calls below on one line each.
const json = (method: "POST" | "PATCH" | "PUT" | "DELETE", body?: unknown) => ({ method, body });
const enc = encodeURIComponent;
/** `?force=true` tells the server to delete even when learners have progress on the item. */
const forceQuery = (force?: boolean) => (force ? "?force=true" : "");

/** Every admin endpoint, grouped by dashboard page. */
export const admin = {
  languages: () => apiFetch<{ languages: AdminLanguage[] }>("/admin/languages"),
  createLanguage: (body: Omit<AdminLanguage, "id" | "isActive" | "counts" | "sortOrder">) =>
    apiFetch("/admin/languages", json("POST", body)),
  publishLanguage: (code: string, published: boolean) =>
    apiFetch(`/admin/languages/${enc(code)}/publish`, json("POST", { published })),

  content: (language: string) => apiFetch<ContentTree>(`/admin/content?language=${enc(language)}`),
  createCourse: (body: { languageCode: string; title: string; description: string }) =>
    apiFetch("/admin/courses", json("POST", body)),
  createUnit: (body: { courseId: string; title: string; description: string; stage: string }) =>
    apiFetch("/admin/units", json("POST", body)),
  createLesson: (body: { unitId: string; title: string; introText: string; kind: LessonKind }) =>
    apiFetch<{ lesson: { id: string } }>("/admin/lessons", json("POST", body)),
  update: (type: "courses" | "units" | "lessons", id: string, body: Record<string, unknown>) =>
    apiFetch(`/admin/${type}/${enc(id)}`, { method: "PATCH", body }),
  publish: (type: "courses" | "units" | "lessons", id: string, published: boolean) =>
    apiFetch(`/admin/${type}/${enc(id)}/publish`, json("POST", { published })),
  move: (type: "units" | "lessons" | "exercises", id: string, direction: "up" | "down") =>
    apiFetch(`/admin/${type}/${enc(id)}/move`, json("POST", { direction })),
  remove: (
    type: "courses" | "units" | "lessons" | "exercises" | "languages",
    id: string,
    force?: boolean,
  ) => apiFetch(`/admin/${type}/${enc(id)}${forceQuery(force)}`, { method: "DELETE" }),

  lesson: (id: string) => apiFetch<{ lesson: AdminLesson }>(`/admin/lessons/${enc(id)}`),
  createExercise: (lessonId: string, body: ExerciseBody) =>
    apiFetch("/admin/exercises", json("POST", { ...body, lessonId })),
  updateExercise: (id: string, body: ExerciseBody) =>
    apiFetch(`/admin/exercises/${enc(id)}`, json("PUT", body)),

  vocabulary: (language: string, search?: string) =>
    apiFetch<{ vocabulary: AdminVocabulary[] }>(
      `/admin/vocabulary?language=${enc(language)}${search ? `&search=${enc(search)}` : ""}`,
    ),
  createVocabulary: (languageCode: string, body: Omit<AdminVocabulary, "id" | "lessons">) =>
    apiFetch("/admin/vocabulary", json("POST", { ...body, languageCode })),
  updateVocabulary: (id: string, body: Partial<Omit<AdminVocabulary, "id" | "lessons">>) =>
    apiFetch(`/admin/vocabulary/${enc(id)}`, { method: "PATCH", body }),
  deleteVocabulary: (id: string) => apiFetch(`/admin/vocabulary/${enc(id)}`, { method: "DELETE" }),

  knowledge: (filters: { language?: string; origin?: string; status?: string }) => {
    const query = new URLSearchParams(
      Object.entries(filters).filter(([, v]) => v) as Array<[string, string]>,
    );
    return apiFetch<{
      documents: KnowledgeDoc[];
      totals: { documents: number; chunks: number };
      indexing: boolean;
      searchEnabled: boolean;
    }>(`/admin/knowledge${query.size ? `?${query}` : ""}`);
  },
  knowledgeDoc: (id: string) =>
    apiFetch<{ document: KnowledgeDocDetail }>(`/admin/knowledge/${enc(id)}`),
  createKnowledge: (languageCode: string, body: KnowledgeInput) =>
    apiFetch<{ document: KnowledgeDocDetail & { preview: KnowledgeChunkPreview[] } }>(
      "/admin/knowledge",
      json("POST", { ...body, languageCode }),
    ),
  updateKnowledge: (id: string, body: Partial<KnowledgeInput>) =>
    apiFetch<{ document: KnowledgeDocDetail & { preview: KnowledgeChunkPreview[] } }>(
      `/admin/knowledge/${enc(id)}`,
      { method: "PATCH", body },
    ),
  previewKnowledge: (id: string) =>
    apiFetch<{ chunks: KnowledgeChunkPreview[] }>(`/admin/knowledge/${enc(id)}/preview`),
  publishKnowledge: (id: string, published: boolean) =>
    apiFetch<{ status: string; indexed: boolean; chunks: number; message?: string }>(
      `/admin/knowledge/${enc(id)}/publish`,
      { ...json("POST", { published }), timeoutMs: 180_000 },
    ),
  reindexKnowledge: (id: string) =>
    apiFetch<{ chunks: number }>(`/admin/knowledge/${enc(id)}/reindex`, {
      method: "POST",
      timeoutMs: 180_000,
    }),
  reindexAll: () =>
    apiFetch<{
      report: {
        embedded: string[];
        skipped: string[];
        removed: string[];
        drafts: string[];
        seconds: number;
      };
    }>("/admin/knowledge-reindex", { method: "POST", timeoutMs: 600_000 }),
  deleteKnowledge: (id: string) => apiFetch(`/admin/knowledge/${enc(id)}`, { method: "DELETE" }),

  analytics: (days: number, language?: string) =>
    apiFetch<Analytics>(
      `/admin/analytics?days=${days}${language ? `&language=${enc(language)}` : ""}`,
    ),
  auditLog: () => apiFetch<{ entries: AuditEntry[] }>("/admin/audit-log"),
};
