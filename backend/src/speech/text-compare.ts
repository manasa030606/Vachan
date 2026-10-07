// Content match: compares what speech-to-text heard with the phrase the learner was asked to say.
//
// This is plain text comparison (edit distance), no AI. It answers "were the right words
// said?", not "was the pronunciation good?": a speech-to-text system often writes the right
// word even when the pronunciation is far from native, and sometimes writes a wrong word for a
// good pronunciation. The UI says so.
//
//   1. normalise both texts (Unicode NFC, no punctuation, lower case, no zero-width joiners)
//   2. character similarity = 1 − edit distance / length   (spaces ignored, so word
//      splitting differences don't count) → score 0–100 → verdict
//   3. word-by-word alignment → which words were right, almost right, wrong, missing or extra;
//      a wrong or missing word caps the verdict at "partial"
import { SPEECH_CONFIG } from "../config/speech.ts";

export type WordResult = {
  expected: string;
  heard: string | null;
  status: "correct" | "close" | "wrong" | "missing";
  similarity: number;
};

export type ContentMatch = {
  /** 0–100 character similarity */
  score: number;
  verdict: "match" | "close" | "partial" | "different" | "nothing-heard";
  /** Which form the transcript was compared with. */
  comparedWith: "script" | "romanization";
  transcriptScript: "native" | "latin" | "mixed" | "empty";
  words: WordResult[];
  extraWords: string[];
};

const INDIC = /[ऀ-෿]/u;
const LATIN = /[a-z]/iu;

/** Lower case, NFC, no punctuation/symbols, no zero-width joiners, single spaces. */
export function normalizeText(text: string): string {
  return text
    .normalize("NFC")
    .toLowerCase()
    .replace(/[\u200b-\u200d\ufeff]/gu, "")
    .replace(/[\p{P}\p{S}]/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

/** Romanization is spelled in many ways (namaskaram / namaskaaram): fold long vowels. */
export function foldRomanization(text: string): string {
  return normalizeText(text).replace(/aa/g, "a").replace(/ee|ii/g, "i").replace(/oo|uu/g, "u");
}

export function detectScript(text: string): ContentMatch["transcriptScript"] {
  const native = INDIC.test(text);
  const latin = LATIN.test(text);
  if (native && latin) return "mixed";
  if (native) return "native";
  if (latin) return "latin";
  return "empty";
}

const segmenter = new Intl.Segmenter("und", { granularity: "grapheme" });

/** User-perceived characters: in Indic scripts a letter with its vowel sign counts as one. */
export function graphemes(text: string): string[] {
  return [...segmenter.segment(text)].map((s) => s.segment);
}

/** Edit distance between two lists (characters or words). */
export function editDistance<T>(a: T[], b: T[], same = (x: T, y: T) => x === y): number {
  let previous = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(
        previous[j]! + 1,
        current[j - 1]! + 1,
        previous[j - 1]! + (same(a[i - 1]!, b[j - 1]!) ? 0 : 1),
      );
    }
    previous = current;
  }
  return previous[b.length]!;
}

/**
 * 1 = identical, 0 = nothing in common. Compared by Unicode code points, so a missing vowel sign
 * (ఆశ vs ఆశా) is one small difference, not a whole different letter.
 */
export function similarity(a: string, b: string): number {
  const x = Array.from(a);
  const y = Array.from(b);
  const longest = Math.max(x.length, y.length);
  return longest === 0 ? 1 : 1 - editDistance(x, y) / longest;
}

/**
 * Aligns expected words with heard words (like a diff), allowing near-matches.
 * Substituting a word costs (1 − similarity); skipping one costs 1.
 */
export function alignWords(expected: string[], heard: string[]) {
  const n = expected.length;
  const m = heard.length;
  const cost: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  const sims: number[][] = expected.map((e) => heard.map((h) => similarity(e, h)));
  for (let i = 0; i <= n; i++) cost[i]![0] = i;
  for (let j = 0; j <= m; j++) cost[0]![j] = j;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      cost[i]![j] = Math.min(
        cost[i - 1]![j]! + 1,
        cost[i]![j - 1]! + 1,
        cost[i - 1]![j - 1]! + (1 - sims[i - 1]![j - 1]!),
      );
    }
  }
  // Walk back from the end to recover the alignment. Two words are only paired when they are at
  // least about one-third similar; otherwise it counts as a missing word plus an extra word.
  const words: WordResult[] = [];
  const extra: string[] = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    if (
      i > 0 &&
      j > 0 &&
      Math.abs(cost[i]![j]! - (cost[i - 1]![j - 1]! + (1 - sims[i - 1]![j - 1]!))) < 1e-9 &&
      sims[i - 1]![j - 1]! >= 0.34
    ) {
      const sim = sims[i - 1]![j - 1]!;
      words.unshift({
        expected: expected[i - 1]!,
        heard: heard[j - 1]!,
        status: wordStatus(sim),
        similarity: Math.round(sim * 100) / 100,
      });
      i--;
      j--;
    } else if (i > 0 && (j === 0 || cost[i]![j]! === cost[i - 1]![j]! + 1)) {
      words.unshift({ expected: expected[i - 1]!, heard: null, status: "missing", similarity: 0 });
      i--;
    } else {
      extra.unshift(heard[j - 1]!);
      j--;
    }
  }
  return { words, extra };
}

function wordStatus(sim: number): WordResult["status"] {
  if (sim >= 0.999) return "correct";
  if (sim >= SPEECH_CONFIG.match.closeWord) return "close";
  return "wrong";
}

function verdictFor(score: number): ContentMatch["verdict"] {
  const { verdicts } = SPEECH_CONFIG.match;
  if (score >= verdicts.match) return "match";
  if (score >= verdicts.close) return "close";
  if (score >= verdicts.partial) return "partial";
  return "different";
}

/**
 * Compares the transcript with the expected phrase. Native-script transcripts are compared with
 * the native text; a transcript in Latin letters (some speech-to-text systems romanize) is
 * compared with the romanization, with long vowels folded.
 */
export function compareTranscript(
  expected: { script: string; romanization: string },
  transcript: string,
): ContentMatch {
  const transcriptScript = detectScript(transcript);
  const useRoman = transcriptScript === "latin";
  const prepare = useRoman ? foldRomanization : normalizeText;
  const target = prepare(useRoman ? expected.romanization : expected.script);
  const heard = prepare(transcript);

  const expectedWords = target.split(" ").filter(Boolean);
  if (!heard) {
    return {
      score: 0,
      verdict: "nothing-heard",
      comparedWith: useRoman ? "romanization" : "script",
      transcriptScript,
      words: expectedWords.map((w) => ({
        expected: w,
        heard: null,
        status: "missing",
        similarity: 0,
      })),
      extraWords: [],
    };
  }

  const score = Math.round(similarity(target.replace(/ /g, ""), heard.replace(/ /g, "")) * 100);
  const { words, extra } = alignWords(expectedWords, heard.split(" ").filter(Boolean));
  // A wrong or missing word means the phrase was not said — at most "partial", whatever the
  // character score ("मुझे चाय चाहिए" is not "मुझे पानी चाहिए", even though most letters match).
  const wordMissed = words.some((w) => w.status === "missing" || w.status === "wrong");
  let verdict = verdictFor(score);
  if (wordMissed && (verdict === "match" || verdict === "close")) verdict = "partial";
  return {
    score,
    verdict,
    comparedWith: useRoman ? "romanization" : "script",
    transcriptScript,
    words,
    extraWords: extra,
  };
}
