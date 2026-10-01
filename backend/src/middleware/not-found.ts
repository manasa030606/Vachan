import type { Request, Response } from "express";

/** Runs when no route matched: always answer with JSON, never an HTML page. */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.originalUrl} does not exist`,
    },
  });
}
