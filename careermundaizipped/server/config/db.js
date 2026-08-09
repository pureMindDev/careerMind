import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

export async function connectDB() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongodbUri);
  logger.info("MongoDB connected");
  return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
