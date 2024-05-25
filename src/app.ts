import express, { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import morgan from "morgan";
import csrf from "csurf";
import sanitize from "express-mongo-sanitize";
import logger from "./config/logger";

// Initialize Express app
const app = express();

app.use(express.json());

// All security related middlewares
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(csrf({ cookie: true }));
app.use(hpp());
app.use(morgan("combined"));
app.use(sanitize());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to take-home-challenge site");
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/require-await
app.get("/error", async (req: Request, res: Response, next: NextFunction) => {
    const err = createHttpError(
        401,
        "Hey, you don't have permission to access this page",
    );
    return next(err);
});

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
