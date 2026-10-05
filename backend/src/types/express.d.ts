// Adds `req.auth` to Express's Request type. It is set by the auth middleware.
import type { UserRole } from "../generated/prisma/client.ts";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

export {};
