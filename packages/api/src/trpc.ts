import { initTRPC, TRPCError } from "@trpc/server";
import type { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";
import { AppError, type ErrorCode, logError, toAppError } from "@repo/common/errors";
import type { Context } from "./context";

const TRPC_CODE: Record<ErrorCode, TRPC_ERROR_CODE_KEY> = {
  BAD_REQUEST: "BAD_REQUEST",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  VALIDATION_ERROR: "UNPROCESSABLE_CONTENT",
  RATE_LIMITED: "TOO_MANY_REQUESTS",
  INTERNAL_ERROR: "INTERNAL_SERVER_ERROR",
};

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    // Procedure errors carry an AppError as `cause` (set by the middleware below). tRPC's
    // own errors, such as an unknown procedure, keep tRPC's code and message. Either way
    // the stack is dropped so no server file paths reach the client.
    const appError = error.cause instanceof AppError ? error.cause : undefined;

    const { message: _shapeMessage, ...rest } = shape;

    return {
      ...rest,
      data: {
        code: appError?.code ?? shape.data.code,
        httpStatus: shape.data.httpStatus,
        path: shape.data.path,
        message: appError?.message ?? shape.message,
        details: appError?.details,
      },
    };
  },
});

/**
 * Applied to every procedure. Business code throws AppError; anything else is treated as
 * an internal error. tRPC wraps thrown values in TRPCError, so the original is on `.cause`.
 */
const errorHandlingMiddleware = t.middleware(async ({ next, path }) => {
  const result = await next();
  if (result.ok) {
    return result;
  }

  const appError = toAppError(result.error.cause ?? result.error);
  logError(appError, { path });

  throw new TRPCError({
    code: TRPC_CODE[appError.code],
    message: appError.message,
    cause: appError,
  });
});

export const router = t.router;
export const publicProcedure = t.procedure.use(errorHandlingMiddleware);
