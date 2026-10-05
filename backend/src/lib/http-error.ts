// A typed error that becomes a JSON response in the error handler.
// Throw it anywhere in a route or service:  throw new HttpError(404, "LESSON_NOT_FOUND", "Lesson not found")

export class HttpError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const notFound = (code: string, message: string) => new HttpError(404, code, message);
export const unauthorized = (message = "You need to log in to do this") =>
  new HttpError(401, "UNAUTHORIZED", message);
export const forbidden = (code: string, message: string) => new HttpError(403, code, message);
