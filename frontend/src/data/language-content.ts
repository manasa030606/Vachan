// Small, verified demo content for each language: first vowels/consonant, five common
// words and one simple sentence ("My name is Asha.").
// Romanization is kept simple (no diacritics) so beginners can read it easily.
// The real course content is created in Phase 3 and managed by admins in Phase 8.
import type {
  LanguageCode,
  LanguageContent,
  SentenceToken,
  VocabularyWord,
} from "@/types/learning";

function word(
  languageCode: LanguageCode,
  key: string,
  script: string,
  romanization: string,
  meaning: string,
  topic: string,
): VocabularyWord {
  return { id: `${languageCode}-${key}`, script, romanization, meaning, topic };
}

function tokens(languageCode: LanguageCode, parts: Array<[string, string]>): SentenceToken[] {
  return parts.map(([text, romanization], index) => ({
    id: `${languageCode}-token-${index}`,
    text,
    romanization,
  }));
}

export const LANGUAGE_CONTENT: Record<LanguageCode, LanguageContent> = {
  hi: {
    letters: [
      { character: "अ", romanization: "a", kind: "vowel" },
      { character: "आ", romanization: "aa", kind: "vowel" },
      { character: "क", romanization: "ka", kind: "consonant" },
    ],
    words: {
      hello: word("hi", "hello", "नमस्ते", "namaste", "Hello", "Greetings"),
      thankYou: word("hi", "thank-you", "धन्यवाद", "dhanyavaad", "Thank you", "Greetings"),
      water: word("hi", "water", "पानी", "paani", "Water", "Food & drink"),
      mother: word("hi", "mother", "माँ", "maa", "Mother", "Family"),
      yes: word("hi", "yes", "हाँ", "haan", "Yes", "Basics"),
    },
    nameSentence: {
      meaning: "My name is Asha.",
      tokens: tokens("hi", [
        ["मेरा", "mera"],
        ["नाम", "naam"],
        ["आशा", "Asha"],
        ["है", "hai"],
      ]),
      nameTokenIndex: 1,
    },
  },
  te: {
    letters: [
      { character: "అ", romanization: "a", kind: "vowel" },
      { character: "ఆ", romanization: "aa", kind: "vowel" },
      { character: "క", romanization: "ka", kind: "consonant" },
    ],
    words: {
      hello: word("te", "hello", "నమస్కారం", "namaskaaram", "Hello", "Greetings"),
      thankYou: word("te", "thank-you", "ధన్యవాదాలు", "dhanyavaadaalu", "Thank you", "Greetings"),
      water: word("te", "water", "నీళ్ళు", "neellu", "Water", "Food & drink"),
      mother: word("te", "mother", "అమ్మ", "amma", "Mother", "Family"),
      yes: word("te", "yes", "అవును", "avunu", "Yes", "Basics"),
    },
    nameSentence: {
      meaning: "My name is Asha.",
      tokens: tokens("te", [
        ["నా", "naa"],
        ["పేరు", "peru"],
        ["ఆశ", "Asha"],
      ]),
      nameTokenIndex: 1,
    },
  },
  ta: {
    letters: [
      { character: "அ", romanization: "a", kind: "vowel" },
      { character: "ஆ", romanization: "aa", kind: "vowel" },
      { character: "க", romanization: "ka", kind: "consonant" },
    ],
    words: {
      hello: word("ta", "hello", "வணக்கம்", "vanakkam", "Hello", "Greetings"),
      thankYou: word("ta", "thank-you", "நன்றி", "nandri", "Thank you", "Greetings"),
      water: word("ta", "water", "தண்ணீர்", "thanneer", "Water", "Food & drink"),
      mother: word("ta", "mother", "அம்மா", "amma", "Mother", "Family"),
      yes: word("ta", "yes", "ஆம்", "aam", "Yes", "Basics"),
    },
    nameSentence: {
      meaning: "My name is Asha.",
      tokens: tokens("ta", [
        ["என்", "en"],
        ["பெயர்", "peyar"],
        ["ஆஷா", "Asha"],
      ]),
      nameTokenIndex: 1,
    },
  },
  ml: {
    letters: [
      { character: "അ", romanization: "a", kind: "vowel" },
      { character: "ആ", romanization: "aa", kind: "vowel" },
      { character: "ക", romanization: "ka", kind: "consonant" },
    ],
    words: {
      hello: word("ml", "hello", "നമസ്കാരം", "namaskaaram", "Hello", "Greetings"),
      thankYou: word("ml", "thank-you", "നന്ദി", "nandi", "Thank you", "Greetings"),
      water: word("ml", "water", "വെള്ളം", "vellam", "Water", "Food & drink"),
      mother: word("ml", "mother", "അമ്മ", "amma", "Mother", "Family"),
      yes: word("ml", "yes", "അതെ", "athe", "Yes", "Basics"),
    },
    nameSentence: {
      meaning: "My name is Asha.",
      tokens: tokens("ml", [
        ["എന്റെ", "ente"],
        ["പേര്", "peru"],
        ["ആശ", "Asha"],
      ]),
      nameTokenIndex: 1,
    },
  },
  kn: {
    letters: [
      { character: "ಅ", romanization: "a", kind: "vowel" },
      { character: "ಆ", romanization: "aa", kind: "vowel" },
      { character: "ಕ", romanization: "ka", kind: "consonant" },
    ],
    words: {
      hello: word("kn", "hello", "ನಮಸ್ಕಾರ", "namaskaara", "Hello", "Greetings"),
      thankYou: word("kn", "thank-you", "ಧನ್ಯವಾದ", "dhanyavaada", "Thank you", "Greetings"),
      water: word("kn", "water", "ನೀರು", "neeru", "Water", "Food & drink"),
      mother: word("kn", "mother", "ಅಮ್ಮ", "amma", "Mother", "Family"),
      yes: word("kn", "yes", "ಹೌದು", "haudu", "Yes", "Basics"),
    },
    nameSentence: {
      meaning: "My name is Asha.",
      tokens: tokens("kn", [
        ["ನನ್ನ", "nanna"],
        ["ಹೆಸರು", "hesaru"],
        ["ಆಶಾ", "Asha"],
      ]),
      nameTokenIndex: 1,
    },
  },
  bn: {
    letters: [
      { character: "অ", romanization: "o", kind: "vowel" },
      { character: "আ", romanization: "aa", kind: "vowel" },
      { character: "ক", romanization: "ko", kind: "consonant" },
    ],
    words: {
      hello: word("bn", "hello", "নমস্কার", "nomoshkar", "Hello", "Greetings"),
      thankYou: word("bn", "thank-you", "ধন্যবাদ", "dhonnobad", "Thank you", "Greetings"),
      water: word("bn", "water", "জল", "jol", "Water", "Food & drink"),
      mother: word("bn", "mother", "মা", "maa", "Mother", "Family"),
      yes: word("bn", "yes", "হ্যাঁ", "hyaan", "Yes", "Basics"),
    },
    nameSentence: {
      meaning: "My name is Asha.",
      tokens: tokens("bn", [
        ["আমার", "amar"],
        ["নাম", "naam"],
        ["আশা", "Asha"],
      ]),
      nameTokenIndex: 1,
    },
  },
};

/** All five demo words for a language, as a list. */
export function getVocabulary(languageCode: LanguageCode): VocabularyWord[] {
  return Object.values(LANGUAGE_CONTENT[languageCode].words);
}
