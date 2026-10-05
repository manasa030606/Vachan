import type { NextConfig } from "next";

// BACKEND_URL (server-side only, e.g. https://vachan-api.onrender.com) turns on the API proxy:
// requests to https://<frontend>/api/... are forwarded to <BACKEND_URL>/api/...
// The browser only ever talks to the frontend's domain, so the httpOnly login cookie is
// first-party and no cross-site cookie/CORS problems appear. See docs/DEPLOYMENT.md.
const backendUrl = process.env.BACKEND_URL?.trim().replace(/\/+$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Don't auto-generate AGENTS.md / CLAUDE.md files in this folder.
  agentRules: false,
  async rewrites() {
    if (!backendUrl) return [];
    return [{ source: "/api/:path*", destination: `${backendUrl}/api/:path*` }];
  },
};

export default nextConfig;
