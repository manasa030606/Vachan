// Frontend configuration read from environment variables.
// Only variables starting with NEXT_PUBLIC_ are available in the browser,
// so NEVER put secrets (API keys, passwords) in a NEXT_PUBLIC_ variable.
//
// Where does the browser send API requests?
//   - Local development: directly to NEXT_PUBLIC_API_URL (normally http://localhost:4000).
//   - Production: always to "/api/..." on the frontend's own domain. next.config.ts uses
//     NEXT_PUBLIC_API_URL as the server-side rewrite destination. Keeping browser requests
//     same-origin makes the httpOnly login cookie first-party, even when the frontend and
//     backend are deployed on different domains.

function resolveApiUrl(): string {
  // Never expose the backend as the browser request target in production. Although
  // NEXT_PUBLIC_API_URL is available in the client bundle, it is used by next.config.ts
  // to configure the Vercel rewrite instead.
  if (process.env.NODE_ENV === "production") return "";

  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");
  return "http://localhost:4000";
}

export const API_URL = resolveApiUrl();