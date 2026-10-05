// GET /api/courses · GET /api/courses/:id — public; lesson statuses are personal when logged in.
import { Router } from "express";
import { optionalAuth } from "../middleware/auth.ts";
import { idParamSchema, listCoursesQuerySchema } from "../schemas/content.schemas.ts";
import { getCourseDetail, listCourses } from "../services/course.service.ts";

export const coursesRouter = Router();

coursesRouter.get("/", async (req, res) => {
  const { languageCode } = listCoursesQuerySchema.parse(req.query);
  res.json({ courses: await listCourses(languageCode) });
});

coursesRouter.get("/:id", optionalAuth, async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  res.json({ course: await getCourseDetail(id, req.auth?.userId ?? null) });
});
