import multer from "multer";

const ALLOWED = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]);

const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED.has(file.mimetype)) {
      cb(new Error("Only PDF, DOCX or TXT files are allowed"));
      return;
    }
    cb(null, true);
  },
}).single("cv");

/**
 * Wraps Multer's callback-style middleware so upload errors (bad mimetype,
 * file too large, malformed multipart body) flow into the normal Express
 * error-handling chain instead of needing bespoke handling in every route.
 */
export function uploadCv(req, res, next) {
  multerUpload(req, res, (err) => {
    if (!err) return next();
    err.status = 400;
    next(err);
  });
}
