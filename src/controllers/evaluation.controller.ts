import { Request, Response } from 'express';
import evaluationService from '../services/evaluation.service';
import { sendSuccess, sendError } from '../utils/response.util';

export class EvaluationController {
    async evaluateDesign(req: Request, res: Response): Promise<void> {
        try {
            const { designId, problemId } = req.body;
            const evaluation = await evaluationService.evaluateDesign(designId, problemId);
            sendSuccess(res, evaluation, 'Design evaluated successfully');
        } catch (error: any) {
            const statusCode = error.message.includes('not found') ? 404 : 500;
            sendError(res, error.message, statusCode);
        }
    }
}

export default new EvaluationController();
