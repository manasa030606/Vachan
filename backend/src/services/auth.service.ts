// Registration, login and logout.
import { createAuthToken } from "../lib/auth-token.ts";
import { HttpError } from "../lib/http-error.ts";
import { hashPassword, verifyPassword } from "../lib/password.ts";
import { prisma } from "../lib/prisma.ts";
import type { LoginInput, RegisterInput } from "../schemas/auth.schemas.ts";
import { getUserById, type UserDto } from "./user.service.ts";

export type AuthResult = { user: UserDto; token: string };

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new HttpError(
      409,
      "EMAIL_ALREADY_REGISTERED",
      "An account with this email already exists",
    );
  }

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash: await hashPassword(input.password),
      profile: { create: { displayName: input.name } },
    },
  });

  return { user: await getUserById(user.id), token: createAuthToken(user.id, user.tokenVersion) };
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  // Same message whether the email or the password is wrong, so attackers
  // can't use the login form to discover which emails are registered.
  const passwordOk = user ? await verifyPassword(input.password, user.passwordHash) : false;
  if (!user || !passwordOk) {
    throw new HttpError(401, "INVALID_CREDENTIALS", "Email or password is incorrect");
  }

  return { user: await getUserById(user.id), token: createAuthToken(user.id, user.tokenVersion) };
}

/** Logging out increases tokenVersion, so every token issued before now stops working. */
export async function logoutUser(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { tokenVersion: { increment: 1 } },
  });
}
