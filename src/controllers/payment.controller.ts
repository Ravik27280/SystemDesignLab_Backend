import { Request, Response } from 'express';
import User from '../models/User.model';
import { sendSuccess, sendError } from '../utils/response.util';

export const upgradeToPro = async (req: Request, res: Response) => {
    try {
        const userId = req.user.userId;

        // In a real app, verify payment here (Stripe/Razorpay)

        const user = await User.findByIdAndUpdate(
            userId,
            {
                role: 'pro',
                subscriptionStatus: 'active'
            },
            { new: true }
        );

        if (!user) {
            return sendError(res, 'User not found', 404);
        }

        return sendSuccess(res, {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                subscriptionStatus: user.subscriptionStatus
            }
        }, 'Successfully upgraded to Pro');

    } catch (error) {
        return sendError(res, 'Failed to process upgrade', 500);
    }
};
