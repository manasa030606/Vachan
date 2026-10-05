import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.ts";
import { Prisma } from "../generated/prisma/client.ts";
import { HttpError } from "../lib/http-error.ts";

type ErrorBody = { error: { code: string; message: string; details?: unknown } };

/**
 * Last line of defence: turns every error thrown in a route into a JSON response.
 * All errors have the same shape:  { "error": { "code": "...", "message": "...", "details"?: ... } }
 * Express recognises this as an error handler because it has 4 parameters.
 */
export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response<ErrorBody>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  // 1. Our own errors (404, 401, 403, 409 …)
  if (error instanceof HttpError) {
    res.status(error.status).json({
      error: { code: error.code, message: error.message, details: error.details },
    });
    return;
  }

  // 2. Invalid input (Zod validation)
  if (error instanceof ZodError) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Some fields are missing or invalid",
        details: error.issues.map((issue) => ({
          field: issue.path.join(".") || "(body)",
          message: issue.message,
        })),
      },
    });
    return;
  }

  // 3. Database unique-constraint violations (e.g. the same email twice at the same moment)
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    res.status(409).json({
      error: { code: "ALREADY_EXISTS", message: "A record with these details already exists" },
    });
    return;
  }

  // 4. Invalid JSON sent by the client (e.g. a typo in a Postman body)
  const maybeHttp = error as { type?: string; status?: number; message?: string };
  if (maybeHttp.type === "entity.parse.failed") {
    res.status(400).json({
      error: { code: "INVALID_JSON", message: "Request body is not valid JSON" },
    });
    return;
  }
  if (maybeHttp.status && maybeHttp.status < 500) {
    res.status(maybeHttp.status).json({
      error: { code: "REQUEST_ERROR", message: maybeHttp.message ?? "Bad request" },
    });
    return;
  }

  // 5. Anything else is a bug or an outage → 500
  console.error(error);
  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message:
        env.NODE_ENV === "production"
          ? "Something went wrong"
          : error instanceof Error
            ? error.message
            : "Unknown error",
    },
  });
}
