import express, { RequestHandler } from "express";
import { register } from "../controllers/authController";
import { registerValidation } from "./../validators/authValidator";

const router = express.Router();

router.route("/").post(registerValidation, register as RequestHandler);

export default router;
