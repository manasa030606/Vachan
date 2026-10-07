"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/session/session-provider";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { ApiError } from "@/lib/api/client";
import { logIn } from "@/lib/api/endpoints";
import { getFieldErrors, loginSchema } from "@/lib/validation/auth-schemas";
import { FormError } from "./form-error";
import { PasswordField } from "./password-field";

type Errors = Partial<Record<"email" | "password", string>>;

/** Where to go after login: the page that sent us here (?next=/learn), if it is a safe local path. */
function nextPath(fallback: string): string {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

/** Log-in form: validates on the client, then logs in through the API. */
export function LoginForm() {
  const router = useRouter();
  const { setUser } = useSession();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fieldErrors = getFieldErrors(loginSchema, values);
    setErrors(fieldErrors);
    setFormError(null);
    if (Object.keys(fieldErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      // POST /api/auth/login — the backend sets the httpOnly login cookie.
      const { user } = await logIn(values);
      setUser(user);
      router.push(user.profile?.onboardingDone ? nextPath("/learn") : "/onboarding");
    } catch (error) {
      setFormError(
        error instanceof ApiError ? error.message : "Something went wrong. Please try again.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormError message={formError} />
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={values.email}
        error={errors.email}
        onChange={(event) => setValues({ ...values, email: event.target.value })}
      />
      <PasswordField
        label="Password"
        autoComplete="current-password"
        value={values.password}
        error={errors.password}
        onChange={(event) => setValues({ ...values, password: event.target.value })}
      />
      <div className="text-right">
        <Link href="/forgot-password" className="text-sm font-bold text-brand-700 hover:underline">
          Forgot password?
        </Link>
      </div>
      <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
        {isSubmitting ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
}
