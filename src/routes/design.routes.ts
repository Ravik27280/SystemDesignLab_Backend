import { Router } from 'express';
import designController from '../controllers/design.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { designSchema } from '../validators/design.validator';

const router = Router();

/**
 * @swagger
 * /api/designs:
 *   post:
 *     summary: Create a new design submission
 *     tags: [Designs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - problemId
 *             properties:
 *               problemId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               nodes:
 *                 type: array
 *                 items:
 *                   type: object
 *                 example: [{"id": "1", "type": "database", "position": {"x": 100, "y": 100}}]
 *               edges:
 *                 type: array
 *                 items:
 *                   type: object
 *                 example: [{"id": "e1-2", "source": "1", "target": "2"}]
 *     responses:
 *       201:
 *         description: Design saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Design'
 *                 message:
 *                   type: string
 *                   example: Design saved successfully
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
 */
router.post(
    '/',
    authenticate,
    validate(designSchema),
    designController.createDesign.bind(designController)
);

/**
 * @swagger
 * /api/designs/user:
 *   get:
 *     summary: Get all designs for the logged-in user
 *     tags: [Designs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user designs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Design'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
    '/user',
    authenticate,
    designController.getUserDesigns.bind(designController)
);

/**
 * @swagger
 * /api/designs/{id}:
 *   get:
 *     summary: Get a specific design by ID
 *     tags: [Designs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Design ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Design details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Design'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Design not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
    '/:id',
    authenticate,
    designController.getDesignById.bind(designController)
);

export default router;
