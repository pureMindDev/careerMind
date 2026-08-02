import { Router } from "express";
import { z } from "zod";
import { Job } from "../models/Job.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";
import { generateJson, withFallback } from "../services/ai.js";
import { fallbackJobMatch } from "../services/fallbacks.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(
      jobs.map((j) => ({
        id: j.id,
        title: j.title,
        company: j.company,
        location: j.location,
        type: j.type,
        salary: j.salary ?? "",
        match: 0,
        reasons: [],
        missing: [],
        tags: j.tags ?? [],
      })),
    );
  }),
);

router.post(
  "/matches",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = z
      .object({
        targetRole: z.string().optional(),
        skills: z.array(z.string()).optional(),
        experience: z.string().optional(),
      })
      .parse(req.body ?? {});

    const profile = {
      targetRole: data.targetRole || req.user.targetRole,
      skills: data.skills ?? [],
      experience: data.experience || req.user.bio,
    };

    const jobs = await Job.find().sort({ createdAt: -1 });
    if (jobs.length === 0) return res.json([]);

    const matches = await withFallback(
      async () => {
        const json = await generateJson({
          system:
            "You are a career matching expert. For each job compute a match score 0-100, 2-3 reasons it matches the candidate and 1-3 missing skills. Keep the same order as the jobs given.",
          prompt: `Candidate:\nTarget role: ${profile.targetRole || "Not specified"}\nSkills: ${profile.skills.join(", ") || "Not specified"}\nExperience: ${profile.experience || "Not specified"}\n\nJobs:\n${jobs
            .map((j, i) => `${i + 1}. ${j.title} at ${j.company} [${(j.tags ?? []).join(", ")}] - ${j.description ?? ""}`)
            .join("\n")}\n\nReturn JSON: {"matches":[{"match":number,"reasons":string[],"missing":string[]}]}`,
        });
        return z
          .object({
            matches: z.array(
              z.object({ match: z.number(), reasons: z.array(z.string()), missing: z.array(z.string()) }),
            ),
          })
          .parse(json).matches;
      },
      () => jobs.map((job) => fallbackJobMatch(job, profile)),
    );

    res.json(
      jobs.map((job, i) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        salary: job.salary ?? "",
        match: matches[i]?.match ?? 70,
        reasons: matches[i]?.reasons ?? ["Relevant role area"],
        missing: matches[i]?.missing ?? ["Check the job description for specifics"],
        tags: job.tags ?? [],
      })),
    );
  }),
);

router.post(
  "/",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const data = z
      .object({
        title: z.string(),
        company: z.string(),
        location: z.string().optional(),
        type: z.string().optional(),
        salary: z.string().optional(),
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
      .parse(req.body);
    const job = await Job.create(data);
    res.status(201).json(job);
  }),
);

export default router;
