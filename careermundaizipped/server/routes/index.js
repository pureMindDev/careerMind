import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import cvRoutes from "./cv.routes.js";
import jobsRoutes from "./jobs.routes.js";
import interviewRoutes from "./interview.routes.js";
import roadmapRoutes from "./roadmap.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

const router = Router();

router.get("/health", (_req, res) => res.json({ ok: true, service: "careermind-api" }));

// user.routes is mounted on the same /auth prefix as auth.routes so the
// public API surface (/api/auth/profile, /api/auth/settings, ...) is unchanged.
router.use("/auth", authRoutes);
router.use("/auth", userRoutes);
router.use("/cv", cvRoutes);
router.use("/jobs", jobsRoutes);
router.use("/interview", interviewRoutes);
router.use("/roadmap", roadmapRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
