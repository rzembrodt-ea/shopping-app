import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_KEY
});
const model = 'gemini-2.5-flash';
export async function getGeminiContent(request) {
    if (!request || request.trim().length === 0)
        return '';
    const response = await ai.models.generateContent({
        model: model,
        contents: request,
    });
    return response.text;
}
