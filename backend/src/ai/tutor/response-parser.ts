// Turns the model's JSON into a safe, GROUNDED answer.
//
// Checks (each one is unit-tested):
//  • the reply must be the JSON object we asked for (code fences are tolerated);
//  • sourceIds must point at retrieved notes — invented numbers are dropped;
//  • an "answered" reply that cites no retrieved note is NOT shown: it becomes "insufficient";
//  • examples are kept only if their native-script text appears in the retrieved notes
//    (so the tutor can't invent a Telugu sentence and present it as an example);
//  • if the model repeats its hidden rules (canary), the answer is replaced.
import { z } from "zod";
import { PROMPT_CANARY } from "./safety.ts";

const outputSchema = z.object({
  answer: z.string().trim().min(1).max(4000),
  examples: z
    .array(
      z.object({
        native: z.string().trim().min(1).max(300),
        romanization: z.string().trim().max(300).optional().default(""),
        meaning: z.string().trim().max(300).optional().default(""),
      }),
    )
    .max(5)
    .optional()
    .default([]),
  sourceIds: z.array(z.coerce.number().int()).max(20).optional().default([]),
  status: z.enum(["answered", "insufficient"]).optional().default("answered"),
});

export type ParsedAnswer = {
  answer: string;
  examples: Array<{ native: string; romanization: string; meaning: string }>;
  sourceIds: number[];
  status: "answered" | "insufficient";
  /** What the checks changed (logged and stored for debugging). */
  issues: string[];
};

export class UnreadableAnswerError extends Error {}

function extractJson(text: string): unknown {
  const unfenced = text.replace(/^\s*```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
  const start = unfenced.indexOf("{");
  const end = unfenced.lastIndexOf("}");
  if (start === -1 || end <= start) throw new UnreadableAnswerError("no JSON object in the reply");
  try {
    return JSON.parse(unfenced.slice(start, end + 1));
  } catch {
    throw new UnreadableAnswerError("the reply is not valid JSON");
  }
}

const squash = (text: string) => text.normalize("NFC").replace(/\s+/g, "");

export function parseTutorReply(
  raw: string,
  contextTexts: string[],
  insufficientMessage: string,
): ParsedAnswer {
  const parsed = outputSchema.safeParse(extractJson(raw));
  if (!parsed.success)
    throw new UnreadableAnswerError("the reply does not match the answer format");
  const output = parsed.data;
  const issues: string[] = [];

  if (output.answer.includes(PROMPT_CANARY)) {
    return {
      answer: insufficientMessage,
      examples: [],
      sourceIds: [],
      status: "insufficient",
      issues: ["prompt-leak"],
    };
  }

  const sourceIds = [...new Set(output.sourceIds)].filter(
    (n) => n >= 1 && n <= contextTexts.length,
  );
  if (sourceIds.length !== new Set(output.sourceIds).size)
    issues.push("dropped-invalid-source-ids");

  const allContext = squash(contextTexts.join("\n"));
  const examples = output.examples.filter((example) => allContext.includes(squash(example.native)));
  if (examples.length !== output.examples.length) issues.push("dropped-examples-not-in-notes");

  if (output.status === "insufficient") {
    return { answer: output.answer, examples: [], sourceIds, status: "insufficient", issues };
  }
  if (sourceIds.length === 0) {
    issues.push("ungrounded-answer-replaced");
    return {
      answer: insufficientMessage,
      examples: [],
      sourceIds: [],
      status: "insufficient",
      issues,
    };
  }
  return { answer: output.answer, examples, sourceIds, status: "answered", issues };
}
