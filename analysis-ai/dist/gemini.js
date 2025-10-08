import { GoogleGenAI } from "@google/genai";
const model = 'gemini-2.5-flash';
export class GeminiModel {
    apiKey;
    ai;
    constructor(apiKey) {
        if (!apiKey || apiKey.trim().length === 0) {
            throw new Error('A Gemini API key is required.');
        }
        this.apiKey = apiKey;
        this.ai = new GoogleGenAI({ apiKey });
    }
    async getGeminiContent(request) {
        if (!request || request.trim().length === 0)
            return '';
        const response = await this.ai.models.generateContent({
            model: model,
            contents: request,
        });
        if (response.usageMetadata) {
            console.log(`Usage: \n:${JSON.stringify(response.usageMetadata)}`);
        }
        return response.text;
    }
}
