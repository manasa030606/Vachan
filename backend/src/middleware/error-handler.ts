import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.ts";

type HttpError = Error & { status?: number; statusCode?: number; type?: string };

/**
 * Last line of defence: catches any error thrown in a route and returns JSON.
 * Express recognises it as an error handler because it has 4 parameters.
 */
export function errorHandler(
  error: HttpError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  // Invalid JSON sent by the client (e.g. a typo in a Postman body).
  if (error.type === "entity.parse.failed") {
    res.status(400).json({
      error: { code: "INVALID_JSON", message: "Request body is not valid JSON" },
    });
    return;
  }

  const status = error.status ?? error.statusCode ?? 500;
  if (status >= 500) {
    console.error(error);
  }

  res.status(status).json({
    error: {
      code: status >= 500 ? "INTERNAL_SERVER_ERROR" : "REQUEST_ERROR",
      // Hide internal details from users in production.
      message:
        status >= 500 && env.NODE_ENV === "production" ? "Something went wrong" : error.message,
    },
  });
}
