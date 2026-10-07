// POST /api/auth/register · POST /api/auth/login · POST /api/auth/logout
import { Router } from "express";
import { clearAuthCookie, setAuthCookie } from "../lib/auth-cookie.ts";
import { env } from "../config/env.ts";
import { getUserId, requireAuth } from "../middleware/auth.ts";
import { RateLimiter, rateLimitBy } from "../middleware/rate-limit.ts";
import { loginSchema, registerSchema } from "../schemas/auth.schemas.ts";
import { loginUser, logoutUser, registerUser } from "../services/auth.service.ts";

export const authRouter = Router();

// Phase 8: brute-force protection. Login: per IP + email (a wrong-password storm on one account
// is slowed down; other learners on the same school/office IP are not affected). Register: per IP.
const loginLimiter = new RateLimiter([
  { name: "minute", limit: env.LOGIN_RATE_LIMIT_PER_MINUTE, windowMs: 60_000 },
  { name: "hour", limit: env.LOGIN_RATE_LIMIT_PER_MINUTE * 5, windowMs: 60 * 60_000 },
]);
const registerLimiter = new RateLimiter([
  { name: "hour", limit: env.REGISTER_RATE_LIMIT_PER_HOUR, windowMs: 60 * 60_000 },
]);
const emailOf = (body: unknown) =>
  String((body as { email?: unknown } | undefined)?.email ?? "")
    .trim()
    .toLowerCase()
    .slice(0, 254);

authRouter.post(
  "/register",
  rateLimitBy(registerLimiter, (req) => req.ip ?? "unknown", "sign-up"),
  async (req, res) => {
    const input = registerSchema.parse(req.body);
    const { user, token } = await registerUser(input);
    setAuthCookie(res, token);
    res.status(201).json({ user, token });
  },
);

authRouter.post(
  "/login",
  rateLimitBy(loginLimiter, (req) => `${req.ip ?? "unknown"}|${emailOf(req.body)}`, "login"),
  async (req, res) => {
    const input = loginSchema.parse(req.body);
    const { user, token } = await loginUser(input);
    setAuthCookie(res, token);
    res.status(200).json({ user, token });
  },
);

authRouter.post("/logout", requireAuth, async (req, res) => {
  await logoutUser(getUserId(req));
  clearAuthCookie(res);
  res.status(200).json({ message: "Logged out. Your previous token no longer works." });
});
