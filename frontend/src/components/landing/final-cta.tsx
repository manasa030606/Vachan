import { LogoMark } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";

/** Landing page: the last call-to-action block before the footer. */
export function FinalCta() {
  return (
    <section className="px-4 py-20">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-14 text-center text-white shadow-xl">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1.5px,transparent_1.5px)] bg-[size:22px_22px]"
        />
        <div className="relative">
          <LogoMark className="mx-auto size-16" />
          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Your first word is waiting.</h2>
          <p className="mx-auto mt-3 max-w-md text-lg text-brand-100">
            Create a free account and finish your first lesson in under five minutes.
          </p>
          <ButtonLink href="/register" variant="accent" size="lg" className="mt-8">
            Get started
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
