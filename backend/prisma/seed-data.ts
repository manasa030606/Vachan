// Demo content for all six languages, used by prisma/seed.ts.
// Kept intentionally small: a few letters, six common words and one sentence per language —
// enough to demonstrate the full course structure (spec section 18: "a complete vertical slice").
// Romanization is kept simple (no diacritics) so beginners can read it.

export type SeedWord = { script: string; romanization: string; meaning: string; topic: string };
export type SeedLetter = { script: string; romanization: string; kind: "vowel" | "consonant" };

export type SeedLanguage = {
  code: string;
  name: string;
  nativeName: string;
  scriptName: string;
  description: string;
  /** a, aa, ka (Bengali: o, aa, ko) */
  letters: [SeedLetter, SeedLetter, SeedLetter];
  words: {
    hello: SeedWord;
    thankYou: SeedWord;
    water: SeedWord;
    mother: SeedWord;
    yes: SeedWord;
    name: SeedWord;
  };
  /** "My name is Asha." word by word: [script, romanization] */
  sentence: Array<[string, string]>;
  /** Index of the word meaning "name" inside `sentence`. */
  nameIndex: number;
};

const w = (script: string, romanization: string, meaning: string, topic: string): SeedWord => ({
  script,
  romanization,
  meaning,
  topic,
});

const vowel = (script: string, romanization: string): SeedLetter => ({
  script,
  romanization,
  kind: "vowel",
});
const consonant = (script: string, romanization: string): SeedLetter => ({
  script,
  romanization,
  kind: "consonant",
});

export const SEED_LANGUAGES: SeedLanguage[] = [
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    scriptName: "Devanagari",
    description: "Spoken widely across North and Central India, written in Devanagari.",
    letters: [vowel("अ", "a"), vowel("आ", "aa"), consonant("क", "ka")],
    words: {
      hello: w("नमस्ते", "namaste", "Hello", "Greetings"),
      thankYou: w("धन्यवाद", "dhanyavaad", "Thank you", "Greetings"),
      water: w("पानी", "paani", "Water", "Food & drink"),
      mother: w("माँ", "maa", "Mother", "Family"),
      yes: w("हाँ", "haan", "Yes", "Basics"),
      name: w("नाम", "naam", "Name", "Introductions"),
    },
    sentence: [
      ["मेरा", "mera"],
      ["नाम", "naam"],
      ["आशा", "Asha"],
      ["है", "hai"],
    ],
    nameIndex: 1,
  },
  {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    scriptName: "Telugu script",
    description: "The language of Andhra Pradesh and Telangana, known for its rounded letters.",
    letters: [vowel("అ", "a"), vowel("ఆ", "aa"), consonant("క", "ka")],
    words: {
      hello: w("నమస్కారం", "namaskaaram", "Hello", "Greetings"),
      thankYou: w("ధన్యవాదాలు", "dhanyavaadaalu", "Thank you", "Greetings"),
      water: w("నీళ్ళు", "neellu", "Water", "Food & drink"),
      mother: w("అమ్మ", "amma", "Mother", "Family"),
      yes: w("అవును", "avunu", "Yes", "Basics"),
      name: w("పేరు", "peru", "Name", "Introductions"),
    },
    sentence: [
      ["నా", "naa"],
      ["పేరు", "peru"],
      ["ఆశ", "Asha"],
    ],
    nameIndex: 1,
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    scriptName: "Tamil script",
    description: "One of the world's oldest living classical languages, spoken in Tamil Nadu.",
    letters: [vowel("அ", "a"), vowel("ஆ", "aa"), consonant("க", "ka")],
    words: {
      hello: w("வணக்கம்", "vanakkam", "Hello", "Greetings"),
      thankYou: w("நன்றி", "nandri", "Thank you", "Greetings"),
      water: w("தண்ணீர்", "thanneer", "Water", "Food & drink"),
      mother: w("அம்மா", "amma", "Mother", "Family"),
      yes: w("ஆம்", "aam", "Yes", "Basics"),
      name: w("பெயர்", "peyar", "Name", "Introductions"),
    },
    sentence: [
      ["என்", "en"],
      ["பெயர்", "peyar"],
      ["ஆஷா", "Asha"],
    ],
    nameIndex: 1,
  },
  {
    code: "ml",
    name: "Malayalam",
    nativeName: "മലയാളം",
    scriptName: "Malayalam script",
    description: "The language of Kerala, written in a graceful, curved script.",
    letters: [vowel("അ", "a"), vowel("ആ", "aa"), consonant("ക", "ka")],
    words: {
      hello: w("നമസ്കാരം", "namaskaaram", "Hello", "Greetings"),
      thankYou: w("നന്ദി", "nandi", "Thank you", "Greetings"),
      water: w("വെള്ളം", "vellam", "Water", "Food & drink"),
      mother: w("അമ്മ", "amma", "Mother", "Family"),
      yes: w("അതെ", "athe", "Yes", "Basics"),
      name: w("പേര്", "peru", "Name", "Introductions"),
    },
    sentence: [
      ["എന്റെ", "ente"],
      ["പേര്", "peru"],
      ["ആശ", "Asha"],
    ],
    nameIndex: 1,
  },
  {
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    scriptName: "Kannada script",
    description: "The language of Karnataka, with a script closely related to Telugu.",
    letters: [vowel("ಅ", "a"), vowel("ಆ", "aa"), consonant("ಕ", "ka")],
    words: {
      hello: w("ನಮಸ್ಕಾರ", "namaskaara", "Hello", "Greetings"),
      thankYou: w("ಧನ್ಯವಾದ", "dhanyavaada", "Thank you", "Greetings"),
      water: w("ನೀರು", "neeru", "Water", "Food & drink"),
      mother: w("ಅಮ್ಮ", "amma", "Mother", "Family"),
      yes: w("ಹೌದು", "haudu", "Yes", "Basics"),
      name: w("ಹೆಸರು", "hesaru", "Name", "Introductions"),
    },
    sentence: [
      ["ನನ್ನ", "nanna"],
      ["ಹೆಸರು", "hesaru"],
      ["ಆಶಾ", "Asha"],
    ],
    nameIndex: 1,
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    scriptName: "Bengali script",
    description: "The language of West Bengal and Bangladesh, rich in literature and song.",
    letters: [vowel("অ", "o"), vowel("আ", "aa"), consonant("ক", "ko")],
    words: {
      hello: w("নমস্কার", "nomoshkar", "Hello", "Greetings"),
      thankYou: w("ধন্যবাদ", "dhonnobad", "Thank you", "Greetings"),
      water: w("জল", "jol", "Water", "Food & drink"),
      mother: w("মা", "maa", "Mother", "Family"),
      yes: w("হ্যাঁ", "hyaan", "Yes", "Basics"),
      name: w("নাম", "naam", "Name", "Introductions"),
    },
    sentence: [
      ["আমার", "amar"],
      ["নাম", "naam"],
      ["আশা", "Asha"],
    ],
    nameIndex: 1,
  },
];

/** A development-only account so you can log in immediately after seeding. */
export const DEMO_USER = {
  email: "demo@vachan.dev",
  password: "Vachan2026!",
  displayName: "Demo Learner",
  languageCode: "hi",
};
