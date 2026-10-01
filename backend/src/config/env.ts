// Loads and validates environment variables ONCE, at startup.
// If something is missing or invalid, the server refuses to start and prints a clear message,
// instead of crashing later with a confusing error.
import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  DATABASE_URL: z
    .string({ error: "DATABASE_URL is required. Copy backend/.env.example to backend/.env." })
    .min(1, "DATABASE_URL is required. Copy backend/.env.example to backend/.env.")
    .refine((value) => value.startsWith("postgresql://") || value.startsWith("postgres://"), {
      message: "DATABASE_URL must start with postgresql:// (see backend/.env.example)",
    }),
  // Comma-separated list of frontend URLs allowed to call this API from the browser.
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("\n❌ Invalid environment configuration (backend/.env):");
    for (const issue of result.error.issues) {
      console.error(`   - ${issue.path.join(".")}: ${issue.message}`);
    }
    console.error("\nFix backend/.env and restart the server.\n");
    process.exit(1);
  }

  return result.data;
}

export const env = loadEnv();

/** CORS_ORIGIN split into a clean array, e.g. ["http://localhost:3000"]. */
export const allowedOrigins = env.CORS_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);
