import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
} from "typeorm";
import { User } from "./User";

@Entity()
export class ChatFolder extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    status: string;

    @Column({ default: "" })
    s3Key: string;

    @Column({ default: "" })
    s3Url: string;

    @Column("jsonb")
    embedding: number[];

    @Column()
    content: string;

    @ManyToOne(() => User, (user) => user.chatFolders)
    user: User;
}
