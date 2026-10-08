// The six Vachan languages: names for the UI and their course content.
import type { LanguageMeta } from "../course-builder.ts";
import { content as bn } from "./languages/bn.ts";
import { content as hi } from "./languages/hi.ts";
import { content as kn } from "./languages/kn.ts";
import { content as ml } from "./languages/ml.ts";
import { content as ta } from "./languages/ta.ts";
import { content as te } from "./languages/te.ts";
import type { LanguageContent } from "./types.ts";

export type SeedLanguage = LanguageMeta & { content: LanguageContent };

export const SEED_LANGUAGES: SeedLanguage[] = [
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    scriptName: "Devanagari",
    description: "Spoken widely across North and Central India, written in Devanagari.",
    content: hi,
  },
  {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    scriptName: "Telugu script",
    description: "The language of Andhra Pradesh and Telangana, known for its rounded letters.",
    content: te,
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    scriptName: "Tamil script",
    description: "One of the world's oldest living classical languages, spoken in Tamil Nadu.",
    content: ta,
  },
  {
    code: "ml",
    name: "Malayalam",
    nativeName: "മലയാളം",
    scriptName: "Malayalam script",
    description: "The language of Kerala, written in a graceful, curved script.",
    content: ml,
  },
  {
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    scriptName: "Kannada script",
    description: "The language of Karnataka, with a script closely related to Telugu.",
    content: kn,
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    scriptName: "Bengali script",
    description: "The language of West Bengal and Bangladesh, rich in literature and song.",
    content: bn,
  },
];
