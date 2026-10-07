// Authentication middleware.
//
// The token can arrive in two ways:
//   1. Authorization: Bearer <token>   ← Postman, mobile apps
//   2. the httpOnly "vachan_token" cookie ← the Vachan website
//
// requireAuth → 401 if there is no valid token.
// optionalAuth → never fails; sets req.auth only when a valid token is present.
import type { NextFunction, Request, Response } from "express";
import { AUTH_COOKIE_NAME } from "../lib/auth-cookie.ts";
import { readAuthToken } from "../lib/auth-token.ts";
import { forbidden, unauthorized } from "../lib/http-error.ts";
import { prisma } from "../lib/prisma.ts";

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice("Bearer ".length).trim() || null;

  const cookieToken: unknown = req.cookies?.[AUTH_COOKIE_NAME];
  return typeof cookieToken === "string" && cookieToken.length > 0 ? cookieToken : null;
}

/** Returns the logged-in user for this request, or null. */
async function authenticate(req: Request): Promise<Request["auth"] | null> {
  const token = extractToken(req);
  if (!token) return null;

  const payload = readAuthToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, role: true, tokenVersion: true },
  });
  // The token is only valid if the user still exists and hasn't logged out since it was issued.
  if (!user || user.tokenVersion !== payload.ver) return null;

  return { userId: user.id, email: user.email, role: user.role };
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const auth = await authenticate(req);
  if (!auth) {
    throw unauthorized("You need to log in to do this. Send a valid token (see docs/API.md).");
  }
  req.auth = auth;
  next();
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  req.auth = (await authenticate(req)) ?? undefined;
  next();
}

/** Use inside routes protected by requireAuth to get the user id with the right type. */
export function getUserId(req: Request): string {
  if (!req.auth) throw unauthorized();
  return req.auth.userId;
}

/**
 * Admin-only routes. Use AFTER requireAuth. The role is read from the database on every request
 * (authenticate() above), so removing someone's admin role takes effect immediately.
 */
export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (req.auth?.role !== "ADMIN") {
    throw forbidden("ADMIN_ONLY", "Only Vachan admins can do this");
  }
  next();
}
