
import dotenv from 'dotenv';
dotenv.config();

const listModels = async () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('No API Key found');
        return;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json() as any;

        if (data.error) {
            console.error('Error listing models:', JSON.stringify(data.error, null, 2));
            return;
        }

        console.log('Available Models:');
        if (data.models) {
            data.models.forEach((m: any) => {
                // Check if it supports generateContent
                const isSupported = m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent');
                if (isSupported) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log('No models found or unexpected format:', data);
        }

    } catch (error) {
        console.error('Fetch error:', error);
    }
};

listModels();
