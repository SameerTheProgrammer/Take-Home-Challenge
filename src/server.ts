import express from "express";
import env from "./config/dotenv";

// Initialize Express app
const app = express();

const startServer = () => {
    const PORT = env.PORT || 8000;

    try {
        app.listen(PORT, () => {
            // eslint-disable-next-line no-console
            console.log(`server is running on port ${PORT}..`);
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        process.exit(1);
    }
};

startServer();
