import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

export function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY environment variable is missing. Please make sure your Gemini API key is configured in the Settings/Secrets panel.",
      );
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function cleanAndParseJSON(rawText: string) {
  if (!rawText) return {};
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }
  return JSON.parse(cleaned);
}

export async function generateAIContentWithFallback(params: {
  contents: string;
  config?: Record<string, unknown>;
}) {
  const modelsToTry = [
    // Verified against this project's API key. Prefer lower-latency models so
    // a temporary outage from a larger model does not disable the AI tools.
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash",
  ];
  let lastError: unknown = null;

  for (const model of modelsToTry) {
    let attempt = 0;
    const maxAttempts = 2;

    while (attempt < maxAttempts) {
      try {
        console.log(
          `[AI] Attempting AI generation using model: ${model} (Attempt ${attempt + 1}/${maxAttempts})`,
        );
        const ai = getGenAI();
        return await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
      } catch (error: unknown) {
        lastError = error;
        attempt++;

        const errorMessage =
          error instanceof Error ? error.message : String(error);
        const errorCode =
          (error as { status?: number; code?: number })?.status ||
          (error as { status?: number; code?: number })?.code ||
          0;

        console.warn(
          `[AI] Error on ${model} (Attempt ${attempt}): ${errorMessage}`,
        );

        if (errorMessage.includes("GEMINI_API_KEY")) {
          throw error;
        }

        if (
          attempt < maxAttempts &&
          (errorCode === 503 ||
            errorCode === 429 ||
            errorMessage.includes("503") ||
            errorMessage.includes("429"))
        ) {
          const waitTime = Math.pow(2, attempt) * 500;
          await delay(waitTime);
        } else {
          break;
        }
      }
    }
  }

  throw lastError || new Error("All AI models failed to generate content.");
}
