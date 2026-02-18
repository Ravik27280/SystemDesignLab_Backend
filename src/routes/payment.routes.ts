import express from 'express';
import { authenticate as protect } from '../middlewares/auth.middleware';
import { upgradeToPro } from '../controllers/payment.controller';

const router = express.Router();

/**
 * @swagger
 * /payment/upgrade:
 *   post:
 *     summary: Upgrade user to Pro (Mock)
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully upgraded
 *       401:
 *         description: Unauthorized
 */
router.post('/upgrade', protect, upgradeToPro);

export default router;
