import { Roadmap } from "../models/Roadmap.js";
import { generateJson, withFallback } from "./ai.service.js";
import { fallbackRoadmap } from "./fallbacks.js";
import { roadmapResultSchema } from "../validators/roadmap.validator.js";

export function toClientRoadmap(doc) {
  return {
    targetRole: doc.targetRole,
    overallProgress: doc.overallProgress,
    phases: doc.phases,
    skillGaps: doc.skillGaps,
  };
}

export async function getExistingRoadmap(userId) {
  return Roadmap.findOne({ user: userId });
}

export async function generateRoadmap({ userId, targetRole, skills, level }) {
  const generated = await withFallback(
    async () => {
      const json = await generateJson({
        system:
          "You are a career coach. Build a 16-week learning roadmap in four phases (4 weeks each) with 3-4 concrete items per phase and 6 skill gaps scored 0-100.",
        prompt: `Target role: ${targetRole}\nCurrent skills: ${(skills ?? []).join(", ") || "Not specified"}\nLevel: ${level ?? "Not specified"}\n\nReturn JSON: {"targetRole":string,"overallProgress":number,"phases":[{"phase":string,"weeks":string,"status":"done"|"active"|"todo","items":string[]}],"skillGaps":[{"skill":string,"you":number,"required":number}]}`,
      });
      return roadmapResultSchema.parse(json);
    },
    () => fallbackRoadmap(targetRole),
  );

  return Roadmap.findOneAndUpdate(
    { user: userId },
    { user: userId, ...generated },
    { upsert: true, new: true },
  );
}

export async function updateRoadmapProgress({ userId, phaseIndex, status }) {
  const doc = await Roadmap.findOne({ user: userId });
  if (!doc || !doc.phases[phaseIndex]) return null;

  doc.phases[phaseIndex].status = status;
  const done = doc.phases.filter((p) => p.status === "done").length;
  doc.overallProgress = Math.round((done / doc.phases.length) * 100);
  await doc.save();
  return doc;
}
