// GET /api/languages — public.
import { Router } from "express";
import { listLanguages } from "../services/course.service.ts";

export const languagesRouter = Router();

languagesRouter.get("/", async (_req, res) => {
  res.json({ languages: await listLanguages() });
});
