"use client";

// XP, level, streak, hearts, daily goal and badges for the logged-in learner (GET /api/stats).
// Loaded after login and again after every page change, so the numbers are fresh
// when the learner comes back from a lesson. Usage: const { stats, reload } = useStats();
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { getStats } from "@/lib/api/endpoints";
import type { StatsDto } from "@/lib/api/types";
import { useSession } from "./session-provider";

type StatsContextValue = { stats: StatsDto | null; reload: () => void };

const StatsContext = createContext<StatsContextValue>({ stats: null, reload: () => {} });

/** Loads the learner's stats and shares them with the whole app. */
export function StatsProvider({ children }: { children: ReactNode }) {
  const { status, user } = useSession();
  const pathname = usePathname();
  const [stats, setStats] = useState<StatsDto | null>(null);
  const [reloadCount, setReloadCount] = useState(0);
  const reload = useCallback(() => setReloadCount((count) => count + 1), []);
  const userId = status === "authenticated" ? user?.id : null;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    getStats()
      .then(({ stats: next }) => {
        if (!cancelled) setStats(next);
      })
      .catch(() => {
        // Keep the last values; cards show placeholders until the next successful load.
      });
    return () => {
      cancelled = true;
    };
    // Also refresh when the daily goal changes in settings.
  }, [userId, pathname, reloadCount, user?.profile?.dailyGoal]);

  return (
    <StatsContext.Provider value={{ stats: userId ? stats : null, reload }}>
      {children}
    </StatsContext.Provider>
  );
}

/** Read the learner's stats (null while loading or when logged out). */
export function useStats(): StatsContextValue {
  return useContext(StatsContext);
}
