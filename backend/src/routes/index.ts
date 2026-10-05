// Collects every API route under /api.
import { Router } from "express";
import { authRouter } from "./auth.routes.ts";
import { coursesRouter } from "./courses.routes.ts";
import { exercisesRouter } from "./exercises.routes.ts";
import { healthRouter } from "./health.routes.ts";
import { languagesRouter } from "./languages.routes.ts";
import { lessonsRouter } from "./lessons.routes.ts";
import { meRouter } from "./me.routes.ts";
import { progressRouter } from "./progress.routes.ts";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/me", meRouter);
apiRouter.use("/languages", languagesRouter);
apiRouter.use("/courses", coursesRouter);
apiRouter.use("/lessons", lessonsRouter);
apiRouter.use("/exercises", exercisesRouter);
apiRouter.use("/progress", progressRouter);
