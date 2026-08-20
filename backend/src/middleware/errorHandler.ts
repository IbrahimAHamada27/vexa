import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { sendError } from '../utils/response.js';

// ─── Custom App Error ────────────────────────────────────────────────────────

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// ─── Not Found Handler ──────────────────────────────────────────────────────

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

// ─── Global Error Handler ───────────────────────────────────────────────────

export function globalErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Zod validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    sendError(res, 'Validation failed', 400, formattedErrors);
    return;
  }

  // Known operational errors
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // Prisma known errors (e.g. unique constraint violation)
  if (err.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as any;
    if (prismaErr.code === 'P2002') {
      sendError(res, `Unique constraint violation on: ${prismaErr.meta?.target}`, 409);
      return;
    }
    if (prismaErr.code === 'P2025') {
      sendError(res, 'Record not found', 404);
      return;
    }
  }

  // Unknown errors
  console.error('💥 Unhandled Error:', err);
  sendError(
    res,
    process.env['NODE_ENV'] === 'production' ? 'Internal Server Error' : err.message,
    500
  );
}
