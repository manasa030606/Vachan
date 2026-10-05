// Developer page from Phase 0: checks that the frontend can reach the backend and database.
import type { Metadata } from "next";
import { Logo } from "@/components/brand/logo";
import { BackendStatus } from "@/components/backend-status";

export const metadata: Metadata = { title: "System status" };

export default function StatusPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 px-4 py-16">
      <Logo />
      <BackendStatus />
      <p className="max-w-md text-center text-sm text-slate-500">
        Developer page. Phase 1 screens use mock data and do not call the backend.
      </p>
    </main>
  );
}
