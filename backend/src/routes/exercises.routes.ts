// POST /api/exercises/:id/attempt — submit an answer (requires login).
import { Router } from "express";
import { getUserId, requireAuth } from "../middleware/auth.ts";
import { attemptBodySchema, idParamSchema } from "../schemas/content.schemas.ts";
import { submitAttempt } from "../services/progress.service.ts";

export const exercisesRouter = Router();

exercisesRouter.post("/:id/attempt", requireAuth, async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  const { answer } = attemptBodySchema.parse(req.body);
  res.status(201).json(await submitAttempt(id, getUserId(req), answer));
});
