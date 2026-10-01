// Entry point: starts the HTTP server and shuts it down cleanly on Ctrl+C.
import { createApp } from "./app.ts";
import { env } from "./config/env.ts";
import { isDatabaseReachable, prisma } from "./lib/prisma.ts";

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`🚀 Vachan API running at http://localhost:${env.PORT} (${env.NODE_ENV})`);
  console.log(`   Health check: http://localhost:${env.PORT}/api/health`);

  // Warn early (but keep running) if PostgreSQL is not reachable.
  void isDatabaseReachable().then((connected) => {
    if (connected) {
      console.log("✅ Database connected");
    } else {
      console.warn(
        "⚠️  Database NOT reachable — check that PostgreSQL is running and DATABASE_URL is correct",
      );
    }
  });
});

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `❌ Port ${env.PORT} is already in use. Stop the other process or change PORT in backend/.env.`,
    );
  } else {
    console.error(error);
  }
  process.exit(1);
});

function shutdown(signal: string): void {
  console.log(`\n${signal} received — shutting down...`);
  server.close(() => {
    void prisma.$disconnect().finally(() => process.exit(0));
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
