import { RequestHandler, Router } from "express";
import { createChatFolder } from "../controllers/chatFolderController";
import { isAuthenticated } from "../middlewares/authMiddleware";

const router = Router();

router.post(
    "/create",
    isAuthenticated as RequestHandler,
    createChatFolder as RequestHandler,
);

export default router;
