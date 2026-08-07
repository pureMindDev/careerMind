import app from "./app.js";
import { env, assertRequiredEnv } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { logger } from "./utils/logger.js";

async function main() {
  assertRequiredEnv();
  await connectDB();

  const server = app.listen(env.port, () => {
    logger.info(`CareerMind API listening on http://localhost:${env.port}`);
  });

  // Let in-flight requests finish before the process exits — important in
  // containers, where the platform sends SIGTERM before a hard kill.
  function shutdown(signal) {
    logger.info(`${signal} received, shutting down gracefully`);
    server.close(() => {
      logger.info("HTTP server closed");
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

main().catch((err) => {
  logger.error("Failed to start server:", err.message);
  process.exit(1);
});
