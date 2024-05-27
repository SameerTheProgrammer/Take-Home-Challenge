import { Request } from "express";

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
