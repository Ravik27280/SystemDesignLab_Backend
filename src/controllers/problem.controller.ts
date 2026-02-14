import { Request, Response } from 'express';
import problemService from '../services/problem.service';
import { sendSuccess, sendError } from '../utils/response.util';

export class ProblemController {
    async getAllProblems(req: Request, res: Response): Promise<void> {
        try {
            const userRole = req.user?.role || 'free';
            const problems = await problemService.getAllProblems(userRole);
            sendSuccess(res, problems);
        } catch (error: any) {
            sendError(res, error.message, 500);
        }
    }

    async getProblemById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const userRole = req.user?.role || 'free';
            const problem = await problemService.getProblemById(id, userRole);
            sendSuccess(res, problem);
        } catch (error: any) {
            const statusCode = error.message.includes('not found') ? 404 :
                error.message.includes('subscription') ? 403 : 500;
            sendError(res, error.message, statusCode);
        }
    }
}

export default new ProblemController();
