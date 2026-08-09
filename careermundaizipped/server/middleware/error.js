import { logger } from "../utils/logger.js";

export function notFound(_req, res) {
  res.status(404).json({ message: "Route not found" });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  // Duplicate key (e.g. two concurrent signups with the same email).
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "value";
    return res.status(409).json({ message: `That ${field} is already in use` });
  }

  if (err.name === "ZodError") {
    // Turn e.g. [{message:"Password must include at least one number"}, ...]
    // into one readable sentence instead of a generic "invalid payload" the
    // user can't act on.
    const message = err.issues?.map((issue) => issue.message).join(". ") || "Invalid request payload";
    return res.status(400).json({ message, issues: err.issues });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid identifier" });
  }

  const status = err.status || 500;
  if (status >= 500) logger.error(err);
  res.status(status).json({ message: err.message || "Server error" });
}

export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
