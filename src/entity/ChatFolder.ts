import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { User } from "./User";
import { ChunkEmbedding } from "./ChunkEmbedding";
import { QuestionAnswer } from "./QuestionAnwser";

@Entity()
export class ChatFolder extends BaseEntity {
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

    @ManyToOne(() => User, (user) => user.chatFolders)
    user: User;

    @OneToMany(
        () => ChunkEmbedding,
        (chunkEmbedding) => chunkEmbedding.chatFolder,
    )
    chunkEmbeddings: ChunkEmbedding[];

    @OneToMany(
        () => QuestionAnswer,
        (questionAnswer) => questionAnswer.chatFolder,
    )
    QuestionAnswer: QuestionAnswer[];
}
