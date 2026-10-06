// One small fetch wrapper used for every backend call.
//
// - Sends and receives JSON.
// - credentials: "include" sends the httpOnly login cookie, so the frontend never
//   needs to read or store the token itself.
// - Turns error responses into an ApiError with the backend's error code.
import { API_URL } from "@/lib/config";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: Array<{ field: string; message: string }>;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: Array<{ field: string; message: string }>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
};

export async function apiFetch<T>(
  path: string,
  { method = "GET", body }: RequestOptions = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api${path}`, {
      method,
      credentials: "include",
      cache: "no-store",
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      0,
      "NETWORK_ERROR",
      API_URL
        ? `Can't reach the Vachan server at ${API_URL}. Is the backend running (npm run dev)?`
        : "Can't reach the Vachan server right now. Please try again in a minute.",
    );
  }

  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const error = (
      data as { error?: { code?: string; message?: string; details?: ApiError["details"] } }
    )?.error;
    throw new ApiError(
      response.status,
      error?.code ?? "UNKNOWN_ERROR",
      error?.message ?? `Request failed with HTTP ${response.status}`,
      error?.details,
    );
  }
  return data as T;
}
