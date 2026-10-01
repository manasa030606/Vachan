// Collects every API route under /api.
// Future phases add routers here (e.g. apiRouter.use("/languages", languagesRouter)).
import { Router } from "express";
import { healthRouter } from "./health.routes.ts";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
