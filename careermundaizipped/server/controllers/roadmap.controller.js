import { getExistingRoadmap, generateRoadmap, updateRoadmapProgress, toClientRoadmap } from "../services/roadmap.service.js";
import { ok } from "../utils/response.js";

export async function createOrGet(req, res) {
  const data = req.body;
  const targetRole = data.targetRole || req.user.targetRole || "Senior Frontend Engineer";

  const existing = await getExistingRoadmap(req.user._id);
  if (existing && !data.regenerate) return ok(res, toClientRoadmap(existing));

  const doc = await generateRoadmap({ userId: req.user._id, targetRole, skills: data.skills, level: data.level });
  ok(res, toClientRoadmap(doc));
}

export async function updateProgress(req, res) {
  const { phaseIndex, status } = req.body;
  const doc = await updateRoadmapProgress({ userId: req.user._id, phaseIndex, status });
  if (!doc) return res.status(404).json({ message: "Phase not found" });
  ok(res, toClientRoadmap(doc));
}
