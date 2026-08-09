import { Router } from "express";
import * as roadmapController from "../controllers/roadmap.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";
import { validate } from "../middleware/validate.js";
import { generateRoadmapSchema, updateProgressSchema } from "../validators/roadmap.validator.js";

const router = Router();

router.post("/", requireAuth, validate(generateRoadmapSchema), asyncHandler(roadmapController.createOrGet));
router.patch(
  "/progress",
  requireAuth,
  validate(updateProgressSchema),
  asyncHandler(roadmapController.updateProgress),
);

export default router;
