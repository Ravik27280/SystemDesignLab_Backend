import { Response } from 'express';

interface SuccessResponse<T = any> {
    success: true;
    data: T;
    message?: string;
}

interface ErrorResponse {
    success: false;
    error: string;
    message?: string;
}

export const sendSuccess = <T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = 200
): Response<SuccessResponse<T>> => {
    return res.status(statusCode).json({
        success: true,
        data,
        ...(message && { message }),
    });
};

export const sendError = (
    res: Response,
    error: string,
    statusCode: number = 400,
    message?: string
): Response<ErrorResponse> => {
    return res.status(statusCode).json({
        success: false,
        error,
        ...(message && { message }),
    });
};
