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
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** JSON body, or FormData for file uploads (e.g. recorded audio). */
  body?: unknown;
  /** Give up after this many milliseconds (AI and speech calls). */
  timeoutMs?: number;
};

const networkError = () =>
  new ApiError(
    0,
    "NETWORK_ERROR",
    API_URL
      ? `Can't reach the Vachan server at ${API_URL}. Is the backend running (npm run dev)?`
      : "Can't reach the Vachan server right now. Please check your internet connection and try again.",
  );

const timeoutError = () =>
  new ApiError(0, "TIMEOUT", "The server took too long to answer. Please try again.");

/** Sends the request; network problems and timeouts become ApiErrors. */
async function send(path: string, { method = "GET", body, timeoutMs }: RequestOptions) {
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  try {
    return await fetch(`${API_URL}/api${path}`, {
      method,
      credentials: "include",
      cache: "no-store",
      // FormData sets its own multipart Content-Type (with the boundary).
      headers: body === undefined || isForm ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
      signal: timeoutMs ? AbortSignal.timeout(timeoutMs) : undefined,
    });
  } catch (error) {
    if (
      error instanceof DOMException &&
      (error.name === "TimeoutError" || error.name === "AbortError")
    ) {
      throw timeoutError();
    }
    throw networkError();
  }
}

async function errorFrom(response: Response): Promise<ApiError> {
  const data: unknown = await response.json().catch(() => null);
  const error = (
    data as { error?: { code?: string; message?: string; details?: ApiError["details"] } }
  )?.error;
  return new ApiError(
    response.status,
    error?.code ?? "UNKNOWN_ERROR",
    error?.message ?? `Request failed with HTTP ${response.status}`,
    error?.details,
  );
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await send(path, options);
  if (!response.ok) throw await errorFrom(response);
  return (await response.json().catch(() => null)) as T;
}

/** Downloads a binary response (e.g. WAV audio from /speech/tts). */
export async function apiBlob(path: string, options: RequestOptions = {}): Promise<Blob> {
  const response = await send(path, options);
  if (!response.ok) throw await errorFrom(response);
  return response.blob();
}
