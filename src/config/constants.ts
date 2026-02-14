export const APP_NAME = 'SystemDesignLab';

export const USER_ROLES = {
    FREE: 'free',
    PRO: 'pro',
} as const;

export const SUBSCRIPTION_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    CANCELLED: 'cancelled',
} as const;

export const DIFFICULTY_LEVELS = {
    EASY: 'Easy',
    MEDIUM: 'Medium',
    HARD: 'Hard',
} as const;

export const RATE_LIMIT_CONFIG = {
    GENERAL: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100,
    },
    AUTH: {
        windowMs: 15 * 60 * 1000,
        max: 5,
    },
    EVALUATION: {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 10,
    },
};
