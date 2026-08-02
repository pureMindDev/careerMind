import { Router } from "express";
import { z } from "zod";
import { CvAnalysis } from "../models/CvAnalysis.js";
import { InterviewPractice } from "../models/InterviewPractice.js";
import { DashboardStat } from "../models/DashboardStat.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";
import { generateJson, withFallback } from "../services/ai.js";
import { fallbackDashboard } from "../services/fallbacks.js";

const router = Router();

const statsSchema = z.object({
  profileCompletion: z.number(),
  currentCvScore: z.number().nullable(),
  progressData: z.array(z.object({ month: z.string(), score: z.number(), matches: z.number() })),
  skillRadar: z.array(z.object({ skill: z.string(), you: z.number(), market: z.number() })),
  insights: z.array(
    z.object({ title: z.string(), body: z.string(), tone: z.enum(["warning", "primary", "success"]) }),
  ),
  notifications: z.array(z.string()),
});

router.post(
  "/stats",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = z.object({ targetRole: z.string().optional() }).parse(req.body ?? {});
    const user = req.user;

    const latestCv = await CvAnalysis.findOne({ user: user._id }).sort({ createdAt: -1 });
    const interviewCount = await InterviewPractice.countDocuments({ user: user._id });

    const completed = [
      Boolean(user.name),
      Boolean(user.targetRole),
      Boolean(user.bio),
      Boolean(latestCv),
      interviewCount > 0,
    ].filter(Boolean).length;
    const profileCompletion = Math.round((completed / 5) * 100);
    const currentCvScore = latestCv?.score ?? null;

    const stats = await withFallback(
      async () => {
        const json = await generateJson({
          system:
            "You are a career analytics assistant. Produce dashboard statistics: 6 months of progress, 6 skill radar entries, 3 insights (tones warning, primary, success) and 3 notifications.",
          prompt: `Target role: ${data.targetRole || user.targetRole || "Software Engineer"}\nLatest CV score: ${currentCvScore ?? "N/A"}\nInterview sessions: ${interviewCount}\nProfile completion: ${profileCompletion}%\n\nReturn JSON: {"profileCompletion":number,"currentCvScore":number|null,"progressData":[{"month":string,"score":number,"matches":number}],"skillRadar":[{"skill":string,"you":number,"market":number}],"insights":[{"title":string,"body":string,"tone":"warning"|"primary"|"success"}],"notifications":string[]}`,
        });
        return statsSchema.parse({ ...json, profileCompletion, currentCvScore });
      },
      () => fallbackDashboard({ profileCompletion, currentCvScore, interviewCount }),
    );

    await DashboardStat.findOneAndUpdate(
      { user: user._id },
      { user: user._id, ...stats },
      { upsert: true },
    );

    res.json(stats);
  }),
);

export default router;
