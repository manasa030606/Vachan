"use client";

// Keeps track of who is logged in, for the whole app. On page load it calls GET /api/me
// (the browser sends the httpOnly login cookie automatically).
// Usage: const { status, user, setUser, logout } = useSession();
// status is "loading" while asking, "authenticated" when user is set, or "guest".
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { getMe, logOut, updateMe } from "@/lib/api/endpoints";
import type { UserDto } from "@/lib/api/types";

type SessionStatus = "loading" | "authenticated" | "guest";

type SessionContextValue = {
  status: SessionStatus;
  user: UserDto | null;
  /** Problem reaching the backend (shown to the user), or null. */
  connectionError: string | null;
  /** True right after logging out (so pages don't redirect to /login while we go home). */
  didLogout: boolean;
  setUser: (user: UserDto | null) => void;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

/** Provides the session to every component below it. */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserDto | null>(null);
  const [status, setStatus] = useState<SessionStatus>("loading");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [didLogout, setDidLogout] = useState(false);
  const router = useRouter();

  const setUser = useCallback((next: UserDto | null) => {
    setUserState(next);
    setStatus(next ? "authenticated" : "guest");
    if (next) setDidLogout(false);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const { user: me } = await getMe();
      setConnectionError(null);
      setUser(me);
    } catch (error) {
      // 401 simply means "not logged in". Anything else is a connection problem.
      if (error instanceof ApiError && error.status !== 401) setConnectionError(error.message);
      setUser(null);
    }
  }, [setUser]);

  // Initial load. Same logic as refresh(), but ignores the answer if the component unmounted.
  useEffect(() => {
    let cancelled = false;
    getMe()
      .then(({ user: me }) => {
        if (!cancelled) setUser(me);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof ApiError && error.status !== 401) setConnectionError(error.message);
        setUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, [setUser]);

  // Streak days follow the learner's own calendar: save the browser's time zone once it differs.
  useEffect(() => {
    const profile = user?.profile;
    if (!profile) return;
    const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!browserTimeZone || profile.timeZone === browserTimeZone) return;
    updateMe({ timeZone: browserTimeZone })
      .then(({ user: updated }) => setUserState(updated))
      .catch(() => {
        // Not critical: the server keeps using the previous time zone.
      });
  }, [user?.profile]);

  /** Logs out on the server (the old token stops working), then goes to the landing page. */
  const logout = useCallback(async () => {
    try {
      await logOut();
    } finally {
      setDidLogout(true);
      setUser(null);
      router.replace("/");
    }
  }, [router, setUser]);

  const value = useMemo(
    () => ({ status, user, connectionError, didLogout, setUser, refresh, logout }),
    [status, user, connectionError, didLogout, setUser, refresh, logout],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

/** Read the current session. Must be used inside <SessionProvider>. */
export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used inside <SessionProvider>");
  return context;
}
