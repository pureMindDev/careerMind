import { Interview } from "../models/Interview.js";
import { generateJson, withFallback } from "./ai.service.js";
import { fallbackInterviewFeedback } from "./fallbacks.js";
import { interviewFeedbackSchema } from "../validators/interview.validator.js";

export async function evaluateAnswer({ question, category, answer }) {
  return withFallback(
    async () => {
      const json = await generateJson({
        system:
          "You are a senior interview coach. Score the answer 0-100 and rate Structure (STAR), Specificity, Conciseness and Confidence signals. Give 2-3 things that worked and 2-3 fixes.",
        prompt: `Question: ${question}\nCategory: ${category ?? "General"}\nAnswer: ${answer}\n\nReturn JSON: {"score":number,"metrics":[{"label":string,"value":number}],"good":string[],"fix":string[]}`,
      });
      return interviewFeedbackSchema.parse(json);
    },
    () => fallbackInterviewFeedback(answer),
  );
}

export async function persistInterview({ userId, question, category, answer, feedback }) {
  return Interview.create({
    user: userId,
    question,
    category,
    answer,
    score: feedback.score,
    metrics: feedback.metrics,
    feedbackGood: feedback.good,
    feedbackFix: feedback.fix,
  });
}

export async function getInterviewHistory(userId, limit = 20) {
  return Interview.find({ user: userId }).sort({ createdAt: -1 }).limit(limit);
}
