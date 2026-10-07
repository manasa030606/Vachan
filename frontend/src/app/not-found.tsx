// Shown for any URL that doesn't match a page (404).
import { LogoMark } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <LogoMark className="size-16" />
      <p className="mt-6 font-display text-6xl font-extrabold text-brand-600">404</p>
      <h1 className="mt-2 text-2xl font-extrabold text-ink">We couldn&apos;t find that page</h1>
      <p className="mt-2 text-slate-600">The link may be broken, or the lesson may not exist.</p>
      <ButtonLink href="/" className="mt-8">
        Go home
      </ButtonLink>
    </main>
  );
}
