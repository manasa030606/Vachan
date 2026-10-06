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
  // Secret used to sign login tokens (JWT). Long and random; never share or commit it.
  JWT_SECRET: z
    .string({ error: "JWT_SECRET is required. See backend/.env.example." })
    .min(32, "JWT_SECRET must be at least 32 characters long (see backend/.env.example)"),
  // How long a login lasts, e.g. "7d", "12h".
  JWT_EXPIRES_IN: z
    .string()
    .regex(/^\d+[smhd]$/, 'JWT_EXPIRES_IN must look like "7d", "12h" or "30m"')
    .default("7d"),
  // Phase 5 (RAG) — optional. Folder for the embedding model files (default: backend/.cache/models).
  RAG_MODEL_DIR: z.string().trim().min(1).optional(),
  // "false" = never download the model (use only files already in RAG_MODEL_DIR).
  RAG_ALLOW_DOWNLOAD: z.enum(["true", "false"]).default("true"),
  // RAG search loads a ~500 MB model in memory. Default: on locally, OFF in production
  // (Render's free plan has 512 MB). Set RAG_ENABLED=true on a server with ≥ 1 GB RAM.
  RAG_ENABLED: z.enum(["true", "false"]).optional(),
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

if (env.JWT_SECRET.startsWith("replace-this")) {
  if (env.NODE_ENV === "production") {
    // Never run a public server with the documented example secret.
    console.error("❌ JWT_SECRET is still the example value. Set a real random secret.");
    process.exit(1);
  }
  console.warn(
    "⚠️  JWT_SECRET is still the example value. Generate your own: openssl rand -hex 32",
  );
}

/** Whether POST /api/rag/search may load the embedding model in this process. */
export const ragEnabled =
  (env.RAG_ENABLED ?? (env.NODE_ENV === "production" ? "false" : "true")) === "true";

/** CORS_ORIGIN split into a clean array, e.g. ["http://localhost:3000"]. */
export const allowedOrigins = env.CORS_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);
