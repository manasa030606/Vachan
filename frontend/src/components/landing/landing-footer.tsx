import { Logo } from "@/components/brand/logo";

/** Footer of the public landing page. */
export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row">
        <Logo />
        <p>Learn India&apos;s languages. One word at a time.</p>
        <p>© {new Date().getFullYear()} Vachan · College capstone project</p>
      </div>
    </footer>
  );
}
