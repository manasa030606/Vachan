// Split-screen layout for login / register / forgot password.
// Left: brand panel (desktop only). Right: the form.
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/logo";
import { LANGUAGE_CONTENT } from "@/data/language-content";
import { LANGUAGES } from "@/data/languages";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <aside className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-600 to-brand-900 p-10 text-white lg:flex">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1.5px,transparent_1.5px)] bg-[size:22px_22px]"
        />
        <div className="relative self-start rounded-2xl bg-white/95 px-3 py-2">
          <Logo />
        </div>
        <div className="relative">
          <p className="font-display text-4xl leading-tight font-extrabold">
            Learn India&apos;s languages.
            <br />
            One word at a time.
          </p>
          <ul aria-label="Hello in six languages" className="mt-8 flex flex-wrap gap-2">
            {LANGUAGES.map((language) => (
              <li key={language.code} className="rounded-full bg-white/15 px-4 py-1.5">
                <span className="font-display text-lg font-bold">
                  {LANGUAGE_CONTENT[language.code].words.hello.script}
                </span>
                <span className="ml-2 text-sm text-brand-100">{language.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-brand-200">
          Hindi · Telugu · Tamil · Malayalam · Kannada · Bengali
        </p>
      </aside>

      <main className="flex flex-1 flex-col px-4 py-6 sm:px-8">
        <div className="lg:hidden">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center py-10">{children}</div>
      </main>
    </div>
  );
}
