import { z } from "zod";

export const jobMatchRequestSchema = z.object({
  targetRole: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience: z.string().optional(),
});

export const jobMatchResultSchema = z.object({
  matches: z.array(
    z.object({ match: z.number(), reasons: z.array(z.string()), missing: z.array(z.string()) }),
  ),
});

export const createJobSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().optional(),
  type: z.string().optional(),
  salary: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});
