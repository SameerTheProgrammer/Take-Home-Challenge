import { Response } from "express";
import { AppDataSource } from "../config/data-source";
import { ChatFolder } from "../entity/ChatFolder";
import { AuthMiddlewareRequest } from "../utils/types";

const chatFolderRepository = AppDataSource.getRepository(ChatFolder);

interface ICreateChatFolderRequest extends AuthMiddlewareRequest {
    body: {
        name: string;
    };
}

export const createChatFolder = async (
    req: ICreateChatFolderRequest,
    res: Response,
) => {
    const { name } = req.body;
    const user = req.user;

    try {
        const chatFolder = chatFolderRepository.create({
            name,
            status: "creating",
            embedding: [],
            content: "",
            user,
        });

        await chatFolderRepository.save(chatFolder);

        res.status(201).json(chatFolder);
    } catch (error) {
        res.status(500).json({ message: "Error creating chatFolder" });
    }
};
