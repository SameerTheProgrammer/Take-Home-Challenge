import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    UpdateDateColumn,
    CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Folder } from "./Folder";

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

    @ManyToOne(() => Folder, (folder) => folder.chunkEmbeddings)
    folder: Folder;

    @CreateDateColumn()
    createdAt: number;

    @UpdateDateColumn()
    updatedAt: number;
}
