import { RequestHandler, Router } from "express";
// import multer from 'multer';
import {
    createFolder,
    getAllSelfFolder,
    getOneFolder,
} from "../controllers/folderController";
import { isAuthenticated } from "../middlewares/authMiddleware";
import { upload } from "../config/multer";

const router = Router();

router.post(
    "/",
    isAuthenticated as RequestHandler,
    upload.single("pdf"),
    createFolder as RequestHandler,
);
router.get(
    "/",
    isAuthenticated as RequestHandler,
    getAllSelfFolder as RequestHandler,
);

router
    .route("/:id")
    .get(isAuthenticated as RequestHandler, getOneFolder as RequestHandler);

export default router;
