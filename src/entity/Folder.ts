import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { User } from "./User";
import { ChunkEmbedding } from "./ChunkEmbedding";
import { QuestionAnswer } from "./QuestionAnwser";

@Entity()
export class Folder {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column()
    status: string;

    @Column()
    s3Key: string;

    @Column()
    s3Url: string;

    @ManyToOne(() => User, (user) => user.folders)
    user: User;

    @OneToMany(() => ChunkEmbedding, (chunkEmbedding) => chunkEmbedding.folder)
    chunkEmbeddings: ChunkEmbedding[];

    @OneToMany(() => QuestionAnswer, (questionAnswer) => questionAnswer.folder)
    QuestionAnswer: QuestionAnswer[];
}
