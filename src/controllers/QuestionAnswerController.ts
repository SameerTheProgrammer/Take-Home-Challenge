import { NextFunction, Request, Response } from "express";
import { generateEmbedding } from "../utils/embedding";
import { QuestionAnswer } from "../entity/QuestionAnwser";
import { AppDataSource } from "../config/data-source";
import { ChatFolder } from "./../entity/ChatFolder";
import createHttpError from "http-errors";
import { findTop3SimilarChunks } from "../utils/similaritySearch";
import { getResponse } from "../utils/getResponse";
import { AuthMiddlewareProps } from "../utils/types";

interface ICQuestionAndAnswerRequest extends AuthMiddlewareProps {
    body: {
        question: string;
    };
}

const chatFolderRepository = AppDataSource.getRepository(ChatFolder);
const questionAnswerRepository = AppDataSource.getRepository(QuestionAnswer);

export const createQuestionAndAnswer = async (
    req: ICQuestionAndAnswerRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { question } = req.body;
        const { id } = req.params;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const questionEmbedding = await generateEmbedding(question);
        const chatfolder = await chatFolderRepository.findOne({
            where: { id: id },
        });

        if (!chatfolder) {
            const error = createHttpError(400, "ChatFolder not found");
            return next(error);
        }
        if (chatfolder.status === "creating") {
            const error = createHttpError(400, "wait for some second");
            return next(error);
        }

        if (chatfolder.status === "failed") {
            const error = createHttpError(400, "ChatFolder is faied to create");
            return next(error);
        }
        const top3SimilarChunk = await findTop3SimilarChunks(
            questionEmbedding,
            id,
        );
        const context = top3SimilarChunk
            .map((chunk, index) => `Chunk ${index + 1}: ${chunk}`)
            .join("\n");

        const answer = await getResponse(context, question);
        const newQA = questionAnswerRepository.create({
            question: question,
            answer: answer,
            chatFolder: chatfolder,
            user: req.user,
        });
        await questionAnswerRepository.save(newQA);
        res.json({ answer });
    } catch (error) {
        return next(error);
    }
};

export const getAllQuestionAnswerOneFolder = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;

        const chatFolder = await chatFolderRepository.findOne({
            where: { id },
        });

        if (!chatFolder) {
            const error = createHttpError(400, "ChatFolder not found");
            return next(error);
        }

        if (chatFolder.status === "creating") {
            const error = createHttpError(400, "wait for some second");
            return next(error);
        }

        if (chatFolder.status === "failed") {
            const error = createHttpError(400, "ChatFolder is faied to create");
            return next(error);
        }

        const allQuestion = await questionAnswerRepository.find({
            where: { chatFolder: { id: id } },
        });

        res.json({ allQuestion });
    } catch (error) {
        return next(error);
    }
};
