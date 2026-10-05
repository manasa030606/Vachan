import { Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

type RecommendedPracticeProps = {
  mistakeCount: number;
  weakWordCount: number;
  weakestTopic: string;
};

/**
 * The suggested practice session. In Phase 4 this is chosen by transparent rules
 * (recent mistakes + weak words + weakest topic) — not "AI", and labelled honestly.
 */
export function RecommendedPractice({
  mistakeCount,
  weakWordCount,
  weakestTopic,
}: RecommendedPracticeProps) {
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
          5-minute smart review
        </h2>
        <p className="mt-2 max-w-lg text-brand-100">
          A short mix built from your recent mistakes, words that need practice, and your weakest
          topic.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2 text-sm font-bold">
          <li className="rounded-full bg-white/15 px-3 py-1">{mistakeCount} recent mistakes</li>
          <li className="rounded-full bg-white/15 px-3 py-1">{weakWordCount} weak words</li>
          <li className="rounded-full bg-white/15 px-3 py-1">{weakestTopic}</li>
        </ul>
        <ButtonLink href="/lesson/practice-recommended" variant="accent" size="lg" className="mt-6">
          Start practice
        </ButtonLink>
      </div>
    </section>
  );
}
