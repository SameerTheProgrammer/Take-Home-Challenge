/* eslint-disable @typescript-eslint/no-unused-vars */
import OpenAI from "openai";
import env from "../config/dotenv";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

// eslint-disable-next-line @typescript-eslint/require-await
export const getResponse = async (context: string, question: string) => {
    // const completion = await openai.chat.completions.create({
    //     messages: [{ role: "system", content: "You are a helpful assistant." }],
    //     model: "gpt-3.5-turbo-16k",
    // });

    return "answer";
};
