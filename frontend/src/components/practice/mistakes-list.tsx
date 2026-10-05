import { Check, X } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import type { MistakeItem } from "@/data/mock-practice";

/** Recent wrong answers with the learner's answer and the correct one. */
export function MistakesList({ mistakes }: { mistakes: MistakeItem[] }) {
  return (
    <Card>
      <CardHeader title="Recent mistakes" description="Learn from what tripped you up." />
      <ul className="divide-y divide-slate-100">
        {mistakes.map((mistake) => (
          <li key={mistake.id} className="flex gap-4 py-3">
            <div className="flex w-28 shrink-0 flex-col items-center justify-center rounded-2xl bg-brand-50 px-2 py-2 text-center">
              <span className="font-display text-lg leading-tight font-bold [overflow-wrap:anywhere] text-brand-800">
                {mistake.prompt}
              </span>
              {mistake.promptSubtext && (
                <span className="text-xs text-slate-500">{mistake.promptSubtext}</span>
              )}
            </div>
            <div className="min-w-0 flex-1 text-sm">
              <p className="flex items-center gap-1.5 text-rose-700">
                <X aria-hidden="true" className="size-4 shrink-0" />
                <span className="font-bold">You said:</span>
                <span className="font-display text-base">{mistake.yourAnswer}</span>
              </p>
              <p className="flex items-center gap-1.5 text-emerald-700">
                <Check aria-hidden="true" className="size-4 shrink-0" />
                <span className="font-bold">Correct:</span>
                <span className="font-display text-base">{mistake.correctAnswer}</span>
              </p>
              <p className="mt-1 text-slate-500">
                {mistake.lessonTitle} · {mistake.when}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
