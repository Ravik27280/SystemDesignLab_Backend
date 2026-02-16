import User from '../models/User.model';
import { generateToken } from '../utils/jwt.util';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

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
}

export default new AuthService();
