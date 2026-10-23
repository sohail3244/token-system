import { Router } from "express";
import {
  login,
  me,
  logout,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { validateLogin } from "../validations/auth.validation.js";

const router = Router();

router.post("/login", validateLogin, login);
router.get("/me", authMiddleware, me);
router.post("/logout", authMiddleware, logout);

export default router;