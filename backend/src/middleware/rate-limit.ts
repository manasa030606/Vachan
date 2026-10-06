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
export function rateLimitByUser(limiter: RateLimiter) {
  return (req: Request, res: Response, next: NextFunction) => {
    const blocked = limiter.hit(req.auth?.userId ?? req.ip ?? "anonymous");
    if (blocked) {
      res.setHeader("Retry-After", String(blocked.retryAfterSeconds));
      throw new HttpError(
        429,
        "RATE_LIMITED",
        blocked.rule === "minute"
          ? `You're asking quickly! Please wait ${blocked.retryAfterSeconds} seconds.`
          : "You've reached today's tutor limit. Please come back tomorrow.",
        { retryAfterSeconds: blocked.retryAfterSeconds, limit: blocked.rule },
      );
    }
    next();
  };
}
