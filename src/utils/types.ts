import { Request } from "express";

export interface IResgisterUserRequest extends Request {
    body: {
        name: string;
        email: string;
        password: string;
    };
}
