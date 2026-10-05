import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { WeakTopic } from "@/data/mock-practice";

/** Topics where the learner keeps making mistakes, weakest first. */
export function WeakTopicsList({ topics }: { topics: WeakTopic[] }) {
  return (
    <Card>
      <CardHeader title="Weak topics" description="Skills that need a little more practice." />
      <ul className="space-y-3">
        {topics.map((topic) => (
          <li key={topic.id}>
            <Link
              href={`/lesson/practice-topic-${topic.id}`}
              className="flex items-center gap-3 rounded-2xl border-2 border-slate-100 p-3 transition hover:border-brand-200 hover:bg-brand-50"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-bold text-ink">{topic.title}</p>
                  <span className="text-sm font-bold text-slate-600">{topic.strength}%</span>
                </div>
                <ProgressBar
                  value={topic.strength}
                  max={100}
                  label={`${topic.title} strength`}
                  size="sm"
                  colorClassName={topic.strength < 50 ? "bg-rose-500" : "bg-marigold-400"}
                  className="mt-1.5"
                />
                <p className="mt-1 text-xs text-slate-500">{topic.reason}</p>
              </div>
              <ChevronRight aria-hidden="true" className="size-5 text-slate-400" />
              <span className="sr-only">Practise {topic.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
