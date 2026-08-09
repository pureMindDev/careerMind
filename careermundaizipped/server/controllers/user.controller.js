import { ok } from "../utils/response.js";

export async function updateProfile(req, res) {
  const data = req.body;

  if (data.fullName !== undefined) req.user.name = data.fullName;
  if (data.targetRole !== undefined) req.user.targetRole = data.targetRole;
  if (data.bio !== undefined) req.user.bio = data.bio;
  await req.user.save();

  ok(res, { ok: true, user: req.user.toProfile() });
}

export async function updateSettings(req, res) {
  const data = req.body;

  req.user.settings = { ...req.user.settings.toObject(), ...data };
  await req.user.save();

  ok(res, { ok: true, user: req.user.toProfile() });
}
