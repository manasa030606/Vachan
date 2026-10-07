// Step 1 of the pipeline: COLLECT CONTENT from three approved sources.
//   1. Curated notes:   backend/knowledge-base/<language>/*.md
//   2. Course content:  vocabulary and letters already taught in the lessons (VocabularyItem table)
//   3. Admin notes:     written in the admin dashboard (Phase 8, KnowledgeDocument.body)
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

/**
 * Turns the course vocabulary (what the lessons teach) into one document per language,
 * with one section per topic, e.g. "Course vocabulary: Greetings".
 * This keeps the tutor consistent with the exact words and spellings used in the lessons.
 */
export async function loadCourseDocuments(prisma: PrismaClient): Promise<SourceDocument[]> {
  const items = await prisma.vocabularyItem.findMany({
    include: { language: { select: { code: true, name: true } } },
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

    const groups = new Map<string, typeof items>();
    for (const item of languageItems) {
      const key = item.kind === "LETTER" ? "Letters" : item.topic;
      groups.set(key, [...(groups.get(key) ?? []), item]);
    }

    documents.push({
      id: `course/${code}/vocabulary`,
      languageCode: code as LanguageCode,
      title: `${languageName} course vocabulary`,
      source: "Vachan course content",
      reference: `course:${code} (VocabularyItem table, taught in the ${languageName} lessons)`,
      defaults: {
        level: "beginner",
        topic: "vocabulary",
        skill: "vocabulary",
        contentType: "vocabulary",
      },
      sections: [...groups].map(([topic, group]) => {
        const isLetters = topic === "Letters";
        const lines = group.map(
          (item) => `${item.script} (${item.romanization}) — ${item.meaning}`,
        );
        return {
          heading: isLetters ? `Course letters and sounds` : `Course vocabulary: ${topic}`,
          body: `${languageName} ${isLetters ? "letters" : `words for ${topic.toLowerCase()}`} taught in the Vachan lessons:\n\n${lines.map((line) => `- ${line}`).join("\n")}`,
          overrides: isLetters
            ? { topic: "letters", skill: "script", contentType: "alphabet" }
            : { topic: topicSlug(topic) },
        };
      }),
    });
  }
  return documents;
}

/** Phase 8: a document written in the admin dashboard, in the same format as the files. */
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
