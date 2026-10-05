"use client";

// Mistake review session: loads up to 10 open mistakes for the current language
// (GET /api/review/session) and plays them with the lesson player in "review" mode.
import { PartyPopper } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { LessonPlayer } from "@/components/lesson/lesson-player";
import { Button, ButtonLink } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { getReviewSession } from "@/lib/api/endpoints";
import { toReviewLesson } from "@/lib/api/mappers";
import { useLearnerPreferences } from "@/lib/learner-preferences";

export function ReviewScreen() {
  const { languageCode, showRomanization } = useLearnerPreferences();
  const { data, error, isLoading, reload } = useApi(
    async () => toReviewLesson((await getReviewSession(languageCode)).session),
    `review-session:${languageCode}`,
  );

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center" aria-busy="true">
        <LogoMark className="size-12 animate-pulse" />
        <span className="sr-only">Loading your mistakes…</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold">Couldn&apos;t load your review</h1>
        <p className="mt-2 text-slate-600">{error?.message ?? "Something went wrong."}</p>
        <Button variant="secondary" className="mt-6" onClick={reload}>
          Try again
        </Button>
      </div>
    );
  }

  if (data.exercises.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-emerald-100">
          <PartyPopper aria-hidden="true" className="size-10 text-emerald-600" />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold">Nothing to review</h1>
        <p className="mt-2 text-slate-600">
          You have no open mistakes in this language. Mistakes from your lessons appear here.
        </p>
        <ButtonLink href="/learn" size="lg" className="mt-8">
          Back to Learn
        </ButtonLink>
      </div>
    );
  }

  return <LessonPlayer lesson={data} showRomanization={showRomanization} />;
}
