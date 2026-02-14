import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { sendError } from '../utils/response.util';

export const validate = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync(req.body);
            next();
        } catch (error: any) {
            if (error.issues) {
                const errorMessages = error.issues.map((issue: any) => ({
                    path: issue.path.join('.'),
                    message: issue.message,
                }));
                sendError(res, 'Validation failed', 400, JSON.stringify(errorMessages));
                return;
            }
            sendError(res, 'Validation error', 400);
        }
    };
};
