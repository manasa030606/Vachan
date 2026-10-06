// OFFLINE TEST DOUBLE — not an AI. Used by the automated tests (LLM_PROVIDER=mock) so the whole
// pipeline (retrieval → prompt → "LLM" → parsing → references → database) can be tested without an
// API key or internet. It "answers" by quoting the first retrieved note, in the same JSON format
// a real model must use. Never use it for real learners.
import type { GenerateRequest, GenerateResult, LlmProvider } from "./types.ts";

export class MockProvider implements LlmProvider {
  readonly name = "mock";
  readonly model = "mock-extractive";

  async generate(request: GenerateRequest): Promise<GenerateResult> {
    const prompt = request.turns.at(-1)?.text ?? "";
    // The first context item looks like: [1] Heading (…)\n<text>
    const first = /\[1\][^\n]*\n([\s\S]*?)(?:\n\[2\]|\n<\/context>)/.exec(prompt);
    const sentence = first?.[1]?.trim().split(/(?<=[.!?])\s/)[0] ?? "";
    const answer = first
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
    return { text: JSON.stringify(answer), model: `mock/${this.model}` };
  }
}
