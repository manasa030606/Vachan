import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />
        <nav
          aria-label="Main"
          className="hidden items-center gap-6 font-bold text-slate-600 md:flex"
        >
          <Link href="#languages" className="hover:text-brand-700">
            Languages
          </Link>
          <Link href="#how-it-works" className="hover:text-brand-700">
            How it works
          </Link>
          <Link href="#features" className="hover:text-brand-700">
            Features
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ButtonLink href="/login" variant="ghost" size="sm">
            Log in
          </ButtonLink>
          <ButtonLink href="/register" size="sm" className="hidden sm:inline-flex">
            Get started
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
