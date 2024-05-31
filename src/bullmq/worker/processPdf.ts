/* eslint-disable no-console */
import { Worker, Job, QueueEvents } from "bullmq";
import { ChatFolder } from "../../entity/ChatFolder";
import axios, { AxiosResponse } from "axios";
import { extractTextFromPDF } from "../../utils/pdfParse";
import { splitText } from "../../utils/other";
import { AppDataSource } from "../../config/data-source";
import createHttpError from "http-errors";
import logger from "../../config/logger";
import redisConnection from "../../config/redis";

const chatFolderRepository = AppDataSource.getRepository(ChatFolder);

type jobData = {
    s3Url: string;
    chatFolderId: string;
};

const pdfWorker = new Worker(
    "pdfQueue",
    async (job: Job) => {
        const { s3Url, chatFolderId } = job.data as jobData;

        try {
            // Make the Axios request with generics
            const response: AxiosResponse<ArrayBuffer> = await axios.get(
                s3Url,
                {
                    responseType: "arraybuffer",
                },
            );
            const pdfContent: Buffer = Buffer.from(response.data);

            const text = await extractTextFromPDF(pdfContent);

            // Split the text into chunks
            const chunks = splitText(text);

            console.log("length of chunks", chunks.length);

            const chatFolder = await chatFolderRepository.findOne({
                where: { id: chatFolderId },
            });
            if (!chatFolder) {
                const err = createHttpError(400, "chat folder not found");
                throw err;
            }
            await chatFolderRepository.update(chatFolderId, {
                status: "success",
            });
        } catch (error) {
            console.error("Error processing PDF:", error);
            const chatFolder = await chatFolderRepository.findOne({
                where: { id: chatFolderId },
            });
            if (!chatFolder) {
                const err = createHttpError(400, "chat folder not found");
                throw err;
            }
            await chatFolderRepository.update(chatFolderId, {
                status: "failed",
            });
        }
    },
    { connection: redisConnection },
);

pdfWorker.on("completed", (job) => {
    logger.info(`Job with id ${job.id} has been completed`);
});

pdfWorker.on("failed", (job, err) => {
    logger.info(`Job with id ${job?.id} has failed with ${err.message}`);
});

// Create QueueEvents to listen to queue events like completed and failed jobs
const queueEvents = new QueueEvents("pdfQueue", {
    connection: redisConnection,
});
queueEvents.on("completed", ({ jobId }) => {
    logger.info(`Job ${jobId} has completed!`);
});
queueEvents.on("failed", ({ jobId, failedReason }) => {
    logger.info(`Job ${jobId} has failed with reason: ${failedReason}`);
});

export { pdfWorker, queueEvents };
