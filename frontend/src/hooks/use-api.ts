"use client";

// Loads data from the backend when a component appears (or when `key` changes).
//
//   const { data, error, isLoading, reload } = useApi(() => getCourse(id), `course:${id}`);
//
// Pass key = null to wait (e.g. until the user is known).
import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";

type Loaded<T> = { key: string; data: T | null; error: ApiError | null };

export function useApi<T>(fetcher: () => Promise<T>, key: string | null) {
  const [loaded, setLoaded] = useState<Loaded<T> | null>(null);
  const [reloadCount, setReloadCount] = useState(0);
  const fullKey = key === null ? null : `${key}#${reloadCount}`;

  useEffect(() => {
    if (fullKey === null) return;
    let cancelled = false;

    fetcher()
      .then((data) => {
        if (!cancelled) setLoaded({ key: fullKey, data, error: null });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const apiError =
          error instanceof ApiError
            ? error
            : new ApiError(
                0,
                "UNKNOWN_ERROR",
                error instanceof Error ? error.message : "Something went wrong",
              );
        setLoaded({ key: fullKey, data: null, error: apiError });
      });

    return () => {
      cancelled = true;
    };
    // `fetcher` is recreated on every render; `fullKey` is what decides when to load again.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullKey]);

  const reload = useCallback(() => setReloadCount((count) => count + 1), []);
  const isCurrent = loaded !== null && loaded.key === fullKey;

  return {
    data: isCurrent ? loaded.data : null,
    error: isCurrent ? loaded.error : null,
    isLoading: fullKey !== null && !isCurrent,
    reload,
  };
}
