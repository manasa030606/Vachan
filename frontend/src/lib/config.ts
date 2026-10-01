// Frontend configuration read from environment variables.
// Only variables starting with NEXT_PUBLIC_ are available in the browser,
// so NEVER put secrets (API keys, passwords) in a NEXT_PUBLIC_ variable.

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
