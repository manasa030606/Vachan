// Login tokens (JSON Web Tokens).
//
// A token contains the user's id ("sub") and their tokenVersion ("ver"), signed with
// JWT_SECRET so nobody can forge or edit it. On logout we increase the user's
// tokenVersion in the database, which makes every older token invalid.
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.ts";

const payloadSchema = z.object({
  sub: z.string().min(1),
  ver: z.number().int(),
});

export type AuthTokenPayload = z.infer<typeof payloadSchema>;

export function createAuthToken(userId: string, tokenVersion: number): string {
  return jwt.sign({ ver: tokenVersion }, env.JWT_SECRET, {
    subject: userId,
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    algorithm: "HS256",
  });
}

/** Returns the payload, or null if the token is missing, expired, or tampered with. */
export function readAuthToken(token: string): AuthTokenPayload | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, { algorithms: ["HS256"] });
    const result = payloadSchema.safeParse(decoded);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
