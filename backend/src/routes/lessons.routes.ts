// GET /api/lessons/:id — requires login (lessons depend on the learner's progress).
import { Router } from "express";
import { getUserId, requireAuth } from "../middleware/auth.ts";
import { idParamSchema } from "../schemas/content.schemas.ts";
import { getLessonForLearner } from "../services/lesson.service.ts";

export const lessonsRouter = Router();

lessonsRouter.get("/:id", requireAuth, async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  res.json({ lesson: await getLessonForLearner(id, getUserId(req)) });
});
