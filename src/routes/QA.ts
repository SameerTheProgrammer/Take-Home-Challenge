import { RequestHandler, Router } from "express";
import { isAuthenticated } from "../middlewares/authMiddleware";
import {
    createQuestionAndAnswer,
    getAllQuestionAnswerOneFolder,
} from "../controllers/QAController";
import { QuestionValidation } from "../validators/validator";

const router = Router();

router.post(
    "/:id",
    QuestionValidation,
    isAuthenticated as RequestHandler,
    createQuestionAndAnswer as RequestHandler,
);
router.get(
    "/:id",
    isAuthenticated as RequestHandler,
    getAllQuestionAnswerOneFolder as RequestHandler,
);

export default router;
