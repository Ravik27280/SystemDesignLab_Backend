import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'SystemDesignLab API',
        version: '1.0.0',
        description: 'API documentation for SystemDesignLab - A SaaS platform for practicing system design',
        contact: {
            name: 'API Support',
        },
    },
    servers: [
        {
            url: `http://localhost:${env.PORT}`,
            description: 'Development server',
        },
        {
            url: 'https://api.systemdesignlab.com',
            description: 'Production server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Enter your JWT token in the format: Bearer <token>',
            },
        },
        schemas: {
            User: {
                type: 'object',
                properties: {
                    id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    role: { type: 'string', enum: ['free', 'pro'], example: 'free' },
                },
            },
            Problem: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                    title: { type: 'string', example: 'Design URL Shortener' },
                    difficulty: { type: 'string', enum: ['Easy', 'Medium', 'Hard'], example: 'Easy' },
                    description: { type: 'string', example: 'Design a URL shortening service...' },
                    functionalRequirements: { type: 'array', items: { type: 'string' } },
                    nonFunctionalRequirements: { type: 'array', items: { type: 'string' } },
                    scale: {
                        type: 'object',
                        properties: {
                            users: { type: 'string', example: '1 million users' },
                            requests: { type: 'string', example: '1000 req/sec' },
                            data: { type: 'string', example: '100 million URLs' },
                        },
                    },
                    isPro: { type: 'boolean', example: false },
                    createdAt: { type: 'string', format: 'date-time' },
                },
            },
            Design: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                    userId: { type: 'string', example: '507f1f77bcf86cd799439011' },
                    problemId: { type: 'string', example: '507f1f77bcf86cd799439011' },
                    nodes: { type: 'array', items: { type: 'object' } },
                    edges: { type: 'array', items: { type: 'object' } },
                    evaluationResult: {
                        type: 'object',
                        properties: {
                            strengths: { type: 'array', items: { type: 'string' } },
                            risks: { type: 'array', items: { type: 'string' } },
                            criticalIssues: { type: 'array', items: { type: 'string' } },
                            optimizations: { type: 'array', items: { type: 'string' } },
                        },
                    },
                    createdAt: { type: 'string', format: 'date-time' },
                },
            },
            Error: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'Error message' },
                    message: { type: 'string', example: 'Additional details' },
                },
            },
            Success: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'object' },
                    message: { type: 'string', example: 'Operation successful' },
                },
            },
        },
    },
    tags: [
        { name: 'Authentication', description: 'User authentication endpoints' },
        { name: 'Problems', description: 'System design problem endpoints' },
        { name: 'Designs', description: 'User design submission endpoints' },
        { name: 'Evaluation', description: 'AI evaluation endpoints' },
        { name: 'Health', description: 'Health check endpoint' },
    ],
};

const options = {
    definition: swaggerDefinition,
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);
