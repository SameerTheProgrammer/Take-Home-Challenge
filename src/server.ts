import app from "./app";
import env from "./config/dotenv";
import logger from "./config/logger";

const startServer = () => {
    const PORT = env.PORT || 8000;

    try {
        app.listen(PORT, () => {
            logger.info(`server is running on port ${PORT}..`);
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

startServer();
