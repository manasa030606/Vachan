// The login token is stored in an httpOnly cookie for the browser.
// httpOnly = JavaScript in the page cannot read it, which protects it from XSS attacks.
import type { CookieOptions, Response } from "express";
import { env } from "../config/env.ts";

export const AUTH_COOKIE_NAME = "vachan_token";

function cookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    // "lax" works because the browser always talks to ONE site:
    //   local:    localhost:3000 → localhost:4000 (same site)
    //   deployed: https://<vercel-app>/api/* is proxied to the backend by next.config.ts,
    //             so the cookie belongs to the frontend's own domain (first-party).
    sameSite: "lax",
    secure: env.NODE_ENV === "production", // HTTPS-only in production
    path: "/",
  };
}

/** Converts "7d" / "12h" / "30m" / "45s" into milliseconds for the cookie's maxAge. */
export function durationToMs(duration: string): number {
  const amount = Number.parseInt(duration, 10);
  const unit = duration.slice(-1);
  const factor = { s: 1_000, m: 60_000, h: 3_600_000, d: 86_400_000 }[unit] ?? 86_400_000;
  return amount * factor;
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(AUTH_COOKIE_NAME, token, {
    ...cookieOptions(),
    maxAge: durationToMs(env.JWT_EXPIRES_IN),
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(AUTH_COOKIE_NAME, cookieOptions());
}
