import express, { RequestHandler } from "express";
import { login, logout, register } from "../controllers/authController";
import {
    loginValidation,
    registerValidation,
} from "./../validators/authValidator";
import { isAuthenticated } from "../middlewares/authMiddleware";

const router = express.Router();

// Registration route
router.post("/register", registerValidation, register as RequestHandler);

// Login route
router.post("/login", loginValidation, login as RequestHandler);

// Logout route (protected)
router.get("/logout", isAuthenticated, logout as RequestHandler);

export default router;
