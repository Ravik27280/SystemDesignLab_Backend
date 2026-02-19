
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('❌ GEMINI_API_KEY not found in .env');
        process.exit(1);
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Access the model manager (available in some SDK versions) or try a basic request
        // Since listModels isn't directly on GoogleGenerativeAI instance in the node SDK (it's often on a ModelManager or similar),
        // we might have to use the REST API manually if the SDK doesn't expose it easily in this version.
        // However, checking the SDK docs/types is better. 
        // Actually, looking at the error message, it says "Call ListModels".
        // In the Node SDK, it's often unavailable directly on the main class in older versions, but let's try via a simple fetch if SDK fails.
        // Wait, the SDK definitely has it. 
        // It seems newer SDKs might not expose listModels directly on the client instance but via a specific manager.
        // Let's try a direct fetch to the API endpoint to be sure, as it avoids SDK version ambiguity.

        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json() as { models?: any[] };

        if (data.models) {
            console.log('✅ Available Models:');
            data.models.forEach((model: any) => {
                if (model.supportedGenerationMethods?.includes('generateContent')) {
                    console.log(`- ${model.name} (${model.displayName})`);
                }
            });
        } else {
            console.log('❌ No models found or error:', data);
        }

    } catch (error) {
        console.error('❌ Error listing models:', error);
    }
}

listModels();
