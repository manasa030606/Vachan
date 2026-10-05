// Zod schemas for the auth forms. The backend checks the same rules again (backend/src/schemas/auth.schemas.ts).
import { z } from "zod";

const email = z.email("Enter a valid email address");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60, "Name is too long"),
  email,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Include at least one number"),
});

export const forgotPasswordSchema = z.object({ email });

/** Turns a failed Zod result into { fieldName: "first error message" }. */
export function getFieldErrors<T extends Record<string, unknown>>(
  schema: z.ZodType<T>,
  values: unknown,
): Partial<Record<keyof T, string>> {
  const result = schema.safeParse(values);
  if (result.success) return {};

  const errors: Partial<Record<keyof T, string>> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof T;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}

/** Pretend to call the server. Only used by "Forgot password" (sending emails is not built yet). */
export function fakeNetworkDelay(ms = 700): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
