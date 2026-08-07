import { z } from "zod";

export const generateRoadmapSchema = z.object({
  targetRole: z.string().optional(),
  skills: z.array(z.string()).optional(),
  level: z.string().optional(),
  regenerate: z.boolean().optional(),
});

export const roadmapResultSchema = z.object({
  targetRole: z.string(),
  overallProgress: z.number().min(0).max(100),
  phases: z.array(
    z.object({
      phase: z.string(),
      weeks: z.string(),
      status: z.enum(["done", "active", "todo"]),
      items: z.array(z.string()),
    }),
  ),
  skillGaps: z.array(z.object({ skill: z.string(), you: z.number(), required: z.number() })),
});

export const updateProgressSchema = z.object({
  phaseIndex: z.number().int().min(0),
  status: z.enum(["done", "active", "todo"]),
});
