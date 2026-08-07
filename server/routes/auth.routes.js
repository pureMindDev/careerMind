import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as authController from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";
import { validate } from "../middleware/validate.js";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} from "../validators/auth.validator.js";

const router = Router();

// Tighter limit than the global API limiter: these endpoints are brute-force targets.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again later" },
});

router.post("/signup", authLimiter, validate(signupSchema), asyncHandler(authController.signup));
router.post("/login", authLimiter, validate(loginSchema), asyncHandler(authController.login));
router.post(
  "/forgot-password",
  authLimiter,
  validate(forgotPasswordSchema),
  asyncHandler(authController.forgotPassword),
);
router.post(
  "/reset-password",
  authLimiter,
  validate(resetPasswordSchema),
  asyncHandler(authController.resetPassword),
);
router.post(
  "/verify-email",
  authLimiter,
  validate(verifyEmailSchema),
  asyncHandler(authController.verifyEmail),
);
router.post(
  "/resend-verification",
  authLimiter,
  validate(resendVerificationSchema),
  asyncHandler(authController.resendVerification),
);
router.get("/me", requireAuth, authController.me);

export default router;
