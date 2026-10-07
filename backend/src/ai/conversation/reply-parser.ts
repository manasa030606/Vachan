// Reads and checks the partner's JSON reply. The model's text is never trusted blindly:
//   • the reply must be in the target script (not English)
//   • source numbers must point at notes that were really in the prompt
//   • suggestions and corrections must be in the target script
//   • a reply that leaks the hidden rules is rejected
//   • "word coverage" = share of the reply's native words that appear in the vocabulary,
//     notes or conversation — stored for evaluation (natural conversation may add a few words)
import { PROMPT_CANARY } from "../tutor/safety.ts";

export class UnreadableReplyError extends Error {}

export type Line = { text: string; romanization: string; meaning: string };
export type PartnerReply = {
  reply: { text: string; romanization: string; translation: string };
  feedback: {
    understood: boolean;
    correction: { text: string; romanization: string; explanation: string } | null;
    note: string;
  } | null;
  suggestions: Line[];
  sourceIds: number[];
  goalReached: boolean;
  issues: string[];
};

/** Any character from the Indian scripts' Unicode blocks (Devanagari up to Sinhala). */
const INDIC = /[ऀ-෿]/u;
/** A model field as a clean single-line string (anything that isn't a string becomes ""). */
const str = (value: unknown, max = 400) =>
  typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";

export function parseJsonObject(raw: string): Record<string, unknown> {
  const cleaned = raw.replace(/^\s*```(?:json)?|```\s*$/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) throw new UnreadableReplyError("no JSON object");
  try {
    return JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    throw new UnreadableReplyError("invalid JSON");
  }
}

/** Native-script words of a text (punctuation removed). */
export function nativeWords(text: string): string[] {
  return text
    .normalize("NFC")
    .replace(/[\p{P}\p{S}]/gu, " ")
    .split(/\s+/)
    .filter((word) => INDIC.test(word));
}

/** Share (0–1) of the reply's native words found in the grounding text; null if none. */
export function wordCoverage(text: string, grounding: string): number | null {
  const words = nativeWords(text);
  if (!words.length) return null;
  const known = new Set(nativeWords(grounding));
  // A word counts if it appears as-is, or its stem (all but the last 2 characters) appears —
  // Indian languages add endings (case, person) to the same word.
  const groundingText = grounding.normalize("NFC");
  const found = words.filter((word) => {
    if (known.has(word)) return true;
    const stem = Array.from(word).slice(0, -2).join("");
    return Array.from(stem).length >= 2 && groundingText.includes(stem);
  });
  return Math.round((found.length / words.length) * 100) / 100;
}

export function parsePartnerReply(
  raw: string,
  noteCount: number,
  options: { expectFeedback: boolean },
): PartnerReply {
  if (raw.includes(PROMPT_CANARY)) throw new UnreadableReplyError("prompt leak");
  const data = parseJsonObject(raw);
  const issues: string[] = [];

  const replyObject = (data.reply ?? {}) as Record<string, unknown>;
  const reply = {
    text: str(replyObject.text),
    romanization: str(replyObject.romanization),
    translation: str(replyObject.translation),
  };
  if (!reply.text || !INDIC.test(reply.text)) {
    throw new UnreadableReplyError("the reply is not in the target script");
  }

  let feedback: PartnerReply["feedback"] = null;
  if (options.expectFeedback && data.feedback && typeof data.feedback === "object") {
    const rawFeedback = data.feedback as Record<string, unknown>;
    const rawCorrection = rawFeedback.correction as Record<string, unknown> | null | undefined;
    // A correction is only kept when it is really written in the target script.
    const correction =
      rawCorrection && typeof rawCorrection === "object" && INDIC.test(str(rawCorrection.text))
        ? {
            text: str(rawCorrection.text, 300),
            romanization: str(rawCorrection.romanization, 300),
            explanation: str(rawCorrection.explanation, 240),
          }
        : null;
    if (rawCorrection && !correction) issues.push("dropped-invalid-correction");
    feedback = {
      understood: rawFeedback.understood !== false,
      correction,
      note: str(rawFeedback.note, 200),
    };
  }

  const suggestions = (Array.isArray(data.suggestions) ? data.suggestions : [])
    .map((s) => s as Record<string, unknown>)
    .map((s) => ({
      text: str(s.text, 200),
      romanization: str(s.romanization, 200),
      meaning: str(s.meaning, 200),
    }))
    .filter((s) => INDIC.test(s.text))
    .slice(0, 3);

  const ids = (Array.isArray(data.sourceIds) ? data.sourceIds : [])
    .map(Number)
    .filter((n) => Number.isInteger(n));
  const sourceIds = [...new Set(ids.filter((n) => n >= 1 && n <= noteCount))];
  if (sourceIds.length !== ids.length) issues.push("dropped-invalid-source-ids");

  return {
    reply,
    feedback,
    suggestions,
    sourceIds,
    goalReached: data.goalReached === true,
    issues,
  };
}

export type SessionSummaryAi = {
  strengths: string[];
  practise: string[];
  usefulPhrases: Line[];
  encouragement: string;
};

/** The AI part of the summary; phrases must come from the conversation or the notes. */
export function parseSummary(raw: string, grounding: string): SessionSummaryAi {
  if (raw.includes(PROMPT_CANARY)) throw new UnreadableReplyError("prompt leak");
  const data = parseJsonObject(raw);
  const list = (value: unknown) =>
    (Array.isArray(value) ? value : [])
      .map((v) => str(v, 220))
      .filter(Boolean)
      .slice(0, 3);
  const norm = (text: string) =>
    text
      .normalize("NFC")
      .replace(/[\p{P}\p{S}]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  const normalizedGrounding = norm(grounding);
  return {
    strengths: list(data.strengths),
    practise: list(data.practise),
    usefulPhrases: (Array.isArray(data.usefulPhrases) ? data.usefulPhrases : [])
      .map((p) => p as Record<string, unknown>)
      .map((p) => ({
        text: str(p.text, 200),
        romanization: str(p.romanization, 200),
        meaning: str(p.meaning, 200),
      }))
      .filter((p) => INDIC.test(p.text) && normalizedGrounding.includes(norm(p.text)))
      .slice(0, 4),
    encouragement: str(data.encouragement, 240),
  };
}
