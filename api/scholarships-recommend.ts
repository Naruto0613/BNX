import type { VercelRequest, VercelResponse } from "@vercel/node";
import { recommendScholarships } from "../lib/handlers.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = await recommendScholarships(req.body ?? {});
    return res.status(200).json(result);
  } catch (error: unknown) {
    console.error("AI Scholarship Finder Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to locate scholarships.";
    return res.status(500).json({ error: message });
  }
}
