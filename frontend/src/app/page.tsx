// Phase 0 placeholder home page.
// The real Vachan landing page and visual system are built in Phase 1.
import { BackendStatus } from "@/components/backend-status";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-slate-50 px-4 py-16">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Vachan</h1>
        <p className="mt-2 text-slate-600">Learn India&apos;s languages. One word at a time.</p>
        <p className="mt-4 text-sm text-slate-500">Phase 0 — project foundation</p>
      </header>

      <BackendStatus />
    </main>
  );
}
