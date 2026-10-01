// Builds the Express application: middleware → routes → 404 → error handler.
// Kept separate from server.ts so the app can later be imported by automated tests
// without actually opening a network port.
import cors from "cors";
import express, { type Express } from "express";
import { allowedOrigins } from "./config/env.ts";
import { errorHandler } from "./middleware/error-handler.ts";
import { notFoundHandler } from "./middleware/not-found.ts";
import { apiRouter } from "./routes/index.ts";

export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json({ limit: "1mb" }));

  app.use("/api", apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
