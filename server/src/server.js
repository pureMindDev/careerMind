import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import cvRoutes from "./routes/cv.js";
import jobRoutes from "./routes/jobs.js";
import interviewRoutes from "./routes/interview.js";
import roadmapRoutes from "./routes/roadmap.js";
import dashboardRoutes from "./routes/dashboard.js";
import { errorHandler, notFound } from "./middleware/error.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(","),
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));
app.use("/api", rateLimit({ windowMs: 60_000, max: 120 }));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "careermind-api" }));
app.use("/api/auth", authRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`CareerMind API listening on http://localhost:${port}`));
  })
  .catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  });

export default app;
