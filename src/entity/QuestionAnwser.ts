import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    UpdateDateColumn,
    CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { ChatFolder } from "./ChatFolder";

@Entity()
export class QuestionAnswer {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    question: string;

    @Column()
    answer: string;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => ChatFolder, (folder) => folder.chunkEmbeddings)
    chatFolder: ChatFolder;

    @CreateDateColumn()
    createdAt: number;

    @UpdateDateColumn()
    updatedAt: number;
}
