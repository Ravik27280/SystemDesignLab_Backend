import Problem from '../models/Problem.model';

export class ProblemService {
    async getAllProblems(userRole: 'free' | 'pro') {
        // Free users can only see non-pro problems
        const filter = userRole === 'free' ? { isPro: false } : {};

        const problems = await Problem.find(filter)
            .select('-__v')
            .sort({ createdAt: -1 });

        return problems;
    }

    async getProblemById(problemId: string, userRole: 'free' | 'pro') {
        const problem = await Problem.findById(problemId).select('-__v');

        if (!problem) {
            throw new Error('Problem not found');
        }

        // Check if user has access to pro problem
        if (problem.isPro && userRole === 'free') {
            throw new Error('Pro subscription required to access this problem');
        }

        return problem;
    }
}

export default new ProblemService();
