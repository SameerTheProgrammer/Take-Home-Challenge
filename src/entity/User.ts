import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ChatFolder } from "./ChatFolder";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => ChatFolder, (folder) => folder.user)
    chatFolders: ChatFolder[];
}
