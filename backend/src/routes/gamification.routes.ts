// Gamification (requires login). Numbers/rules: backend/src/config/gamification.ts.
//   GET /api/stats            XP + level, streak, hearts, daily goal, recent badges (Home screen)
//   GET /api/streak           current/longest streak + the last 7 days
//   GET /api/achievements     every badge with progress
//   GET /api/recommendations  transparent practice recommendations (?languageCode=te)
import { Router } from "express";
import { getUserId, requireAuth } from "../middleware/auth.ts";
import { languageQuerySchema } from "../schemas/gamification.schemas.ts";
import { getRecommendations } from "../services/recommendation.service.ts";
import { getAchievements, getStatsSummary, getStreak } from "../services/stats.service.ts";

export const statsRouter = Router();
export const streakRouter = Router();
export const achievementsRouter = Router();
export const recommendationsRouter = Router();

statsRouter.get("/", requireAuth, async (req, res) => {
  res.json({ stats: await getStatsSummary(getUserId(req)) });
});

streakRouter.get("/", requireAuth, async (req, res) => {
  res.json({ streak: await getStreak(getUserId(req)) });
});

achievementsRouter.get("/", requireAuth, async (req, res) => {
  res.json(await getAchievements(getUserId(req)));
});

recommendationsRouter.get("/", requireAuth, async (req, res) => {
  const { languageCode } = languageQuerySchema.parse(req.query);
  res.json(await getRecommendations(getUserId(req), languageCode));
});
