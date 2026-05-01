import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Middleware to validate request body using Zod schema
 * @param schema Zod schema to validate against
 */
export const validate =
    (schema: ZodSchema) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                await schema.parseAsync(req.body);
                return next();
            } catch (error) {
                if (error instanceof ZodError) {
                    return res.status(400).json({
                        success: false,
                        message: "Validation Error",
                        errors: error.issues.map((issue) => ({
                            path: issue.path.join("."),
                            message: issue.message,
                        })),
                    });
                }
                return res.status(500).json({
                    success: false,
                    message: "Internal Server Error during validation",
                });
            }
        };
