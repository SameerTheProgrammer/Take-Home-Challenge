import createHttpError from "http-errors";
import OpenAI from "openai";
import env from "../config/dotenv";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export const generateEmbedding = async (text: string) => {
    try {
        const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text,
            encoding_format: "float",
        });
        return embedding.data[0].embedding;
    } catch (error: unknown) {
        const err = createHttpError(
            400,
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `error while generating embedding becasue of this error ${error}`,
        );
        throw err;
    }
};
