"use client";

import Link from "next/link";
import { useStats } from "@/components/session/stats-provider";
import { Card } from "@/components/ui/card";

/** Badge count and the latest badges. The full list is on the Profile page. */
export function AchievementsCard() {
  const { stats } = useStats();
  const badges = stats?.achievements;

  return (
    <Card>
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-bold">Achievements</h2>
        <span className="text-sm font-bold text-slate-600">
          {badges ? `${badges.unlockedCount} / ${badges.total}` : "…"}
        </span>
      </div>
      {badges && badges.recent.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {badges.recent.map((badge) => (
            <li key={badge.code} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex size-10 items-center justify-center rounded-xl bg-marigold-50 text-2xl"
              >
                {badge.icon}
              </span>
              <div className="min-w-0">
                <p className="font-bold text-ink">{badge.title}</p>
                <p className="text-xs text-slate-500">{badge.description}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-slate-500">Finish your first lesson to earn a badge.</p>
      )}
      <Link
        href="/profile"
        className="mt-3 inline-block text-sm font-bold text-brand-700 hover:underline"
      >
        See all badges
      </Link>
    </Card>
  );
}
