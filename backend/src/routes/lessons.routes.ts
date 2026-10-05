// Lessons (require login — lessons depend on the learner's progress).
//   GET  /api/lessons/:id        the lesson, its words and exercises (no answers) + progress
//   POST /api/lessons/:id/start  start / resume the lesson ({ "restart": true } starts over)
import { Router } from "express";
import { getUserId, requireAuth } from "../middleware/auth.ts";
import { idParamSchema, startLessonBodySchema } from "../schemas/content.schemas.ts";
import { getLessonForLearner, startLesson } from "../services/lesson.service.ts";

export const lessonsRouter = Router();

lessonsRouter.use(requireAuth);

lessonsRouter.get("/:id", async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  res.json({ lesson: await getLessonForLearner(id, getUserId(req)) });
});

lessonsRouter.post("/:id/start", async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  const { restart } = startLessonBodySchema.parse(req.body ?? undefined);
  res.json(await startLesson(id, getUserId(req), restart));
});
