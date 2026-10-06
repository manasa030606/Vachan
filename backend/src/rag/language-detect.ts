// Works out which language a question is about, when the caller did not say.
//   1. A language named in English: "… in Telugu?"           → te
//   2. Native script in the question: "What is అమ్మ?"        → te (Telugu Unicode block)
// If neither (or several different languages) is found, retrieval searches all languages.
import type { LanguageCode } from "./types.ts";

const NAME_PATTERNS: Array<[LanguageCode, RegExp]> = [
  ["hi", /\bhindi\b/i],
  ["te", /\btelugu\b/i],
  ["ta", /\btamil\b/i],
  ["ml", /\bmalayalam\b/i],
  ["kn", /\bkannada\b/i],
  ["bn", /\b(bengali|bangla)\b/i],
];

/** Unicode blocks of the six scripts. */
const SCRIPT_BLOCKS: Array<[LanguageCode, number, number]> = [
  ["hi", 0x0900, 0x097f], // Devanagari
  ["bn", 0x0980, 0x09ff], // Bengali
  ["ta", 0x0b80, 0x0bff], // Tamil
  ["te", 0x0c00, 0x0c7f], // Telugu
  ["kn", 0x0c80, 0x0cff], // Kannada
  ["ml", 0x0d00, 0x0d7f], // Malayalam
];

export function detectScripts(text: string): LanguageCode[] {
  const found = new Set<LanguageCode>();
  for (const char of text) {
    const code = char.codePointAt(0)!;
    for (const [language, start, end] of SCRIPT_BLOCKS) {
      if (code >= start && code <= end) found.add(language);
    }
  }
  return [...found];
}

export type LanguageGuess = { code: LanguageCode; reason: "named-in-query" | "script-in-query" };

export function inferLanguage(query: string): LanguageGuess | null {
  const named = NAME_PATTERNS.filter(([, pattern]) => pattern.test(query)).map(([code]) => code);
  if (named.length === 1) return { code: named[0]!, reason: "named-in-query" };
  const scripts = detectScripts(query);
  if (named.length === 0 && scripts.length === 1)
    return { code: scripts[0]!, reason: "script-in-query" };
  return null;
}

/** Native-script words in the question (2+ letters), e.g. ["అమ్మ"] — used for exact-term bonuses. */
export function nativeTerms(query: string): string[] {
  const terms = query.normalize("NFC").match(/[\u0900-\u0D7F\u200C\u200D]{2,}/gu) ?? [];
  return [...new Set(terms)];
}
