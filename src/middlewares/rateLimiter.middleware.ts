import rateLimit from 'express-rate-limit';
import { RATE_LIMIT_CONFIG } from '../config/constants';

export const generalLimiter = rateLimit({
    windowMs: RATE_LIMIT_CONFIG.GENERAL.windowMs,
    max: RATE_LIMIT_CONFIG.GENERAL.max,
    message: {
        success: false,
        error: 'Too many requests, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    windowMs: RATE_LIMIT_CONFIG.AUTH.windowMs,
    max: RATE_LIMIT_CONFIG.AUTH.max,
    message: {
        success: false,
        error: 'Too many authentication attempts, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const evaluationLimiter = rateLimit({
    windowMs: RATE_LIMIT_CONFIG.EVALUATION.windowMs,
    max: RATE_LIMIT_CONFIG.EVALUATION.max,
    message: {
        success: false,
        error: 'Too many evaluation requests, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
