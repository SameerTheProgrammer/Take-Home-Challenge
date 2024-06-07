import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Folder } from "./Folder";

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

    @OneToMany(() => Folder, (folder) => folder.user)
    folders: Folder[];
}
