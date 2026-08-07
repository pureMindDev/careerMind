import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(120).optional(),
  targetRole: z.string().max(120).optional(),
  bio: z.string().max(2000).optional(),
});

export const updateSettingsSchema = z.object({
  theme: z.string().optional(),
  notifyMatches: z.boolean().optional(),
  notifyCv: z.boolean().optional(),
  notifyRoadmap: z.boolean().optional(),
  notifyDigest: z.boolean().optional(),
  notifyProduct: z.boolean().optional(),
});
