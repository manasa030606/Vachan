"use client";

// Top bar inside the app: course language switcher, plus streak, XP and hearts.
// The numbers come from GET /api/stats through useStats.
import { Flame, Heart, Zap } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { StatPill } from "@/components/ui/stat-pill";
import { useStats } from "@/components/session/stats-provider";
import { LanguageSwitcher } from "./language-switcher";

/** Sticky header with the learner's main stats. */
export function TopStatsBar() {
  const { stats } = useStats();
  const streak = stats?.streak.current ?? 0;
  const xp = stats?.xp.total ?? 0;
  const hearts = stats?.hearts.current ?? 0;
  const maxHearts = stats?.hearts.max ?? 5;

  return (
    <header className="sticky top-0 z-20 border-b-2 border-slate-200/70 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-2">
          <span className="md:hidden">
            <Logo href="/learn" markOnly />
          </span>
          <LanguageSwitcher />
        </div>
        <div className="flex items-center gap-1 sm:gap-3">
          <StatPill
            icon={<Flame aria-hidden="true" className="size-6 fill-orange-400 text-orange-500" />}
            value={stats ? streak : "–"}
            label={`${streak} day streak`}
            className="text-orange-600"
          />
          <StatPill
            icon={<Zap aria-hidden="true" className="size-6 fill-marigold-400 text-marigold-500" />}
            value={stats ? xp.toLocaleString("en-IN") : "–"}
            label={`${xp} total XP, level ${stats?.xp.level ?? 1}`}
            className="text-marigold-700"
          />
          <StatPill
            icon={<Heart aria-hidden="true" className="size-6 fill-rose-500 text-rose-500" />}
            value={stats ? hearts : "–"}
            label={`${hearts} of ${maxHearts} hearts`}
            className="text-rose-600"
          />
        </div>
      </div>
    </header>
  );
}
