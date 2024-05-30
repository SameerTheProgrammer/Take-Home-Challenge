/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { ChatFolder } from "../entity/ChatFolder";
import { AuthMiddlewareProps, AuthMiddlewareRequest } from "../utils/types";
import { getPdfUrl, uploadToS3 } from "../utils/awsS3";
import createHttpError from "http-errors";
import axios, { AxiosResponse } from "axios";
import { extractTextFromPDF } from "../utils/pdfParse";
import { splitText } from "../utils/other";
import pdfQueue from "../bullmq/queue";

const chatFolderRepository = AppDataSource.getRepository(ChatFolder);

interface ICreateChatFolderRequest extends AuthMiddlewareRequest {
    body: {
        name: string;
    };
}

export const createChatFolder = async (
    req: ICreateChatFolderRequest,
    res: Response,
    next: NextFunction,
) => {
    const { name } = req.body;
    const userId = req.user?.id;

    try {
        if (!userId) {
            const error = createHttpError(401, "User not authenticated");
            return next(error);
        }

        const file = req.file;
        if (!file || !file.mimetype.startsWith("application/pdf")) {
            const error = createHttpError(400, "Please upload a PDF file");
            return next(error);
        }

        const { key } = await uploadToS3(file, userId);
        const url = await getPdfUrl(key);

        const chatFolder = chatFolderRepository.create({
            name,
            status: "creating",
            embedding: [],
            content: "",
            s3Url: url,
            s3Key: key,
            user: req.user,
        });

        // Make the Axios request with generics
        // const response: AxiosResponse<ArrayBuffer> = await axios.get(
        //     chatFolder.s3Url,
        //     {
        //         responseType: "arraybuffer",
        //     },
        // );
        // const pdfContent: Buffer = Buffer.from(response.data);
        // const text = await extractTextFromPDF(pdfContent);

        // chatFolder.content = text;

        // Split the text into chunks
        // const chunks = splitText(text);

        const newChatFolder = await chatFolderRepository.save(chatFolder);

        await pdfQueue.add("pdfQueue", {
            s3Url: url,
            chatFolderId: newChatFolder.id,
        });

        res.status(201).json({ newChatFolder });
    } catch (error) {
        return next(error);
    }
};

export const getOneChatFolder = async (
    req: AuthMiddlewareProps,
    res: Response,
    next: NextFunction,
) => {
    try {
        const folder = await chatFolderRepository.findOne({
            where: { id: req.params.id },
        });
        if (!folder) {
            const error = createHttpError(400, "ChatFolder not found");
            return next(error);
        }
        res.json(folder);
    } catch (error) {
        return next(error);
    }
};

export const getAllSelfChatFolder = async (
    req: AuthMiddlewareProps,
    res: Response,
    next: NextFunction,
) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        const allFolders = await chatFolderRepository.find({
            where: { user: { id: userId } },
            // relations: ["user"], // Ensures that the user relationship is loaded
        });
        res.json(allFolders);
    } catch (error) {
        return next(error);
    }
};
