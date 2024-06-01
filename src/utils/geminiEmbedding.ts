import { GoogleGenerativeAI } from "@google/generative-ai";
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
