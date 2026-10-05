import { Check, X } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import type { MistakeDto } from "@/lib/api/types";
import { cn } from "@/lib/cn";

/** "Today", "Yesterday" or "3 days ago". */
function daysAgo(isoDate: string): string {
  const days = Math.floor((Date.now() - new Date(isoDate).getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

/** Open mistakes (from GET /api/review) with the learner's answer and the correct one. */
export function MistakesList({ mistakes }: { mistakes: MistakeDto[] }) {
  return (
    <Card>
      <CardHeader title="Mistakes to review" description="Learn from what tripped you up." />
      {mistakes.length === 0 ? (
        <p className="py-6 text-center text-slate-500">
          No open mistakes. Wrong answers from your lessons appear here.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {mistakes.map((mistake) => (
            <li key={mistake.exerciseId} className="flex gap-4 py-3">
              <div className="flex w-28 shrink-0 flex-col items-center justify-center rounded-2xl bg-brand-50 px-2 py-2 text-center">
                <span
                  className={cn(
                    "font-display leading-tight font-bold [overflow-wrap:anywhere] text-brand-800",
                    // A single letter (e.g. "ఆ") is shown big; words and sentences smaller.
                    [...mistake.prompt].length <= 3 ? "text-4xl" : "text-lg",
                  )}
                >
                  {mistake.prompt}
                </span>
                {mistake.promptSubtext && (
                  <span className="text-xs text-slate-500">{mistake.promptSubtext}</span>
                )}
              </div>
              <div className="min-w-0 flex-1 text-sm">
                <p className="text-slate-500">{mistake.instruction}</p>
                <p className="flex items-center gap-1.5 text-rose-700">
                  <X aria-hidden="true" className="size-4 shrink-0" />
                  <span className="font-bold">You said:</span>
                  <span className="font-display text-base [overflow-wrap:anywhere]">
                    {mistake.yourAnswer}
                  </span>
                </p>
                <p className="flex items-center gap-1.5 text-emerald-700">
                  <Check aria-hidden="true" className="size-4 shrink-0" />
                  <span className="font-bold">Correct:</span>
                  <span className="font-display text-base [overflow-wrap:anywhere]">
                    {mistake.correctAnswer}
                  </span>
                </p>
                <p className="mt-1 text-slate-500">
                  {mistake.lessonTitle} · {daysAgo(mistake.lastWrongAt)}
                  {mistake.wrongCount > 1 && ` · wrong ${mistake.wrongCount}×`}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
