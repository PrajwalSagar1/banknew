import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

/**
 * Custom Error Class for API specific errors
 */
export class ApiError extends Error {
    statusCode: number;
    errors: any[];

    constructor(statusCode: number, message: string, errors: any[] = [], stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

/**
 * Centralized Error handling middleware
 */
export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let error = err;

    // LOGGING (Production Grade)
    if (process.env.NODE_ENV === 'production') {
        console.error(`[ERROR] ${new Date().toISOString()} - ${req.method} ${req.path}:`, {
            message: err.message,
            stack: err.stack,
            user: (req as any).user?._id
        });
    } else {
        console.error(err);
    }

    // 1. Logic for Zod Validation Errors
    if (err instanceof ZodError) {
        const message = "Validation Error";
        const errors = err.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
        }));
        error = new ApiError(400, message, errors, err.stack);
    }

    // 2. Logic for JWT Errors
    else if (err instanceof TokenExpiredError) {
        error = new ApiError(401, "Access token has expired", [], err.stack);
    }
    else if (err instanceof JsonWebTokenError) {
        error = new ApiError(401, "Invalid access token", [], err.stack);
    }

    // 3. Logic for Mongoose/Mongo Errors
    else if (err.name === "CastError") {
        error = new ApiError(400, `Invalid ${err.path}: ${err.value}`, [], err.stack);
    }
    else if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        error = new ApiError(409, `Duplicate field value entered: ${field}`, [], err.stack);
    }

    // Final structured response
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message,
        errors: error.errors || [],
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
};
