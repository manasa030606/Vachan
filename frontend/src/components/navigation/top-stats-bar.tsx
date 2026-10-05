"use client";

// Top bar inside the app: course language + streak, XP and hearts.
// On mobile it is the only place these stats appear; on desktop the Learn page also shows cards.
import { Flame, Heart, Zap } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { StatPill } from "@/components/ui/stat-pill";
import { MOCK_PROGRESS } from "@/data/mock-user";
import { LanguageSwitcher } from "./language-switcher";

export function TopStatsBar() {
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
            value={MOCK_PROGRESS.streakDays}
            label={`${MOCK_PROGRESS.streakDays} day streak`}
            className="text-orange-600"
          />
          <StatPill
            icon={<Zap aria-hidden="true" className="size-6 fill-marigold-400 text-marigold-500" />}
            value={MOCK_PROGRESS.totalXp.toLocaleString("en-IN")}
            label={`${MOCK_PROGRESS.totalXp} total XP`}
            className="text-marigold-700"
          />
          <StatPill
            icon={<Heart aria-hidden="true" className="size-6 fill-rose-500 text-rose-500" />}
            value={MOCK_PROGRESS.hearts}
            label={`${MOCK_PROGRESS.hearts} of ${MOCK_PROGRESS.maxHearts} hearts`}
            className="text-rose-600"
          />
        </div>
      </div>
    </header>
  );
}
