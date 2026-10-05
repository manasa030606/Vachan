"use client";

import { useState, type FormEvent } from "react";
import { MailCheck } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import {
  fakeNetworkDelay,
  forgotPasswordSchema,
  getFieldErrors,
} from "@/lib/validation/auth-schemas";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fieldErrors = getFieldErrors(forgotPasswordSchema, { email });
    setError(fieldErrors.email);
    if (fieldErrors.email) return;

    setStatus("sending");
    await fakeNetworkDelay();
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="animate-pop rounded-card border-2 border-emerald-200 bg-emerald-50 p-6 text-center"
      >
        <MailCheck aria-hidden="true" className="mx-auto size-12 text-emerald-600" />
        <h2 className="mt-3 text-xl font-extrabold text-emerald-900">Check your inbox</h2>
        <p className="mt-1 text-emerald-800">
          If an account exists for <strong>{email}</strong>, we&apos;ve sent a link to reset your
          password.
        </p>
        <ButtonLink href="/login" variant="secondary" className="mt-5">
          Back to log in
        </ButtonLink>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        error={error}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Button type="submit" size="lg" fullWidth disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}
