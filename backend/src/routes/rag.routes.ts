// RAG knowledge-base search — retrieval only, no LLM (requires login).
//   POST /api/rag/search  { query, language?, level?, topic?, limit? } → relevant chunks + metadata
//   GET  /api/rag/stats   what is indexed (documents, chunks per language/type/level, topics)
import { Router } from "express";
import { env, ragEnabled } from "../config/env.ts";
import { HttpError } from "../lib/http-error.ts";
import { requireAuth } from "../middleware/auth.ts";
import { getKnowledgeStats, searchKnowledge } from "../rag/retrieval.service.ts";
import { ragSearchSchema } from "../schemas/rag.schemas.ts";

export const ragRouter = Router();

ragRouter.use(requireAuth);

ragRouter.post("/search", async (req, res) => {
  const body = ragSearchSchema.parse(req.body ?? {}); // invalid input → 400 even when search is off
  if (!ragEnabled) {
    throw new HttpError(
      503,
      "RAG_DISABLED",
      `Knowledge-base search is turned off on this server (NODE_ENV=${env.NODE_ENV}, RAG_ENABLED=${env.RAG_ENABLED ?? "not set"}). ` +
        "It is off by default in production because the model needs about 550 MB of memory — see docs/AI.md.",
    );
  }
  res.json(await searchKnowledge(body));
});

ragRouter.get("/stats", async (_req, res) => {
  res.json({ knowledgeBase: { searchEnabled: ragEnabled, ...(await getKnowledgeStats()) } });
});
