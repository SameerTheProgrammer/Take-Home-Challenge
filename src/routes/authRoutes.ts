import express, { RequestHandler } from "express";
import { register } from "../controllers/authController";

const router = express.Router();

router.route("/").post(register as RequestHandler);

export default router;
