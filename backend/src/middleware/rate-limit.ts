// A small per-learner rate limiter (no extra library).
//
// Fixed windows kept in memory: N requests per minute and M per day for each user id.
// Protects the free AI quota from one learner (or a script) using it all.
// Limits reset when the server restarts and are per server process — fine for one Render
// instance; with several instances a shared store (e.g. Redis) would be needed (Phase 8).
import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../lib/http-error.ts";

type Window = { count: number; resetsAt: number };

export class RateLimiter {
  private readonly windows = new Map<string, Window>();

  constructor(private readonly rules: Array<{ name: string; limit: number; windowMs: number }>) {}

  /** Records one request; returns null if allowed, or how long to wait. */
  hit(key: string, now = Date.now()): { rule: string; retryAfterSeconds: number } | null {
    for (const rule of this.rules) {
      const id = `${rule.name}:${key}`;
      const window = this.windows.get(id);
      if (window && window.resetsAt > now && window.count >= rule.limit) {
        return { rule: rule.name, retryAfterSeconds: Math.ceil((window.resetsAt - now) / 1000) };
      }
    }
    for (const rule of this.rules) {
      const id = `${rule.name}:${key}`;
      const window = this.windows.get(id);
      if (!window || window.resetsAt <= now)
        this.windows.set(id, { count: 1, resetsAt: now + rule.windowMs });
      else window.count += 1;
    }
    if (this.windows.size > 10_000) this.cleanup(now);
    return null;
  }

  private cleanup(now: number) {
    for (const [id, window] of this.windows) if (window.resetsAt <= now) this.windows.delete(id);
  }
}

/** Express middleware (after requireAuth): limits by user id. */
export function rateLimitByUser(limiter: RateLimiter, feature = "tutor") {
  return rateLimitBy(limiter, (req) => req.auth?.userId ?? req.ip ?? "anonymous", feature);
}

/**
 * Phase 8: limits by any key — e.g. client IP + email for login (slows down password guessing
 * without locking a real user out from a different network). Behind Render/Vercel the client IP
 * comes from X-Forwarded-For, which Express only trusts when `trust proxy` is set (app.ts).
 */
export function rateLimitBy(limiter: RateLimiter, key: (req: Request) => string, feature: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const blocked = limiter.hit(key(req));
    if (blocked) {
      res.setHeader("Retry-After", String(blocked.retryAfterSeconds));
      throw new HttpError(
        429,
        "RATE_LIMITED",
        blocked.rule === "minute"
          ? `Too many requests. Please wait ${blocked.retryAfterSeconds} seconds.`
          : blocked.rule === "day"
            ? `You've reached today's ${feature} limit. Please come back tomorrow.`
            : `Too many ${feature} attempts. Please try again in ${Math.ceil(blocked.retryAfterSeconds / 60)} minutes.`,
        { retryAfterSeconds: blocked.retryAfterSeconds, limit: blocked.rule },
      );
    }
    next();
  };
}
