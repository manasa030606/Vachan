// Builds the Express app: middleware → routes → 404 → error handler.
// Kept separate from server.ts so tests can import the app without opening a port.
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";
import { allowedOrigins, env } from "./config/env.ts";
import { errorHandler } from "./middleware/error-handler.ts";
import { notFoundHandler } from "./middleware/not-found.ts";
import { securityHeaders } from "./middleware/security-headers.ts";
import { apiRouter } from "./routes/index.ts";

export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");
  // Trust the hosting proxy so req.ip is the learner's IP (rate limits per IP).
  app.set("trust proxy", env.TRUST_PROXY ?? (env.NODE_ENV === "production" ? 1 : 0));
  app.use(securityHeaders);
  // credentials: true lets the browser send the login cookie to the API.
  app.use(cors({ origin: allowedOrigins, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  app.use("/api", apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
