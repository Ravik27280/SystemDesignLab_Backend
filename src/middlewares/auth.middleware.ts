import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { sendError } from '../utils/response.util';
import User from '../models/User.model';

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            sendError(res, 'No token provided', 401, 'Authentication required');
            return;
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = verifyToken(token);

            // Fetch user details
            const user = await User.findById(decoded.userId).select('email role');

            if (!user) {
                sendError(res, 'User not found', 401);
                return;
            }

            // Attach user to request object
            req.user = {
                userId: decoded.userId,
                email: user.email,
                role: user.role,
            };

            next();
        } catch (error) {
            sendError(res, 'Invalid or expired token', 401);
            return;
        }
    } catch (error) {
        sendError(res, 'Authentication failed', 500);
    }
};
