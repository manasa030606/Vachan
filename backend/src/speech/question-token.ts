// Listening questions must not reveal their answer — not even through ids (course ids are
// readable, e.g. "te-v16-hello"). Each question gets an encrypted token (AES-256-GCM, key
// derived from JWT_SECRET) holding the vocabulary item and the correct option letter. The
// client sends the token back to play the audio and to check the answer.
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { env } from "../config/env.ts";
import { HttpError } from "../lib/http-error.ts";

type QuestionSecret = { itemId: string; correct: string; expiresAt: number };

const key = createHash("sha256").update(`${env.JWT_SECRET}|vachan-listening`).digest();
const TTL_MS = 24 * 60 * 60_000;

export function sealQuestion(itemId: string, correct: string, now = Date.now()): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const payload: QuestionSecret = { itemId, correct, expiresAt: now + TTL_MS };
  const data = Buffer.concat([cipher.update(JSON.stringify(payload), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), data]).toString("base64url");
}

// Token layout (base64url): 12-byte IV | 16-byte auth tag | encrypted JSON.
export function openQuestion(token: string, now = Date.now()): QuestionSecret {
  try {
    const raw = Buffer.from(token, "base64url");
    const decipher = createDecipheriv("aes-256-gcm", key, raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    const text = Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString();
    const secret = JSON.parse(text) as QuestionSecret;
    if (secret.expiresAt < now) throw new Error("expired");
    return secret;
  } catch {
    throw new HttpError(400, "INVALID_QUESTION", "This question has expired — start a new round");
  }
}
