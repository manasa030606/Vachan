// GET /api/me · PATCH /api/me — the logged-in user's account and profile.
import { Router } from "express";
import { getUserId, requireAuth } from "../middleware/auth.ts";
import { updateMeSchema } from "../schemas/me.schemas.ts";
import { getUserById, updateUserProfile } from "../services/user.service.ts";

export const meRouter = Router();

meRouter.use(requireAuth);

meRouter.get("/", async (req, res) => {
  res.json({ user: await getUserById(getUserId(req)) });
});

meRouter.patch("/", async (req, res) => {
  const input = updateMeSchema.parse(req.body);
  res.json({ user: await updateUserProfile(getUserId(req), input) });
});
