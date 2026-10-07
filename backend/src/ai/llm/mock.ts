// OFFLINE TEST DOUBLE — not an AI. Used by the automated tests (LLM_PROVIDER=mock) so the whole
// pipeline (retrieval → prompt → "LLM" → parsing → references → database) can be tested without an
// API key or internet. It "answers" by copying text from the prompt, in the same JSON format a
// real model must use. Never use it for real learners.
import type { GenerateRequest, GenerateResult, LlmProvider } from "./types.ts";

/** "- నమస్కారం (namaskaaram) — Hello" lines of a <vocabulary> block. */
function vocabularyLines(prompt: string) {
  const block = /<vocabulary>\n([\s\S]*?)\n<\/vocabulary>/.exec(prompt)?.[1] ?? "";
  return [...block.matchAll(/^- (.+?) \((.+?)\) — (.+)$/gm)].map((m) => ({
    text: m[1]!,
    romanization: m[2]!,
    meaning: m[3]!,
  }));
}

function tutorAnswer(prompt: string) {
  // The first context item looks like: [1] Heading (…)\n<text>
  const first = /\[1\][^\n]*\n([\s\S]*?)(?:\n\[2\]|\n<\/context>)/.exec(prompt);
  const sentence = first?.[1]?.trim().split(/(?<=[.!?])\s/)[0] ?? "";
  return first
    ? {
        answer: `According to the Vachan notes: ${sentence}`,
        examples: [],
        sourceIds: [1],
        status: "answered",
      }
    : {
        answer: "The notes do not cover this.",
        examples: [],
        sourceIds: [],
        status: "insufficient",
      };
}

function partnerReply(prompt: string) {
  const words = vocabularyLines(prompt);
  const turn = (prompt.match(/^(You|Learner): /gm) ?? []).length;
  const line = words[turn % Math.max(1, words.length)] ?? {
    text: "నమస్కారం",
    romanization: "namaskaaram",
    meaning: "Hello",
  };
  const hasNotes = /<notes>\n\[1\]/.test(prompt);
  return {
    reply: {
      text: `${line.text}?`,
      romanization: `${line.romanization}?`,
      translation: `${line.meaning}?`,
    },
    feedback: prompt.includes("<reply>")
      ? { understood: true, correction: null, note: "Good — the partner understood you." }
      : null,
    suggestions: words.slice(0, 2),
    sourceIds: hasNotes ? [1] : [],
    goalReached: false,
  };
}

function sessionSummary(prompt: string) {
  const partnerLine = /^Partner: (.+)$/m.exec(prompt)?.[1]?.replace(/[?.!]$/, "") ?? "";
  const learnerLines = (prompt.match(/^Learner: /gm) ?? []).length;
  return {
    strengths: [`You replied ${learnerLines} time(s) in the role-play.`],
    practise: ["Try to answer with a full short sentence."],
    usefulPhrases: partnerLine ? [{ text: partnerLine, romanization: "", meaning: "" }] : [],
    encouragement: "Keep practising!",
  };
}

export class MockProvider implements LlmProvider {
  readonly name = "mock";
  readonly model = "mock-extractive";

  async generate(request: GenerateRequest): Promise<GenerateResult> {
    const prompt = request.turns.at(-1)?.text ?? "";
    const answer =
      request.purpose === "conversation"
        ? partnerReply(prompt)
        : request.purpose === "conversation-summary"
          ? sessionSummary(prompt)
          : tutorAnswer(prompt);
    return { text: JSON.stringify(answer), model: `mock/${this.model}` };
  }
}
