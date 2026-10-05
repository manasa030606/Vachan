"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import type { VocabularyDto } from "@/lib/api/types";
import { cn } from "@/lib/cn";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "LETTER", label: "Letters" },
  { id: "WORD", label: "Words" },
  { id: "PHRASE", label: "Phrases" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

type VocabularyListProps = {
  words: VocabularyDto[];
  showRomanization: boolean;
};

/** Letters, words and phrases from the lessons the learner has completed. */
export function VocabularyList({ words, showRomanization }: VocabularyListProps) {
  const [filter, setFilter] = useState<FilterId>("all");
  const visibleWords = words.filter((word) => filter === "all" || word.kind === filter);

  return (
    <Card>
      <CardHeader
        title="What you've learned"
        description={`${words.length} letters, words and phrases from completed lessons`}
      />

      <div role="group" aria-label="Filter" className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
            className={cn(
              "rounded-full border-2 px-4 py-1.5 text-sm font-bold transition",
              filter === item.id
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-slate-200 text-slate-600 hover:bg-slate-50",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {visibleWords.map((word) => (
          <li key={word.id} className="rounded-2xl border-2 border-slate-100 p-3">
            <p
              className={cn(
                "font-display leading-tight font-bold [overflow-wrap:anywhere] text-brand-800",
                word.kind === "LETTER" ? "text-4xl" : "text-2xl",
              )}
            >
              {word.script}
            </p>
            {showRomanization && <p className="text-sm text-slate-500">{word.romanization}</p>}
            <p className="font-bold text-ink">{word.meaning}</p>
            <p className="text-xs text-slate-500">{word.topic}</p>
          </li>
        ))}
      </ul>
      {visibleWords.length === 0 && (
        <p className="py-6 text-center text-slate-500">
          Nothing here yet — complete a lesson to collect its words.
        </p>
      )}
    </Card>
  );
}
