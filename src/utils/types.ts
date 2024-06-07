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

export interface AuthMiddlewareProps extends Request {
    userId?: string;
    user?: User;
}

export interface AuthMiddlewareRequest extends AuthMiddlewareProps {
    cookies: {
        chatPDF?: string;
    };
}

export interface ICQuestionAndAnswerRequest extends AuthMiddlewareProps {
    body: {
        question: string;
    };
}

export interface ICreateFolderRequest extends AuthMiddlewareRequest {
    body: {
        title: string;
    };
}

export interface IJobData {
    s3Url: string;
    folderId: string;
}
