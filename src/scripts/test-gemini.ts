
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const testGemini = async () => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        console.log('Using API Key ending in:', process.env.GEMINI_API_KEY?.slice(-4));

        // There is no direct listModels() on the JS SDK instance as per some docs, 
        // but the error message suggests calling ListModels.
        // In @google/generative-ai, we might not have a direct helper for listing models on the main class easily without checking docs.
        // However, we can try a simple generation with a fallback model name

        // Let's try to infer from error or just try a few known ones
        const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-1.0-pro'];

        for (const modelName of models) {
            console.log(`\nTesting model: ${modelName}`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent('Hello world');
                const response = await result.response;
                console.log(`✅ Success with ${modelName}:`, response.text());
                return; // Exit on first success
            } catch (error: any) {
                console.error(`❌ Failed with ${modelName}:`, error.message.split('\n')[0]);
            }
        }

    } catch (error) {
        console.error('Error:', error);
    }
};

testGemini();
