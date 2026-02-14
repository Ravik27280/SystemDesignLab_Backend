import { z } from 'zod';

export const evaluationSchema = z.object({
    designId: z.string().min(1, 'Design ID is required'),
    problemId: z.string().min(1, 'Problem ID is required'),
});

export type EvaluationInput = z.infer<typeof evaluationSchema>;
