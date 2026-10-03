import type { AppError, ErrorCode } from "./app-error";

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiFailure {
  success: false;
  message: string;
  error: { code: ErrorCode; details?: unknown };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

/**
 * The envelope Express sends as its JSON body and tRPC returns as a procedure result, so
 * REST and tRPC callers see the same shape.
 */
export function success<T>(data: T, message = "Success"): ApiSuccess<T> {
  return { success: true, message, data };
}

export function failure(err: AppError): ApiFailure {
  return { success: false, message: err.message, error: { code: err.code, details: err.details } };
}
