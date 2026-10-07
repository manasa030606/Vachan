"use client";

import { Heart } from "lucide-react";
import { useStats } from "@/components/session/stats-provider";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

/** When the next heart comes back: "in 12 min" if under an hour, otherwise "at 14:05". */
export function nextHeartLabel(nextHeartAt: string | null): string | null {
  if (!nextHeartAt) return null;
  const nextHeart = new Date(nextHeartAt);
  const minutes = Math.max(1, Math.ceil((nextHeart.getTime() - Date.now()) / 60_000));
  if (minutes < 60) return `in ${minutes} min`;
  return `at ${nextHeart.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

/** Hearts are the learner's lives in lessons (from GET /api/stats). */
export function HeartsCard() {
  const { stats } = useStats();
  const hearts = stats?.hearts.current ?? 0;
  const max = stats?.hearts.max ?? 5;
  const next = nextHeartLabel(stats?.hearts.nextHeartAt ?? null);

  return (
    <Card>
      <h2 className="text-lg font-bold">Hearts</h2>
      <div className="mt-3 flex gap-1.5" aria-label={`${hearts} of ${max} hearts`} role="img">
        {Array.from({ length: max }, (_, index) => (
          <Heart
            key={index}
            aria-hidden="true"
            className={cn(
              "size-7",
              index < hearts ? "fill-rose-500 text-rose-500" : "fill-slate-200 text-slate-300",
            )}
          />
        ))}
      </div>
      <p className="mt-2 text-sm text-slate-500">
        A wrong lesson answer costs one heart.{" "}
        {next
          ? `Next heart ${next}, or fix a mistake in the review to earn one now.`
          : "Hearts are full."}
      </p>
    </Card>
  );
}
