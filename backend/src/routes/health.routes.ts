// GET /api/health — tells you whether the API server and the database are working.
import { Router } from "express";
import { env } from "../config/env.ts";
import { isDatabaseReachable } from "../lib/prisma.ts";

export type HealthResponse = {
  status: "ok" | "degraded";
  service: "vachan-backend";
  environment: string;
  uptimeSeconds: number;
  timestamp: string;
  database: {
    status: "connected" | "disconnected";
  };
};

export const healthRouter = Router();

healthRouter.get("/", async (_req, res) => {
  const databaseConnected = await isDatabaseReachable();

  const body: HealthResponse = {
    status: databaseConnected ? "ok" : "degraded",
    service: "vachan-backend",
    environment: env.NODE_ENV,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    database: {
      status: databaseConnected ? "connected" : "disconnected",
    },
  };

  // 200 = everything works. 503 = server is up, but the database is not reachable.
  res.status(databaseConnected ? 200 : 503).json(body);
});
