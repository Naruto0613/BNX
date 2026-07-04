import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Google GenAI Client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required to run AI features. Please add it in the Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Helper to pause execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Robust wrapper with automatic retry and model fallback for high demand/503/429 scenarios
async function generateAIContentWithFallback(params: {
  contents: string;
  config?: any;
}): Promise<any> {
  const modelsToTry = [
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash",
    "gemini-2.5-flash",
    "gemini-2.0-flash"
  ];
  let lastError: any = null;

  for (const model of modelsToTry) {
    let attempt = 0;
    const maxAttempts = 3;

    while (attempt < maxAttempts) {
      try {
        console.log(`[AI] Attempting AI generation using model: ${model} (Attempt ${attempt + 1}/${maxAttempts})`);
        const ai = getGenAI();
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config
        });
        return response;
      } catch (error: any) {
        lastError = error;
        attempt++;
        
        const errorMessage = error?.message || "";
        const errorCode = error?.status || error?.code || 0;
        
        // If we get a 503 (Unavailable) or 429 (Rate Limit), wait and retry.
        if (attempt < maxAttempts && (errorCode === 503 || errorCode === 429 || errorMessage.includes("503") || errorMessage.includes("429"))) {
          const waitTime = Math.pow(2, attempt) * 500;
          console.warn(`[AI] Temporary error (${errorCode}) on ${model}. Retrying in ${waitTime}ms...`);
          await delay(waitTime);
        } else {
          // Break out of retry loop for this model and try the next fallback model
          console.warn(`[AI] Error on ${model}: ${errorMessage}. Moving to fallback if available.`);
          break;
        }
      }
    }
  }

  throw lastError || new Error("All AI models failed to generate content.");
}

// 1. AI University Recommendation Endpoint
app.post("/api/recommend", async (req, res) => {
  try {
    const profile = req.body;
    const ai = getGenAI();

    const prompt = `
You are an expert global admissions consultant specializing in helping Mongolian students select and apply to top-tier international and national universities.
Analyze the following student profile and match it against prominent universities from USA, Canada, United Kingdom, South Korea, Japan, China, Germany, Australia, Singapore, and Mongolia.

Student Profile:
- Name: ${profile.name || "Mongolian Student"}
- Age: ${profile.age || "N/A"}
- Home Country: Mongolia
- Target Countries of Interest: All supported (USA, Canada, UK, South Korea, Japan, China, Germany, Australia, Singapore, Mongolia)
- School: ${profile.school || "N/A"}
- GPA: ${profile.gpa || "N/A"}
- Class Rank/Percentile: ${profile.classRank || "N/A"}
- Test Scores: IELTS: ${profile.ieltsScore || "N/A"}, TOEFL: ${profile.toeflScore || "N/A"}, SAT: ${profile.satScore || "N/A"}, ACT: ${profile.actScore || "N/A"}
- Advanced Courses: AP: ${profile.apCourses || "N/A"}, IB: ${profile.ibCourses || "N/A"}
- Awards/Olympiads/Competitions: ${profile.awards || "N/A"}, Olympiads: ${profile.olympiads || "N/A"}, ${profile.competitions || "N/A"}
- Volunteer Activities: ${profile.volunteerActivities || "N/A"}
- Leadership Experience: ${profile.leadershipExperience || "N/A"}
- Extracurriculars: ${profile.extracurricularActivities || "N/A"}
- Skills: Programming: ${profile.programmingSkills || "N/A"}, Languages: ${profile.languageSkills || "N/A"}
- Career Interests: ${profile.careerInterests || "N/A"}

Generate 5-7 customized university recommendation matches. For each:
1. Provide the university's official name, country, and global/country rank.
2. Formulate a Match Percentage (an integer between 5% and 100%) indicating how well the student's credentials align compared to successful previous applicants from Mongolia.
3. Classify its entry difficulty (Reach school, Target school, or Safety school).
4. Evaluate specific positive match factors (e.g. GPA, Test scores, Awards, Leadership, extraccs).
5. Give highly practical application advice detailing required documents, minimum scores, or recommended improvements (such as Retake SAT, emphasis on personal statement, etc).

Output the result strictly as a JSON object of this structure:
{
  "recommendations": [
    {
      "universityName": "University Name",
      "country": "Country",
      "ranking": 25,
      "matchPercentage": 75,
      "difficulty": "Target",
      "gpaFactor": "Feedback about GPA against entry requirements",
      "testFactor": "Feedback about IELTS/TOEFL/SAT",
      "activitiesFactor": "Feedback about Olympiads/Leadership/Extracurriculars",
      "actionableAdvice": "Concrete, friendly application tips tailored for Mongolian students navigating visa and scholarship options for this school"
    }
  ]
}
Do not write any markdown wrappers (and no \`\`\`json) outside the pure JSON payload.
`;

    const response = await generateAIContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("AI Recommendation Error:", error);
    res.status(500).json({ error: error.message || "Failed to make AI university recommendations" });
  }
});

// 2. AI Essay Assistant Endpoint 
app.post("/api/essay-analyze", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Essay content is required." });
    }
    const ai = getGenAI();

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
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("AI Essay Analysis Error:", error);
    res.status(500).json({ error: error.message || "Failed to perform essay analysis." });
  }
});

// 3. AI Scholarship Finder Endpoint
app.post("/api/scholarships-recommend", async (req, res) => {
  try {
    const profile = req.body;
    const ai = getGenAI();

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
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("AI Scholarship Finder Error:", error);
    res.status(500).json({ error: error.message || "Failed to locate scholarships." });
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
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BNX Full-stack local server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Boot failure:", err);
});
