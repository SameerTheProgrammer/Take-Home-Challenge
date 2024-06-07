import { NextFunction, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Folder } from "../entity/Folder";
import { AuthMiddlewareProps, ICreateFolderRequest } from "../utils/types";
import { getPdfUrl, uploadToS3 } from "../utils/awsS3";
import createHttpError from "http-errors";
import pdfQueue from "../bullmq/queue";

const folderRepository = AppDataSource.getRepository(Folder);

export const createFolder = async (
    req: ICreateFolderRequest,
    res: Response,
    next: NextFunction,
) => {
    const { title } = req.body;
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

        // Uploading the pdf into aws s3 bucket and getting pdf url
        const { key } = await uploadToS3(file, userId);
        const url = await getPdfUrl(key);

        const folder = folderRepository.create({
            title,
            status: "creating",
            s3Url: url,
            s3Key: key,
            user: req.user,
        });
        const newFolder = await folderRepository.save(folder);

        // starting Queue for further process
        await pdfQueue.add("pdfQueue", {
            s3Url: url,
            folderId: newFolder.id,
        });

        res.status(201).json({ newFolder });
    } catch (error) {
        return next(error);
    }
};

export const getOneFolder = async (
    req: AuthMiddlewareProps,
    res: Response,
    next: NextFunction,
) => {
    try {
        const folder = await folderRepository.findOne({
            where: { id: req.params.id },
        });
        if (!folder) {
            const error = createHttpError(400, "Folder not found");
            return next(error);
        }
        res.json(folder);
    } catch (error) {
        return next(error);
    }
};

export const getAllSelfFolder = async (
    req: AuthMiddlewareProps,
    res: Response,
    next: NextFunction,
) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: "User is not authenticated" });
    }

    try {
        const allFolders = await folderRepository.find({
            where: { user: { id: userId } },
        });
        res.json(allFolders);
    } catch (error) {
        return next(error);
    }
};
