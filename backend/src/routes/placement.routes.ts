// Placement test (requires login).
//   POST /api/placement/start    { "languageCode"?: "te" }                 → test + questions (no answers)
//   POST /api/placement/answer   { "testId", "questionId", "answer": {…} } → progress (no right/wrong yet)
//   GET  /api/placement/result   ?testId=…  (default: latest test for your language)
//   POST /api/placement/decide   { "testId", "choice": "recommended" | "beginning" }
import { Router } from "express";
import { getUserId, requireAuth } from "../middleware/auth.ts";
import {
  placementAnswerSchema,
  placementDecideSchema,
  placementResultQuerySchema,
  placementStartSchema,
} from "../schemas/gamification.schemas.ts";
import {
  answerPlacement,
  decidePlacement,
  getPlacementResult,
  startPlacement,
} from "../services/placement.service.ts";

export const placementRouter = Router();

placementRouter.use(requireAuth);

placementRouter.post("/start", async (req, res) => {
  const { languageCode } = placementStartSchema.parse(req.body ?? undefined);
  res.status(201).json(await startPlacement(getUserId(req), languageCode));
});

placementRouter.post("/answer", async (req, res) => {
  const { testId, questionId, answer } = placementAnswerSchema.parse(req.body);
  res.status(201).json(await answerPlacement(getUserId(req), testId, questionId, answer));
});

placementRouter.get("/result", async (req, res) => {
  const { testId } = placementResultQuerySchema.parse(req.query);
  res.json({ result: await getPlacementResult(getUserId(req), testId) });
});

placementRouter.post("/decide", async (req, res) => {
  const { testId, choice } = placementDecideSchema.parse(req.body);
  res.json(await decidePlacement(getUserId(req), testId, choice));
});
