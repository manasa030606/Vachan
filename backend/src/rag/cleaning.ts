// Step 2 of the pipeline: CLEANING.
// Makes text consistent before it is chunked and embedded, so the same word always produces
// the same characters (and therefore the same embedding).

/** Zero-width / invisible characters that carry no meaning. (ZWJ/ZWNJ are kept: they change
 *  how Malayalam and Bengali letters are drawn.) */
const INVISIBLE = /[\u200B\u2060\uFEFF\u00AD]/g;

/**
 * Cleans one block of markdown text:
 *  1. Unicode NFC — the same Indian-script letter can be stored in two ways; NFC picks one.
 *  2. Removes invisible characters and HTML comments (metadata comments were read earlier).
 *  3. Removes markdown decoration (**bold**, _italics_, `code`, [links](url)) but keeps the words.
 *  4. Normalises whitespace: single spaces, at most one blank line between paragraphs.
 */
export function cleanText(input: string): string {
  return input
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .replace(INVISIBLE, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(^|[\s(])[*_]([^*_\n]+)[*_](?=[\s).,;:!?]|$)/g, "$1$2")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{3,6}\s+/gm, "")
    .replace(/^[ \t]*[-*+][ \t]+/gm, "• ")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Cleans a single-line value such as a heading or a front-matter value. */
export function cleanLine(input: string): string {
  return cleanText(input).replace(/\s+/g, " ");
}
