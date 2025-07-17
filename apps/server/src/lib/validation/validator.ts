import type { NextFunction, Request, Response } from "express";
import { type ZodSchema, z } from "zod";

// Extended Request interface to include validated data
export interface ValidatedRequest extends Request {
  validated?: any;
}

// Validation error response interface
export interface ValidationErrorResponse {
  message: string;
  errors: Array<{
    field: string;
    message: string;
    code: string;
  }>;
}

/**
 * Creates a validation middleware for a specific route
 * @param schema - Zod schema to validate against
 * @param validateTarget - What part of the request to validate ('body', 'query', 'params', or 'all')
 * @returns Express middleware function
 */
export function createValidator<T extends ZodSchema>(
  schema: T,
  validateTarget: "body" | "query" | "params" | "all" = "body",
) {
  return (req: ValidatedRequest, res: Response<ValidationErrorResponse>, next: NextFunction) => {
    try {
      let dataToValidate: unknown;

      switch (validateTarget) {
        case "body":
          dataToValidate = req.body;
          break;
        case "query":
          dataToValidate = req.query;
          break;
        case "params":
          dataToValidate = req.params;
          break;
        case "all":
          dataToValidate = {
            body: req.body,
            query: req.query,
            params: req.params,
          };
          break;
        default:
          dataToValidate = req.body;
      }

      const validatedData = schema.parse(dataToValidate);

      // Store validated data in request object
      req.validated = validatedData;

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
        }));

        return res.status(400).json({
          message: "Validation failed",
          errors,
        });
      }

      // Handle unexpected errors
      return res.status(500).json({
        message: "Internal validation error",
        errors: [
          {
            field: "unknown",
            message: "An unexpected error occurred during validation",
            code: "INTERNAL_ERROR",
          },
        ],
      });
    }
  };
}

/**
 * Creates a validation middleware that validates multiple parts of the request
 * @param schemas - Object containing schemas for different parts of the request
 * @returns Express middleware function
 */
export function createMultiValidator(schemas: { body?: ZodSchema; query?: ZodSchema; params?: ZodSchema }) {
  return (req: ValidatedRequest, res: Response<ValidationErrorResponse>, next: NextFunction) => {
    try {
      const validatedData: any = {};

      // Validate body if schema provided
      if (schemas.body) {
        validatedData.body = schemas.body.parse(req.body);
      }

      // Validate query if schema provided
      if (schemas.query) {
        validatedData.query = schemas.query.parse(req.query);
      }

      // Validate params if schema provided
      if (schemas.params) {
        validatedData.params = schemas.params.parse(req.params);
      }

      // Store validated data in request object
      req.validated = validatedData;

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
        }));

        return res.status(400).json({
          message: "Validation failed",
          errors,
        });
      }

      return res.status(500).json({
        message: "Internal validation error",
        errors: [
          {
            field: "unknown",
            message: "An unexpected error occurred during validation",
            code: "INTERNAL_ERROR",
          },
        ],
      });
    }
  };
}

/**
 * Utility function to get validated data from request
 * @param req - Express request object
 * @returns Validated data
 */
export function getValidatedData<T>(req: ValidatedRequest): T {
  return req.validated as T;
}
