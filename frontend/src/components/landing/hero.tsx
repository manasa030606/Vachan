import { ButtonLink } from "@/components/ui/button";
import { HeroVisual } from "./hero-visual";

/** Landing page: top section with the headline and sign-up buttons. */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-kolam absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-50"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 md:grid-cols-2 md:py-24">
        <div className="text-center md:text-left">
          <p className="inline-flex items-center gap-2 rounded-full bg-marigold-100 px-4 py-1.5 text-sm font-extrabold text-marigold-700">
            6 Indian languages · free to start
          </p>
          <h1 className="mt-5 text-4xl leading-[1.1] font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Learn India&apos;s languages.{" "}
            <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
              One word at a time.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-lg text-slate-600 md:mx-0">
            Vachan turns learning Hindi, Telugu, Tamil, Malayalam, Kannada and Bengali into short,
            game-like lessons — starting from the very first letter of the script.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center md:justify-start">
            <ButtonLink href="/register" size="lg">
              Start learning — it&apos;s free
            </ButtonLink>
            <ButtonLink href="/login" variant="secondary" size="lg">
              I already have an account
            </ButtonLink>
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}
