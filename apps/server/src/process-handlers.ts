import { logger } from "@repo/common/logger";

/**
 * Last-resort safety net for errors outside the request lifecycle (background jobs,
 * timers, etc). Express already forwards errors from route handlers to `errorHandler`,
 * so this is never reached for request errors.
 *
 * Both events fail fast. After an unhandled rejection or exception the process state
 * can't be trusted, so we log and exit instead of carrying on.
 */
export function registerProcessErrorHandlers() {
  process.on("unhandledRejection", (reason) => {
    logger.error("unhandled promise rejection, shutting down", { err: reason });
    process.exit(1);
  });

  process.on("uncaughtException", (err) => {
    logger.error("uncaught exception, shutting down", { err });
    process.exit(1);
  });
}
