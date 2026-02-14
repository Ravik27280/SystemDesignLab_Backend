import { Router } from 'express';
import evaluationController from '../controllers/evaluation.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { evaluationSchema } from '../validators/evaluation.validator';
import { evaluationLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

/**
 * @swagger
 * /api/evaluate:
 *   post:
 *     summary: Evaluate a design (Mock AI response)
 *     description: Evaluates a system design and provides feedback. Currently returns mock responses. Future integration with OpenAI planned.
 *     tags: [Evaluation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - designId
 *               - problemId
 *             properties:
 *               designId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               problemId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439012
 *     responses:
 *       200:
 *         description: Design evaluated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     strengths:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Good use of caching layer", "Proper load balancing"]
 *                     risks:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Single point of failure in database"]
 *                     criticalIssues:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Missing data replication"]
 *                     optimizations:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Consider using CDN", "Add read replicas"]
 *                 message:
 *                   type: string
 *                   example: Design evaluated successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Design or problem not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       429:
 *         description: "Too many requests (Rate limit: 10 per hour)"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
    '/',
    authenticate,
    evaluationLimiter,
    validate(evaluationSchema),
    evaluationController.evaluateDesign.bind(evaluationController)
);

export default router;
