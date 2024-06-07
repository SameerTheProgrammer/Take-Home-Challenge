import express, { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "./config/logger";
import authRoutes from "./routes/authRoutes";
import folderRoutes from "./routes/folderRoute";
import questionAnswerRoutes from "./routes/QA";
import "./bullmq/worker/processPdf";

// Initialize Express app
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/question", questionAnswerRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/folder", folderRoutes);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) {
        logger.error(err.message);
        const statusCode = err.statusCode || err.status || 500;

        res.status(statusCode).json({
            error: [
                {
                    type: err.name,
                    msg: err.message,
                    path: "",
                    location: "",
                },
            ],
        });
    }
});

export default app;
