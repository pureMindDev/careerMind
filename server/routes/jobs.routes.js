import { Router } from "express";
import * as jobsController from "../controllers/jobs.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";
import { validate } from "../middleware/validate.js";
import { jobMatchRequestSchema, createJobSchema } from "../validators/jobs.validator.js";

const router = Router();

router.get("/", asyncHandler(jobsController.list));
router.post("/matches", requireAuth, validate(jobMatchRequestSchema), asyncHandler(jobsController.matches));
router.post("/", requireAuth, requireAdmin, validate(createJobSchema), asyncHandler(jobsController.create));

export default router;
