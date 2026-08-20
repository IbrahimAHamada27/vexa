import { Response } from 'express';

// ─── Standard API Response Format ────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  message: string;
}

/**
 * Send a successful response
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): void {
  res.status(statusCode).json({
    success: true,
    data,
    message,
  } satisfies ApiResponse<T>);
}

/**
 * Send an error response
 */
export function sendError(
  res: Response,
  message = 'Internal Server Error',
  statusCode = 500,
  data: unknown = null
): void {
  res.status(statusCode).json({
    success: false,
    data,
    message,
  } satisfies ApiResponse);
}

/**
 * Send a paginated response
 */
export function sendPaginated<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  message = 'Success'
): void {
  res.status(200).json({
    success: true,
    data: {
      items: data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
    message,
  });
}
