import type { Metadata } from "next";
import { RequireAuth } from "@/components/session/require-auth";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export const metadata: Metadata = { title: "Get started" };

export default function OnboardingPage() {
  return (
    <RequireAuth allowIncompleteOnboarding>
      <OnboardingWizard />
    </RequireAuth>
  );
}
