import { Router } from "express";
import { z } from "zod";
import { InterviewPractice } from "../models/InterviewPractice.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";
import { generateJson, withFallback } from "../services/ai.js";
import { fallbackInterviewFeedback } from "../services/fallbacks.js";

const router = Router();

const feedbackSchema = z.object({
  score: z.number().min(0).max(100),
  metrics: z.array(z.object({ label: z.string(), value: z.number() })),
  good: z.array(z.string()),
  fix: z.array(z.string()),
});

router.post(
  "/evaluate",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = z
      .object({
        question: z.string().min(1),
        category: z.string().optional(),
        answer: z.string().min(1),
      })
      .parse(req.body);

    const feedback = await withFallback(
      async () => {
        const json = await generateJson({
          system:
            "You are a senior interview coach. Score the answer 0-100 and rate Structure (STAR), Specificity, Conciseness and Confidence signals. Give 2-3 things that worked and 2-3 fixes.",
          prompt: `Question: ${data.question}\nCategory: ${data.category ?? "General"}\nAnswer: ${data.answer}\n\nReturn JSON: {"score":number,"metrics":[{"label":string,"value":number}],"good":string[],"fix":string[]}`,
        });
        return feedbackSchema.parse(json);
      },
      () => fallbackInterviewFeedback(data.answer),
    );

    await InterviewPractice.create({
      user: req.user._id,
      question: data.question,
      category: data.category,
      answer: data.answer,
      score: feedback.score,
      metrics: feedback.metrics,
      feedbackGood: feedback.good,
      feedbackFix: feedback.fix,
    });

    res.json(feedback);
  }),
);

router.get(
  "/history",
  requireAuth,
  asyncHandler(async (req, res) => {
    const docs = await InterviewPractice.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(docs);
  }),
);

export default router;
