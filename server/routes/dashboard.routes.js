import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";
import { validate } from "../middleware/validate.js";
import { dashboardStatsRequestSchema } from "../validators/dashboard.validator.js";

const router = Router();

router.post("/stats", requireAuth, validate(dashboardStatsRequestSchema), asyncHandler(dashboardController.stats));

export default router;
