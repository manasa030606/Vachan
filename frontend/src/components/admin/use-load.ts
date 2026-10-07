"use client";

// Small data-loading hook shared by the admin pages.
import { useCallback, useEffect, useState } from "react";
import { errorText } from "./admin-ui";

/**
 * Loads data for an admin page. `key` changes (e.g. the selected language) load again;
 * `reload()` fetches again after a change. Old data stays visible while reloading.
 */
export function useLoad<T>(load: () => Promise<T>, key: string) {
  const [state, setState] = useState<{ key: string | null; data: T | null; error: string | null }>({
    key: null,
    data: null,
    error: null,
  });
  const [reloadCount, setReloadCount] = useState(0);
  const reload = useCallback(() => setReloadCount((count) => count + 1), []);

  useEffect(() => {
    let cancelled = false;
    load()
      .then((data) => {
        if (!cancelled) setState({ key, data, error: null });
      })
      .catch((error: unknown) => {
        if (!cancelled) setState((old) => ({ ...old, key, error: errorText(error) }));
      });
    return () => {
      cancelled = true;
    };
    // `load` is a new function on every render; `key` says when the request really changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, reloadCount]);

  return {
    data: state.data,
    error: state.error,
    loading: state.key !== key,
    reload,
  };
}
