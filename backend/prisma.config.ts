// Configuration for the Prisma CLI (prisma generate / migrate / studio).
// Loads backend/.env so DATABASE_URL is available to CLI commands.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // `prisma generate` does not need a real URL, so a missing value is allowed here.
    // Commands that talk to the database (migrate, studio) will fail with a clear error instead.
    url: process.env.DATABASE_URL ?? "",
  },
});
