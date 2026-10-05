// Frontend configuration read from environment variables.
// Only variables starting with NEXT_PUBLIC_ are available in the browser,
// so NEVER put secrets (API keys, passwords) in a NEXT_PUBLIC_ variable.
//
// Where does the browser send API requests?
//   - Local development: NEXT_PUBLIC_API_URL=http://localhost:4000 (frontend/.env.local)
//   - Deployed (Vercel): leave NEXT_PUBLIC_API_URL unset. The browser then calls
//     "/api/..." on the website's own domain, and next.config.ts forwards those requests
//     to the backend (BACKEND_URL). Same domain = the login cookie is a normal first-party
//     cookie, so login works in every browser (including Safari).

function resolveApiUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");
  // Production build without NEXT_PUBLIC_API_URL → same-origin "/api" (proxied by Next.js).
  return process.env.NODE_ENV === "production" ? "" : "http://localhost:4000";
}

export const API_URL = resolveApiUrl();
