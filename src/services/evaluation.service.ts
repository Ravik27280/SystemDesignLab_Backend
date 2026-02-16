import Design from '../models/Design.model';
import Problem from '../models/Problem.model';
import { IEvaluationResult } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger.util';

export class EvaluationService {
    private genAI: GoogleGenerativeAI | null = null;

    constructor() {
        // Initialize Gemini AI if API key is available
        if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
            this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            logger.info('✅ Gemini AI initialized successfully');
        } else {
            logger.warn('⚠️  Gemini API key not found - using mock evaluations');
        }
    }

    /**
     * Evaluate a system design using Gemini AI
     */
    async evaluateDesign(designId: string, problemId: string): Promise<IEvaluationResult> {
        // Fetch design and problem for context
        const design = await Design.findById(designId);
        const problem = await Problem.findById(problemId);

        if (!design || !problem) {
            throw new Error('Design or problem not found');
        }

        // Use AI evaluation if available, otherwise fall back to mock
        let evaluation: IEvaluationResult;

        if (this.genAI) {
            try {
                evaluation = await this.evaluateWithGemini(design, problem);
                logger.info(`✅ AI evaluation completed for design ${designId}`);
            } catch (error: any) {
                logger.error('❌ Gemini AI evaluation failed:', error.message);
                logger.warn('⚠️  Falling back to mock evaluation');
                evaluation = this.getMockEvaluation();
            }
        } else {
            evaluation = this.getMockEvaluation();
        }

        // Store evaluation result in design
        design.evaluationResult = evaluation;
        await design.save();

        return evaluation;
    }

    /**
     * Evaluate design using Gemini AI
     */
    /**
     * Evaluate design using Gemini AI
     */
    private async evaluateWithGemini(design: any, problem: any): Promise<IEvaluationResult> {
        // Use 'gemini-flash-latest' for potentially better availability
        const model = this.genAI!.getGenerativeModel({ model: 'gemini-flash-latest' });

        // Prepare design context
        const componentsSummary = design.nodes.map((node: any) => ({
            type: node.data.nodeType,
            label: node.data.label,
        }));

        const connectionsSummary = design.edges.map((edge: any) => {
            const sourceNode = design.nodes.find((n: any) => n.id === edge.source);
            const targetNode = design.nodes.find((n: any) => n.id === edge.target);
            return {
                from: sourceNode?.data.label || edge.source,
                to: targetNode?.data.label || edge.target,
            };
        });

        const prompt = `You are a senior system design architect. Analyze the following system design and provide detailed, specific feedback.

PROBLEM: ${problem.title}
DESCRIPTION: ${problem.description}

FUNCTIONAL REQUIREMENTS:
${problem.functionalRequirements.map((req: string, i: number) => `${i + 1}. ${req}`).join('\n')}

NON-FUNCTIONAL REQUIREMENTS:
${problem.nonFunctionalRequirements.map((req: string, i: number) => `${i + 1}. ${req}`).join('\n')}

SCALE:
- Users: ${problem.scale.users || 'Not specified'}
- Requests: ${problem.scale.requests || 'Not specified'}
- Data: ${problem.scale.data || 'Not specified'}

DESIGNED ARCHITECTURE:
Components: ${JSON.stringify(componentsSummary, null, 2)}
Connections: ${JSON.stringify(connectionsSummary, null, 2)}

Analyze this architecture and provide feedback in STRICT JSON format with these exact keys:
{
  "score": 0-100 (integer, based on how well requirements are met),
  "strengths": ["list of 3-5 specific positive aspects based on actual components used"],
  "warnings": ["list of 3-5 potential issues or minor concerns"],
  "errors": ["list of 2-4 critical flaws, missing requirements, or single points of failure"],
  "suggestions": ["list of 4-6 concrete improvement suggestions"]
}

IMPORTANT: 
- Be specific and reference actual components in the design (e.g., "Your Redis cache reduces database load")
- Consider the scale requirements when evaluating
- Mention missing critical components for this problem
- Return ONLY valid JSON, no markdown formatting`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Parse JSON response
        try {
            // Remove markdown code blocks if present
            const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const evaluation = JSON.parse(jsonText);

            // Validate structure
            if (typeof evaluation.score !== 'number' || !evaluation.strengths || !evaluation.warnings || !evaluation.errors || !evaluation.suggestions) {
                throw new Error('Invalid evaluation structure');
            }

            return evaluation as IEvaluationResult;
        } catch (parseError) {
            logger.error('Failed to parse Gemini response:', text);
            throw new Error('Invalid AI response format');
        }
    }

    /**
     * Fallback mock evaluation
     */
    private getMockEvaluation(): IEvaluationResult {
        return {
            score: 75,
            strengths: [
                'Good use of load balancer for distributing traffic',
                'Implemented caching layer to reduce database load',
                'Proper separation between frontend and backend services',
                'Use of message queue for asynchronous processing',
            ],
            warnings: [
                'Single point of failure in the database layer',
                'No data replication strategy mentioned',
                'Cache invalidation strategy not clearly defined',
                'Limited monitoring and alerting setup',
            ],
            errors: [
                'Missing database sharding for horizontal scalability',
                'No backup and disaster recovery plan',
                'Authentication service is not horizontally scaled',
            ],
            suggestions: [
                'Consider using CDN for static assets to reduce latency',
                'Add read replicas for the database to handle read-heavy workloads',
                'Implement circuit breaker pattern for external service calls',
                'Use Redis cluster instead of single Redis instance',
                'Add API gateway for rate limiting and request routing',
            ],
        };
    }
}

export default new EvaluationService();
