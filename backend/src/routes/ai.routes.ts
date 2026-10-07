// AI tutor (Phase 6) — requires login. The LLM API key never leaves the server.
//   POST   /api/ai/tutor                 ask a question → grounded answer + references (rate-limited)
//   GET    /api/ai/tutor/context         learner context, suggested questions, tutor availability
//   GET    /api/ai/conversations         my tutor chats (?language=te)
//   GET    /api/ai/conversations/:id     one chat with all messages
//   DELETE /api/ai/conversations/:id     delete one chat
// Role-play conversation (Phase 7):
//   GET    /api/ai/conversation/scenarios      the 6 scenarios + key words, level, availability
//   POST   /api/ai/conversation                { scenario, language?, level? } → session + partner's first line
//   GET    /api/ai/conversation                my role-plays (?language=te)
//   GET    /api/ai/conversation/:id            one role-play with all lines
//   POST   /api/ai/conversation/:id/reply      { text, inputMode, audio? } → my line + partner's answer
//   POST   /api/ai/conversation/:id/end        end → summary (statistics + AI review)
//   DELETE /api/ai/conversation/:id            delete one role-play
import { Router } from "express";
import { env } from "../config/env.ts";
import {
  deleteConversation,
  getConversation,
  listConversations,
} from "../ai/tutor/conversation.service.ts";
import { askTutor, getTutorContext } from "../ai/tutor/tutor.service.ts";
import {
  deleteConversationSession,
  endConversation,
  getConversationSession,
  listConversationSessions,
  listScenarios,
  replyToConversation,
  startConversation,
} from "../ai/conversation/conversation.service.ts";
import { getUserId, requireAuth } from "../middleware/auth.ts";
import { RateLimiter, rateLimitByUser } from "../middleware/rate-limit.ts";
import {
  conversationLanguageQuerySchema,
  conversationListQuerySchema,
  conversationReplySchema,
  conversationStartSchema,
  tutorAskSchema,
  tutorContextQuerySchema,
} from "../schemas/ai.schemas.ts";

export const aiRouter = Router();

const tutorLimiter = new RateLimiter([
  { name: "minute", limit: env.TUTOR_RATE_LIMIT_PER_MINUTE, windowMs: 60_000 },
  { name: "day", limit: env.TUTOR_RATE_LIMIT_PER_DAY, windowMs: 24 * 60 * 60_000 },
]);

const conversationLimiter = new RateLimiter([
  { name: "minute", limit: env.CONVERSATION_RATE_LIMIT_PER_MINUTE, windowMs: 60_000 },
  { name: "day", limit: env.CONVERSATION_RATE_LIMIT_PER_DAY, windowMs: 24 * 60 * 60_000 },
]);

aiRouter.use(requireAuth);

// Validate first (invalid requests don't use up the learner's quota), then rate-limit, then ask.
aiRouter.post(
  "/tutor",
  (req, _res, next) => {
    req.body = tutorAskSchema.parse(req.body ?? {});
    next();
  },
  rateLimitByUser(tutorLimiter),
  async (req, res) => {
    res.json(await askTutor(getUserId(req), req.body));
  },
);

aiRouter.get("/tutor/context", async (req, res) => {
  const query = tutorContextQuerySchema.parse(req.query);
  res.json(await getTutorContext(getUserId(req), query));
});

aiRouter.get("/conversations", async (req, res) => {
  const { language } = conversationListQuerySchema.parse(req.query);
  res.json({ conversations: await listConversations(getUserId(req), language) });
});

aiRouter.get("/conversations/:id", async (req, res) => {
  res.json({ conversation: await getConversation(getUserId(req), String(req.params.id)) });
});

aiRouter.delete("/conversations/:id", async (req, res) => {
  await deleteConversation(getUserId(req), String(req.params.id));
  res.json({ message: "Conversation deleted" });
});

// ── Role-play conversation (Phase 7) ────────────────────────────

aiRouter.get("/conversation/scenarios", async (req, res) => {
  const { language } = conversationLanguageQuerySchema.parse(req.query);
  res.json(await listScenarios(getUserId(req), language));
});

aiRouter.post(
  "/conversation",
  (req, _res, next) => {
    req.body = conversationStartSchema.parse(req.body ?? {});
    next();
  },
  rateLimitByUser(conversationLimiter, "conversation"),
  async (req, res) => {
    res.status(201).json(await startConversation(getUserId(req), req.body));
  },
);

aiRouter.get("/conversation", async (req, res) => {
  const { language } = conversationLanguageQuerySchema.parse(req.query);
  res.json({ sessions: await listConversationSessions(getUserId(req), language) });
});

aiRouter.get("/conversation/:id", async (req, res) => {
  res.json(await getConversationSession(getUserId(req), String(req.params.id)));
});

aiRouter.post(
  "/conversation/:id/reply",
  (req, _res, next) => {
    req.body = conversationReplySchema.parse(req.body ?? {});
    next();
  },
  rateLimitByUser(conversationLimiter, "conversation"),
  async (req, res) => {
    res.json(await replyToConversation(getUserId(req), String(req.params.id), req.body));
  },
);

aiRouter.post("/conversation/:id/end", async (req, res) => {
  res.json(await endConversation(getUserId(req), String(req.params.id)));
});

aiRouter.delete("/conversation/:id", async (req, res) => {
  await deleteConversationSession(getUserId(req), String(req.params.id));
  res.json({ message: "Conversation deleted" });
});
