// GET /api/progress · GET /api/progress/:lessonId — the learner's own progress (requires login).
import { Router } from "express";
import { getUserId, requireAuth } from "../middleware/auth.ts";
import { lessonIdParamSchema } from "../schemas/content.schemas.ts";
import { getLessonProgress, getProgressSummary } from "../services/progress.service.ts";

export const progressRouter = Router();

progressRouter.use(requireAuth);

progressRouter.get("/", async (req, res) => {
  res.json({ progress: await getProgressSummary(getUserId(req)) });
});

progressRouter.get("/:lessonId", async (req, res) => {
  const { lessonId } = lessonIdParamSchema.parse(req.params);
  res.json({ progress: await getLessonProgress(getUserId(req), lessonId) });
});
