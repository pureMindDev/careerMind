import "dotenv/config";

/** Required in every environment; the process refuses to start without these. */
const REQUIRED = ["MONGODB_URI", "JWT_SECRET"];

function readEnv() {
  const env = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT) || 5000,
    mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/careermind",
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
    clientOrigin: (process.env.CLIENT_ORIGIN || "http://localhost:5173")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),

    ai: {
      baseUrl: process.env.AI_BASE_URL || "https://api.openai.com/v1",
      apiKey: process.env.AI_API_KEY || "",
      model: process.env.AI_MODEL || "gpt-4o-mini",
    },

    brevo: {
      apiKey: process.env.BREVO_API_KEY || "",
      senderEmail: process.env.BREVO_SENDER_EMAIL || "no-reply@careermind.ai",
      senderName: process.env.BREVO_SENDER_NAME || "CareerMind AI",
    },
  };

  return env;
}

export const env = readEnv();

/** Call once at boot. Throws with a clear message instead of failing deep in Mongoose/JWT. */
export function assertRequiredEnv() {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(", ")}. Copy .env.example to .env and fill them in.`,
    );
  }
}
