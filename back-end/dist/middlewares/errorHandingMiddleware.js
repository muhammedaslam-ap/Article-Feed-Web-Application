"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const zod_1 = require("zod");
const custom_error_1 = require("../util/custom.error");
const constant_1 = require("../shared/constant");
/**
 * Global error handler for the application.
 */
const handleError = (err, req, res, next) => {
    let statusCode = constant_1.HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let message = constant_1.ERROR_MESSAGES.SERVER_ERROR;
    let errors;
    console.error("🔴 [ERROR]", {
        message: err instanceof Error ? err.message : "Unknown error",
        stack: err instanceof Error ? err.stack : "No stack available",
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        time: new Date().toISOString(),
    });
    // Handle Zod validation errors
    if (err instanceof zod_1.ZodError) {
        statusCode = constant_1.HTTP_STATUS.BAD_REQUEST;
        message = constant_1.ERROR_MESSAGES.VALIDATION_ERROR;
        errors = err.issues.map((issue) => ({
            message: issue.message,
            path: issue.path.join("."),
        }));
    }
    // Handle custom application errors
    else if (err instanceof custom_error_1.CustomError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    // Handle general JavaScript errors
    else if (err instanceof Error) {
        message = err.message;
    }
    // Send structured error response
    res.status(statusCode).json(Object.assign(Object.assign({ success: false, statusCode,
        message }, (errors && { errors })), (process.env.NODE_ENV === "development" &&
        err instanceof Error && { stack: err.stack })));
    next();
};
exports.handleError = handleError;
