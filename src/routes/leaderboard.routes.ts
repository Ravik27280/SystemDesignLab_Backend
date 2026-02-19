import { Router } from 'express';
import leaderboardController from '../controllers/leaderboard.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /leaderboard:
 *   get:
 *     summary: Get global leaderboard
 *     tags: [Leaderboard]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of users to return
 *     responses:
 *       200:
 *         description: List of top users
 */
router.get('/', leaderboardController.getLeaderboard);

/**
 * @swagger
 * /leaderboard/rank:
 *   get:
 *     summary: Get current user's rank and stats
 *     tags: [Leaderboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User rank and total score
 */
router.get('/rank', authenticate, leaderboardController.getUserRank);

export default router;
