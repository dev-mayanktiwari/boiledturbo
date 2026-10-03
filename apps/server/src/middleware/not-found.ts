import { AppError } from "@repo/common/errors";
import type { NextFunction, Request, Response } from "express";

/** Registered after all real routes; anything that falls through is a 404. */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(new AppError("NOT_FOUND", `Route ${req.method} ${req.originalUrl} not found`));
}
