"use client";

import { Heart } from "lucide-react";
import { useStats } from "@/components/session/stats-provider";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

/** "in 12 min" / "at 14:05" for the next heart. */
export function nextHeartLabel(nextHeartAt: string | null): string | null {
  if (!nextHeartAt) return null;
  const minutes = Math.max(1, Math.ceil((new Date(nextHeartAt).getTime() - Date.now()) / 60_000));
  return minutes < 60
    ? `in ${minutes} min`
    : `at ${new Date(nextHeartAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

/** Hearts = lives (GET /api/stats → hearts). */
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
