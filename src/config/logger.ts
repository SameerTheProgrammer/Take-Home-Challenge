import winston from "winston";
import env from "./dotenv";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.File({
            dirname: "logs",
            filename: "combined.log",
            level: "info",
            silent: env.NODE_ENV == "test",
        }),
        new winston.transports.File({
            dirname: "logs",
            filename: "error.log",
            level: "error",
            silent: env.NODE_ENV == "test",
        }),
        new winston.transports.Console({
            level: "info",
            silent: env.NODE_ENV == "test",
        }),
    ],
});

export default logger;
