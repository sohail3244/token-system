import { Router } from "express";
import authRoutes from "./auth.routes.js";
import planRoutes from "./plan.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/plans", planRoutes);

export default router;