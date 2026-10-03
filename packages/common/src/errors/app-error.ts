import { ZodError } from "zod";
import { logger } from "../logger";

/**
 * The single source of truth for error codes. Adding a code is one line here.
 * `INTERNAL_ERROR` is the only code treated as an unexpected bug; everything else is
 * an expected business condition and logged as a warning.
 */
export const ERROR_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
} as const;

export type ErrorCode = keyof typeof ERROR_STATUS;

export interface AppErrorOptions {
  /** Client-safe structured data, e.g. validation issues. */
  details?: unknown;
  /** The original thrown value. Logged for unexpected errors, never sent to the client. */
  cause?: unknown;
  /** Overrides the status derived from `code`, for errors that carry their own (e.g. 413). */
  httpStatus?: number;
}

/**
 * The only error type business logic should throw. `message` must be safe to show a
 * client; the real error goes in `cause` for logging.
 */
export class AppError extends Error {
  readonly code: ErrorCode;
  readonly httpStatus: number;
  readonly details?: unknown;

  constructor(code: ErrorCode, message: string, options: AppErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.name = "AppError";
    this.code = code;
    this.httpStatus = options.httpStatus ?? ERROR_STATUS[code];
    this.details = options.details;
  }

  get isOperational(): boolean {
    return this.code !== "INTERNAL_ERROR";
  }
}

/**
 * Turns anything caught at a boundary into an AppError. Unknown errors become a generic
 * INTERNAL_ERROR; the original is kept on `cause` for logging only.
 */
export function toAppError(err: unknown): AppError {
  if (err instanceof AppError) {
    return err;
  }

  if (err instanceof ZodError) {
    return new AppError("VALIDATION_ERROR", "Validation failed", { details: err.issues, cause: err });
  }

  // Errors from body parsing and similar middleware carry their own HTTP status and are
  // only exposed to the client when the library marks them as safe (`expose`).
  const status = (err as { status?: unknown })?.status;
  const exposed = (err as { expose?: unknown })?.expose === true;
  if (exposed && typeof status === "number" && status >= 400 && status < 500) {
    const isMalformedJson = (err as { type?: unknown }).type === "entity.parse.failed";
    return new AppError("BAD_REQUEST", isMalformedJson ? "Malformed JSON body" : (err as Error).message, {
      cause: err,
      httpStatus: status,
    });
  }

  return new AppError("INTERNAL_ERROR", "Internal server error", { cause: err });
}

/**
 * Expected errors log a warning with the business code. Unexpected errors log an error
 * with the original cause and stack attached.
 */
export function logError(err: AppError, meta: Record<string, unknown> = {}): void {
  if (err.isOperational) {
    logger.warn(err.message, { code: err.code, ...meta });
  } else {
    logger.error("unhandled error", { err: err.cause ?? err, ...meta });
  }
}
