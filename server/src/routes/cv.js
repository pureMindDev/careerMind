import { Router } from "express";
import { z } from "zod";
import { CvAnalysis } from "../models/CvAnalysis.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";
import { uploadCv } from "../middleware/upload.js";
import { extractText } from "../services/extract.js";
import { generateJson, withFallback } from "../services/ai.js";
import { fallbackCvAnalysis } from "../services/fallbacks.js";

const router = Router();

const analysisSchema = z.object({
  score: z.number().min(0).max(100),
  breakdown: z.array(z.object({ label: z.string(), value: z.number() })),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  improvements: z.array(z.string()),
});

async function analyze({ text, targetRole }) {
  const result = await withFallback(
    async () => {
      const json = await generateJson({
        system:
          "You are an expert CV reviewer and recruiter. Score the CV 0-100, give a 5-dimension breakdown, 3-5 strengths, 3-5 weaknesses and 3-5 actionable improvements.",
        prompt: `CV text:\n${text.slice(0, 12000)}\n${targetRole ? `Target role: ${targetRole}` : ""}\n\nReturn JSON: {"score":number,"breakdown":[{"label":string,"value":number}],"strengths":string[],"weaknesses":string[],"improvements":string[]}`,
      });
      return analysisSchema.parse(json);
    },
    () => fallbackCvAnalysis(text),
  );
  return result;
}

async function persist(user, result, meta, text) {
  await CvAnalysis.create({
    user: user._id,
    fileName: meta.fileName,
    fileSize: meta.fileSize,
    ...result,
    rawText: text.slice(0, 10000),
  });
}

router.post(
  "/analyze",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = z
      .object({
        text: z.string().min(1),
        targetRole: z.string().optional(),
        fileName: z.string().optional(),
        fileSize: z.number().optional(),
      })
      .parse(req.body);

    const result = await analyze({ text: data.text, targetRole: data.targetRole || req.user.targetRole });
    await persist(req.user, result, data, data.text);
    res.json(result);
  }),
);

/** Multer upload route: the file is parsed server-side (PDF/DOCX/TXT). */
router.post("/upload", requireAuth, (req, res, next) => {
  uploadCv(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    asyncHandler(async () => {
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });
      const text = await extractText(req.file);
      if (!text) return res.status(422).json({ message: "Could not read any text from that file" });

      const result = await analyze({
        text,
        targetRole: req.body.targetRole || req.user.targetRole,
      });
      await persist(req.user, result, {
        fileName: req.file.originalname,
        fileSize: req.file.size,
      }, text);
      res.json(result);
    })(req, res, next);
  });
});

router.get(
  "/latest",
  requireAuth,
  asyncHandler(async (req, res) => {
    const doc = await CvAnalysis.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    if (!doc) return res.json(null);
    res.json({
      score: doc.score,
      breakdown: doc.breakdown,
      strengths: doc.strengths,
      weaknesses: doc.weaknesses,
      improvements: doc.improvements,
    });
  }),
);

router.get(
  "/history",
  requireAuth,
  asyncHandler(async (req, res) => {
    const docs = await CvAnalysis.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("score fileName createdAt")
      .limit(20);
    res.json(docs);
  }),
);

export default router;
