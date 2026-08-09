import { listJobs, matchJobs, createJob } from "../services/jobs.service.js";
import { ok, created } from "../utils/response.js";

export async function list(_req, res) {
  ok(res, await listJobs());
}

export async function matches(req, res) {
  const data = req.body;
  const profile = {
    targetRole: data.targetRole || req.user.targetRole,
    skills: data.skills ?? [],
    experience: data.experience || req.user.bio,
  };
  ok(res, await matchJobs(profile));
}

export async function create(req, res) {
  created(res, await createJob(req.body));
}
