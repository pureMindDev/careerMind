import { CV } from "../models/CV.js";
import { Interview } from "../models/Interview.js";
import { DashboardStat } from "../models/DashboardStat.js";
import { generateJson, withFallback } from "./ai.service.js";
import { fallbackDashboard } from "./fallbacks.js";
import { dashboardStatsResultSchema } from "../validators/dashboard.validator.js";

export async function buildDashboardStats({ user, targetRole }) {
  const latestCv = await CV.findOne({ user: user._id }).sort({ createdAt: -1 });
  const interviewCount = await Interview.countDocuments({ user: user._id });

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
        prompt: `Target role: ${targetRole || user.targetRole || "Software Engineer"}\nLatest CV score: ${currentCvScore ?? "N/A"}\nInterview sessions: ${interviewCount}\nProfile completion: ${profileCompletion}%\n\nReturn JSON: {"profileCompletion":number,"currentCvScore":number|null,"progressData":[{"month":string,"score":number,"matches":number}],"skillRadar":[{"skill":string,"you":number,"market":number}],"insights":[{"title":string,"body":string,"tone":"warning"|"primary"|"success"}],"notifications":string[]}`,
      });
      return dashboardStatsResultSchema.parse({ ...json, profileCompletion, currentCvScore });
    },
    () => fallbackDashboard({ profileCompletion, currentCvScore, interviewCount }),
  );

  await DashboardStat.findOneAndUpdate({ user: user._id }, { user: user._id, ...stats }, { upsert: true });

  return stats;
}
