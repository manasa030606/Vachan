import { z } from "zod";
import { KNOWLEDGE_LEVELS, RAG_CONFIG } from "../rag/config.ts";
import { LANGUAGE_CODES } from "../rag/types.ts";

/** POST /api/rag/search */
export const ragSearchSchema = z
  .object({
    /** The learner's question, in English or in the target language. */
    query: z.string().trim().min(2, "query must be at least 2 characters").max(500),
    /** Target language; when missing it is inferred from the question ("… in Telugu", native script). */
    language: z.enum(LANGUAGE_CODES).optional(),
    /** Learner level: same-level chunks are preferred, harder ones are pushed down. */
    level: z.enum(KNOWLEDGE_LEVELS).optional(),
    /** Topic slug such as "greetings", "pronouns" (see GET /api/rag/stats → topics). */
    topic: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "topic must be a slug like greetings or past-tense")
      .optional(),
    limit: z.coerce.number().int().min(1).max(RAG_CONFIG.retrieval.maxLimit).optional(),
  })
  .strict();
