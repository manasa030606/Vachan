// Collects every API route under /api.
import { Router } from "express";
import { aiRouter } from "./ai.routes.ts";
import { authRouter } from "./auth.routes.ts";
import { coursesRouter } from "./courses.routes.ts";
import { exercisesRouter } from "./exercises.routes.ts";
import {
  achievementsRouter,
  recommendationsRouter,
  statsRouter,
  streakRouter,
} from "./gamification.routes.ts";
import { healthRouter } from "./health.routes.ts";
import { languagesRouter } from "./languages.routes.ts";
import { lessonsRouter } from "./lessons.routes.ts";
import { meRouter } from "./me.routes.ts";
import { placementRouter } from "./placement.routes.ts";
import { progressRouter } from "./progress.routes.ts";
import { ragRouter } from "./rag.routes.ts";
import { reviewRouter } from "./review.routes.ts";
import { speechRouter } from "./speech.routes.ts";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/me", meRouter);
apiRouter.use("/languages", languagesRouter);
apiRouter.use("/courses", coursesRouter);
apiRouter.use("/lessons", lessonsRouter);
apiRouter.use("/exercises", exercisesRouter);
apiRouter.use("/progress", progressRouter);
apiRouter.use("/review", reviewRouter);
apiRouter.use("/placement", placementRouter);
apiRouter.use("/stats", statsRouter);
apiRouter.use("/streak", streakRouter);
apiRouter.use("/achievements", achievementsRouter);
apiRouter.use("/recommendations", recommendationsRouter);
apiRouter.use("/rag", ragRouter);
apiRouter.use("/ai", aiRouter);
apiRouter.use("/speech", speechRouter);
