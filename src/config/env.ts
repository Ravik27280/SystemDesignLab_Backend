import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
    PORT: number;
    NODE_ENV: string;
    MONGODB_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    CORS_ORIGIN: string;
}

const getEnvVariable = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

export const env: EnvConfig = {
    PORT: parseInt(getEnvVariable('PORT', '5000'), 10),
    NODE_ENV: getEnvVariable('NODE_ENV', 'development'),
    MONGODB_URI: getEnvVariable('MONGODB_URI'),
    JWT_SECRET: getEnvVariable('JWT_SECRET'),
    JWT_EXPIRES_IN: getEnvVariable('JWT_EXPIRES_IN', '7d'),
    CORS_ORIGIN: getEnvVariable('CORS_ORIGIN', 'http://localhost:5173'),
};
