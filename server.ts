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

app.post("/api/recommend", async (req, res) => {
  try {
    const profile = req.body;
    const ai = getGenAI();

    // Format structured lists for AI prompt context
    const awardsSummary =
      profile.awardsList && profile.awardsList.length > 0
        ? profile.awardsList
            .map(
              (a: any) =>
                `- ${a.awardName} (${a.awardType} at ${a.level} level in ${a.category}, ${a.year}): ${a.description || ""}`,
            )
            .join("\n")
        : profile.awards || "N/A";

    const activitiesSummary =
      profile.activitiesList && profile.activitiesList.length > 0
        ? profile.activitiesList
            .map(
              (act: any) =>
                `- ${act.role} at ${act.organization} (${act.activityType}, ${act.hoursPerWeek || 0} hrs/wk, ${act.membersLed || 0} members led, ${act.beneficiaries || 0} beneficiaries): ${act.achievements || ""}`,
            )
            .join("\n")
        : profile.extracurricularActivities || "N/A";

    const researchSummary =
      profile.researchList && profile.researchList.length > 0
        ? profile.researchList
            .map(
              (r: any) =>
                `- ${r.title} (Published: ${r.published}, Area: ${r.researchArea || "N/A"}, Journal/Conf: ${r.conferenceOrJournal || "N/A"}, Supervisor: ${r.supervisor || "N/A"})`,
            )
            .join("\n")
        : "N/A";

    const languagesSummary =
      profile.languagesList && profile.languagesList.length > 0
        ? profile.languagesList
            .map(
              (l: any) =>
                `- ${l.language}: Overall ${l.overallLevel} (R:${l.reading}, W:${l.writing}, L:${l.listening}, S:${l.speaking})`,
            )
            .join("\n")
        : profile.languageSkills || "N/A";

    const skillsSummary = `Programming: ${(profile.selectedProgrammingSkills || []).join(", ") || profile.programmingSkills || "N/A"} | Soft Skills: ${(profile.selectedSoftSkills || []).join(", ") || "N/A"} | Certifications: ${(profile.selectedCertificates || []).join(", ") || "N/A"}`;

    const preferencesSummary = profile.preferences
      ? `
- Preferred Countries: ${(profile.preferences.preferredCountries || []).join(", ")}
- Annual Budget: $${profile.preferences.budgetAnnualUsd || "Flexible"} USD
- Need Financial Aid/Scholarship: ${profile.preferences.needScholarship || "Yes"}
- Preferred Climate: ${profile.preferences.preferredClimate || "Any"}
- Preferred Campus Size: ${profile.preferences.preferredCampusSize || "Any"}
- Preferred University Type: ${profile.preferences.preferredUniversityType || "Any"}
- Career Goal: ${profile.preferences.careerGoal || "N/A"}
`
      : "N/A";

    const prompt = `
You are an expert global admissions consultant specializing in helping Mongolian students select and apply to top-tier international and national universities.
Analyze the student's complete structured academic portfolio below and calculate exact university match percentages based on entry thresholds, test scores, awards, leadership impact, and preferences.

Student Profile:
- Full Name: ${profile.name || "Mongolian Student"}
- Date of Birth / Graduation Year: ${profile.dob || "N/A"} / Class of ${profile.graduationYear || 2026}
- School: ${profile.school || "N/A"} (${profile.city || "Mongolia"})
- GPA: ${profile.gpa || "N/A"} / 4.0
- Class Rank: ${profile.classRank || "N/A"}
- Test Scores:
  * IELTS: ${profile.ieltsScore || "N/A"}
  * TOEFL iBT: ${profile.toeflScore || "N/A"}
  * Duolingo (DET): ${profile.detScore || "N/A"}
  * SAT Score: ${profile.satScore || "N/A"}
  * ACT Score: ${profile.actScore || "N/A"}
- AP Courses & Scores: ${profile.apCourses || "N/A"}
- IB Diploma Courses: ${profile.ibCourses || "N/A"}

Structured Honors & Awards:
${awardsSummary}

Structured Extracurriculars & Leadership:
${activitiesSummary}

Research & Publications:
${researchSummary}

Language Proficiency:
${languagesSummary}

Technical Skills & Certifications:
${skillsSummary}

Student Preferences & Career Objectives:
${preferencesSummary}

Instructions:
Generate 6-8 university recommendation matches tailored for this student. Include a diverse mix of:
- Reach Schools (Challenging but possible, match 30-55%)
- Target Schools (Strong fit, match 60-80%)
- Safety Schools (High probability of admission & scholarship, match 85-98%)

For each university:
1. Provide the university's official name, country, and global rank.
2. Calculate a Precise Match Percentage (an integer between 10% and 99%) mathematically derived from test score overlap, GPA, awards level, leadership hours, and country preferences.
3. Classify entry difficulty ("Reach", "Target", or "Safety").
4. Evaluate specific positive match factors (GPA alignment, test score advantage, competition awards, leadership impact).
5. Give actionable, practical application advice (scholarship options, early decision tips, visa requirements for Mongolian students).

Output the result strictly as a JSON object of this structure:
{
  "recommendations": [
    {
      "universityName": "University Name",
      "country": "Country",
      "ranking": 25,
      "matchPercentage": 78,
      "difficulty": "Target",
      "gpaFactor": "Feedback about GPA against entry requirements",
      "testFactor": "Feedback about IELTS/SAT/TOEFL scores",
      "activitiesFactor": "Feedback about Olympiads, Leadership, and Extracurriculars",
      "actionableAdvice": "Concrete application tips for this school for Mongolian applicants"
    }
  ]
}
Do not write any markdown wrappers outside the pure JSON payload.
`;

    const response = await generateAIContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    res.json(cleanAndParseJSON(text));
  } catch (error: any) {
    console.error("AI Recommendation Error:", error);
    res
      .status(500)
      .json({
        error: error.message || "Failed to make AI university recommendations",
      });
  }
});

// 2. AI Essay Assistant Endpoint
app.post("/api/essay-analyze", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Essay content is required." });
    }

    const prompt = `
You are a senior IELTS examiner and admissions essay editor. Review the student's essay below and perform a rigorous critique.

Essay Title: ${title || "Untitled Admissions Essay"}
Essay Content:
"${content}"

Provide feedback divided into:
1. Grammar Corrections: Outline specific typos, grammatical faults, and list sentences with corrected revisions.
2. IELTS-Style Band Rating / Writing Assessment: Target scoring dimensions (Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Accuracy). Provide a band score out of 9 (e.g., "7.5") with professional justification.
3. Structure and Flow Analysis: Point out paragraph transitions, logical pacing, intro strength, and conclusion impact.
4. Suggestions for Improvement: 3-5 concrete, actionable tips (e.g., 'Utilize transitional adverbs', 'Expand on the personal challenge in Paragraph 2').

Output the result strictly as a JSON object matching this structure:
{
  "scoreEstimate": "IELTS Band 7.5",
  "grammarCorrections": "Detailed feedback paragraph about grammar successes and corrected lines",
  "ieltsFeedback": "Band grading assessment text for all 4 parameters",
  "structureAnalysis": "Analysis of essay structure, flow, and structural dynamics",
  "suggestions": "Bullet points or paragraph of core actionable improvements"
}
Do not write any markdown wrappers or comments outside the pure JSON payload.
`;

    const response = await generateAIContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    res.json(cleanAndParseJSON(text));
  } catch (error: any) {
    console.error("AI Essay Analysis Error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to perform essay analysis." });
  }
});

// 3. AI Scholarship Finder Endpoint
app.post("/api/scholarships-recommend", async (req, res) => {
  try {
    const profile = req.body;

    const prompt = `
Analyze the academic profile of this student from Mongolia and propose 4-5 high-value international/national scholarships.

Student Profile:
- Name: ${profile.name || "Student"}
- GPA: ${profile.gpa || "N/A"}
- IELTS Score: ${profile.ieltsScore || "N/A"}
- TOEFL Score: ${profile.toeflScore || "N/A"}
- Careers/Majors of interest: ${profile.careerInterests || "N/A"}

Specifically search for global scholarship schemes open to citizens of Mongolia, such as:
- Fulbright Scholarship (USA)
- Chevening (UK)
- MEXT (Japan)
- CSC - Chinese Government Scholarship (China)
- DAAD (Germany)
- KGSP / GKS - Global Korea Scholarship (South Korea)
- Mongolian Government "President's Messenger 2100" Scholarship Scheme
- Australia Awards Scholarships (AAS)
- University-specific merit discounts and need-based financial aid.

Provide name, country, financial coverage/amount, enrollment criteria, deadline, and matching strategy.

Output the result strictly as a JSON object of this structure:
{
  "scholarships": [
    {
      "name": "Scholarship Name (e.g., MEXT Japanese Government Scholarship)",
      "country": "Japan",
      "amount": "Full tuition waiver, monthly stipend of 117,000 JPY, and return flight ticket",
      "eligibility": "Mongolian citizen under 35 years, academic average equivalent to top grades, willing to study in Japanese",
      "deadline": "May 31 annually",
      "matchingStrategy": "Very strong fit! Your background in STEM or IT matches Japan's technical quotas. Ensure you prepare for the physics and math written examinations conducted at the embassy."
    }
  ]
}
Do not write any markdown wrappers outside the pure JSON payload.
`;

    const response = await generateAIContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    res.json(cleanAndParseJSON(text));
  } catch (error: any) {
    console.error("AI Scholarship Finder Error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to locate scholarships." });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "healthy" });
});

// Serve frontend assets and boot listener
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
