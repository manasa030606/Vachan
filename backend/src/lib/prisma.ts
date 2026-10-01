// A single shared Prisma Client for the whole backend.
// Prisma 7 talks to PostgreSQL through a "driver adapter" (here: the `pg` driver).
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../config/env.ts";
import { PrismaClient } from "../generated/prisma/client.ts";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
  // Fail fast (instead of hanging) when PostgreSQL is not reachable.
  connectionTimeoutMillis: 5_000,
});

export const prisma = new PrismaClient({ adapter });

/** Returns true if PostgreSQL answers a trivial query. Used by the health check. */
export async function isDatabaseReachable(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
