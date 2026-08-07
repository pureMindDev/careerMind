import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";
import { validate } from "../middleware/validate.js";
import { updateProfileSchema, updateSettingsSchema } from "../validators/user.validator.js";

const router = Router();

router.put("/profile", requireAuth, validate(updateProfileSchema), asyncHandler(userController.updateProfile));
router.put("/settings", requireAuth, validate(updateSettingsSchema), asyncHandler(userController.updateSettings));

export default router;
