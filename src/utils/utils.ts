import pdfParse from "pdf-parse";
import { AppDataSource } from "../config/data-source";
import { ChunkEmbedding } from "../entity/ChunkEmbedding";

export const extractTextFromPDF = async (buffer: Buffer): Promise<string> => {
    const data = await pdfParse(buffer, { max: 5 });
    return data.text.replace(/\n/g, " ");
};

export const splitText = (text: string, chunkSize = 800, overlap = 100) => {
    const chunks = [];
    let start = 0;
    let round = 1;
    while (round < Math.ceil(text.length / chunkSize)) {
        const end = Math.min(start + chunkSize, text.length);
        chunks.push(text.substring(start, end));
        start = end - overlap;
        round += 1;
    }
    return chunks;
};

export const findTop3SimilarChunks = async (
    queryEmbedding: number[],
    folderId: string,
) => {
    const connection = AppDataSource;
    const questionEmbedding = JSON.stringify(queryEmbedding);

    const results: ChunkEmbedding[] = await connection
        .getRepository(ChunkEmbedding)
        .createQueryBuilder("chunk")
        .innerJoin("chunk.folderId", "folderId")
        .where("folderId.id = :folderId", { folderId })
        .orderBy("(chunk.embedding <=> :queryEmbedding)", "ASC") // Order by similarity
        .setParameter("queryEmbedding", questionEmbedding)
        .limit(2)
        .getMany();
    const result = results.map((result: ChunkEmbedding) => result.chunk);
    return result;
};
