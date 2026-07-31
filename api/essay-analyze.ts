import type { VercelRequest, VercelResponse } from "@vercel/node";
import { analyzeEssay } from "../lib/handlers.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = await analyzeEssay(req.body ?? {});
    return res.status(200).json(result);
  } catch (error: unknown) {
    const statusCode =
      error instanceof Error && "statusCode" in error
        ? (error as Error & { statusCode: number }).statusCode
        : 500;
    console.error("AI Essay Analysis Error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to perform essay analysis.";
    return res.status(statusCode).json({ error: message });
  }
}
