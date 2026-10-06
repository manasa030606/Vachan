// Shapes that move through the pipeline:
//   SourceDocument → (cleaning, chunking) → PreparedChunk → (embedding) → stored KnowledgeChunk row
import type { KnowledgeLevelName } from "./config.ts";

export const CONTENT_TYPES = [
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
export type ContentTypeName = (typeof CONTENT_TYPES)[number];

export const SKILLS = [
  "script",
  "pronunciation",
  "vocabulary",
  "grammar",
  "conversation",
  "culture",
] as const;
export type SkillName = (typeof SKILLS)[number];

export const LANGUAGE_CODES = ["hi", "te", "ta", "ml", "kn", "bn"] as const;
export type LanguageCode = (typeof LANGUAGE_CODES)[number];

/** Metadata attached to every chunk (front matter, possibly overridden per section). */
export type ChunkMetadata = {
  level: KnowledgeLevelName;
  topic: string;
  skill: SkillName;
  contentType: ContentTypeName;
};

/** One section of a source document (a `##` heading and its text). */
export type SourceSection = {
  heading: string;
  /** Raw section text (markdown), without the heading line. */
  body: string;
  /** Metadata overrides from a `<!-- key: value -->` comment under the heading. */
  overrides: Partial<ChunkMetadata>;
};

/** A document before cleaning/chunking: a markdown file, or course content from the database. */
export type SourceDocument = {
  /** Stable id, e.g. "te/phrases" or "course/te/vocabulary" */
  id: string;
  languageCode: LanguageCode;
  title: string;
  source: string;
  /** File path (or course reference) of the original content */
  reference: string;
  defaults: ChunkMetadata;
  sections: SourceSection[];
};

/** A chunk ready to be embedded and stored. */
export type PreparedChunk = ChunkMetadata & {
  id: string;
  documentId: string;
  languageCode: LanguageCode;
  source: string;
  reference: string;
  heading: string;
  /** Clean text for display / the tutor prompt */
  content: string;
  /** Text that is actually embedded: language + document title + heading + content */
  embeddingText: string;
  contentHash: string;
};
