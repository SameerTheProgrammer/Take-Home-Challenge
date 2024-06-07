import "reflect-metadata";
import app from "./app";
import env from "./config/dotenv";
import logger from "./config/logger";
import { AppDataSource } from "./config/data-source";

const startServer = async () => {
    const PORT = env.PORT || 8000;
    try {
        await AppDataSource.initialize();
        logger.info("Database connected successfully");

        await AppDataSource.query("CREATE EXTENSION IF NOT EXISTS vector;");

        await AppDataSource.query(`
            ALTER TABLE chunk_embedding
            ALTER COLUMN embedding TYPE vector(768) USING embedding::vector;
        `);

        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}..`);
        });
    } catch (error) {
        if (error instanceof Error) {
            logger.error(error.message);
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        }
    }
};

void startServer();
