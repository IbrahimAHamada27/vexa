import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Middleware factory that validates request data against a Zod schema.
 * @param schema - The Zod schema to validate against
 * @param source - Which part of the request to validate ('body' | 'query' | 'params')
 */
export function validate(
  schema: ZodSchema,
  source: 'body' | 'query' | 'params' = 'body'
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[source]);
      // Replace with parsed (coerced/transformed) values
      (req as unknown as Record<string, unknown>)[source] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error); // Handled by globalErrorHandler
      } else {
        next(error);
      }
    }
  };
}
