import User from '../models/User.model';
import { generateToken } from '../utils/jwt.util';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { IUser } from '../types';

export class AuthService {
    async register(data: RegisterInput) {
        // Check if user already exists
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            throw new Error('Email already registered');
        }

        // Create new user
        const user = await User.create({
            name: data.name,
            email: data.email,
            password: data.password,
        });

        // Generate JWT token
        const token = generateToken(user._id.toString());

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        };
    }

    async login(data: LoginInput) {
        // Find user and include password
        const user = await User.findOne({ email: data.email }).select('+password');
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(data.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Generate JWT token
        const token = generateToken(user._id.toString());

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        };
    }

    async googleLogin(credential: string) {
        // Use the access token to get user info directly
        try {
            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${credential}` },
            });

            if (!response.ok) {
                throw new Error('Failed to verify Google token');
            }

            interface GoogleTokenPayload {
                email: string;
                name: string;
                picture: string;
                given_name: string;
                sub: string;
            }

            const payload = await response.json() as GoogleTokenPayload;

            if (!payload.email) {
                throw new Error('Invalid Google token payload');
            }

            const { email, name, picture } = payload;

            // Check if user exists
            let user = await User.findOne({ email });

            if (!user) {
                // Create new user
                const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

                user = await User.create({
                    name: name || payload.given_name || 'User',
                    email,
                    password: randomPassword,
                    role: 'free' // Default role
                });
            }

            // Generate JWT token
            const token = generateToken(user._id.toString());

            return {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            };
        } catch (error) {
            console.error('Google Auth Error:', error);
            throw new Error('Invalid Google token');
        }
    }
    async updateProfile(userId: string, data: { name?: string }): Promise<IUser> {
        const user = await User.findByIdAndUpdate(userId, data, { new: true });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async upgradeToPro(userId: string): Promise<IUser> {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        user.role = 'pro';
        user.subscriptionStatus = 'active';
        await user.save();

        return user;
    }

    async getUserStats(userId: string): Promise<any> {
        // Import models inline to avoid circular dependencies if any, or just standard import at top
        const Design = require('../models/Design.model').default;
        const Problem = require('../models/Problem.model').default;

        const designsCount = await Design.countDocuments({ userId });

        // Find designs with feedback
        const designs = await Design.find({ userId, 'evaluationResult.score': { $exists: true } });

        const solvedCount = designs.length;
        const totalScore = designs.reduce((acc: number, curr: any) => acc + (curr.evaluationResult?.score || 0), 0);
        const averageScore = solvedCount > 0 ? Math.round(totalScore / solvedCount) : 0;

        return {
            designsCount,
            problemsSolved: solvedCount,
            averageScore
        };
    }
}

export default new AuthService();
