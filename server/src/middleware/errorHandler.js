import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues,
    });
  }

  if (error?.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A record with a unique field already exists",
      fields: Object.keys(error.keyPattern ?? {}),
    });
  }

  const statusCode = error instanceof ApiError ? error.statusCode : 500;

  if (statusCode >= 500) {
    console.error(error);
  }

  return res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
    ...(error.details ? { details: error.details } : {}),
  });
}
