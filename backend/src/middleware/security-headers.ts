// Security headers for every API response (no library needed — the API only returns
// JSON and audio, so a strict policy is safe).
//   nosniff            browsers must not guess content types (stops "JSON as HTML" tricks)
//   frame-ancestors    the API can't be embedded in a frame (clickjacking)
//   default-src 'none' a response opened directly in the browser can't run scripts
//   Referrer-Policy    no URLs leak to other sites
//   HSTS               production only: browsers always use HTTPS
import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.ts";

export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  if (env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
}
