import { evaluateAnswer, persistInterview, getInterviewHistory } from "../services/interview.service.js";
import { ok } from "../utils/response.js";

export async function evaluate(req, res) {
  const { question, category, answer } = req.body;
  const feedback = await evaluateAnswer({ question, category, answer });
  await persistInterview({ userId: req.user._id, question, category, answer, feedback });
  ok(res, feedback);
}

export async function history(req, res) {
  ok(res, await getInterviewHistory(req.user._id));
}
