import Design from '../models/Design.model';
import Problem from '../models/Problem.model';
import { IEvaluationResult } from '../types';

export class EvaluationService {
    /**
     * TODO: In the future, integrate OpenAI API for real AI-powered evaluation
     * This would involve:
     * 1. Sending the design (nodes & edges) and problem requirements to OpenAI
     * 2. Using GPT-4 to analyze system architecture
     * 3. Getting detailed feedback on scalability, bottlenecks, best practices
     * 4. Storing evaluation results in the Design model
     */
    async evaluateDesign(designId: string, problemId: string): Promise<IEvaluationResult> {
        // Fetch design and problem for context (even though mock doesn't use them yet)
        const design = await Design.findById(designId);
        const problem = await Problem.findById(problemId);

        if (!design || !problem) {
            throw new Error('Design or problem not found');
        }

        // Mock AI evaluation response
        // In production, this would be replaced with actual OpenAI API call
        const mockEvaluation: IEvaluationResult = {
            strengths: [
                'Good use of load balancer for distributing traffic',
                'Implemented caching layer to reduce database load',
                'Proper separation between frontend and backend services',
                'Use of message queue for asynchronous processing',
            ],
            risks: [
                'Single point of failure in the database layer',
                'No data replication strategy mentioned',
                'Cache invalidation strategy not clearly defined',
                'Limited monitoring and alerting setup',
            ],
            criticalIssues: [
                'Missing database sharding for horizontal scalability',
                'No backup and disaster recovery plan',
                'Authentication service is not horizontally scaled',
            ],
            optimizations: [
                'Consider using CDN for static assets to reduce latency',
                'Add read replicas for the database to handle read-heavy workloads',
                'Implement circuit breaker pattern for external service calls',
                'Use Redis cluster instead of single Redis instance',
                'Add API gateway for rate limiting and request routing',
            ],
        };

        // Store evaluation result in design
        design.evaluationResult = mockEvaluation;
        await design.save();

        return mockEvaluation;
    }
}

export default new EvaluationService();
