import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Folder } from "./Folder";

@Entity("chunk_embedding")
export class ChunkEmbedding {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    chunk: string;

    @Column()
    embedding: string;

    @ManyToOne(() => Folder, (folder) => folder.chunkEmbeddings)
    folder: Folder;
}
