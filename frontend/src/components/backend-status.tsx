"use client";

// Shows whether the frontend can reach the backend (and whether the backend can reach PostgreSQL).
// Phase 0 uses this to prove that frontend ↔ backend ↔ database are wired together correctly.
import { useEffect, useState } from "react";
import { fetchHealth, type HealthResponse } from "@/lib/api";
import { API_URL } from "@/lib/config";

type CheckState =
  | { kind: "loading" }
  | { kind: "success"; health: HealthResponse }
  | { kind: "error"; message: string };

export function BackendStatus() {
  const [state, setState] = useState<CheckState>({ kind: "loading" });
  // Increasing this number re-runs the effect below ("Check again" button).
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false; // ignore late responses after the component unmounts

    fetchHealth()
      .then((health) => {
        if (!cancelled) setState({ kind: "success", health });
      })
      .catch(() => {
        if (!cancelled) {
          setState({
            kind: "error",
            message: `Could not reach the backend at ${API_URL}. Is it running?`,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  function handleRetry() {
    setState({ kind: "loading" });
    setAttempt((current) => current + 1);
  }

  return (
    <section
      aria-live="polite"
      className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">System status</h2>

      {state.kind === "loading" && <p className="mt-4 text-slate-600">Checking backend…</p>}

      {state.kind === "error" && (
        <p className="mt-4 text-red-700">
          <span aria-hidden="true">✗ </span>
          {state.message}
        </p>
      )}

      {state.kind === "success" && (
        <ul className="mt-4 space-y-2 text-slate-700">
          <StatusRow label="Backend API" ok={true} okText="Running" failText="Down" />
          <StatusRow
            label="Database"
            ok={state.health.database.status === "connected"}
            okText="Connected"
            failText="Not connected"
          />
          <li className="pt-2 text-sm text-slate-500">
            Environment: {state.health.environment} · Uptime: {state.health.uptimeSeconds}s
          </li>
        </ul>
      )}

      <button
        type="button"
        onClick={handleRetry}
        className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
      >
        Check again
      </button>
    </section>
  );
}

type StatusRowProps = {
  label: string;
  ok: boolean;
  okText: string;
  failText: string;
};

// Uses a symbol AND text (not only color) so the status is clear to everyone.
function StatusRow({ label, ok, okText, failText }: StatusRowProps) {
  return (
    <li className="flex items-center justify-between">
      <span>{label}</span>
      <span className={ok ? "font-medium text-green-700" : "font-medium text-red-700"}>
        {ok ? "✓ " : "✗ "}
        {ok ? okText : failText}
      </span>
    </li>
  );
}
