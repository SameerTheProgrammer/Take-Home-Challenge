import { NextFunction, Response } from "express";
import {
    AuthRequest,
    ILoginUserRequest,
    IResgisterUserRequest,
} from "../utils/types";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import env from "../config/dotenv";

const userRepository = AppDataSource.getRepository(User);

export const register = async (
    req: IResgisterUserRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({
                errors: result.array(),
            });
        }

        const { name, email, password } = req.body;

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

        // const token = jwt.sign(user.id,env.JWT_SECRET)
        const token = jwt.sign({ id: String(user.id) }, env.JWT_SECRET, {
            expiresIn: env.JWT_TOKEN_EXPIRY_DAYS,
        });

        res.cookie("chatPDF", token, {
            maxAge: env.COOKIE_MAXAGE_DAYS * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

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
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({
                errors: result.array(),
            });
        }

        const { email, password } = req.body;

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

        // const token = jwt.sign(user.id,env.JWT_SECRET)
        const token = jwt.sign({ id: String(isUserExits.id) }, env.JWT_SECRET, {
            expiresIn: env.JWT_TOKEN_EXPIRY_DAYS,
        });

        res.cookie("chatPDF", token, {
            maxAge: env.COOKIE_MAXAGE_DAYS * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        res.status(200).json({
            message: "You are loggedIn in your account",
            id: isUserExits.id,
        });
    } catch (error) {
        return next(error);
    }
};

export const logout = (req: AuthRequest, res: Response) => {
    res.clearCookie("chatPDF");
    res.status(200).json({
        message: "You are logout",
    });
};
