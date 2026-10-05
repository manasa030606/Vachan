// Password hashing with scrypt (built into Node.js — no extra library needed).
// We store "scrypt:<salt>:<hash>", never the password itself.
//
// Why scrypt? It is deliberately slow and memory-hungry, which makes guessing
// passwords from a stolen database very expensive.
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keyLength: number,
) => Promise<Buffer>;

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

export async function hashPassword(password: string): Promise<string> {
  // A random salt makes two identical passwords produce different hashes.
  const salt = randomBytes(SALT_LENGTH);
  const hash = await scryptAsync(password, salt, KEY_LENGTH);
  return `scrypt:${salt.toString("hex")}:${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [algorithm, saltHex, hashHex] = storedHash.split(":");
  if (algorithm !== "scrypt" || !saltHex || !hashHex) return false;

  const expected = Buffer.from(hashHex, "hex");
  const actual = await scryptAsync(password, Buffer.from(saltHex, "hex"), expected.length);
  // timingSafeEqual takes the same time whether the first or last byte differs (prevents timing attacks).
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
