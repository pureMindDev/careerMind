import { extractText } from "../utils/extractText.js";
import { analyzeCvText, persistCvAnalysis, getLatestCv, getCvHistory } from "../services/cv.service.js";
import { ok } from "../utils/response.js";

export async function analyze(req, res) {
  const data = req.body;
  const result = await analyzeCvText({ text: data.text, targetRole: data.targetRole || req.user.targetRole });
  await persistCvAnalysis({
    userId: req.user._id,
    result,
    fileName: data.fileName,
    fileSize: data.fileSize,
    text: data.text,
  });
  ok(res, result);
}

/** Multer has already parsed req.file (PDF/DOCX/TXT) by the time this runs. */
export async function upload(req, res) {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const text = await extractText(req.file);
  if (!text) return res.status(422).json({ message: "Could not read any text from that file" });

  const result = await analyzeCvText({ text, targetRole: req.body.targetRole || req.user.targetRole });
  await persistCvAnalysis({
    userId: req.user._id,
    result,
    fileName: req.file.originalname,
    fileSize: req.file.size,
    text,
  });
  ok(res, result);
}

export async function latest(req, res) {
  const doc = await getLatestCv(req.user._id);
  if (!doc) return ok(res, null);
  ok(res, {
    score: doc.score,
    breakdown: doc.breakdown,
    strengths: doc.strengths,
    weaknesses: doc.weaknesses,
    improvements: doc.improvements,
  });
}

export async function history(req, res) {
  ok(res, await getCvHistory(req.user._id));
}
