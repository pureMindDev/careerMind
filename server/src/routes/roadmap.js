import { Router } from "express";
import { z } from "zod";
import { Roadmap } from "../models/Roadmap.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";
import { generateJson, withFallback } from "../services/ai.js";
import { fallbackRoadmap } from "../services/fallbacks.js";

const router = Router();

const roadmapSchema = z.object({
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

function toClient(doc) {
  return {
    targetRole: doc.targetRole,
    overallProgress: doc.overallProgress,
    phases: doc.phases,
    skillGaps: doc.skillGaps,
  };
}

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = z
      .object({
        targetRole: z.string().optional(),
        skills: z.array(z.string()).optional(),
        level: z.string().optional(),
        regenerate: z.boolean().optional(),
      })
      .parse(req.body ?? {});

    const targetRole = data.targetRole || req.user.targetRole || "Senior Frontend Engineer";
    const existing = await Roadmap.findOne({ user: req.user._id });
    if (existing && !data.regenerate) return res.json(toClient(existing));

    const generated = await withFallback(
      async () => {
        const json = await generateJson({
          system:
            "You are a career coach. Build a 16-week learning roadmap in four phases (4 weeks each) with 3-4 concrete items per phase and 6 skill gaps scored 0-100.",
          prompt: `Target role: ${targetRole}\nCurrent skills: ${(data.skills ?? []).join(", ") || "Not specified"}\nLevel: ${data.level ?? "Not specified"}\n\nReturn JSON: {"targetRole":string,"overallProgress":number,"phases":[{"phase":string,"weeks":string,"status":"done"|"active"|"todo","items":string[]}],"skillGaps":[{"skill":string,"you":number,"required":number}]}`,
        });
        return roadmapSchema.parse(json);
      },
      () => fallbackRoadmap(targetRole),
    );

    const doc = await Roadmap.findOneAndUpdate(
      { user: req.user._id },
      { user: req.user._id, ...generated },
      { upsert: true, new: true },
    );
    res.json(toClient(doc));
  }),
);

router.patch(
  "/progress",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { phaseIndex, status } = z
      .object({ phaseIndex: z.number().int().min(0), status: z.enum(["done", "active", "todo"]) })
      .parse(req.body);

    const doc = await Roadmap.findOne({ user: req.user._id });
    if (!doc || !doc.phases[phaseIndex]) return res.status(404).json({ message: "Phase not found" });

    doc.phases[phaseIndex].status = status;
    const done = doc.phases.filter((p) => p.status === "done").length;
    doc.overallProgress = Math.round((done / doc.phases.length) * 100);
    await doc.save();
    res.json(toClient(doc));
  }),
);

export default router;
