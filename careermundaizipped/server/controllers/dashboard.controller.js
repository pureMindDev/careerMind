import { buildDashboardStats } from "../services/dashboard.service.js";
import { ok } from "../utils/response.js";

export async function stats(req, res) {
  const { targetRole } = req.body;
  ok(res, await buildDashboardStats({ user: req.user, targetRole }));
}
