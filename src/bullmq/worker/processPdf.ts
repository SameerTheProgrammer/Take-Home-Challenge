/* eslint-disable no-console */
import { Worker, Job } from "bullmq";
import { Folder } from "../../entity/Folder";
import axios, { AxiosResponse } from "axios";
import { extractTextFromPDF, splitText } from "../../utils/utils";
import { AppDataSource } from "../../config/data-source";
import createHttpError from "http-errors";
import logger from "../../config/logger";
import redisConnection from "../../config/redis";
import { ChunkEmbedding } from "../../entity/ChunkEmbedding";
import { generateGeminiEmbedding } from "../../utils/gemini";
import { IJobData } from "../../utils/types";

const FolderRepository = AppDataSource.getRepository(Folder);
const chunkEmbeddingRepository = AppDataSource.getRepository(ChunkEmbedding);

const pdfWorker = new Worker(
    "pdfQueue",
    async (job: Job) => {
        const { s3Url, folderId } = job.data as IJobData;

        const response: AxiosResponse<ArrayBuffer> = await axios.get(s3Url, {
            responseType: "arraybuffer",
        });
        const pdfContent: Buffer = Buffer.from(response.data);

        const text = await extractTextFromPDF(pdfContent);

        // Split the text into chunks
        const chunks = splitText(text);

        const folder = await FolderRepository.findOne({
            where: { id: folderId },
        });
        if (!folder) {
            const err = createHttpError(400, "folder not found");
            throw err;
        }

        // Create vector embeddings for each chunk
        for (let i = 0; i < chunks.length; i++) {
            const embedding = await generateGeminiEmbedding(chunks[i]);
            const newChunkEmbedding = chunkEmbeddingRepository.create({
                chunk: chunks[i],
                embedding: JSON.stringify(embedding),
                folder: folder,
            });
            await chunkEmbeddingRepository.save(newChunkEmbedding);
        }

        await FolderRepository.update(folderId, {
            status: "success",
        });
    },
    { connection: redisConnection },
);

const handleCompletedJob = async (job: Job) => {
    try {
        const { folderId } = job.data as IJobData;
        await FolderRepository.update(folderId, {
            status: "success",
        });
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        logger.info(`Job with id ${job?.id} has failed with ${error}`);
    }
};
pdfWorker.on("completed", (job) => {
    void handleCompletedJob(job);
    logger.info(`Job with id ${job.id} has been completed`);
});

const handleFailedJob = async (job: Job) => {
    try {
        const { folderId } = job.data as IJobData;

        await FolderRepository.update(folderId, {
            status: "failed",
        });
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        logger.info(`Job with id ${job?.id} has failed with ${error}`);
    }
};

pdfWorker.on("failed", (job, err) => {
    void handleFailedJob(job!);
    logger.info(`Job with id ${job?.id} has failed with ${err.message}`);
});

export default pdfWorker;
