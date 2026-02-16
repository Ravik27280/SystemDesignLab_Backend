export interface IUser {
    id?: string;
    name: string;
    email: string;
    password: string;
    role: 'free' | 'pro';
    subscriptionStatus: 'active' | 'inactive' | 'cancelled';
    createdAt: Date;
}

export interface IProblem {
    id?: string;
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
    id?: string;
    userId: string;
    problemId: string;
    nodes: any[];
    edges: any[];
    evaluationResult?: IEvaluationResult;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IEvaluationResult {
    score: number;
    strengths: string[];
    warnings: string[];
    errors: string[];
    suggestions: string[];
}
