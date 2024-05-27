import { Response, NextFunction, Request } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import env from "../config/dotenv";

interface AuthRequest extends Request {
    cookies: {
        "chat-with-pdf"?: string;
    };
    userId?: string;
}

export const isAuthenticated = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    const token = req.cookies["chat-with-pdf"];

    if (!token) {
        return next(createHttpError(401, "Authentication token is missing"));
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
        req.userId = decoded.id;
        next();
    } catch (error) {
        return next(createHttpError(401, "Invalid authentication token"));
    }
};
