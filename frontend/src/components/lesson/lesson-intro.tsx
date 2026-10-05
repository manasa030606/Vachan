// First step of a lesson: introduce the new words with examples before practising.
import Link from "next/link";
import { BookOpen, X } from "lucide-react";
import type { VocabularyWord } from "@/types/learning";
import { Button } from "@/components/ui/button";

type LessonIntroProps = {
  title: string;
  unitTitle: string;
  words: VocabularyWord[];
  /** Sentence under the title, e.g. "Here are the letters you'll practise…" */
  introText: string;
  showRomanization: boolean;
  onStart: () => void;
};

export function LessonIntro({
  title,
  unitTitle,
  words,
  introText,
  showRomanization,
  onStart,
}: LessonIntroProps) {
  return (
    <div className="mx-auto w-full max-w-2xl animate-pop space-y-6 px-4 py-6 sm:py-16">
      <Link
        href="/learn"
        aria-label="Exit lesson"
        className="-ml-2 inline-flex rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
      >
        <X aria-hidden="true" className="size-6" />
      </Link>
      <div>
        <p className="flex items-center gap-2 text-sm font-bold tracking-wide text-brand-700 uppercase">
          <BookOpen aria-hidden="true" className="size-4" />
          {unitTitle}
        </p>
        <h1 className="mt-1 text-3xl font-extrabold text-ink sm:text-4xl">{title}</h1>
        <p className="mt-2 text-lg text-slate-600">{introText}</p>
      </div>

      {/* One row per word: script on the left, meaning on the right. Rows have room for long words. */}
      <ul className="space-y-3">
        {words.map((word) => (
          <li
            key={word.id}
            className="flex items-center justify-between gap-4 rounded-card border-2 border-brand-100 bg-white px-5 py-4"
          >
            <div className="min-w-0">
              <p className="font-display text-3xl leading-tight font-bold [overflow-wrap:anywhere] text-brand-800 sm:text-4xl">
                {word.script}
              </p>
              {showRomanization && <p className="text-slate-500">{word.romanization}</p>}
            </div>
            <p className="shrink-0 text-right text-lg font-extrabold text-ink">{word.meaning}</p>
          </li>
        ))}
      </ul>

      <Button size="lg" fullWidth onClick={onStart} autoFocus>
        Let&apos;s start
      </Button>
    </div>
  );
}
