"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { WEAK_WORD_THRESHOLD, type VocabularyEntry } from "@/data/mock-practice";
import { cn } from "@/lib/cn";
import { StrengthMeter } from "./strength-meter";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "weak", label: "Needs practice" },
  { id: "strong", label: "Strong" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

type VocabularyListProps = {
  words: VocabularyEntry[];
  showRomanization: boolean;
};

/** All words the learner has met, filterable by strength. */
export function VocabularyList({ words, showRomanization }: VocabularyListProps) {
  const [filter, setFilter] = useState<FilterId>("all");

  const visibleWords = words.filter((word) => {
    if (filter === "weak") return word.strength < WEAK_WORD_THRESHOLD;
    if (filter === "strong") return word.strength >= WEAK_WORD_THRESHOLD;
    return true;
  });

  return (
    <Card>
      <CardHeader
        title="Vocabulary"
        description={`${words.length} words learned in this demo course`}
      />

      <div role="group" aria-label="Filter words" className="mb-4 flex flex-wrap gap-2">
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
          <li
            key={word.id}
            className="flex items-center gap-3 rounded-2xl border-2 border-slate-100 p-3"
          >
            <div className="min-w-0 flex-1">
              <p className="font-display text-2xl leading-tight font-bold text-brand-800">
                {word.script}
              </p>
              {showRomanization && <p className="text-sm text-slate-500">{word.romanization}</p>}
              <p className="font-bold text-ink">{word.meaning}</p>
              <p className="text-xs text-slate-500">
                {word.topic} · {word.lastPracticed}
              </p>
            </div>
            <StrengthMeter strength={word.strength} />
          </li>
        ))}
      </ul>
      {visibleWords.length === 0 && (
        <p className="py-6 text-center text-slate-500">No words here yet.</p>
      )}
    </Card>
  );
}
