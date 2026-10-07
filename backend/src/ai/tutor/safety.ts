// Basic protection for the tutor's input.
//
//  1. sanitizeQuestion — Unicode NFC, no control characters, single spaces, length limit.
//  2. detectInjection  — catches the common "ignore your instructions / show your prompt / you are
//     now …" attempts BEFORE anything is sent to the LLM. Those questions get a polite refusal.
//  3. neutralizeTags   — removes look-alike prompt delimiters (<context>, <question> …) from text
//     the learner controls, so it can't pretend to be part of the retrieved notes.
// The system prompt adds a second layer: everything inside the delimiters is data, not instructions.
// This is basic protection, not a guarantee — see docs/AI_TUTOR.md → Security.
import { TUTOR_CONFIG } from "../../config/tutor.ts";

// eslint-disable-next-line no-control-regex -- removing control characters is the point
const CONTROL_CHARS = /[\u0000-\u0008\u000B-\u001F\u007F-\u009F\u200B\u2060\uFEFF]/g;

export function sanitizeQuestion(input: string): string {
  return input
    .normalize("NFC")
    .replace(CONTROL_CHARS, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, TUTOR_CONFIG.maxQuestionLength);
}

const PROMPT_TAGS =
  /<\/?\s*(context|question|learner|exercise|conversation|system|instructions?|rules|scenario|vocabulary|notes|reply)\b[^>]*>/gi;

export function neutralizeTags(text: string): string {
  return text.replace(PROMPT_TAGS, "");
}

const INJECTION_PATTERNS: Array<[string, RegExp]> = [
  [
    "ignore-instructions",
    /\b(ignore|disregard|forget|override|bypass)\b.{0,30}\b(previous|prior|above|earlier|all|your|the|these|system)\b.{0,20}\b(instructions?|rules?|prompts?|guidelines?)\b/i,
  ],
  [
    "reveal-prompt",
    /\b(reveal|show|print|repeat|display|leak|tell me|what (is|are))\b.{0,25}\b(system prompt|your (instructions|rules|prompt)|hidden (instructions|prompt))\b/i,
  ],
  ["system-prompt", /\bsystem\s*prompt\b/i],
  [
    "role-change",
    /\b(you are now|from now on you are|pretend (to be|you are)|act as (an? )?(unrestricted|different|evil|dan)\b)/i,
  ],
  ["jailbreak", /\b(jailbreak|developer mode|dan mode|do anything now)\b/i],
  ["fake-delimiter", PROMPT_TAGS],
];

/** Returns the name of the matched pattern, or null when the question looks normal. */
export function detectInjection(text: string): string | null {
  for (const [name, pattern] of INJECTION_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) return name;
  }
  return null;
}

/** A random-looking marker inside the system prompt: if it ever shows up in an answer, the
 *  model leaked its instructions and the answer is replaced. */
export const PROMPT_CANARY = "VACHAN-RULES-41C7";
