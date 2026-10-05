// Content for all six languages, used by prisma/seed.ts (through course-builder.ts).
//
// Letters are NOT typed by hand: Hindi, Bengali, Tamil, Telugu, Kannada and Malayalam
// scripts share one Unicode layout, so "the letter ka" is always at the same offset
// inside each script's Unicode block (e.g. Telugu block 0x0C00 + 0x15 = క).
// That keeps the six alphabets accurate and the content language-agnostic.
//
// Romanization is kept simple (no diacritics) so beginners can read it.

export type SeedWord = { script: string; romanization: string; meaning: string; topic: string };

/** One sentence, word by word: [script, romanization]. */
export type SeedSentence = Array<[string, string]>;

export const VOWEL_KEYS = ["a", "aa", "i", "ii", "u", "uu"] as const;
export const CONSONANT_KEYS = ["ka", "ma", "na", "pa", "ra", "la"] as const;
export const SIGN_KEYS = ["aa", "i", "u"] as const;

export type VowelKey = (typeof VOWEL_KEYS)[number];
export type ConsonantKey = (typeof CONSONANT_KEYS)[number];
export type SignKey = (typeof SIGN_KEYS)[number];

/** Offsets inside a script's Unicode block (identical for all six scripts). */
const VOWEL_OFFSETS: Record<VowelKey, number> = {
  a: 0x05,
  aa: 0x06,
  i: 0x07,
  ii: 0x08,
  u: 0x09,
  uu: 0x0a,
};
const CONSONANT_OFFSETS: Record<ConsonantKey, number> = {
  ka: 0x15,
  ma: 0x2e,
  na: 0x28,
  pa: 0x2a,
  ra: 0x30,
  la: 0x32,
};
const SIGN_OFFSETS: Record<SignKey, number> = { aa: 0x3e, i: 0x3f, u: 0x41 };

export function vowelGlyph(scriptBase: number, key: VowelKey): string {
  return String.fromCodePoint(scriptBase + VOWEL_OFFSETS[key]);
}
export function consonantGlyph(scriptBase: number, key: ConsonantKey): string {
  return String.fromCodePoint(scriptBase + CONSONANT_OFFSETS[key]);
}
/** Consonant + vowel sign, e.g. క + ి = కి (ki). */
export function syllableGlyph(scriptBase: number, consonant: ConsonantKey, sign: SignKey): string {
  return (
    consonantGlyph(scriptBase, consonant) + String.fromCodePoint(scriptBase + SIGN_OFFSETS[sign])
  );
}

/** How each sound is pronounced, explained with English words. */
export const SOUND_HINTS: Record<VowelKey | ConsonantKey, string> = {
  a: "short “a”, like the u in “cup”",
  aa: "long “aa”, like the a in “father”",
  i: "short “i”, like the i in “sit”",
  ii: "long “ee”, like the ee in “see”",
  u: "short “u”, like the u in “put”",
  uu: "long “oo”, like the oo in “moon”",
  ka: "“k” as in “skin” — without a puff of air",
  ma: "“m” as in “mother”",
  na: "“n” with the tongue touching the back of the teeth",
  pa: "“p” as in “spin” — without a puff of air",
  ra: "a light, tapped “r”",
  la: "“l” as in “love”",
};

export type SeedLanguage = {
  code: string;
  name: string;
  nativeName: string;
  scriptName: string;
  description: string;
  /** First code point of the script's Unicode block. */
  scriptBase: number;
  /** The vowel every consonant carries by default: "a" (ka, ma…) or "o" in Bengali (ko, mo…). */
  inherentVowel: "a" | "o";
  /** Language-specific pronunciation notes that replace the general hint. */
  soundHintOverrides?: Partial<Record<VowelKey | ConsonantKey, string>>;
  words: {
    hello: SeedWord;
    thankYou: SeedWord;
    yes: SeedWord;
    no: SeedWord;
    mother: SeedWord;
    father: SeedWord;
    friend: SeedWord;
    water: SeedWord;
    food: SeedWord;
    milk: SeedWord;
    one: SeedWord;
    two: SeedWord;
    three: SeedWord;
    name: SeedWord;
  };
  sentences: {
    /** "My name is Asha." — the word for "name" is at index 1. */
    myName: SeedSentence;
    /** "What is your name?" */
    yourName: SeedSentence;
    /** "How are you?" */
    howAreYou: SeedSentence;
    /** "I am fine." */
    imFine: SeedSentence;
    /** "I want water." — the word for "water" is at index 1. */
    wantWater: SeedSentence;
  };
};

const w = (script: string, romanization: string, meaning: string, topic: string): SeedWord => ({
  script,
  romanization,
  meaning,
  topic,
});

export const SEED_LANGUAGES: SeedLanguage[] = [
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    scriptName: "Devanagari",
    description: "Spoken widely across North and Central India, written in Devanagari.",
    scriptBase: 0x0900,
    inherentVowel: "a",
    words: {
      hello: w("नमस्ते", "namaste", "Hello", "Greetings"),
      thankYou: w("धन्यवाद", "dhanyavaad", "Thank you", "Greetings"),
      yes: w("हाँ", "haan", "Yes", "Greetings"),
      no: w("नहीं", "nahin", "No", "Greetings"),
      mother: w("माँ", "maa", "Mother", "Family"),
      father: w("पिता", "pitaa", "Father", "Family"),
      friend: w("दोस्त", "dost", "Friend", "Family"),
      water: w("पानी", "paani", "Water", "Food & drink"),
      food: w("खाना", "khaanaa", "Food", "Food & drink"),
      milk: w("दूध", "doodh", "Milk", "Food & drink"),
      one: w("एक", "ek", "One", "Numbers"),
      two: w("दो", "do", "Two", "Numbers"),
      three: w("तीन", "teen", "Three", "Numbers"),
      name: w("नाम", "naam", "Name", "Introductions"),
    },
    sentences: {
      myName: [
        ["मेरा", "meraa"],
        ["नाम", "naam"],
        ["आशा", "Asha"],
        ["है", "hai"],
      ],
      yourName: [
        ["आपका", "aapkaa"],
        ["नाम", "naam"],
        ["क्या", "kyaa"],
        ["है", "hai"],
      ],
      howAreYou: [
        ["आप", "aap"],
        ["कैसे", "kaise"],
        ["हैं", "hain"],
      ],
      imFine: [
        ["मैं", "main"],
        ["ठीक", "theek"],
        ["हूँ", "hoon"],
      ],
      wantWater: [
        ["मुझे", "mujhe"],
        ["पानी", "paani"],
        ["चाहिए", "chaahiye"],
      ],
    },
  },
  {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    scriptName: "Telugu script",
    description: "The language of Andhra Pradesh and Telangana, known for its rounded letters.",
    scriptBase: 0x0c00,
    inherentVowel: "a",
    words: {
      hello: w("నమస్కారం", "namaskaaram", "Hello", "Greetings"),
      thankYou: w("ధన్యవాదాలు", "dhanyavaadaalu", "Thank you", "Greetings"),
      yes: w("అవును", "avunu", "Yes", "Greetings"),
      no: w("కాదు", "kaadu", "No", "Greetings"),
      mother: w("అమ్మ", "amma", "Mother", "Family"),
      father: w("నాన్న", "naanna", "Father", "Family"),
      friend: w("స్నేహితుడు", "snehitudu", "Friend", "Family"),
      water: w("నీళ్ళు", "neellu", "Water", "Food & drink"),
      food: w("భోజనం", "bhojanam", "Food", "Food & drink"),
      milk: w("పాలు", "paalu", "Milk", "Food & drink"),
      one: w("ఒకటి", "okati", "One", "Numbers"),
      two: w("రెండు", "rendu", "Two", "Numbers"),
      three: w("మూడు", "moodu", "Three", "Numbers"),
      name: w("పేరు", "peru", "Name", "Introductions"),
    },
    sentences: {
      myName: [
        ["నా", "naa"],
        ["పేరు", "peru"],
        ["ఆశ", "Asha"],
      ],
      yourName: [
        ["మీ", "mee"],
        ["పేరు", "peru"],
        ["ఏమిటి", "emiti"],
      ],
      howAreYou: [
        ["మీరు", "meeru"],
        ["ఎలా", "elaa"],
        ["ఉన్నారు", "unnaaru"],
      ],
      imFine: [
        ["నేను", "nenu"],
        ["బాగున్నాను", "baagunnaanu"],
      ],
      wantWater: [
        ["నాకు", "naaku"],
        ["నీళ్ళు", "neellu"],
        ["కావాలి", "kaavaali"],
      ],
    },
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    scriptName: "Tamil script",
    description: "One of the world's oldest living classical languages, spoken in Tamil Nadu.",
    scriptBase: 0x0b80,
    inherentVowel: "a",
    soundHintOverrides: {
      ka: "“k” at the start of a word; between vowels it often softens towards “g” or “h”",
    },
    words: {
      hello: w("வணக்கம்", "vanakkam", "Hello", "Greetings"),
      thankYou: w("நன்றி", "nandri", "Thank you", "Greetings"),
      yes: w("ஆம்", "aam", "Yes", "Greetings"),
      no: w("இல்லை", "illai", "No", "Greetings"),
      mother: w("அம்மா", "ammaa", "Mother", "Family"),
      father: w("அப்பா", "appaa", "Father", "Family"),
      friend: w("நண்பன்", "nanban", "Friend", "Family"),
      water: w("தண்ணீர்", "thanneer", "Water", "Food & drink"),
      food: w("சாப்பாடு", "saappaadu", "Food", "Food & drink"),
      milk: w("பால்", "paal", "Milk", "Food & drink"),
      one: w("ஒன்று", "ondru", "One", "Numbers"),
      two: w("இரண்டு", "irandu", "Two", "Numbers"),
      three: w("மூன்று", "moondru", "Three", "Numbers"),
      name: w("பெயர்", "peyar", "Name", "Introductions"),
    },
    sentences: {
      myName: [
        ["என்", "en"],
        ["பெயர்", "peyar"],
        ["ஆஷா", "Asha"],
      ],
      yourName: [
        ["உங்கள்", "ungal"],
        ["பெயர்", "peyar"],
        ["என்ன", "enna"],
      ],
      howAreYou: [
        ["நீங்கள்", "neengal"],
        ["எப்படி", "eppadi"],
        ["இருக்கிறீர்கள்", "irukkireergal"],
      ],
      imFine: [
        ["நான்", "naan"],
        ["நன்றாக", "nandraaga"],
        ["இருக்கிறேன்", "irukkiren"],
      ],
      wantWater: [
        ["எனக்கு", "enakku"],
        ["தண்ணீர்", "thanneer"],
        ["வேண்டும்", "vendum"],
      ],
    },
  },
  {
    code: "ml",
    name: "Malayalam",
    nativeName: "മലയാളം",
    scriptName: "Malayalam script",
    description: "The language of Kerala, written in a graceful, curved script.",
    scriptBase: 0x0d00,
    inherentVowel: "a",
    words: {
      hello: w("നമസ്കാരം", "namaskaaram", "Hello", "Greetings"),
      thankYou: w("നന്ദി", "nandi", "Thank you", "Greetings"),
      yes: w("അതെ", "athe", "Yes", "Greetings"),
      no: w("ഇല്ല", "illa", "No", "Greetings"),
      mother: w("അമ്മ", "amma", "Mother", "Family"),
      father: w("അച്ഛൻ", "achchhan", "Father", "Family"),
      friend: w("സുഹൃത്ത്", "suhruthu", "Friend", "Family"),
      water: w("വെള്ളം", "vellam", "Water", "Food & drink"),
      food: w("ഭക്ഷണം", "bhakshanam", "Food", "Food & drink"),
      milk: w("പാൽ", "paal", "Milk", "Food & drink"),
      one: w("ഒന്ന്", "onnu", "One", "Numbers"),
      two: w("രണ്ട്", "randu", "Two", "Numbers"),
      three: w("മൂന്ന്", "moonnu", "Three", "Numbers"),
      name: w("പേര്", "peru", "Name", "Introductions"),
    },
    sentences: {
      myName: [
        ["എന്റെ", "ente"],
        ["പേര്", "peru"],
        ["ആശ", "Asha"],
      ],
      yourName: [
        ["നിങ്ങളുടെ", "ningalude"],
        ["പേര്", "peru"],
        ["എന്താണ്", "enthaanu"],
      ],
      howAreYou: [
        ["നിങ്ങൾക്ക്", "ningalkku"],
        ["സുഖമാണോ", "sukhamaano"],
      ],
      imFine: [
        ["എനിക്ക്", "enikku"],
        ["സുഖമാണ്", "sukhamaanu"],
      ],
      wantWater: [
        ["എനിക്ക്", "enikku"],
        ["വെള്ളം", "vellam"],
        ["വേണം", "venam"],
      ],
    },
  },
  {
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    scriptName: "Kannada script",
    description: "The language of Karnataka, with a script closely related to Telugu.",
    scriptBase: 0x0c80,
    inherentVowel: "a",
    words: {
      hello: w("ನಮಸ್ಕಾರ", "namaskaara", "Hello", "Greetings"),
      thankYou: w("ಧನ್ಯವಾದ", "dhanyavaada", "Thank you", "Greetings"),
      yes: w("ಹೌದು", "haudu", "Yes", "Greetings"),
      no: w("ಇಲ್ಲ", "illa", "No", "Greetings"),
      mother: w("ಅಮ್ಮ", "amma", "Mother", "Family"),
      father: w("ಅಪ್ಪ", "appa", "Father", "Family"),
      friend: w("ಸ್ನೇಹಿತ", "snehita", "Friend", "Family"),
      water: w("ನೀರು", "neeru", "Water", "Food & drink"),
      food: w("ಊಟ", "oota", "Food", "Food & drink"),
      milk: w("ಹಾಲು", "haalu", "Milk", "Food & drink"),
      one: w("ಒಂದು", "ondu", "One", "Numbers"),
      two: w("ಎರಡು", "eradu", "Two", "Numbers"),
      three: w("ಮೂರು", "mooru", "Three", "Numbers"),
      name: w("ಹೆಸರು", "hesaru", "Name", "Introductions"),
    },
    sentences: {
      myName: [
        ["ನನ್ನ", "nanna"],
        ["ಹೆಸರು", "hesaru"],
        ["ಆಶಾ", "Asha"],
      ],
      yourName: [
        ["ನಿಮ್ಮ", "nimma"],
        ["ಹೆಸರು", "hesaru"],
        ["ಏನು", "enu"],
      ],
      howAreYou: [
        ["ನೀವು", "neevu"],
        ["ಹೇಗಿದ್ದೀರಿ", "hegiddeeri"],
      ],
      imFine: [
        ["ನಾನು", "naanu"],
        ["ಚೆನ್ನಾಗಿದ್ದೇನೆ", "chennaagiddene"],
      ],
      wantWater: [
        ["ನನಗೆ", "nanage"],
        ["ನೀರು", "neeru"],
        ["ಬೇಕು", "beku"],
      ],
    },
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    scriptName: "Bengali script",
    description: "The language of West Bengal and Bangladesh, rich in literature and song.",
    scriptBase: 0x0980,
    inherentVowel: "o",
    soundHintOverrides: {
      a: "short “o”, like the o in “hot” — written অ, read “o” in Bengali",
      ii: "“ee” as in “see” — in everyday Bengali it sounds almost like ই",
      uu: "“oo” as in “moon” — in everyday Bengali it sounds almost like উ",
    },
    words: {
      hello: w("নমস্কার", "nomoshkar", "Hello", "Greetings"),
      thankYou: w("ধন্যবাদ", "dhonnobad", "Thank you", "Greetings"),
      yes: w("হ্যাঁ", "hyaan", "Yes", "Greetings"),
      no: w("না", "naa", "No", "Greetings"),
      mother: w("মা", "maa", "Mother", "Family"),
      father: w("বাবা", "baabaa", "Father", "Family"),
      friend: w("বন্ধু", "bondhu", "Friend", "Family"),
      water: w("জল", "jol", "Water", "Food & drink"),
      food: w("খাবার", "khaabaar", "Food", "Food & drink"),
      milk: w("দুধ", "dudh", "Milk", "Food & drink"),
      one: w("এক", "ek", "One", "Numbers"),
      two: w("দুই", "dui", "Two", "Numbers"),
      three: w("তিন", "tin", "Three", "Numbers"),
      name: w("নাম", "naam", "Name", "Introductions"),
    },
    sentences: {
      myName: [
        ["আমার", "aamaar"],
        ["নাম", "naam"],
        ["আশা", "Asha"],
      ],
      yourName: [
        ["আপনার", "aapnaar"],
        ["নাম", "naam"],
        ["কী", "ki"],
      ],
      howAreYou: [
        ["আপনি", "aapni"],
        ["কেমন", "kemon"],
        ["আছেন", "aachhen"],
      ],
      imFine: [
        ["আমি", "aami"],
        ["ভালো", "bhaalo"],
        ["আছি", "aachhi"],
      ],
      wantWater: [
        ["আমার", "aamaar"],
        ["জল", "jol"],
        ["চাই", "chaai"],
      ],
    },
  },
];

/** A development-only account so you can log in immediately after seeding. */
export const DEMO_USER = {
  email: "demo@vachan.dev",
  password: "Vachan2026!",
  displayName: "Demo Learner",
  languageCode: "hi",
};
