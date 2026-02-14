import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response.util';

export class AuthController {
    async register(req: Request, res: Response): Promise<void> {
        try {
            const result = await authService.register(req.body);
            sendSuccess(res, result, 'User registered successfully', 201);
        } catch (error: any) {
            sendError(res, error.message, 400);
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const result = await authService.login(req.body);
            sendSuccess(res, result, 'Login successful');
        } catch (error: any) {
            sendError(res, error.message, 401);
        }
    }
}

export default new AuthController();
