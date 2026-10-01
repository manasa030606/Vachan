// Small typed helpers for calling the Vachan backend.
import { API_URL } from "./config";

/** Shape of GET /api/health (mirrors backend/src/routes/health.routes.ts). */
export type HealthResponse = {
  status: "ok" | "degraded";
  service: string;
  environment: string;
  uptimeSeconds: number;
  timestamp: string;
  database: {
    status: "connected" | "disconnected";
  };
};

/**
 * Calls the backend health endpoint.
 * Note: the backend answers 503 (not an exception) when only the database is down,
 * so we still read the JSON body in that case.
 */
export async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_URL}/api/health`, { cache: "no-store" });

  if (!response.ok && response.status !== 503) {
    throw new Error(`Health check failed with HTTP ${response.status}`);
  }

  return (await response.json()) as HealthResponse;
}
