import { HeartCrack } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

/** Shown when the learner runs out of hearts during a lesson. */
export function OutOfHearts() {
  return (
    <div className="mx-auto flex w-full max-w-md animate-pop flex-col items-center px-4 py-16 text-center">
      <div className="flex size-24 items-center justify-center rounded-full bg-rose-100">
        <HeartCrack aria-hidden="true" className="size-12 text-rose-500" />
      </div>
      <h1 className="mt-6 text-3xl font-extrabold text-ink">You&apos;re out of hearts</h1>
      <p className="mt-2 text-lg text-slate-600">
        Mistakes are part of learning! Review your weak words in Practice to earn hearts back.
      </p>
      <p className="mt-2 text-sm text-slate-500">
        (Hearts refilling is added with gamification in Phase 4.)
      </p>
      <div className="mt-8 flex w-full flex-col gap-3">
        <ButtonLink href="/practice" size="lg" fullWidth autoFocus>
          Practise to earn hearts
        </ButtonLink>
        <ButtonLink href="/learn" variant="secondary" size="lg" fullWidth>
          Back to Learn
        </ButtonLink>
      </div>
    </div>
  );
}
