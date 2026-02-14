import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.util';
import { USER_ROLES } from '../config/constants';

export const requireProUser = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (!req.user) {
        sendError(res, 'Authentication required', 401);
        return;
    }

    if (req.user.role !== USER_ROLES.PRO) {
        sendError(
            res,
            'Pro subscription required',
            403,
            'This feature is only available to Pro users. Please upgrade your subscription.'
        );
        return;
    }

    next();
};
