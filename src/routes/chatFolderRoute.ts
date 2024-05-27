import { RequestHandler, Router } from "express";
import {
    createChatFolder,
    getAllSelfChatFolder,
} from "../controllers/chatFolderController";
import { isAuthenticated } from "../middlewares/authMiddleware";

const router = Router();

router
    .post(
        "/",
        isAuthenticated as RequestHandler,
        createChatFolder as RequestHandler,
    )
    .get(
        "/",
        isAuthenticated as RequestHandler,
        getAllSelfChatFolder as RequestHandler,
    );

router
    .route("/id")
    .get(
        "/",
        isAuthenticated as RequestHandler,
        getAllSelfChatFolder as RequestHandler,
    );

export default router;
