import { GoogleGenerativeAI } from "@google/generative-ai";
import env from "../config/dotenv";

const configuration = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const modelId = "gemini-pro";
const model = configuration.getGenerativeModel({ model: modelId });

export const generateGeminiResponse = async (
    question: string,
    context: string,
) => {
    const prompt = `Here is some context: ${context}\\n\\nAnswer the question on the basic of context: ${question}\\n\\nNote:- Don't not add any thing by own just give reponse on the basis of given context`;
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return response;
};
