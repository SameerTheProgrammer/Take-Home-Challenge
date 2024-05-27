import express, { RequestHandler } from "express";
import { login, register } from "../controllers/authController";
import {
    loginValidation,
    registerValidation,
} from "./../validators/authValidator";

const router = express.Router();

router.route("/").post(registerValidation, register as RequestHandler);
router.route("/login").post(loginValidation, login as RequestHandler);

export default router;
