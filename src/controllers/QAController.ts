import { NextFunction, Request, Response } from "express";
import { QuestionAnswer } from "../entity/QuestionAnwser";
import { AppDataSource } from "../config/data-source";
import { Folder } from "../entity/Folder";
import createHttpError from "http-errors";
import { ICQuestionAndAnswerRequest } from "../utils/types";
import {
    generateGeminiEmbedding,
    generateGeminiResponse,
} from "../utils/gemini";
import { findTop3SimilarChunks } from "../utils/utils";

const FolderRepository = AppDataSource.getRepository(Folder);
const questionAnswerRepository = AppDataSource.getRepository(QuestionAnswer);

export const createQuestionAndAnswer = async (
    req: ICQuestionAndAnswerRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { question } = req.body;
        const { id } = req.params;

        // Transforming Question into Embedding for further similarity search
        const questionEmbedding = await generateGeminiEmbedding(question);
        const folder = await FolderRepository.findOne({
            where: { id: id },
        });

        if (!folder) {
            const error = createHttpError(400, "Folder not found");
            return next(error);
        }
        if (folder.status === "creating") {
            const error = createHttpError(400, "wait for some second");
            return next(error);
        }

        if (folder.status === "failed") {
            const error = createHttpError(400, "Folder is failed to create");
            return next(error);
        }

        // Find Top 3 chunks text which high similarity with question text
        const top3SimilarChunk = await findTop3SimilarChunks(
            questionEmbedding,
            id,
        );

        // Joinning all chunk data into one chunk
        const context = top3SimilarChunk
            .map((chunk, index) => `Context ${index + 1}: ${chunk}`)
            .join("\n");

        // making chat history of particular pdf
        const history = await questionAnswerRepository.find({
            where: { folder: { id } },
        });
        const chatHistory = [];
        for (const entity of history) {
            chatHistory.push({
                role: "user",
                parts: [{ text: entity.question }],
            });
            chatHistory.push({
                role: "model",
                parts: [{ text: entity.answer }],
            });
        }

        const answer = await generateGeminiResponse(
            context,
            question,
            chatHistory,
        );

        const newQA = questionAnswerRepository.create({
            question: question,
            answer: answer,
            folder: folder,
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

        const folder = await FolderRepository.findOne({
            where: { id },
        });

        if (!folder) {
            const error = createHttpError(400, "Folder not found");
            return next(error);
        }

        if (folder.status === "creating") {
            const error = createHttpError(400, "wait for some second");
            return next(error);
        }

        if (folder.status === "failed") {
            const error = createHttpError(400, "Folder is faied to create");
            return next(error);
        }

        const allQuestion = await questionAnswerRepository.find({
            where: { folder: { id: id } },
        });

        res.json({ allQuestion });
    } catch (error) {
        return next(error);
    }
};
