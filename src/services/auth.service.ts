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
}

export default new AuthService();
