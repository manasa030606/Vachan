import { RotateCcw, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

type RecommendedPracticeProps = {
  openMistakes: number;
  resolvedMistakes: number;
};

/**
 * The suggested practice: a review session of the learner's open mistakes.
 * Chosen by a transparent rule (wrong answers not yet answered correctly in a review) — not "AI".
 */
export function RecommendedPractice({ openMistakes, resolvedMistakes }: RecommendedPracticeProps) {
  const hasMistakes = openMistakes > 0;
  return (
    <section
      aria-labelledby="recommended-title"
      className="relative overflow-hidden rounded-card bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-lg sm:p-8"
    >
      <div
        aria-hidden="true"
        className="absolute -top-10 -right-10 size-48 rounded-full bg-marigold-400/30 blur-2xl"
      />
      <div className="relative">
        <p className="flex items-center gap-2 text-sm font-bold tracking-wide text-marigold-200 uppercase">
          <Sparkles aria-hidden="true" className="size-4" />
          Recommended for you
        </p>
        <h2 id="recommended-title" className="mt-1 text-3xl font-extrabold">
          {hasMistakes ? "Review your mistakes" : "You're all caught up"}
        </h2>
        <p className="mt-2 max-w-lg text-brand-100">
          {hasMistakes
            ? "Answer each one correctly to clear it. Up to 10 per session."
            : "Every mistake has been reviewed. Keep going with your course."}
        </p>
        <ul className="mt-4 flex flex-wrap gap-2 text-sm font-bold">
          <li className="rounded-full bg-white/15 px-3 py-1">{openMistakes} to review</li>
          <li className="rounded-full bg-white/15 px-3 py-1">{resolvedMistakes} cleared</li>
        </ul>
        {hasMistakes ? (
          <ButtonLink href="/review" variant="accent" size="lg" className="mt-6">
            <RotateCcw aria-hidden="true" className="size-5" />
            Start review
          </ButtonLink>
        ) : (
          <ButtonLink href="/learn" variant="accent" size="lg" className="mt-6">
            Continue your course
          </ButtonLink>
        )}
      </div>
    </section>
  );
}
