import { Request, Response } from 'express';
import leaderboardService from '../services/leaderboard.service';
import { sendSuccess, sendError } from '../utils/response.util';

export class LeaderboardController {
    async getLeaderboard(req: Request, res: Response): Promise<void> {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
            const leaderboard = await leaderboardService.getGlobalLeaderboard(limit);
            sendSuccess(res, leaderboard);
        } catch (error: any) {
            sendError(res, error.message, 500);
        }
    }

    async getUserRank(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                sendError(res, 'Authentication required', 401);
                return;
            }

            const rankData = await leaderboardService.getUserRank(req.user.userId);
            sendSuccess(res, rankData);
        } catch (error: any) {
            sendError(res, error.message, 500);
        }
    }
}

export default new LeaderboardController();
