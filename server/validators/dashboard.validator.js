import { z } from "zod";

export const dashboardStatsRequestSchema = z.object({
  targetRole: z.string().optional(),
});

export const dashboardStatsResultSchema = z.object({
  profileCompletion: z.number(),
  currentCvScore: z.number().nullable(),
  progressData: z.array(z.object({ month: z.string(), score: z.number(), matches: z.number() })),
  skillRadar: z.array(z.object({ skill: z.string(), you: z.number(), market: z.number() })),
  insights: z.array(
    z.object({ title: z.string(), body: z.string(), tone: z.enum(["warning", "primary", "success"]) }),
  ),
  notifications: z.array(z.string()),
});
