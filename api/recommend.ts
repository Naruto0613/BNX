import type { VercelRequest, VercelResponse } from "@vercel/node";
import { recommendUniversities } from "../lib/handlers";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = await recommendUniversities(req.body ?? {});
    return res.status(200).json(result);
  } catch (error: unknown) {
    console.error("AI Recommendation Error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to make AI university recommendations";
    return res.status(500).json({ error: message });
  }
}
