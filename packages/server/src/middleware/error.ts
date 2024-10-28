import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/errors';
import { ApiResponse } from '@pizza-management/shared';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof AppError) {
    const response: ApiResponse<null> = {
      error: {
        message: err.message,
        code: err.code,
        status: err.status,
      },
    };
    res.status(err.status).json(response);
  } else {
    const response: ApiResponse<null> = {
      error: {
        message: 'Internal Server Error',
        code: 'INTERNAL_ERROR',
        status: 500,
      },
    };
    res.status(500).json(response);
  }
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const err = new AppError('Resource not found', 404, 'NOT_FOUND');
  next(err);
};