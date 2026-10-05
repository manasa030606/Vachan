import { HeartCrack } from "lucide-react";
import { nextHeartLabel } from "@/components/gamification/hearts-card";
import { ButtonLink } from "@/components/ui/button";

/** Shown when the learner runs out of hearts during a lesson (rules: config/gamification.ts). */
export function OutOfHearts({ nextHeartAt }: { nextHeartAt: string | null }) {
  const next = nextHeartLabel(nextHeartAt);
  return (
    <div className="mx-auto flex w-full max-w-md animate-pop flex-col items-center px-4 py-16 text-center">
      <div className="flex size-24 items-center justify-center rounded-full bg-rose-100">
        <HeartCrack aria-hidden="true" className="size-12 text-rose-500" />
      </div>
      <h1 className="mt-6 text-3xl font-extrabold text-ink">You&apos;re out of hearts</h1>
      <p className="mt-2 text-lg text-slate-600">
        Mistakes are part of learning! Your answers so far are saved — open the lesson again to
        continue where you stopped, or review your mistakes in Practice.
      </p>
      <p className="mt-3 rounded-2xl bg-rose-50 px-4 py-3 font-bold text-rose-700">
        {next ? `Your next heart arrives ${next}.` : "A heart comes back every 30 minutes."} Each
        mistake you fix in the review gives you a heart right away.
      </p>
      <div className="mt-8 flex w-full flex-col gap-3">
        <ButtonLink href="/review" size="lg" fullWidth autoFocus>
          Review mistakes
        </ButtonLink>
        <ButtonLink href="/learn" variant="secondary" size="lg" fullWidth>
          Back to Learn
        </ButtonLink>
      </div>
    </div>
  );
}
