import { Job } from "../models/Job.js";
import { generateJson, withFallback } from "./ai.service.js";
import { fallbackJobMatch } from "./fallbacks.js";
import { jobMatchResultSchema } from "../validators/jobs.validator.js";

export async function listJobs() {
  const jobs = await Job.find().sort({ createdAt: -1 });
  return jobs.map((j) => ({
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
  }));
}

export async function matchJobs(profile) {
  const jobs = await Job.find().sort({ createdAt: -1 });
  if (jobs.length === 0) return [];

  const matches = await withFallback(
    async () => {
      const json = await generateJson({
        system:
          "You are a career matching expert. For each job compute a match score 0-100, 2-3 reasons it matches the candidate and 1-3 missing skills. Keep the same order as the jobs given.",
        prompt: `Candidate:\nTarget role: ${profile.targetRole || "Not specified"}\nSkills: ${profile.skills.join(", ") || "Not specified"}\nExperience: ${profile.experience || "Not specified"}\n\nJobs:\n${jobs
          .map((j, i) => `${i + 1}. ${j.title} at ${j.company} [${(j.tags ?? []).join(", ")}] - ${j.description ?? ""}`)
          .join("\n")}\n\nReturn JSON: {"matches":[{"match":number,"reasons":string[],"missing":string[]}]}`,
      });
      return jobMatchResultSchema.parse(json).matches;
    },
    () => jobs.map((job) => fallbackJobMatch(job, profile)),
  );

  return jobs.map((job, i) => ({
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
  }));
}

export async function createJob(data) {
  return Job.create(data);
}
