// Letters for the script units, built from Unicode instead of typed by hand.
//
// The six scripts (Devanagari, Bengali, Tamil, Telugu, Kannada, Malayalam) share one Unicode
// layout: "the letter ka" is always at offset 0x15 inside the script's block, the vowel sign "i"
// at 0x3F, and so on. Each language picks which letters it teaches and in which groups; the
// glyphs themselves come from the shared offsets, so they are always correct.

export type LetterKind = "vowel" | "consonant" | "syllable";

export type Letter = {
  key: string;
  kind: LetterKind;
  script: string;
  romanization: string;
  /** How to pronounce it, in plain English. */
  hint: string;
};

const VOWEL_OFFSETS: Record<string, number> = {
  a: 0x05,
  aa: 0x06,
  i: 0x07,
  ii: 0x08,
  u: 0x09,
  uu: 0x0a,
  e_s: 0x0e,
  e: 0x0f,
  ai: 0x10,
  o_s: 0x12,
  o: 0x13,
  au: 0x14,
};

const CONSONANT_OFFSETS: Record<string, number> = {
  ka: 0x15,
  kha: 0x16,
  ga: 0x17,
  gha: 0x18,
  nga: 0x19,
  ca: 0x1a,
  cha: 0x1b,
  ja: 0x1c,
  jha: 0x1d,
  nya: 0x1e,
  Ta: 0x1f,
  Tha: 0x20,
  Da: 0x21,
  Dha: 0x22,
  Na: 0x23,
  ta: 0x24,
  tha: 0x25,
  da: 0x26,
  dha: 0x27,
  na: 0x28,
  nnna: 0x29,
  pa: 0x2a,
  pha: 0x2b,
  ba: 0x2c,
  bha: 0x2d,
  ma: 0x2e,
  ya: 0x2f,
  ra: 0x30,
  rra: 0x31,
  la: 0x32,
  La: 0x33,
  zha: 0x34,
  va: 0x35,
  sha: 0x36,
  Sha: 0x37,
  sa: 0x38,
  ha: 0x39,
};

const SIGN_OFFSETS: Record<string, number> = {
  aa: 0x3e,
  i: 0x3f,
  ii: 0x40,
  u: 0x41,
  uu: 0x42,
  e_s: 0x46,
  e: 0x47,
  ai: 0x48,
  o_s: 0x4a,
  o: 0x4b,
  au: 0x4c,
};

/** Beginner romanization of each consonant without its vowel ("k" + "a" = "ka"). */
const CONSONANT_STEMS: Record<string, string> = {
  ka: "k",
  kha: "kh",
  ga: "g",
  gha: "gh",
  nga: "ng",
  ca: "ch",
  cha: "chh",
  ja: "j",
  jha: "jh",
  nya: "ny",
  Ta: "T",
  Tha: "Th",
  Da: "D",
  Dha: "Dh",
  Na: "N",
  ta: "t",
  tha: "th",
  da: "d",
  dha: "dh",
  na: "n",
  nnna: "ṉ",
  pa: "p",
  pha: "ph",
  ba: "b",
  bha: "bh",
  ma: "m",
  ya: "y",
  ra: "r",
  rra: "ṟ",
  la: "l",
  La: "L",
  zha: "zh",
  va: "v",
  sha: "sh",
  Sha: "Sh",
  sa: "s",
  ha: "h",
};

const VOWEL_HINTS: Record<string, string> = {
  a: "short “a”, like the u in “cup”",
  aa: "long “aa”, like the a in “father”",
  i: "short “i”, like the i in “sit”",
  ii: "long “ee”, like the ee in “see”",
  u: "short “u”, like the u in “put”",
  uu: "long “oo”, like the oo in “moon”",
  e_s: "short “e”, like the e in “bed”",
  e: "long “e”, like the a in “cake” (without the y-glide)",
  ai: "“ai”, like the ai in “aisle”",
  o_s: "short “o”, like the o in “pot” said quickly",
  o: "long “o”, like the o in “go”",
  au: "“au”, like the ou in “loud”",
};

const CONSONANT_HINTS: Record<string, string> = {
  ka: "“k” as in “skin” — no puff of air",
  kha: "“k” with a puff of air, as in “kite”",
  ga: "“g” as in “go”",
  gha: "“g” with a breathy puff, like “g-h” said together",
  nga: "the “ng” sound in “sing”",
  ca: "“ch” as in “church” — no puff of air",
  cha: "“ch” with a strong puff of air",
  ja: "“j” as in “jug”",
  jha: "“j” with a breathy puff",
  nya: "“ny”, like the ni in “onion”",
  Ta: "retroflex “t”: curl the tongue back to the roof of the mouth",
  Tha: "retroflex “t” with a puff of air",
  Da: "retroflex “d”: curl the tongue back",
  Dha: "retroflex “d” with a breathy puff",
  Na: "retroflex “n”: curl the tongue back",
  ta: "soft dental “t”: tongue touches the back of the upper teeth",
  tha: "dental “t” with a puff of air (not the English “th”)",
  da: "soft dental “d”: tongue touches the teeth",
  dha: "dental “d” with a breathy puff",
  na: "“n” with the tongue touching the back of the teeth",
  nnna: "an “n” made a little further back than ந",
  pa: "“p” as in “spin” — no puff of air",
  pha: "“p” with a puff of air, as in “pin” (often said like “f”)",
  ba: "“b” as in “bat”",
  bha: "“b” with a breathy puff",
  ma: "“m” as in “mother”",
  ya: "“y” as in “yes”",
  ra: "a light, tapped “r”",
  rra: "a stronger, trilled “r”",
  la: "“l” as in “love”",
  La: "retroflex “l”: curl the tongue back",
  zha: "a special sound between “r” and “l”, tongue curled far back",
  va: "between “v” and “w”",
  sha: "“sh” as in “ship”",
  Sha: "a retroflex “sh”, tongue curled back",
  sa: "“s” as in “sun”",
  ha: "“h” as in “house”",
};

export type ScriptPlan = {
  /** First code point of the script's Unicode block. */
  base: number;
  /** The vowel every consonant carries: "a" (ka) or "o" in Bengali (ko). */
  inherent: "a" | "o";
  /** Five vowel groups (vowel lessons 1–5). */
  vowelGroups: string[][];
  /** Six consonant groups (consonant lessons 1–6). */
  consonantGroups: string[][];
  /** Three vowel-sign groups (vowel-sign lessons 1–3). */
  signGroups: string[][];
  /** Consonants used to show the vowel signs, e.g. ["ka", "ma"]. */
  signConsonants: [string, string];
  vowelRoman?: Partial<Record<string, string>>;
  hintOverrides?: Partial<Record<string, string>>;
};

const INDO_ARYAN_CONSONANTS = [
  ["ka", "kha", "ga", "gha"],
  ["ca", "cha", "ja", "jha"],
  ["Ta", "Tha", "Da", "Dha", "Na"],
  ["ta", "tha", "da", "dha", "na"],
  ["pa", "pha", "ba", "bha", "ma"],
];
const DRAVIDIAN_VOWELS = [
  ["a", "aa"],
  ["i", "ii"],
  ["u", "uu"],
  ["e_s", "e", "ai"],
  ["o_s", "o", "au"],
];
const DRAVIDIAN_VOWEL_ROMAN = { e_s: "e", e: "ee", o_s: "o", o: "oo" };

export const SCRIPT_PLANS: Record<string, ScriptPlan> = {
  hi: {
    base: 0x0900,
    inherent: "a",
    vowelGroups: [
      ["a", "aa"],
      ["i", "ii"],
      ["u", "uu"],
      ["e", "ai"],
      ["o", "au"],
    ],
    consonantGroups: [...INDO_ARYAN_CONSONANTS, ["ya", "ra", "la", "va", "sha", "sa", "ha"]],
    signGroups: [
      ["aa", "i", "ii"],
      ["u", "uu"],
      ["e", "ai", "o", "au"],
    ],
    signConsonants: ["ka", "ma"],
    vowelRoman: { e: "e", o: "o" },
    hintOverrides: {
      a: "short “a”, like the u in “cup” — every consonant carries this sound",
      e: "“e”, like the a in “cake”",
      ai: "“ai”, like the a in “bat” in most of North India",
      au: "“au”, like the o in “often” in most of North India",
      va: "between “v” and “w” (वा in “wala” sounds like “w”)",
    },
  },
  bn: {
    base: 0x0980,
    inherent: "o",
    vowelGroups: [
      ["a", "aa"],
      ["i", "ii"],
      ["u", "uu"],
      ["e", "ai"],
      ["o", "au"],
    ],
    consonantGroups: [...INDO_ARYAN_CONSONANTS, ["ra", "la", "sha", "sa", "ha"]],
    signGroups: [
      ["aa", "i", "ii"],
      ["u", "uu"],
      ["e", "ai", "o", "au"],
    ],
    signConsonants: ["ka", "ma"],
    vowelRoman: { a: "ô", ai: "oi", au: "ou" },
    hintOverrides: {
      a: "“ô”, like the o in “hot” — every consonant carries this sound",
      i: "“i”, like the i in “sit” (ই and ঈ sound almost the same in Bengali)",
      ii: "“ee”; in everyday Bengali it sounds almost like ই",
      u: "“u”, like the u in “put” (উ and ঊ sound almost the same)",
      uu: "“oo”; in everyday Bengali it sounds almost like উ",
      e: "“e”, like the e in “bed” or the a in “cake”",
      ai: "“oi”, like the oy in “boy”",
      o: "“o”, like the o in “go”",
      au: "“ou”, like the ow in “bowl”",
      ba: "“b” as in “bat” — Bengali uses ব for both b and v",
      sha: "“sh” as in “ship”",
      sa: "usually “sh” as in “ship”; “s” before some consonants",
      ja: "“j” as in “jug”",
    },
  },
  te: {
    base: 0x0c00,
    inherent: "a",
    vowelGroups: DRAVIDIAN_VOWELS,
    consonantGroups: [...INDO_ARYAN_CONSONANTS, ["ya", "ra", "la", "va", "La", "sha", "sa", "ha"]],
    signGroups: [
      ["aa", "i", "ii"],
      ["u", "uu"],
      ["e_s", "e", "ai", "o_s", "o", "au"],
    ],
    signConsonants: ["ka", "ma"],
    vowelRoman: DRAVIDIAN_VOWEL_ROMAN,
    hintOverrides: { ca: "“ch” as in “church” (also “ts” in some Telugu words)" },
  },
  kn: {
    base: 0x0c80,
    inherent: "a",
    vowelGroups: DRAVIDIAN_VOWELS,
    consonantGroups: [...INDO_ARYAN_CONSONANTS, ["ya", "ra", "la", "va", "La", "sha", "sa", "ha"]],
    signGroups: [
      ["aa", "i", "ii"],
      ["u", "uu"],
      ["e_s", "e", "ai", "o_s", "o", "au"],
    ],
    signConsonants: ["ka", "ma"],
    vowelRoman: DRAVIDIAN_VOWEL_ROMAN,
  },
  ml: {
    base: 0x0d00,
    inherent: "a",
    vowelGroups: DRAVIDIAN_VOWELS,
    consonantGroups: [...INDO_ARYAN_CONSONANTS, ["ya", "ra", "la", "va", "La", "zha", "sa", "ha"]],
    // The au sign has two spellings in Malayalam (old and reformed), so it is left out.
    signGroups: [
      ["aa", "i", "ii"],
      ["u", "uu"],
      ["e_s", "e", "ai", "o_s", "o"],
    ],
    signConsonants: ["ka", "ma"],
    vowelRoman: DRAVIDIAN_VOWEL_ROMAN,
    hintOverrides: {
      zha: "ഴ (zha): a sound between “r” and “l”, tongue curled far back — as in മഴ (mazha, rain)",
    },
  },
  ta: {
    base: 0x0b80,
    inherent: "a",
    vowelGroups: DRAVIDIAN_VOWELS,
    consonantGroups: [
      ["ka", "nga", "ca", "nya"],
      ["Ta", "Na", "ta", "na"],
      ["pa", "ma", "ya", "ra"],
      ["la", "va", "zha", "La"],
      ["rra", "nnna"],
      ["ja", "Sha", "sa", "ha"],
    ],
    // The au sign is very rare in Tamil words, so it is left out.
    signGroups: [
      ["aa", "i", "ii"],
      ["u", "uu"],
      ["e_s", "e", "ai", "o_s", "o"],
    ],
    signConsonants: ["ka", "ma"],
    vowelRoman: DRAVIDIAN_VOWEL_ROMAN,
    hintOverrides: {
      ka: "“k” at the start of a word, a soft “g” or “h” between vowels (Tamil has one letter for k/g)",
      ca: "“ch” or “s” at the start of a word, a soft “s” between vowels (Tamil has one letter for ch/j/s)",
      Ta: "retroflex “t”, a soft retroflex “d” between vowels",
      ta: "dental “t”, a soft “dh” between vowels",
      pa: "“p”, a soft “b” between vowels",
      zha: "ழ (zha): the famous Tamil sound, between “r” and “l”, tongue curled far back — as in தமிழ் (tamizh)",
      rra: "a strong trilled “r”; doubled (ற்ற) it sounds like “tr”",
      nnna: "an “n” made just behind the teeth; at the end of words, as in அவன் (avan)",
      ja: "“j” as in “jug” (a Grantha letter for Sanskrit and English words)",
      Sha: "“sh” as in “ship” (a Grantha letter)",
      sa: "“s” as in “sun” (a Grantha letter)",
      ha: "“h” as in “house” (a Grantha letter)",
    },
  },
};

const glyph = (base: number, offset: number) => String.fromCodePoint(base + offset);

export function vowelLetter(plan: ScriptPlan, key: string): Letter {
  const offset = VOWEL_OFFSETS[key];
  if (offset === undefined) throw new Error(`Unknown vowel key "${key}"`);
  return {
    key: `v-${key}`,
    kind: "vowel",
    script: glyph(plan.base, offset),
    romanization: plan.vowelRoman?.[key] ?? key,
    hint: plan.hintOverrides?.[key] ?? VOWEL_HINTS[key]!,
  };
}

export function consonantLetter(plan: ScriptPlan, key: string): Letter {
  const offset = CONSONANT_OFFSETS[key];
  if (offset === undefined) throw new Error(`Unknown consonant key "${key}"`);
  return {
    key: `c-${key}`,
    kind: "consonant",
    script: glyph(plan.base, offset),
    romanization: CONSONANT_STEMS[key]! + plan.inherent,
    hint: plan.hintOverrides?.[key] ?? CONSONANT_HINTS[key]!,
  };
}

/** Consonant + vowel sign, e.g. క + ి = కి (ki). */
export function syllable(plan: ScriptPlan, consonant: string, sign: string): Letter {
  const signOffset = SIGN_OFFSETS[sign];
  if (signOffset === undefined) throw new Error(`Unknown vowel sign "${sign}"`);
  const base = consonantLetter(plan, consonant);
  const vowel = vowelLetter(plan, sign);
  return {
    key: `s-${consonant}-${sign}`,
    kind: "syllable",
    script: base.script + glyph(plan.base, signOffset),
    romanization: CONSONANT_STEMS[consonant]! + vowel.romanization,
    hint: `${base.script} (${base.romanization}) + the “${vowel.romanization}” vowel sign`,
  };
}
