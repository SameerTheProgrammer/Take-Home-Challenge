import { NextFunction, Response } from "express";
import { ILoginUserRequest, IResgisterUserRequest } from "../utils/types";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import createHttpError from "http-errors";
import logger from "../config/logger";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";

const userRepository = AppDataSource.getRepository(User);

export const register = async (
    req: IResgisterUserRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        // express validation initization
        const result = validationResult(req);

        /* Checking that is there is any error in express
                     validation array while validating the req.body data */
        if (!result.isEmpty()) {
            return res.status(400).json({
                errors: result.array(),
            });
        }

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
        return next(error);
    }
};

export const login = async (
    req: ILoginUserRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        // express validation initization
        const result = validationResult(req);

        /* Checking that is there is any error in express
                     validation array while validating the req.body data */
        if (!result.isEmpty()) {
            return res.status(400).json({
                errors: result.array(),
            });
        }

        const { email, password } = req.body;

        logger.info("New request to login a user", {
            email,
            password: "*****",
        });

        const isUserExits = await userRepository.findOne({ where: { email } });
        if (!isUserExits) {
            const error = createHttpError(
                400,
                "Email or Password is incorrect",
            );
            return next(error);
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            isUserExits.password,
        );
        if (!isPasswordCorrect) {
            const error = createHttpError(
                400,
                "Email or Password is incorrect",
            );
            return next(error);
        }

        logger.info("User has been logged in", { id: isUserExits.id });

        res.status(200).json({
            message: "You are logged in in your account",
            id: isUserExits.id,
        });
    } catch (error) {
        return next(error);
    }
};
