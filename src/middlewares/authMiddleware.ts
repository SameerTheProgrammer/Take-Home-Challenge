import { Response, NextFunction } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import env from "../config/dotenv";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import { AuthMiddlewareRequest } from "../utils/types";

const userRepository = AppDataSource.getRepository(User);

export const isAuthenticated = async (
    req: AuthMiddlewareRequest,
    res: Response,
    next: NextFunction,
) => {
    const token = req.cookies.chatPDF;

    if (!token) {
        return next(createHttpError(401, "Authentication token is missing"));
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
        const user = await userRepository.findOneBy({ id: decoded.id });

        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.user = user;
        req.userId = user.id;
        next();
    } catch (error) {
        return next(createHttpError(401, "Invalid authentication token"));
    }
};
