import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import {
  analyzeEssay,
  recommendScholarships,
  recommendUniversities,
} from "./lib/handlers";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.post("/api/recommend", async (req, res) => {
  try {
    res.json(await recommendUniversities(req.body));
  } catch (error: unknown) {
    console.error("AI Recommendation Error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to make AI university recommendations";
    res.status(500).json({ error: message });
  }
});

app.post("/api/essay-analyze", async (req, res) => {
  try {
    res.json(await analyzeEssay(req.body));
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
    res.status(statusCode).json({ error: message });
  }
});

app.post("/api/scholarships-recommend", async (req, res) => {
  try {
    res.json(await recommendScholarships(req.body));
  } catch (error: unknown) {
    console.error("AI Scholarship Finder Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to locate scholarships.";
    res.status(500).json({ error: message });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "healthy" });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `BNX Full-stack local server running on http://localhost:${PORT}`,
    );
  });
}

startServer().catch((err) => {
  console.error("Boot failure:", err);
});
