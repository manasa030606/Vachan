// The six languages Vachan supports.
// The backend database is the source of truth for names and descriptions (GET /api/languages);
// this file adds the visual theme and is also used by the static landing page.
import type { Language, LanguageCode } from "@/types/learning";

export const LANGUAGES: Language[] = [
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    scriptName: "Devanagari",
    glyph: "हि",
    description: "Spoken widely across North and Central India, written in Devanagari.",
    theme: { tile: "bg-orange-500 text-white", soft: "bg-orange-50", ring: "ring-orange-400" },
  },
  {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    scriptName: "Telugu script",
    glyph: "తె",
    description: "The language of Andhra Pradesh and Telangana, known for its rounded letters.",
    theme: { tile: "bg-brand-600 text-white", soft: "bg-brand-50", ring: "ring-brand-400" },
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    scriptName: "Tamil script",
    glyph: "த",
    description: "One of the world's oldest living classical languages, spoken in Tamil Nadu.",
    theme: { tile: "bg-rose-600 text-white", soft: "bg-rose-50", ring: "ring-rose-400" },
  },
  {
    code: "ml",
    name: "Malayalam",
    nativeName: "മലയാളം",
    scriptName: "Malayalam script",
    glyph: "മ",
    description: "The language of Kerala, written in a graceful, curved script.",
    theme: { tile: "bg-emerald-600 text-white", soft: "bg-emerald-50", ring: "ring-emerald-400" },
  },
  {
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    scriptName: "Kannada script",
    glyph: "ಕ",
    description: "The language of Karnataka, with a script closely related to Telugu.",
    theme: { tile: "bg-amber-500 text-ink", soft: "bg-amber-50", ring: "ring-amber-400" },
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    scriptName: "Bengali script",
    glyph: "বা",
    description: "The language of West Bengal and Bangladesh, rich in literature and song.",
    theme: { tile: "bg-teal-600 text-white", soft: "bg-teal-50", ring: "ring-teal-400" },
  },
];

export const DEFAULT_LANGUAGE_CODE: LanguageCode = "hi";

export function getLanguage(code: LanguageCode): Language {
  return LANGUAGES.find((language) => language.code === code) ?? LANGUAGES[0];
}

export function isLanguageCode(code: string): code is LanguageCode {
  return LANGUAGES.some((language) => language.code === code);
}

/**
 * Combines a language from the API (names, descriptions — stored in the database)
 * with its visual theme (glyph tile colours — a frontend concern).
 */
export function withTheme(language: {
  code: string;
  name: string;
  nativeName: string;
  scriptName: string;
  description: string;
}): Language {
  const fallback = isLanguageCode(language.code) ? getLanguage(language.code) : LANGUAGES[0];
  return {
    ...fallback,
    name: language.name,
    nativeName: language.nativeName,
    scriptName: language.scriptName,
    description: language.description,
  };
}
