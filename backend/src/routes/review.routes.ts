// The learner's mistakes (requires login).
//   GET /api/review           open mistakes + words learned (?languageCode=te)
//   GET /api/review/attempts  every incorrect answer, newest first (?languageCode=te&limit=20)
//   GET /api/review/session   open mistakes as exercises to practise (?languageCode=te&limit=10)
// Review answers are sent to POST /api/exercises/:id/attempt with "mode": "review".
import { Router } from "express";
import { getUserId, requireAuth } from "../middleware/auth.ts";
import { reviewQuerySchema } from "../schemas/content.schemas.ts";
import { getIncorrectAttempts, getReview, getReviewSession } from "../services/review.service.ts";

export const reviewRouter = Router();

reviewRouter.use(requireAuth);

reviewRouter.get("/", async (req, res) => {
  const { languageCode } = reviewQuerySchema.parse(req.query);
  res.json({ review: await getReview(getUserId(req), languageCode) });
});

reviewRouter.get("/attempts", async (req, res) => {
  const { languageCode, limit } = reviewQuerySchema.parse(req.query);
  res.json({ attempts: await getIncorrectAttempts(getUserId(req), languageCode, limit) });
});

reviewRouter.get("/session", async (req, res) => {
  const { languageCode, limit } = reviewQuerySchema.parse(req.query);
  res.json({ session: await getReviewSession(getUserId(req), languageCode, Math.min(limit, 10)) });
});
