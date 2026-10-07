"use client";

// Wraps pages that need a logged-in learner.
//   - not logged in → /login?next=<this page>
//   - logged in but onboarding not finished → /onboarding (unless allowIncompleteOnboarding)
import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogoMark } from "@/components/brand/logo";
import { useSession } from "./session-provider";

type RequireAuthProps = {
  children: ReactNode;
  allowIncompleteOnboarding?: boolean;
};

export function RequireAuth({ children, allowIncompleteOnboarding = false }: RequireAuthProps) {
  const { status, user, connectionError, didLogout } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  // Admins can open /admin without choosing a language first.
  const adminArea = user?.role === "ADMIN" && pathname.startsWith("/admin");
  const needsOnboarding =
    !allowIncompleteOnboarding &&
    !adminArea &&
    status === "authenticated" &&
    !user?.profile?.onboardingDone;

  useEffect(() => {
    if (status === "guest" && !connectionError && !didLogout) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    } else if (needsOnboarding) {
      router.replace("/onboarding");
    }
  }, [status, needsOnboarding, connectionError, didLogout, router, pathname]);

  if (connectionError) {
    return (
      <div role="alert" className="mx-auto max-w-md px-4 py-20 text-center">
        <LogoMark className="mx-auto size-14" />
        <h1 className="mt-4 text-2xl font-extrabold">Can&apos;t reach the server</h1>
        <p className="mt-2 text-slate-600">{connectionError}</p>
      </div>
    );
  }

  if (status !== "authenticated" || needsOnboarding) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center" aria-busy="true">
        <LogoMark className="size-12 animate-pulse" />
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  return <>{children}</>;
}
