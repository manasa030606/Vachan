"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/session/session-provider";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { ApiError } from "@/lib/api/client";
import { registerAccount } from "@/lib/api/endpoints";
import { getFieldErrors, registerSchema } from "@/lib/validation/auth-schemas";
import { FormError } from "./form-error";
import { PasswordField } from "./password-field";

type Values = { name: string; email: string; password: string };

export function RegisterForm() {
  const router = useRouter();
  const { setUser } = useSession();
  const [formError, setFormError] = useState<string | null>(null);
  const [values, setValues] = useState<Values>({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update(field: keyof Values, value: string) {
    setValues({ ...values, [field]: value });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fieldErrors = getFieldErrors(registerSchema, values);
    setErrors(fieldErrors);
    setFormError(null);
    if (Object.keys(fieldErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      // POST /api/auth/register — creates the account and logs in (httpOnly cookie).
      const { user } = await registerAccount({ ...values, name: values.name.trim() });
      setUser(user);
      router.push("/onboarding");
    } catch (error) {
      if (error instanceof ApiError && error.code === "EMAIL_ALREADY_REGISTERED") {
        setErrors({ email: "An account with this email already exists. Try logging in." });
      } else if (error instanceof ApiError && error.details?.length) {
        // Server-side validation errors → show them under the matching fields.
        setErrors(
          Object.fromEntries(
            error.details.map((detail) => [detail.field, detail.message]),
          ) as typeof errors,
        );
      } else {
        setFormError(
          error instanceof ApiError ? error.message : "Something went wrong. Please try again.",
        );
      }
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormError message={formError} />
      <TextField
        label="Your name"
        autoComplete="name"
        placeholder="e.g. Asha"
        value={values.name}
        error={errors.name}
        onChange={(event) => update("name", event.target.value)}
      />
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={values.email}
        error={errors.email}
        onChange={(event) => update("email", event.target.value)}
      />
      <PasswordField
        label="Password"
        autoComplete="new-password"
        hint="At least 8 characters, including a number."
        value={values.password}
        error={errors.password}
        onChange={(event) => update("password", event.target.value)}
      />
      <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
