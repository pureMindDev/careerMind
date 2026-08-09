import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";

import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/error.js";

const app = express();

// Required behind a reverse proxy/load balancer (Render, Railway, Heroku,
// Fly, nginx, etc.) so express-rate-limit and req.ip see the real client IP
// instead of the proxy's.
if (env.nodeEnv === "production") app.set("trust proxy", 1);

app.use(helmet());
app.use(compression());
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use("/api", rateLimit({ windowMs: 60_000, max: 120 }));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
