"use client";

// Practice screen: review session, open mistakes and everything learned so far,
// for the learner's current language (GET /api/review?languageCode=…).
import { LogoMark } from "@/components/brand/logo";
import { RecommendationsCard } from "@/components/gamification/recommendations-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLanguage } from "@/data/languages";
import { useApi } from "@/hooks/use-api";
import { getReview } from "@/lib/api/endpoints";
import { useLearnerPreferences } from "@/lib/learner-preferences";
import { MistakesList } from "./mistakes-list";
import { RecommendedPractice } from "./recommended-practice";
import { VocabularyList } from "./vocabulary-list";

/** The Practice page. */
export function PracticeView() {
  const { languageCode, showRomanization } = useLearnerPreferences();
  const language = getLanguage(languageCode);
  const { data, error, isLoading, reload } = useApi(
    async () => (await getReview(languageCode)).review,
    `review:${languageCode}`,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-ink">Practice</h1>
        <p className="mt-2 text-slate-600">
          Strengthen your {language.name} — review your mistakes and what you&apos;ve learned.
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16" aria-busy="true">
          <LogoMark className="size-12 animate-pulse" />
          <span className="sr-only">Loading your practice…</span>
        </div>
      )}

      {error && (
        <Card role="alert" className="text-center">
          <p className="font-bold text-rose-700">{error.message}</p>
          <Button variant="secondary" className="mt-4" onClick={reload}>
            Try again
          </Button>
        </Card>
      )}

      {data && (
        <>
          <RecommendedPractice
            openMistakes={data.openMistakes}
            resolvedMistakes={data.resolvedMistakes}
          />
          <RecommendationsCard limit={5} />
          <MistakesList mistakes={data.mistakes} />
          <VocabularyList words={data.learnedVocabulary} showRomanization={showRomanization} />
        </>
      )}
    </div>
  );
}
