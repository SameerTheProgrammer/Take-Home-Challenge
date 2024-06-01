/* eslint-disable @typescript-eslint/no-unused-vars */
import { AppDataSource } from "../config/data-source";
import { ChunkEmbedding } from "../entity/ChunkEmbedding";

export const findTop3SimilarChunks = async (
    queryEmbedding: number[],
    chatFolderId: string,
) => {
    const connection = AppDataSource;
    const questionEmbedding = JSON.stringify(queryEmbedding);

    // Assuming queryEmbedding is already in the correct format (number array)
    const results: ChunkEmbedding[] = await connection
        .getRepository(ChunkEmbedding)
        .createQueryBuilder("chunk")
        // .where("chatFolderId = :chatFolderId", { chatFolderId })
        .orderBy("(chunk.embedding <=> :queryEmbedding)", "ASC") // Order by similarity
        .setParameter("queryEmbedding", questionEmbedding)
        .limit(2)
        .getMany();
    const result = results.map((result: ChunkEmbedding) => result.chunk);
    return result;
};
