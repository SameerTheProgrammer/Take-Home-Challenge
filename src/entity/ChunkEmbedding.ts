import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ChatFolder } from "./ChatFolder";
// import { ChatFolder } from "./ChatFolder";

@Entity("chunk_embedding")
export class ChunkEmbedding {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    chunk: string;

    @Column() // change string to vector using typeorm query
    embedding: string;

    @ManyToOne(() => ChatFolder, (folder) => folder.chunkEmbedding)
    chatFolders: ChatFolder;
}
