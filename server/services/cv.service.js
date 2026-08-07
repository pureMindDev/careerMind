import { CV } from "../models/CV.js";
import { generateJson, withFallback } from "./ai.service.js";
import { fallbackCvAnalysis } from "./fallbacks.js";
import { cvAnalysisResultSchema } from "../validators/cv.validator.js";

export async function analyzeCvText({ text, targetRole }) {
  return withFallback(
    async () => {
      const json = await generateJson({
        system:
          "You are an expert CV reviewer and recruiter. Score the CV 0-100, give a 5-dimension breakdown, 3-5 strengths, 3-5 weaknesses and 3-5 actionable improvements.",
        prompt: `CV text:\n${text.slice(0, 12000)}\n${targetRole ? `Target role: ${targetRole}` : ""}\n\nReturn JSON: {"score":number,"breakdown":[{"label":string,"value":number}],"strengths":string[],"weaknesses":string[],"improvements":string[]}`,
      });
      return cvAnalysisResultSchema.parse(json);
    },
    () => fallbackCvAnalysis(text),
  );
}

export async function persistCvAnalysis({ userId, result, fileName, fileSize, text }) {
  return CV.create({
    user: userId,
    fileName,
    fileSize,
    ...result,
    rawText: text.slice(0, 10000),
  });
}

export async function getLatestCv(userId) {
  return CV.findOne({ user: userId }).sort({ createdAt: -1 });
}

export async function getCvHistory(userId, limit = 20) {
  return CV.find({ user: userId }).sort({ createdAt: -1 }).select("score fileName createdAt").limit(limit);
}
