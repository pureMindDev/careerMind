import { Router } from "express";
import * as interviewController from "../controllers/interview.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";
import { validate } from "../middleware/validate.js";
import { evaluateAnswerSchema } from "../validators/interview.validator.js";

const router = Router();

router.post("/evaluate", requireAuth, validate(evaluateAnswerSchema), asyncHandler(interviewController.evaluate));
router.get("/history", requireAuth, asyncHandler(interviewController.history));

export default router;
