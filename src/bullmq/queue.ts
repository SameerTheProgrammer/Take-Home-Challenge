import { Queue } from "bullmq";
import redisConnection from "./../config/redis";

// export const pdfQueue = new Queue("pdfQueue");
const pdfQueue = new Queue("pdfQueue", { connection: redisConnection });

export default pdfQueue;
