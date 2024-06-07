import { Content, GoogleGenerativeAI } from "@google/generative-ai";
import env from "../config/dotenv";
import createHttpError from "http-errors";

const configuration = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const modelId = "embedding-001";
const model = configuration.getGenerativeModel({ model: modelId });

export const generateGeminiEmbedding = async (text: string) => {
    try {
        const result = await model.embedContent(text);
        const embedding = result.embedding;
        return embedding.values;
    } catch (error) {
        const err = createHttpError(
            400,
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `error while generating embedding becasue of this error ${error}`,
        );
        throw err;
    }
};

export const generateGeminiResponse = async (
    question: string,
    context: string,
    chatHistory: Content[],
) => {
    const prompt = `You are a helpful and enthusiastic bot designed to answer questions based on the given context. Use the provided information to find the answer. If the answer isn't in the context, say "I'm sorry, I don't know the answer to that." Avoid making up answers. The user question is provided below:

    Context: ${context}
    Question: ${question}
    `;

    const chat = model.startChat({
        history: chatHistory,
        generationConfig: {
            maxOutputTokens: 200,
        },
    });

    const result = await chat.sendMessage(prompt);
    // const result = await model.generateContent(prompt);   // without history
    const response = result.response.text();
    return response;
};
