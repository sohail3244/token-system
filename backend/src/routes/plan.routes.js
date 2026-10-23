import { Router } from "express";

import PlanController from "../controllers/plan.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import { validateCreatePlan } from "../validations/plan.validation.js";

const router = Router();

// POST /api/plans
router.post(
  "/",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN"),
  validateCreatePlan,
  PlanController.createPlan,
);

export default router;
