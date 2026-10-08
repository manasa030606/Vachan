// Step 1 of the pipeline: COLLECT CONTENT from three approved sources.
//   1. Curated notes:   backend/knowledge-base/<language>/*.md
//   2. Course content:  words, phrases and letters taught in the lessons (VocabularyItem table)
//   3. Admin notes:     written in the admin dashboard (KnowledgeDocument.body)
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { PrismaClient } from "../generated/prisma/client.ts";
import { RAG_PATHS } from "./config.ts";
import { parseKnowledgeFile } from "./document-parser.ts";
import { LANGUAGE_CODES, type LanguageCode, type SourceDocument } from "./types.ts";

/** Reads every knowledge-base markdown file (sorted, so ids and order are stable). */
export async function loadKnowledgeFiles(
  root: string = RAG_PATHS.knowledgeBase,
): Promise<SourceDocument[]> {
  const documents: SourceDocument[] = [];
  for (const language of LANGUAGE_CODES) {
    let files: string[];
    try {
      files = (await readdir(join(root, language))).filter((file) => file.endsWith(".md")).sort();
    } catch {
      continue; // no folder for this language yet
    }
    for (const file of files) {
      const relativePath = `${language}/${file}`;
      documents.push(
        parseKnowledgeFile(relativePath, await readFile(join(root, relativePath), "utf8")),
      );
    }
  }
  return documents;
}

/** Course topic names → the topic slugs used in the knowledge-base files (so topic filters match both). */
const COURSE_TOPIC_SLUGS: Record<string, string> = {
  "food-and-drink": "food",
  phrases: "everyday-phrases",
};

const topicSlug = (topic: string) => {
  const slug = topic
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return COURSE_TOPIC_SLUGS[slug] ?? slug;
};

/** Course word lists are cut into sections of about this many characters (one chunk each). */
const WORD_SECTION_CHARS = 900;

type CourseItem = {
  script: string;
  romanization: string;
  meaning: string;
  topic: string;
  notes: string | null;
  lessons: Array<{ title: string; unit: { title: string; sortOrder: number } }>;
};

const wordLine = (item: CourseItem) => `- ${item.script} (${item.romanization}) — ${item.meaning}`;

/** One self-contained section per word or phrase: what it means, how to use it, where it is taught. */
const itemSection = (item: CourseItem, languageName: string) => ({
  heading: `${item.meaning} — ${item.script} (${item.romanization})`,
  body: `How to say "${item.meaning}" in ${languageName}: ${item.script} (${item.romanization}).${item.notes ? ` ${item.notes}` : ""}${taughtIn(item)}`,
  overrides: { topic: topicSlug(item.topic) },
});

/** Packs list lines into sections of at most WORD_SECTION_CHARS (a long topic becomes "part 2", …). */
function packLines(lines: string[]): string[][] {
  const groups: string[][] = [];
  let current: string[] = [];
  let size = 0;
  for (const line of lines) {
    if (current.length && size + line.length > WORD_SECTION_CHARS) {
      groups.push(current);
      current = [];
      size = 0;
    }
    current.push(line);
    size += line.length + 1;
  }
  if (current.length) groups.push(current);
  return groups;
}

const taughtIn = (item: CourseItem) => {
  const lesson = item.lessons[0];
  return lesson
    ? ` It is taught in the lesson "${lesson.title}" (unit ${lesson.unit.sortOrder}, ${lesson.unit.title}).`
    : "";
};

/**
 * Turns the course content (what the lessons teach) into knowledge-base documents, so the tutor
 * uses exactly the words and spellings of the lessons:
 *   - course/<code>/vocabulary: word and letter lists, grouped by topic ("Course vocabulary: Family")
 *   - course/<code>/words:      one section per word, with its usage notes and the lesson that teaches it
 *   - course/<code>/phrases:    one section per phrase, with its usage notes (polite/casual forms,
 *                               gender, alternatives) and the lesson that teaches it
 */
export async function loadCourseDocuments(prisma: PrismaClient): Promise<SourceDocument[]> {
  const items = await prisma.vocabularyItem.findMany({
    include: {
      language: { select: { code: true, name: true } },
      lessons: {
        where: { isPublished: true },
        select: { title: true, unit: { select: { title: true, sortOrder: true } } },
        orderBy: { unit: { sortOrder: "asc" } },
        take: 1,
      },
    },
    orderBy: [{ topic: "asc" }, { script: "asc" }],
  });

  const byLanguage = new Map<string, typeof items>();
  for (const item of items) {
    const list = byLanguage.get(item.language.code) ?? [];
    list.push(item);
    byLanguage.set(item.language.code, list);
  }

  const documents: SourceDocument[] = [];
  for (const [code, languageItems] of byLanguage) {
    if (!(LANGUAGE_CODES as readonly string[]).includes(code)) continue;
    const languageName = languageItems[0]!.language.name;
    const languageCode = code as LanguageCode;
    const reference = `course:${code} (VocabularyItem table, taught in the ${languageName} lessons)`;

    // Words and letters, grouped by topic.
    const groups = new Map<string, typeof items>();
    for (const item of languageItems.filter((row) => row.kind !== "PHRASE")) {
      const key = item.kind === "LETTER" ? "Letters" : item.topic;
      groups.set(key, [...(groups.get(key) ?? []), item]);
    }
    const wordSections = [...groups].flatMap(([topic, group]) => {
      const isLetters = topic === "Letters";
      const parts = packLines(group.map(wordLine));
      return parts.map((lines, index) => {
        const heading = isLetters ? "Course letters and sounds" : `Course vocabulary: ${topic}`;
        return {
          heading: index === 0 ? heading : `${heading} (part ${index + 1})`,
          body: `${languageName} ${isLetters ? "letters" : `words for ${topic.toLowerCase()}`} taught in the Vachan lessons:\n\n${lines.join("\n")}`,
          overrides: isLetters
            ? { topic: "letters", skill: "script" as const, contentType: "alphabet" as const }
            : { topic: topicSlug(topic) },
        };
      });
    });
    documents.push({
      id: `course/${code}/vocabulary`,
      languageCode,
      title: `${languageName} course vocabulary`,
      source: "Vachan course content",
      reference,
      defaults: {
        level: "beginner",
        topic: "vocabulary",
        skill: "vocabulary",
        contentType: "vocabulary",
      },
      sections: wordSections,
    });

    // Words and phrases: one self-contained section each (what a learner usually asks about).
    const words = languageItems.filter((row) => row.kind === "WORD");
    if (words.length) {
      documents.push({
        id: `course/${code}/words`,
        languageCode,
        title: `${languageName} course words`,
        source: "Vachan course content",
        reference,
        defaults: {
          level: "beginner",
          topic: "vocabulary",
          skill: "vocabulary",
          contentType: "vocabulary",
        },
        sections: words.map((item) => itemSection(item, languageName)),
      });
    }
    const phrases = languageItems.filter((row) => row.kind === "PHRASE");
    if (phrases.length) {
      documents.push({
        id: `course/${code}/phrases`,
        languageCode,
        title: `${languageName} course phrases`,
        source: "Vachan course content",
        reference,
        defaults: {
          level: "beginner",
          topic: "everyday-phrases",
          skill: "conversation",
          contentType: "phrase",
        },
        sections: phrases.map((item) => itemSection(item, languageName)),
      });
    }
  }
  return documents;
}

/** A document written in the admin dashboard, in the same format as the files. */
export type AdminDocumentRow = {
  id: string;
  languageCode: string;
  title: string;
  source: string;
  level: string | null;
  topic: string | null;
  contentType: string | null;
  skill: string | null;
  body: string | null;
};

const fromEnum = (value: string | null, fallback: string) =>
  (value ?? fallback).toLowerCase().replace(/_/g, "-");

/**
 * Turns an admin document into a SourceDocument by giving it the same front matter a file has,
 * so it goes through exactly the same parsing, validation and chunking.
 * Throws KnowledgeFormatError with a readable message when the text has no "## " sections etc.
 */
export function adminDocumentSource(row: AdminDocumentRow): SourceDocument {
  const frontMatter = [
    "---",
    `language: ${row.languageCode}`,
    `title: ${row.title.replace(/\n/g, " ")}`,
    `type: ${fromEnum(row.contentType, "explanation")}`,
    `level: ${fromEnum(row.level, "beginner")}`,
    `skill: ${fromEnum(row.skill, "vocabulary")}`,
    `topic: ${row.topic ?? "general"}`,
    `source: ${row.source.replace(/\n/g, " ")}`,
    "---",
    "",
  ].join("\n");
  const parsed = parseKnowledgeFile(`${row.id}.md`, frontMatter + (row.body ?? ""));
  return { ...parsed, id: row.id, reference: `admin-dashboard:${row.id}` };
}

/** Published admin documents (drafts are never indexed). */
export async function loadAdminDocuments(prisma: PrismaClient): Promise<SourceDocument[]> {
  const rows = await prisma.knowledgeDocument.findMany({
    where: { origin: "ADMIN", status: "PUBLISHED" },
    orderBy: { id: "asc" },
  });
  return rows.map(adminDocumentSource);
}
