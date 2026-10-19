import type { NextConfig } from "next";

// Next.js settings: security headers and the optional /api proxy to the backend.

// NEXT_PUBLIC_API_URL (e.g. https://vachan-api.vercel.app) turns on the API proxy:
// requests to https://<frontend>/api/... are forwarded to the backend's /api/...
// The browser only ever talks to the frontend's domain, so the httpOnly login cookie is
// first-party and no cross-site cookie/CORS problems appear. See docs/DEPLOYMENT.md.
// BACKEND_URL remains supported for Docker deployments and older environments.
const backendUrl = (process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL)
  ?.trim()
  .replace(/\/+$/, "");

// Security headers sent with every page.
//   frame-ancestors / X-Frame-Options  no clickjacking (the app can't be framed)
//   nosniff                            no content-type guessing
//   Permissions-Policy                 the microphone only for Vachan itself (speaking practice);
//                                      camera and location are never needed
// A full Content-Security-Policy is not set: Next.js needs inline scripts unless every page uses
// nonces — see docs/SECURITY.md (remaining risks).
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "microphone=(self), camera=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Don't auto-generate AGENTS.md / CLAUDE.md files in this folder.
  agentRules: false,
  async rewrites() {
    if (!backendUrl) return [];
    return [{ source: "/api/:path*", destination: `${backendUrl}/api/:path*` }];
  },
};

export default nextConfig;