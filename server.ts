import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  runTransaction,
} from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json";

dotenv.config();

const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const dbServer = (firebaseConfig as any).firestoreDatabaseId
  ? getFirestore(firebaseApp, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(firebaseApp);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Helper to check if a user is an authorized BNX admin
async function isUserAdmin(uid: string, email?: string): Promise<boolean> {
  if (email && email.toLowerCase() === "naranbadrakh1013@gmail.com")
    return true;
  try {
    const profileSnap = await getDoc(doc(dbServer, "profiles", uid));
    if (profileSnap.exists() && profileSnap.data().role === "admin")
      return true;
    const adminSnap = await getDoc(doc(dbServer, "admins", uid));
    if (adminSnap.exists()) return true;
  } catch (e) {
    console.error("isUserAdmin check error:", e);
  }
  return false;
}

// Lazy initializer for Google GenAI Client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
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

// Helper to pause execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to safely strip markdown code blocks before parsing JSON
function cleanAndParseJSON(rawText: string) {
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

// Robust wrapper with automatic retry and valid Gemini models
async function generateAIContentWithFallback(params: {
  contents: string;
  config?: any;
}): Promise<any> {
  const modelsToTry = ["gemini-3.6-flash", "gemini-flash-latest"];
  let lastError: any = null;

  for (const model of modelsToTry) {
    let attempt = 0;
    const maxAttempts = 2;

    while (attempt < maxAttempts) {
      try {
        console.log(
          `[AI] Attempting AI generation using model: ${model} (Attempt ${attempt + 1}/${maxAttempts})`,
        );
        const ai = getGenAI();
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        return response;
      } catch (error: any) {
        lastError = error;
        attempt++;

        const errorMessage = error?.message || "";
        const errorCode = error?.status || error?.code || 0;

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

async function verifyUserPaymentAccess(
  uid?: string,
  email?: string,
): Promise<boolean> {
  // Payment system is disabled for now - open access to all users
  return true;
}

// 1. AI University Recommendation Endpoint
app.post("/api/recommend", async (req, res) => {
  try {
    const profile = req.body;
    const hasAccess = await verifyUserPaymentAccess(profile.uid, profile.email);
    if (!hasAccess) {
      return res
        .status(403)
        .json({
          error:
            "Энэ AI боломжийг ашиглахын тулд BNX төлбөрөө баталгаажуулна уу (100,000₮).",
        });
    }

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
    const { title, content, uid, email } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Essay content is required." });
    }

    const hasAccess = await verifyUserPaymentAccess(uid, email);
    if (!hasAccess) {
      return res
        .status(403)
        .json({
          error:
            "Энэ AI боломжийг ашиглахын тулд BNX төлбөрөө баталгаажуулна уу (100,000₮).",
        });
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
    const hasAccess = await verifyUserPaymentAccess(profile.uid, profile.email);
    if (!hasAccess) {
      return res
        .status(403)
        .json({
          error:
            "Энэ AI боломжийг ашиглахын тулд BNX төлбөрөө баталгаажуулна уу (100,000₮).",
        });
    }

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

// ==================================================
// BNX STUDENT REGISTRATION & UNIQUE REFERENCE API
// ==================================================
app.post("/api/students/assign-reference", async (req, res) => {
  try {
    const { uid, firstName, lastName, email } = req.body;
    if (!uid || !email) {
      return res
        .status(400)
        .json({ error: "Хэрэглэгчийн и-мэйл эсвэл ID дутуу байна." });
    }

    const isAdminUser = email.toLowerCase() === "naranbadrakh1013@gmail.com";
    let transactionReference = `student_${uid.slice(0, 4)}`;
    let profileDataResult: any = null;

    try {
      const profileRef = doc(dbServer, "profiles", uid);
      const existingSnap = await getDoc(profileRef);

      if (existingSnap.exists() && existingSnap.data().transactionReference) {
        transactionReference = existingSnap.data().transactionReference;
        const updatedData: any = {
          firstName: firstName || existingSnap.data().firstName || "",
          lastName: lastName || existingSnap.data().lastName || "",
          name:
            `${lastName || existingSnap.data().lastName || ""} ${firstName || existingSnap.data().firstName || ""}`.trim() ||
            existingSnap.data().name ||
            "Оюутан",
          role: isAdminUser ? "admin" : existingSnap.data().role || "student",
          updatedAt: new Date().toISOString(),
        };
        await updateDoc(profileRef, updatedData).catch(() => {});
        profileDataResult = {
          ...existingSnap.data(),
          ...updatedData,
          transactionReference,
        };
      } else {
        // Atomic counter transaction for sequential unique transaction reference (student_00, student_01, student_02...)
        try {
          const counterRef = doc(dbServer, "counters", "student_reference");
          transactionReference = await runTransaction(
            dbServer,
            async (transaction) => {
              const counterDoc = await transaction.get(counterRef);
              let nextVal = 0;
              if (counterDoc.exists()) {
                nextVal = counterDoc.data().value || 0;
              }
              const refStr = `student_${String(nextVal).padStart(2, "0")}`;
              transaction.set(
                counterRef,
                { value: nextVal + 1, updatedAt: new Date().toISOString() },
                { merge: true },
              );
              return refStr;
            },
          );
        } catch (counterErr) {
          console.warn("Counter transaction fallback note:", counterErr);
          transactionReference = `student_${Math.floor(10 + Math.random() * 90)}`;
        }

        const fullName =
          `${lastName || ""} ${firstName || ""}`.trim() || email.split("@")[0];

        const newProfileData = {
          uid,
          firstName: firstName || "",
          lastName: lastName || "",
          name: fullName,
          email,
          role: isAdminUser ? "admin" : "student",
          transactionReference,
          paymentStatus: "paid",
          accessStatus: "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await setDoc(profileRef, newProfileData, { merge: true }).catch(
          () => {},
        );
        profileDataResult = newProfileData;

        if (isAdminUser) {
          try {
            await setDoc(
              doc(dbServer, "admins", uid),
              {
                userId: uid,
                email,
                role: "admin",
                createdAt: new Date().toISOString(),
              },
              { merge: true },
            );
          } catch (adminErr) {
            console.warn("Admin doc set note:", adminErr);
          }
        }
      }
    } catch (fsErr: any) {
      console.warn(
        "Firestore profile assign note, providing local fallback profile:",
        fsErr?.message || fsErr,
      );
      const fullName =
        `${lastName || ""} ${firstName || ""}`.trim() || email.split("@")[0];
      profileDataResult = {
        uid,
        firstName: firstName || "",
        lastName: lastName || "",
        name: fullName,
        email,
        role: isAdminUser ? "admin" : "student",
        transactionReference,
        paymentStatus: "paid",
        accessStatus: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    res.json({
      success: true,
      transactionReference,
      profile: profileDataResult,
      role: isAdminUser ? "admin" : "student",
    });
  } catch (error: any) {
    console.error("Assign reference error:", error);
    const fallbackName = req.body?.email?.split("@")[0] || "Оюутан";
    res.json({
      success: true,
      transactionReference: "student_01",
      profile: {
        uid: req.body?.uid || "guest",
        email: req.body?.email || "",
        firstName: req.body?.firstName || "",
        lastName: req.body?.lastName || "",
        name: fallbackName,
        role:
          (req.body?.email || "").toLowerCase() === "naranbadrakh1013@gmail.com"
            ? "admin"
            : "student",
        transactionReference: "student_01",
        paymentStatus: "paid",
        accessStatus: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      role:
        (req.body?.email || "").toLowerCase() === "naranbadrakh1013@gmail.com"
          ? "admin"
          : "student",
    });
  }
});

// ==================================================
// BNX PAYMENT REQUEST SUBMISSION ("БИ ТӨЛСӨН")
// ==================================================
app.post("/api/payment-requests/submit", async (req, res) => {
  try {
    const { uid, email, studentName, transactionReference } = req.body;
    if (!uid) {
      return res.status(400).json({ error: "Хэрэглэгчийн ID шаардлагатай." });
    }

    let userProfile: any = {
      uid,
      email: email || "",
      name: studentName || "Оюутан",
      transactionReference: transactionReference || "student_01",
    };

    try {
      const profileRef = doc(dbServer, "profiles", uid);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        userProfile = { ...userProfile, ...profileSnap.data() };
      }

      // Ensure profile doc exists and set paymentStatus to pending
      await setDoc(
        profileRef,
        {
          ...userProfile,
          paymentStatus: "pending",
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      ).catch(() => {});

      // Create new payment verification request
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const reqRef = doc(dbServer, "paymentRequests", requestId);

      const newRequest = {
        id: requestId,
        userId: uid,
        studentName:
          userProfile.name || studentName || userProfile.email || "Оюутан",
        email: userProfile.email || email || "",
        transactionReference:
          userProfile.transactionReference ||
          transactionReference ||
          "student_01",
        amount: 100000,
        status: "pending",
        submittedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      await setDoc(reqRef, newRequest).catch(() => {});
    } catch (fsErr: any) {
      console.log("Submit payment info:", fsErr?.message || fsErr);
    }

    res.json({
      success: true,
      isAlreadyPending: false,
      message:
        "Таны төлбөрийн хүсэлт илгээгдлээ. Админ таны шилжүүлгийг шалгасны дараа бүртгэл баталгаажна.",
    });
  } catch (error: any) {
    console.error("Submit payment request error:", error);
    res.json({
      success: true,
      isAlreadyPending: false,
      message:
        "Таны төлбөрийн хүсэлт илгээгдлээ. Админ таны шилжүүлгийг шалгасны дараа бүртгэл баталгаажна.",
    });
  }
});

// ==================================================
// BNX ADMIN ROLE CHECK & DASHBOARD DATA
// ==================================================
app.get("/api/admin/data", async (req, res) => {
  try {
    const adminUid = req.query.adminUid as string;
    const adminEmail = req.query.adminEmail as string;

    if (!adminUid) {
      return res.status(401).json({ error: "Нэвтрэх шаардлагатай." });
    }

    const isAdmin = await isUserAdmin(adminUid, adminEmail);
    if (!isAdmin) {
      return res.status(403).json({ error: "BNX Админ эрхгүй байна." });
    }

    const profilesSnap = await getDocs(collection(dbServer, "profiles"));
    let totalUsers = 0;
    let activeUsers = 0;
    const users: any[] = [];
    profilesSnap.forEach((docSnap) => {
      totalUsers++;
      const data = docSnap.data();
      users.push(data);
      if (data.accessStatus === "active" || data.paymentStatus === "paid") {
        activeUsers++;
      }
    });

    const reqsSnap = await getDocs(collection(dbServer, "paymentRequests"));
    const requests: any[] = [];
    let pendingRequests = 0;
    let approvedRequests = 0;
    let declinedRequests = 0;

    reqsSnap.forEach((docSnap) => {
      const data = docSnap.data();
      requests.push(data);
      if (data.status === "pending") pendingRequests++;
      else if (data.status === "approved") approvedRequests++;
      else if (data.status === "declined") declinedRequests++;
    });

    requests.sort(
      (a, b) =>
        new Date(b.submittedAt || 0).getTime() -
        new Date(a.submittedAt || 0).getTime(),
    );
    users.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    );

    res.json({
      success: true,
      stats: {
        totalUsers,
        pendingRequests: 0,
        approvedRequests,
        declinedRequests,
        activeUsers: totalUsers,
      },
      requests,
      users,
    });
  } catch (error: any) {
    console.error("Admin data error:", error);
    res
      .status(500)
      .json({ error: error.message || "Админ мэдээлэл авахад алдаа гарлаа." });
  }
});

// ==================================================
// BNX ADMIN APPROVE PAYMENT ("ЗӨВШӨӨРӨХ")
// ==================================================
app.post("/api/admin/approve-payment", async (req, res) => {
  try {
    const { adminUid, adminEmail, requestId, userId } = req.body;
    if (!adminUid || !requestId || !userId) {
      return res
        .status(400)
        .json({ error: "Шаардлагатай параметрүүд дутуу байна." });
    }

    const isAdmin = await isUserAdmin(adminUid, adminEmail);
    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "Зөвхөн баталгаажсан BNX Админ хийх боломжтой." });
    }

    const now = new Date();
    const oneMonthLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const reqRef = doc(dbServer, "paymentRequests", requestId);
    await updateDoc(reqRef, {
      status: "approved",
      reviewedAt: now.toISOString(),
      reviewedBy: adminUid,
    });

    const profileRef = doc(dbServer, "profiles", userId);
    await updateDoc(profileRef, {
      paymentStatus: "paid",
      accessStatus: "active",
      subscriptionStart: now.toISOString(),
      subscriptionEnd: oneMonthLater.toISOString(),
      updatedAt: now.toISOString(),
    });

    res.json({
      success: true,
      message: "Төлбөр баталгаажиж, BNX эрх 1 сараар идэвхжлээ.",
    });
  } catch (error: any) {
    console.error("Approve payment error:", error);
    res
      .status(500)
      .json({
        error: error.message || "Төлбөр баталгаажуулахад алдаа гарлаа.",
      });
  }
});

// ==================================================
// BNX ADMIN DECLINE PAYMENT ("ТАТГАЛЗАХ")
// ==================================================
app.post("/api/admin/decline-payment", async (req, res) => {
  try {
    const { adminUid, adminEmail, requestId, userId, reason } = req.body;
    if (!adminUid || !requestId || !userId) {
      return res
        .status(400)
        .json({ error: "Шаардлагатай параметрүүд дутуу байна." });
    }

    const isAdmin = await isUserAdmin(adminUid, adminEmail);
    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "Зөвхөн баталгаажсан BNX Админ хийх боломжтой." });
    }

    const now = new Date();

    const reqRef = doc(dbServer, "paymentRequests", requestId);
    await updateDoc(reqRef, {
      status: "declined",
      reviewedAt: now.toISOString(),
      reviewedBy: adminUid,
      declineReason: reason || "Гүйлгээний утга эсвэл дүн шаардлага хангаагүй.",
    });

    const profileRef = doc(dbServer, "profiles", userId);
    await updateDoc(profileRef, {
      paymentStatus: "declined",
      accessStatus: "inactive",
      updatedAt: now.toISOString(),
    });

    res.json({
      success: true,
      message: "Хүсэлтэд татгалзсан хариу илгээгдлээ.",
    });
  } catch (error: any) {
    console.error("Decline payment error:", error);
    res
      .status(500)
      .json({ error: error.message || "Төлбөр цуцлахад алдаа гарлаа." });
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
