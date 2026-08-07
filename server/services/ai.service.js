import { aiConfig, isAiEnabled } from "../config/ai.js";

export { isAiEnabled as aiEnabled };

export async function generateJson({ system, prompt }) {
  if (!isAiEnabled()) throw new Error("AI_API_KEY is not configured");

  const res = await fetch(`${aiConfig.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${aiConfig.apiKey}`,
    },
    body: JSON.stringify({
      model: aiConfig.model,
      response_format: { type: "json_object" },
      temperature: 0.4,
      messages: [
        { role: "system", content: `${system}\nRespond with valid JSON only.` },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`AI request failed (${res.status}): ${await res.text()}`);
  }

  const payload = await res.json();
  const content = payload.choices?.[0]?.message?.content ?? "{}";
  return JSON.parse(content);
}

/** Runs the AI call and silently falls back to a local generator on any failure. */
export async function withFallback(task, fallback) {
  if (!isAiEnabled()) return fallback();
  try {
    return await task();
  } catch (err) {
    const { logger } = await import("../utils/logger.js");
    logger.warn("AI call failed, using fallback:", err.message);
    return fallback();
  }
}
