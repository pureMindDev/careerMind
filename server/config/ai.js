import { env } from "./env.js";

/** Any OpenAI-compatible chat-completions endpoint: OpenAI, OpenRouter, Groq, Together... */
export const aiConfig = {
  baseUrl: env.ai.baseUrl,
  apiKey: env.ai.apiKey,
  model: env.ai.model,
};

export function isAiEnabled() {
  return Boolean(aiConfig.apiKey);
}
