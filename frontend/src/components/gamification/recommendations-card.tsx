"use client";

import Link from "next/link";
import { BookOpen, HeartPulse, RotateCcw, Sparkles, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { getRecommendations } from "@/lib/api/endpoints";
import type { RecommendationDto } from "@/lib/api/types";
import { useLearnerPreferences } from "@/lib/learner-preferences";

const ICONS: Record<RecommendationDto["type"], typeof BookOpen> = {
  "earn-hearts": HeartPulse,
  "repeated-mistakes": RotateCcw,
  "unfinished-lesson": BookOpen,
  "weak-topic": TrendingDown,
  review: RotateCcw,
  "next-lesson": BookOpen,
};

export function recommendationHref(item: RecommendationDto): string {
  return item.action.kind === "review" ? "/review" : `/lesson/${item.action.lessonId}`;
}

/**
 * Recommended practice (GET /api/recommendations). Chosen by simple, visible rules —
 * each item says why it is recommended.
 */
export function RecommendationsCard({ limit = 3 }: { limit?: number }) {
  const { languageCode } = useLearnerPreferences();
  const { data } = useApi(
    async () => (await getRecommendations(languageCode)).recommendations,
    `recommendations:${languageCode}`,
  );

  return (
    <Card>
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <Sparkles aria-hidden="true" className="size-5 text-marigold-500" />
        Recommended practice
      </h2>
      {!data ? (
        <p className="mt-2 text-sm text-slate-500">Loading…</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {data.slice(0, limit).map((item) => {
            const Icon = ICONS[item.type];
            return (
              <li key={`${item.type}-${item.title}`}>
                <Link
                  href={recommendationHref(item)}
                  className="flex gap-3 rounded-2xl border-2 border-slate-100 p-3 transition hover:border-brand-200 hover:bg-brand-50"
                >
                  <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-brand-600" />
                  <span className="min-w-0">
                    <span className="block font-bold text-ink">{item.title}</span>
                    <span className="block text-xs text-slate-500">{item.reason}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
