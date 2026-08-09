import { Router } from "express";
import * as cvController from "../controllers/cv.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";
import { validate } from "../middleware/validate.js";
import { uploadCv } from "../middleware/upload.js";
import { analyzeCvSchema } from "../validators/cv.validator.js";

const router = Router();

router.post("/analyze", requireAuth, validate(analyzeCvSchema), asyncHandler(cvController.analyze));
router.post("/upload", requireAuth, uploadCv, asyncHandler(cvController.upload));
router.get("/latest", requireAuth, asyncHandler(cvController.latest));
router.get("/history", requireAuth, asyncHandler(cvController.history));

export default router;
