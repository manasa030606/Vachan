// Step 3 of the pipeline: CHUNKING.
//
// Rule: one `##` section = one concept = one chunk. Concepts are not cut in the middle, so a
// retrieved chunk always makes sense on its own. Only a section longer than
// RAG_CONFIG.chunking.maxChars is split — first at `###` sub-headings, then between paragraphs —
// and every part keeps the section heading so it still has context.
import { createHash } from "node:crypto";
import { RAG_CONFIG } from "./config.ts";
import { cleanText } from "./cleaning.ts";
import type { PreparedChunk, SourceDocument } from "./types.ts";

export const LANGUAGE_NAMES: Record<string, string> = {
  hi: "Hindi",
  te: "Telugu",
  ta: "Tamil",
  ml: "Malayalam",
  kn: "Kannada",
  bn: "Bengali",
};

/** "Hello — నమస్కారం (namaskaaram)" → "hello-namaskaaram" (only the Latin letters are kept). */
export function slugify(heading: string): string {
  return heading
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");
}

export const sha256 = (text: string) => createHash("sha256").update(text).digest("hex");

/** Splits a long text into parts of at most `maxChars`, at ### headings first, then paragraphs. */
export function splitLongText(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) return [text];

  const blocks = text
    .split(/\n(?=###\s)/)
    .flatMap((block) => (block.length > maxChars ? block.split(/\n\s*\n/) : [block]))
    .map((block) => block.trim())
    .filter(Boolean);

  const parts: string[] = [];
  let current = "";
  for (const block of blocks) {
    if (current && current.length + block.length + 2 > maxChars) {
      parts.push(current);
      current = block;
    } else {
      current = current ? `${current}\n\n${block}` : block;
    }
  }
  if (current) parts.push(current);
  return parts;
}

/** Turns a parsed document into chunks (cleaned text + metadata + a stable id). */
export function chunkDocument(
  document: SourceDocument,
  maxChars: number = RAG_CONFIG.chunking.maxChars,
): PreparedChunk[] {
  const languageName = LANGUAGE_NAMES[document.languageCode] ?? document.languageCode;
  const usedIds = new Set<string>();
  const chunks: PreparedChunk[] = [];

  document.sections.forEach((section, sectionIndex) => {
    const metadata = { ...document.defaults, ...section.overrides };
    const baseSlug = slugify(section.heading) || `section-${sectionIndex + 1}`;
    // Split first (### markers are still there), then clean each part.
    const parts = splitLongText(section.body.trim(), maxChars)
      .map(cleanText)
      .filter((part) => part);

    parts.forEach((content, partIndex) => {
      let id = `${document.id}#${baseSlug}${parts.length > 1 ? `-part-${partIndex + 1}` : ""}`;
      for (let n = 2; usedIds.has(id); n++) id = `${document.id}#${baseSlug}-${n}`;
      usedIds.add(id);

      const heading =
        parts.length > 1
          ? `${section.heading} (${partIndex + 1}/${parts.length})`
          : section.heading;
      // The embedded text carries its context: a chunk about "Hello" is also about *Telugu*.
      const embeddingText = `${languageName} — ${document.title} — ${heading}\n${content}`;

      chunks.push({
        ...metadata,
        id,
        documentId: document.id,
        languageCode: document.languageCode,
        source: document.source,
        reference: `${document.reference}#${baseSlug}`,
        heading,
        content,
        embeddingText,
        contentHash: sha256(
          JSON.stringify([embeddingText, metadata, document.source, document.reference]),
        ),
      });
    });
  });

  return chunks;
}
