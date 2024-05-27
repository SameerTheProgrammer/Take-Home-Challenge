import { Request } from "express";
import { User } from "../entity/User";

export interface IResgisterUserRequest extends Request {
    body: {
        name: string;
        email: string;
        password: string;
    };
}

export interface ILoginUserRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}

export interface AuthRequest extends Request {
    id?: string;
}

export interface AuthMiddlewareRequest extends Request {
    cookies: {
        "chat-with-pdf"?: string;
    };
    userId?: string;
    user?: User;
}
