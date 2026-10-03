import { failure, logError, toAppError } from "@repo/common/errors";
import type { NextFunction, Request, Response } from "express";

/**
 * Final error middleware. Must be registered last, after every route and `notFoundHandler`.
 * Express only treats it as error middleware because it declares four parameters, so
 * `_next` stays even though it's only used to pass errors on.
 */
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  // Once a response has started, Express can't send a new one; hand off to its default handler.
  if (res.headersSent) {
    return next(err);
  }

  const appError = toAppError(err);
  logError(appError, { path: req.originalUrl, method: req.method });

  res.status(appError.httpStatus).json(failure(appError));
}
