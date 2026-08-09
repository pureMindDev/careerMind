import { z } from "zod";

export const evaluateAnswerSchema = z.object({
  question: z.string().min(1),
  category: z.string().optional(),
  answer: z.string().min(1),
});

export const interviewFeedbackSchema = z.object({
  score: z.number().min(0).max(100),
  metrics: z.array(z.object({ label: z.string(), value: z.number() })),
  good: z.array(z.string()),
  fix: z.array(z.string()),
});
