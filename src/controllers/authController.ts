import { NextFunction, Response } from "express";
import { IResgisterUserRequest } from "../utils/types";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import createHttpError from "http-errors";
import logger from "../config/logger";
import bcrypt from "bcryptjs";

const userRepository = AppDataSource.getRepository(User);

export const register = async (
    req: IResgisterUserRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { name, email, password } = req.body;

        logger.info("New request to register a user", {
            name,
            email,
            password: "*****",
        });

        const isUserExits = await userRepository.findOne({ where: { email } });
        if (isUserExits) {
            const error = createHttpError(400, "Email already exists");
            return next(error);
        }

        // converting normal password to hashed password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = userRepository.create({
            name,
            email,
            password: hashedPassword,
        });
        await userRepository.save(user);

        logger.info("User has been registered", { id: user.id });

        res.status(201).json({
            message: "User registered successfully",
            id: user.id,
        });
    } catch (error) {
        res.status(500).json({ message: "Error registering user" });
    }
};
