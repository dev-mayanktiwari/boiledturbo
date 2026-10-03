type LogMeta = Record<string, unknown>;
type LogLevel = "info" | "warn" | "error";

function serializeError(err: unknown) {
  if (err instanceof Error) {
    return { name: err.name, message: err.message, stack: err.stack, cause: err.cause };
  }
  return err;
}

function log(level: LogLevel, message: string, meta?: LogMeta) {
  const { err, ...rest } = meta ?? {};
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...rest,
    ...(err !== undefined ? { err: serializeError(err) } : {}),
  };

  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

/**
 * Minimal structured logger shared by Express and tRPC error handling so unexpected
 * errors are logged the same way everywhere. Swap the implementation for pino/winston
 * later without touching call sites - this is the only file that would need to change.
 */
export const logger = {
  info: (message: string, meta?: LogMeta) => log("info", message, meta),
  warn: (message: string, meta?: LogMeta) => log("warn", message, meta),
  error: (message: string, meta?: LogMeta) => log("error", message, meta),
};
