import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { CustomError } from "../util/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../shared/constant";

/**
 * Global error handler for the application.
 */
export const handleError = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = ERROR_MESSAGES.SERVER_ERROR;
  let errors: { message: string; path?: string }[] | undefined;

  console.error("🔴 [ERROR]", {
    message: err instanceof Error ? err.message : "Unknown error",
    stack: err instanceof Error ? err.stack : "No stack available",
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    time: new Date().toISOString(),
  });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = ERROR_MESSAGES.VALIDATION_ERROR;
    errors = err.issues.map((issue) => ({
      message: issue.message,
      path: issue.path.join("."),
    }));
  }

  // Handle custom application errors
  else if (err instanceof CustomError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Handle general JavaScript errors
  else if (err instanceof Error) {
    message = err.message;
  }

  // Send structured error response
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === "development" &&
      err instanceof Error && { stack: err.stack }),
  });

  next();
};
