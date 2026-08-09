import { z } from "zod";

export const analyzeCvSchema = z.object({
  text: z.string().min(1),
  targetRole: z.string().optional(),
  fileName: z.string().optional(),
  fileSize: z.number().optional(),
});

/** Shape the AI (or fallback) result must match before it's trusted/persisted. */
export const cvAnalysisResultSchema = z.object({
  score: z.number().min(0).max(100),
  breakdown: z.array(z.object({ label: z.string(), value: z.number() })),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  improvements: z.array(z.string()),
});
