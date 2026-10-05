import { BookOpenCheck, Crown, Flame, Languages, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { MOCK_PROGRESS } from "@/data/mock-user";

type Stat = { icon: ReactNode; value: string; label: string };

const STATS: Stat[] = [
  {
    icon: <Flame aria-hidden="true" className="size-6 fill-orange-400 text-orange-500" />,
    value: String(MOCK_PROGRESS.streakDays),
    label: "Day streak",
  },
  {
    icon: <Zap aria-hidden="true" className="size-6 fill-marigold-400 text-marigold-500" />,
    value: MOCK_PROGRESS.totalXp.toLocaleString("en-IN"),
    label: "Total XP",
  },
  {
    icon: <Crown aria-hidden="true" className="size-6 fill-brand-200 text-brand-600" />,
    value: `Level ${MOCK_PROGRESS.level}`,
    label: "Current level",
  },
  {
    icon: <BookOpenCheck aria-hidden="true" className="size-6 text-emerald-600" />,
    value: String(MOCK_PROGRESS.lessonsCompleted),
    label: "Lessons done",
  },
  {
    icon: <Languages aria-hidden="true" className="size-6 text-teal-600" />,
    value: String(MOCK_PROGRESS.wordsLearned),
    label: "Words learned",
  },
];

export function ProfileStats() {
  return (
    <section aria-labelledby="stats-title">
      <h2 id="stats-title" className="mb-3 text-xl font-bold">
        Statistics
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {STATS.map((stat) => (
          <li
            key={stat.label}
            className="flex items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white p-4"
          >
            {stat.icon}
            <div>
              <p className="text-lg leading-tight font-extrabold text-ink">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
