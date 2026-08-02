import { Router } from "express";
import crypto from "crypto";
import { z } from "zod";
import { User } from "../models/User.js";
import { requireAuth, signToken } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";

const router = Router();

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

router.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const data = signupSchema.parse(req.body);
    const existing = await User.findOne({ email: data.email });
    if (existing) return res.status(409).json({ message: "An account with that email already exists" });

    const user = await User.create(data);
    res.status(201).json({ token: signToken(user.id), user: user.toProfile() });
  }),
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const data = z.object({ email: z.string().email(), password: z.string() }).parse(req.body);
    const user = await User.findOne({ email: data.email }).select("+password");
    if (!user || !(await user.comparePassword(data.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({ token: signToken(user.id), user: user.toProfile() });
  }),
);

router.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);
    const user = await User.findOne({ email });
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      user.resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");
      user.resetTokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
      await user.save();
      // Wire your mail provider here; the raw token is what belongs in the email link.
      console.log(`Password reset token for ${email}: ${token}`);
    }
    // Always the same response so accounts cannot be enumerated.
    res.json({ ok: true });
  }),
);

router.post(
  "/reset-password",
  asyncHandler(async (req, res) => {
    const { token, password } = z
      .object({ token: z.string().min(10), password: z.string().min(8) })
      .parse(req.body);
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetTokenHash: hash,
      resetTokenExpiresAt: { $gt: new Date() },
    }).select("+password +resetTokenHash +resetTokenExpiresAt");
    if (!user) return res.status(400).json({ message: "Reset link is invalid or has expired" });

    user.password = password;
    user.resetTokenHash = undefined;
    user.resetTokenExpiresAt = undefined;
    await user.save();
    res.json({ ok: true });
  }),
);

router.get("/me", requireAuth, (req, res) => res.json(req.user.toProfile()));

router.put(
  "/profile",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = z
      .object({
        fullName: z.string().max(120).optional(),
        targetRole: z.string().max(120).optional(),
        bio: z.string().max(2000).optional(),
      })
      .parse(req.body);

    if (data.fullName !== undefined) req.user.name = data.fullName;
    if (data.targetRole !== undefined) req.user.targetRole = data.targetRole;
    if (data.bio !== undefined) req.user.bio = data.bio;
    await req.user.save();
    res.json({ ok: true, user: req.user.toProfile() });
  }),
);

router.put(
  "/settings",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = z
      .object({
        theme: z.string().optional(),
        notifyMatches: z.boolean().optional(),
        notifyCv: z.boolean().optional(),
        notifyRoadmap: z.boolean().optional(),
        notifyDigest: z.boolean().optional(),
        notifyProduct: z.boolean().optional(),
      })
      .parse(req.body);

    req.user.settings = { ...req.user.settings.toObject(), ...data };
    await req.user.save();
    res.json({ ok: true, user: req.user.toProfile() });
  }),
);

export default router;
