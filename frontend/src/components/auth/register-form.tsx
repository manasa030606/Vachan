"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { updatePreferences } from "@/lib/learner-preferences";
import { fakeNetworkDelay, getFieldErrors, registerSchema } from "@/lib/validation/auth-schemas";
import { PasswordField } from "./password-field";

type Values = { name: string; email: string; password: string };

export function RegisterForm() {
  const router = useRouter();
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
    if (Object.keys(fieldErrors).length > 0) return;

    setIsSubmitting(true);
    await fakeNetworkDelay(); // Phase 2: POST /api/auth/register
    updatePreferences({ displayName: values.name.trim() });
    router.push("/onboarding");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
