export function notFound(_req, res) {
  res.status(404).json({ message: "Route not found" });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  console.error(err);
  const status = err.status || (err.name === "ZodError" ? 400 : 500);
  res.status(status).json({
    message: err.name === "ZodError" ? "Invalid request payload" : err.message || "Server error",
    issues: err.issues,
  });
}

export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
