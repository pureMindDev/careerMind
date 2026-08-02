/**
 * Thin wrapper around any OpenAI-compatible chat-completions endpoint.
 * Set AI_BASE_URL / AI_API_KEY / AI_MODEL in .env.
 * When no key is configured, callers fall back to deterministic heuristics
 * so the app stays fully usable in local development.
 */
export function aiEnabled() {
  return Boolean(process.env.AI_API_KEY);
}

export async function generateJson({ system, prompt }) {
  if (!aiEnabled()) throw new Error("AI_API_KEY is not configured");

  const baseUrl = process.env.AI_BASE_URL || "https://api.openai.com/v1";
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL || "gpt-4o-mini",
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
  if (!aiEnabled()) return fallback();
  try {
    return await task();
  } catch (err) {
    console.warn("AI call failed, using fallback:", err.message);
    return fallback();
  }
}
