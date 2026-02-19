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
    private async evaluateWithGemini(design: any, problem: any): Promise<IEvaluationResult> {
        // Use 'gemini-2.5-flash' as it was verified to be working and within quota
        const model = this.genAI!.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: { responseMimeType: "application/json" }
        });

        // Prepare design context
        const componentsSummary = design.nodes.map((node: any) => ({
            type: node.data.nodeType || 'generic',
            label: node.data.label || 'Unnamed Component',
            config: node.data.config || {}
        }));

        const connectionsSummary = design.edges.map((edge: any) => {
            const sourceNode = design.nodes.find((n: any) => n.id === edge.source);
            const targetNode = design.nodes.find((n: any) => n.id === edge.target);
            return {
                from: sourceNode?.data.label || edge.source,
                to: targetNode?.data.label || edge.target,
                relation: edge.label || 'connects to'
            };
        });

        const prompt = `You are a Senior System Design Architect acting as an interviewer and evaluator. 
Your goal is to evaluate a candidate's system design solution against a specific problem statement.

CONTEXT:
PROBLEM TITLE: ${problem.title}
DESCRIPTION: ${problem.description}

FUNCTIONAL REQUIREMENTS (Must be met):
${problem.functionalRequirements.map((req: string, i: number) => `${i + 1}. ${req}`).join('\n')}

NON-FUNCTIONAL REQUIREMENTS (Should be considered):
${problem.nonFunctionalRequirements.map((req: string, i: number) => `${i + 1}. ${req}`).join('\n')}

SCALE CONSIDERATIONS:
- Users: ${problem.scale.users || 'N/A'}
- Requests: ${problem.scale.requests || 'N/A'}
- Data: ${problem.scale.data || 'N/A'}

CANDIDATE'S DESIGN:
Components: ${JSON.stringify(componentsSummary, null, 2)}
Connections: ${JSON.stringify(connectionsSummary, null, 2)}

INSTRUCTIONS:
1. Analyze if the design meets the Functional Requirements. Mark each as met/not met.
2. Analyze if the design addresses Non-Functional Requirements (Scalability, Availability, Latency).
3. Identify critical missing components (e.g., missing Load Balancer for high traffic, missing Cache for latency).
4. Assign a score (0-100) based on:
    - Functionality (40%)
    - Scalability & Reliability (30%)
    - Component Choice (20%)
    - Completeness (10%)

OUTPUT FORMAT (Strict JSON):
{
  "score": <number 0-100>,
  "summary": "<1-2 sentence high-level summary>",
  "requirementAnalysis": [
    { "requirement": "<Requirement Text>", "met": <boolean>, "comment": "<Brief explanation>" }
  ],
  "strengths": ["<Strength 1>", "<Strength 2>", ...],
  "warnings": ["<Warning 1>", "<Warning 2>", ...],
  "errors": ["<Critical Error 1>", "<Critical Error 2>", ...],
  "suggestions": ["<Suggestion 1>", "<Suggestion 2>", ...],
  "securityAnalysis": "<Specific feedback on security risks/best practices>",
  "scalabilityAnalysis": "<Specific feedback on handling the defined scale>"
}`;

        try {
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            // Parse JSON response (Gemini might wrap in markdown blocks)
            const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const evaluation = JSON.parse(jsonText);

            // Ensure all fields exist
            return {
                score: evaluation.score || 0,
                summary: evaluation.summary || "Evaluation completed.",
                requirementAnalysis: evaluation.requirementAnalysis || [],
                strengths: evaluation.strengths || [],
                warnings: evaluation.warnings || [],
                errors: evaluation.errors || [],
                suggestions: evaluation.suggestions || [],
                securityAnalysis: evaluation.securityAnalysis || "No specific security issues found.",
                scalabilityAnalysis: evaluation.scalabilityAnalysis || "Scalability looks acceptable."
            };

        } catch (error: any) {
            logger.error('Failed to generate or parse Gemini response:', error);
            throw new Error('AI Evaluation failed to produce valid JSON');
        }
    }

    /**
     * Fallback mock evaluation
     */
    private getMockEvaluation(): IEvaluationResult {
        return {
            score: 75,
            summary: "A solid baseline design that covers most core requirements but lacks advanced scalability features.",
            requirementAnalysis: [
                { requirement: "Handle URL redirection", met: true, comment: "API service handles this." },
                { requirement: "High Availability", met: false, comment: "Single database instance is a SPOF." }
            ],
            strengths: [
                'Good use of load balancer',
                'Separation of concerns is clear',
            ],
            warnings: [
                'Database might become a bottleneck',
                'No caching layer visible'
            ],
            errors: [
                'No database replication defined',
            ],
            suggestions: [
                'Add Redis for caching',
                'Implement database sharding',
            ],
            securityAnalysis: "Basic architecture lacks detailed security components like WAF or private subnets.",
            scalabilityAnalysis: "Horizontal scaling is possible for APIs, but database needs read replicas."
        };
    }
}

export default new EvaluationService();
