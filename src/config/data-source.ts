import "reflect-metadata";
import { DataSource } from "typeorm";
import env from "./dotenv";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    // Dont't use this in production. Always keep false
    synchronize: false,
    logging: false,
    entities: ["src/entity/*{ts,js}"],
    migrations: ["src/migration/*{ts,js}"],
    subscribers: [],
});
