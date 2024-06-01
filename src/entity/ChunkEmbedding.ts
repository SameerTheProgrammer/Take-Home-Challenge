import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ChatFolder } from "./ChatFolder";

@Entity("chunk_embedding")
export class ChunkEmbedding {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    chunk: string;

    @Column()
    embedding: string;

    @ManyToOne(() => ChatFolder, (chatFolder) => chatFolder.chunkEmbeddings)
    chatFolder: ChatFolder;
}
