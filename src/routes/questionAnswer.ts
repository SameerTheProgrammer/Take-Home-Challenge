import { RequestHandler, Router } from "express";
import { isAuthenticated } from "../middlewares/authMiddleware";
import {
    createQuestionAndAnswer,
    getAllQuestionAnswerOneFolder,
} from "../controllers/QuestionAnswerController";
import { QuestionValidation } from "../validators/questionValidator";

const router = Router();

router
    .post(
        "/:id",
        QuestionValidation,
        isAuthenticated as RequestHandler,
        createQuestionAndAnswer as RequestHandler,
    )
    .get(
        "/:id",
        isAuthenticated as RequestHandler,
        getAllQuestionAnswerOneFolder as RequestHandler,
    );

export default router;
