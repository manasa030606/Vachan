// Step 1 of the pipeline: CONTENT → SourceDocument.
// Reads a knowledge-base markdown file: front matter (metadata defaults) + `##` sections
// (each with optional `<!-- key: value; key: value -->` metadata overrides).
import { KNOWLEDGE_LEVELS, type KnowledgeLevelName } from "./config.ts";
import { cleanLine } from "./cleaning.ts";
import {
  CONTENT_TYPES,
  LANGUAGE_CODES,
  SKILLS,
  type ChunkMetadata,
  type ContentTypeName,
  type LanguageCode,
  type SkillName,
  type SourceDocument,
  type SourceSection,
} from "./types.ts";

export class KnowledgeFormatError extends Error {
  constructor(file: string, message: string) {
    super(`${file}: ${message}`);
    this.name = "KnowledgeFormatError";
  }
}

const isOneOf = <T extends string>(list: readonly T[], value: string): value is T =>
  (list as readonly string[]).includes(value);

const TOPIC_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Validates one metadata key/value pair and returns it in ChunkMetadata form. */
function parseMetaValue(file: string, key: string, value: string): Partial<ChunkMetadata> {
  switch (key) {
    case "level":
      if (!isOneOf(KNOWLEDGE_LEVELS, value))
        throw new KnowledgeFormatError(file, `level "${value}" must be one of ${KNOWLEDGE_LEVELS}`);
      return { level: value as KnowledgeLevelName };
    case "type":
      if (!isOneOf(CONTENT_TYPES, value))
        throw new KnowledgeFormatError(file, `type "${value}" must be one of ${CONTENT_TYPES}`);
      return { contentType: value as ContentTypeName };
    case "skill":
      if (!isOneOf(SKILLS, value))
        throw new KnowledgeFormatError(file, `skill "${value}" must be one of ${SKILLS}`);
      return { skill: value as SkillName };
    case "topic":
      if (!TOPIC_PATTERN.test(value))
        throw new KnowledgeFormatError(file, `topic "${value}" must be a lowercase-slug`);
      return { topic: value };
    default:
      throw new KnowledgeFormatError(file, `unknown metadata key "${key}"`);
  }
}

/** `<!-- topic: pronouns; level: elementary -->` → { topic: "pronouns", level: "elementary" } */
export function parseMetaComment(file: string, comment: string): Partial<ChunkMetadata> {
  const inner = comment.replace(/^<!--/, "").replace(/-->$/, "").trim();
  const result: Partial<ChunkMetadata> = {};
  for (const pair of inner.split(";")) {
    if (!pair.trim()) continue;
    const [key, ...rest] = pair.split(":");
    Object.assign(result, parseMetaValue(file, key!.trim(), rest.join(":").trim()));
  }
  return result;
}

/** Splits "---\nkey: value\n---\nbody" into the key/value map and the body. */
function splitFrontMatter(file: string, text: string) {
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text);
  if (!match) throw new KnowledgeFormatError(file, "missing front matter (--- … ---)");
  const values: Record<string, string> = {};
  for (const line of match[1]!.split("\n")) {
    if (!line.trim()) continue;
    const index = line.indexOf(":");
    if (index === -1) throw new KnowledgeFormatError(file, `bad front matter line "${line}"`);
    values[line.slice(0, index).trim()] = line.slice(index + 1).trim();
  }
  return { values, body: match[2]! };
}

/**
 * Parses a knowledge-base markdown file.
 * @param relativePath e.g. "te/phrases.md" (used for the document id and reference)
 */
export function parseKnowledgeFile(relativePath: string, rawText: string): SourceDocument {
  const text = rawText.normalize("NFC").replace(/\r\n?/g, "\n");
  const { values, body } = splitFrontMatter(relativePath, text);

  for (const key of ["language", "title", "type", "level", "skill", "topic", "source"]) {
    if (!values[key]) throw new KnowledgeFormatError(relativePath, `front matter needs "${key}"`);
  }
  const language = values.language!;
  if (!isOneOf(LANGUAGE_CODES, language)) {
    throw new KnowledgeFormatError(relativePath, `language "${language}" is not supported`);
  }

  const defaults = {
    ...parseMetaValue(relativePath, "level", values.level!),
    ...parseMetaValue(relativePath, "type", values.type!),
    ...parseMetaValue(relativePath, "skill", values.skill!),
    ...parseMetaValue(relativePath, "topic", values.topic!),
  } as ChunkMetadata;

  // Split at "## " headings. Text before the first one (the "# Title" line) is ignored.
  const sections: SourceSection[] = [];
  const parts = body.split(/^## +/m).slice(1);
  for (const part of parts) {
    const newline = part.indexOf("\n");
    const heading = cleanLine(newline === -1 ? part : part.slice(0, newline));
    let sectionBody = newline === -1 ? "" : part.slice(newline + 1);
    let overrides: Partial<ChunkMetadata> = {};
    const meta = /^\s*(<!--[\s\S]*?-->)/.exec(sectionBody);
    if (meta) {
      overrides = parseMetaComment(relativePath, meta[1]!);
      sectionBody = sectionBody.slice(meta[0].length);
    }
    if (!heading) throw new KnowledgeFormatError(relativePath, "empty ## heading");
    sections.push({ heading, body: sectionBody, overrides });
  }
  if (sections.length === 0) {
    throw new KnowledgeFormatError(relativePath, "no ## sections found");
  }

  return {
    id: relativePath.replace(/\.md$/, ""),
    languageCode: language as LanguageCode,
    title: cleanLine(values.title!),
    source: cleanLine(values.source!),
    reference: `backend/knowledge-base/${relativePath}`,
    defaults,
    sections,
  };
}
