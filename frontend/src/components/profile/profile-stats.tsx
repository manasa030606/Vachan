import { BookOpenCheck, Clock, Crown, Flame, Target, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { MOCK_PROGRESS } from "@/data/mock-user";
import type { ProgressSummaryDto } from "@/lib/api/types";

type Stat = { icon: ReactNode; value: string; label: string; demo?: boolean };

function lastActive(isoDate: string | null | undefined): string {
  if (!isoDate) return "—";
  const days = Math.floor((Date.now() - new Date(isoDate).getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

/**
 * Lessons, accuracy and last activity are real (GET /api/progress).
 * Streak, XP and level are demo values until gamification arrives in Phase 4.
 */
export function ProfileStats({ progress }: { progress: ProgressSummaryDto | null }) {
  const stats: Stat[] = [
    {
      icon: <BookOpenCheck aria-hidden="true" className="size-6 text-emerald-600" />,
      value: progress ? String(progress.totals.lessonsCompleted) : "…",
      label: "Lessons done",
    },
    {
      icon: <Target aria-hidden="true" className="size-6 text-brand-600" />,
      value: progress?.totals.accuracy == null ? "—" : `${progress.totals.accuracy}%`,
      label: progress
        ? `Accuracy (${progress.totals.correctAnswers}/${progress.totals.exercisesAnswered})`
        : "Accuracy",
    },
    {
      icon: <Clock aria-hidden="true" className="size-6 text-teal-600" />,
      value: progress ? lastActive(progress.totals.lastActivityAt) : "…",
      label: "Last active",
    },
    {
      icon: <Flame aria-hidden="true" className="size-6 fill-orange-400 text-orange-500" />,
      value: String(MOCK_PROGRESS.streakDays),
      label: "Day streak",
      demo: true,
    },
    {
      icon: <Zap aria-hidden="true" className="size-6 fill-marigold-400 text-marigold-500" />,
      value: MOCK_PROGRESS.totalXp.toLocaleString("en-IN"),
      label: "Total XP",
      demo: true,
    },
    {
      icon: <Crown aria-hidden="true" className="size-6 fill-brand-200 text-brand-600" />,
      value: `Level ${MOCK_PROGRESS.level}`,
      label: "Current level",
      demo: true,
    },
  ];

  return (
    <section aria-labelledby="stats-title">
      <h2 id="stats-title" className="mb-3 text-xl font-bold">
        Statistics
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <li
            key={stat.label}
            className="flex items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white p-4"
          >
            {stat.icon}
            <div>
              <p className="text-lg leading-tight font-extrabold text-ink">{stat.value}</p>
              <p className="text-sm text-slate-500">
                {stat.label}
                {stat.demo && <span className="ml-1 text-xs text-slate-400">(demo)</span>}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-slate-500">
        Streak, XP, level and achievements are demo values until gamification is added in Phase 4.
      </p>
    </section>
  );
}
