// POST /api/auth/register · POST /api/auth/login · POST /api/auth/logout
import { Router } from "express";
import { clearAuthCookie, setAuthCookie } from "../lib/auth-cookie.ts";
import { getUserId, requireAuth } from "../middleware/auth.ts";
import { loginSchema, registerSchema } from "../schemas/auth.schemas.ts";
import { loginUser, logoutUser, registerUser } from "../services/auth.service.ts";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const input = registerSchema.parse(req.body);
  const { user, token } = await registerUser(input);
  setAuthCookie(res, token);
  res.status(201).json({ user, token });
});

authRouter.post("/login", async (req, res) => {
  const input = loginSchema.parse(req.body);
  const { user, token } = await loginUser(input);
  setAuthCookie(res, token);
  res.status(200).json({ user, token });
});

authRouter.post("/logout", requireAuth, async (req, res) => {
  await logoutUser(getUserId(req));
  clearAuthCookie(res);
  res.status(200).json({ message: "Logged out. Your previous token no longer works." });
});
