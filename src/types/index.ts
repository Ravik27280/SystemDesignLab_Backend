export interface IUser {
    name: string;
    email: string;
    password: string;
    role: 'free' | 'pro';
    subscriptionStatus: 'active' | 'inactive' | 'cancelled';
    createdAt: Date;
}

export interface IProblem {
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    description: string;
    functionalRequirements: string[];
    nonFunctionalRequirements: string[];
    scale: {
        users?: string;
        requests?: string;
        data?: string;
    };
    isPro: boolean;
    createdAt: Date;
}

export interface IDesign {
    userId: string;
    problemId: string;
    nodes: any[];
    edges: any[];
    evaluationResult?: IEvaluationResult;
    createdAt: Date;
    updatedAt: Date;
}

export interface IEvaluationResult {
    strengths: string[];
    risks: string[];
    criticalIssues: string[];
    optimizations: string[];
}
