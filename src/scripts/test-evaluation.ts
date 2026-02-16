
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model';
import Problem from '../models/Problem.model';
import Design from '../models/Design.model';
import EvaluationService from '../services/evaluation.service';
import { logger } from '../utils/logger.util';

dotenv.config();

const testEvaluation = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/systemdesignlab');
        logger.info('Connected to MongoDB');

        const user = await User.findOne({ email: 'pro@example.com' });
        if (!user) {
            logger.error('User not found');
            return;
        }

        const problem = await Problem.findOne({ title: 'Design URL Shortener' });
        if (!problem) {
            logger.error('Problem not found');
            return;
        }

        const design = await Design.findOne({ userId: user._id.toString(), problemId: problem._id.toString() });
        if (!design) {
            logger.error('Design not found');
            return;
        }

        logger.info(`Evaluating design for user: ${user.email}, problem: ${problem.title}`);
        const result = await EvaluationService.evaluateDesign(design._id.toString(), problem._id.toString());

        console.log('\nEvaluation Result:');
        console.log(JSON.stringify(result, null, 2));

    } catch (error) {
        logger.error('Evaluation failed:', error);
    } finally {
        await mongoose.disconnect();
    }
};

testEvaluation();
