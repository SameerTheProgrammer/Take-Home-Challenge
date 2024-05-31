import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
    OneToMany,
    // OneToMany,
} from "typeorm";
import { User } from "./User";
import { ChunkEmbedding } from "./ChunkEmbedding";

@Entity()
export class ChatFolder extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column()
    status: string;

    @Column({ default: "" })
    s3Key: string;

    @Column({ default: "" })
    s3Url: string;

    @ManyToOne(() => User, (user) => user.chatFolders)
    user: User;

    @OneToMany(
        () => ChunkEmbedding,
        (chunkEmbedding) => chunkEmbedding.chatFolders,
    )
    chunkEmbedding: ChunkEmbedding[];
}
