import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.util';
import { logger } from '../utils/logger.util';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    logger.error('Error:', err);

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        sendError(res, `${field} already exists`, 400);
        return;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e: any) => e.message);
        sendError(res, errors.join(', '), 400);
        return;
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        sendError(res, 'Invalid ID format', 400);
        return;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        sendError(res, 'Invalid token', 401);
        return;
    }

    if (err.name === 'TokenExpiredError') {
        sendError(res, 'Token expired', 401);
        return;
    }

    // Default error
    const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message || 'Internal server error';

    sendError(
        res,
        message,
        err.statusCode || 500
    );
};
