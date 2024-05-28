import { RequestHandler, Router } from "express";
// import multer from 'multer';
import {
    createChatFolder,
    getAllSelfChatFolder,
    getOneChatFolder,
} from "../controllers/chatFolderController";
import { isAuthenticated } from "../middlewares/authMiddleware";
import { upload } from "../config/multer";

const router = Router();

router
    .post(
        "/",
        isAuthenticated as RequestHandler,
        upload.single("pdf"),
        createChatFolder as RequestHandler,
    )
    .get(
        "/",
        isAuthenticated as RequestHandler,
        getAllSelfChatFolder as RequestHandler,
    );

router
    .route("/:id")
    .get(isAuthenticated as RequestHandler, getOneChatFolder as RequestHandler);

export default router;
