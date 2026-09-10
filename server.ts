import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY
  });
});

// AI Enhancement Endpoint
app.post("/api/ai-enhance", async (req, res) => {
  try {
    const {
      rawText,
      currentText,
      fieldLabel,
      tone = "impact",
      language = "id",
      customInstruction = "",
      contextHint = ""
    } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({
        error: "GEMINI_API_KEY belum dikonfigurasi. Silakan masukkan GEMINI_API_KEY di Settings AI Studio atau file .env.",
        missingKey: true
      });
    }

    if (!rawText || typeof rawText !== "string" || !rawText.trim()) {
      return res.status(400).json({
        error: "Input kata mentah / draft tidak boleh kosong."
      });
    }

    const ai = getGenAI();

    const toneDescriptions: Record<string, string> = {
      impact: "High-impact, data-driven, highlighting measurable outcomes, efficiency metrics, and technical contributions.",
      executive: "Executive & formal, demonstrating leadership, strategic thinking, and senior industry communication standards.",
      concise: "Concise, punchy, action-verb first, zero fluff, easy for recruiters and hiring managers to scan.",
      creative: "Engaging and authentic narrative tone that captures personal motivation and unique character."
    };

    const targetToneDesc = toneDescriptions[tone] || toneDescriptions.impact;
    const targetLangDesc = language === "en" ? "English" : "Bahasa Indonesia formal & profesional";

    const prompt = `You are an expert executive resume writer and senior portfolio copywriter for top tech talents (Data Analysts, Analytics Engineers, Developers, and Tech Professionals).
Your task is to take the user's raw, unpolished thoughts/notes and turn them into 3 distinct, high-impact professional recommendations for a portfolio web field.

Field Context:
- Target Field: "${fieldLabel || "Portfolio Item"}"
${contextHint ? `- Field Hint: "${contextHint}"` : ""}
${currentText ? `- Current Value in field (for reference): "${currentText}"` : ""}
- User's Raw Input / Notes: "${rawText.trim()}"
- Target Tone: ${targetToneDesc}
- Target Language: ${targetLangDesc}
${customInstruction ? `- User's Specific Custom Instruction: "${customInstruction}"` : ""}

Guidelines:
1. Provide exactly 3 diverse options with slightly different emphasis (e.g. Option 1: Metric & Action-driven, Option 2: Executive & Holistic, Option 3: Concise & Direct).
2. For bullet points or short fields, keep them sharp, impactful, and without unnecessary filler.
3. For longer bios/summaries, make the structure compelling and easy to read.
4. Output MUST be valid JSON only. Do not include markdown code block quotes like \`\`\`json. Return strictly the raw JSON object.

Format strictly as JSON:
{
  "recommendations": [
    {
      "title": "Action & Impact",
      "text": "Enhanced text ready for insertion...",
      "description": "Menonjolkan hasil terukur dan efisiensi"
    },
    {
      "title": "Executive & Leadership",
      "text": "Enhanced text ready for insertion...",
      "description": "Bahasa formal dengan perspektif manajerial/strategis"
    },
    {
      "title": "Concise & Direct",
      "text": "Enhanced text ready for insertion...",
      "description": "Singkat, padat, dan langsung ke inti pencapaian"
    }
  ]
}`;

    const modelsToTry = ["gemini-3.5-flash-lite", "gemini-2.5-pro"];
    let responseText = "";
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt
        });
        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed, trying next fallback:`, err.message || err);
      }
    }

    if (!responseText) {
      throw lastError || new Error("Gagal mendapatkan respons dari model Gemini.");
    }

    // Clean any markdown formatting if present
    let cleaned = responseText.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    try {
      const parsed = JSON.parse(cleaned);
      if (parsed && Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0) {
        return res.json(parsed);
      }
    } catch (parseErr) {
      console.warn("JSON parse failed, attempting fallback extraction:", parseErr);
    }

    // Fallback: package text into standard recommendations structure
    return res.json({
      recommendations: [
        {
          "title": "Rekomendasi Utama",
          "text": responseText.replace(/```/g, "").trim(),
          "description": "Hasil polesan AI"
        }
      ]
    });
  } catch (error: any) {
    console.error("Error in /api/ai-enhance:", error);
    return res.status(500).json({
      error: error.message || "Gagal menghasilkan rekomendasi AI.",
      details: error.toString()
    });
  }
});

// Dedicated AI endpoint to deconstruct raw job explanations into selectable professional bullet points with variations
app.post("/api/ai-job-bullets", async (req, res) => {
  try {
    const { role, company, explanation, language = "id", tone = "impact" } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY belum dikonfigurasi. Silakan masukkan GEMINI_API_KEY di Settings AI Studio atau file .env.",
        missingKey: true
      });
    }

    if (!explanation || typeof explanation !== "string" || !explanation.trim()) {
      return res.status(400).json({
        error: "Penjelasan pekerjaan tidak boleh kosong."
      });
    }

    const ai = getGenAI();

    const targetLangDesc = language === "en" ? "English" : "Bahasa Indonesia formal & profesional";

    const prompt = `You are an elite career coach and executive resume writer for tech and data professionals.
The user is describing their daily work, tasks, and responsibilities for a specific job experience.
Job Details:
- Role / Posisi: "${role || "Professional"}"
- Company: "${company || "-"}"
- User's Explanation of what they did: "${explanation.trim()}"
- Target Language: ${targetLangDesc}
- Tone Preference: ${tone}

Your task:
1. Carefully analyze what the user did and deconstruct their explanation into 3 to 5 distinct, high-value professional accomplishment & responsibility bullet points.
2. For EACH bullet point:
   - Provide a concise category "theme" (e.g. "Pipeline & Otomasi", "Optimasi SQL & Query", "Dashboard & Visualisasi", "Leadership & Mentoring").
   - Provide 2 or 3 distinct alternative phrasing recommendations:
     * Option A (Impact & Metrics - formula: Action Verb + Project/Context + Measurable Outcome / Efficiency)
     * Option B (Technical Depth - emphasizing tools, tech stack, architecture, and standards)
     * Option C (Concise & Standard - clear, direct, and recruiter-friendly)
3. Return STRICTLY valid JSON without code blocks or markdown wrappers.

Format strictly as JSON:
{
  "points": [
    {
      "id": "point_1",
      "theme": "Otomasi & Data Pipeline",
      "options": [
        {
          "label": "Fokus Metrik & Hasil",
          "text": "Merancang dan mengotomatisasi pipeline ETL harian menggunakan Python dan Apache Airflow, memangkas waktu pemrosesan data sebesar 45%."
        },
        {
          "label": "Fokus Teknis & Arsitektur",
          "text": "Membangun arsitektur data pipeline berbasis Python dan Apache Airflow dengan logging terpusat dan mekanisme auto-retry."
        },
        {
          "label": "Ringkas & Padat",
          "text": "Mengembangkan alur kerja ETL otomatis dengan Python dan Airflow untuk konsistensi data pelaporan."
        }
      ]
    }
  ]
}`;

    const modelsToTry = ["gemini-3.5-flash-lite", "gemini-2.5-pro"];
    let responseText = "";
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt
        });
        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed in /api/ai-job-bullets, trying next:`, err.message || err);
      }
    }

    if (!responseText) {
      throw lastError || new Error("Gagal mendapatkan respons dari model Gemini.");
    }

    let cleaned = responseText.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    try {
      const parsed = JSON.parse(cleaned);
      if (parsed && Array.isArray(parsed.points) && parsed.points.length > 0) {
        return res.json(parsed);
      }
    } catch (parseErr) {
      console.warn("JSON parse failed in /api/ai-job-bullets:", parseErr);
    }

    return res.status(500).json({
      error: "Gagal memproses format output rekomendasi poin AI."
    });
  } catch (error: any) {
    console.error("Error in /api/ai-job-bullets:", error);
    return res.status(500).json({
      error: error.message || "Gagal menghasilkan rekomendasi poin pekerjaan.",
      details: error.toString()
    });
  }
});

// Dedicated AI endpoint to translate and localize a single Job Experience item between Indonesian and English
app.post("/api/ai-translate-experience", async (req, res) => {
  try {
    const { sourceLang = "id", targetLang = "en", role = "", company = "", period = "", bulletPoints = [] } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY belum dikonfigurasi. Silakan masukkan GEMINI_API_KEY di Settings AI Studio atau file .env.",
        missingKey: true
      });
    }

    if (!role && !company && (!Array.isArray(bulletPoints) || bulletPoints.length === 0)) {
      return res.status(400).json({
        error: "Data pengalaman yang akan ditransfer tidak boleh kosong."
      });
    }

    const ai = getGenAI();

    const isIdToEn = sourceLang === "id" || targetLang === "en";
    const srcLangName = isIdToEn ? "Indonesian" : "English";
    const tgtLangName = isIdToEn ? "English" : "Indonesian";

    const prompt = `You are a world-class bilingual resume consultant and professional translator specializing in tech, business, and industry career portfolios.
Your task is to translate and professionally localize a SINGLE work experience item from ${srcLangName} to ${tgtLangName}.

Original Work Experience Data (${srcLangName}):
- Role / Job Title: "${role}"
- Company / Organization: "${company}"
- Period / Date: "${period}"
- Key Achievements & Bullet Points (${bulletPoints.length} points):
${bulletPoints.map((bp: string, i: number) => `  ${i + 1}. "${bp}"`).join("\n")}

CRITICAL TRANSLATION & LOCALIZATION RULES:
1. DO NOT do a word-for-word machine translation. You must adapt terms contextually for high-level professional resumes.
2. If translating to English:
   - Acronyms and Indonesian institutions must be translated clearly. For example, "SMK" -> "Vocational High School", "SMA" -> "Senior High School", "Magang" -> "Internship", "Sekarang" / "Hingga Saat Ini" -> "Present", "Freelance" -> "Freelance / Contract", "Staf" -> "Specialist / Associate / Staff".
   - Bullet points must start with powerful English action verbs (e.g. "Architected", "Engineered", "Optimized", "Collaborated", "Spearheaded", "Maintained", "Executed").
   - Maintain measurable metrics, tools, and technical stacks accurately.
3. If translating to Indonesian:
   - Use standard formal Indonesian professional CV terminology (e.g. "Present" -> "Sekarang", "Intern" -> "Pemagang / Magang", "Developed" -> "Mengembangkan", "Implemented" -> "Menerapkan / Mengimplementasikan").
   - Keep global tech terms in industry standards (e.g. Python, SQL, REST API, Pipeline ETL).
4. For Period: Translate terms like "SEKARANG" <-> "PRESENT", "Jan" <-> "Jan", "Agu" <-> "Aug", "Okt" <-> "Oct", "Des" <-> "Dec".
5. Return strictly valid JSON with no markdown backticks, explanations, or wrappers.

JSON Output Schema:
{
  "role": "Translated Job Role",
  "company": "Translated / Cleaned Company Name",
  "period": "Translated Period String",
  "bulletPoints": [
    "Translated bullet point 1",
    "Translated bullet point 2"
  ]
}`;

    const modelsToTry = ["gemini-3.5-flash-lite", "gemini-2.5-pro"];
    let responseText = "";
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt
        });
        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed in /api/ai-translate-experience, trying next:`, err.message || err);
      }
    }

    if (!responseText) {
      throw lastError || new Error("Gagal mendapatkan respons terjemahan dari model Gemini.");
    }

    let cleaned = responseText.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    try {
      const parsed = JSON.parse(cleaned);
      if (parsed && typeof parsed.role === "string" && Array.isArray(parsed.bulletPoints)) {
        return res.json(parsed);
      }
    } catch (parseErr) {
      console.warn("JSON parse failed in /api/ai-translate-experience:", parseErr);
    }

    return res.status(500).json({
      error: "Gagal memproses format output terjemahan AI."
    });
  } catch (error: any) {
    console.error("Error in /api/ai-translate-experience:", error);
    return res.status(500).json({
      error: error.message || "Gagal melakukan transfer bahasa pengalaman kerja.",
      details: error.toString()
    });
  }
});

// Dedicated AI endpoint to translate and localize Subpage Items (Personality, Hobbies, Story Slides, Education, Goals) with Markdown preservation
app.post("/api/ai-translate-subpage-item", async (req, res) => {
  try {
    const {
      sourceLang = "id",
      targetLang = "en",
      itemType = "personality",
      title = "",
      description = "",
      note = ""
    } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY belum dikonfigurasi. Silakan masukkan GEMINI_API_KEY di Settings AI Studio atau file .env.",
        missingKey: true
      });
    }

    if (!title && !description) {
      return res.status(400).json({
        error: "Judul dan deskripsi yang akan ditransfer tidak boleh kosong."
      });
    }

    const ai = getGenAI();

    const isIdToEn = sourceLang === "id" || targetLang === "en";
    const srcLangName = isIdToEn ? "Indonesian" : "English";
    const tgtLangName = isIdToEn ? "English" : "Indonesian";

    const itemTypeDescriptions: Record<string, string> = {
      personality: "Personality Trait & Work Philosophy (principles, ethics, analytical approach, collaborative style)",
      hobby: "Hobby & Personal Creative Interest (lifestyle, passions, balance, creative pursuits)",
      career_goal: "Career Goal & Long-term Aspiration (strategic technical roadmap, leadership objectives)",
      story_slide: "About Me Story Presentation Slide (narrative journey, academic/project milestones)",
      education: "Educational Background & Academic Degree",
      methodology: "Core Methodology & Work Philosophy (analytical frameworks, engineering mindset, data governance, problem-solving approach)",
      generic: "Portfolio Subpage Content"
    };

    const typeDesc = itemTypeDescriptions[itemType] || itemTypeDescriptions.personality;

    const prompt = `You are a world-class bilingual copywriter and translator for top-tier professional portfolios and executive resumes.
Your task is to translate and professionally localize a "${typeDesc}" item from ${srcLangName} to ${tgtLangName}.

Original Item Data (${srcLangName}):
- Title: "${title}"
- Description / Narrative Body:
"""
${description}
"""
${note ? `- User Note / Custom Direction: "${note}"` : ""}

CRITICAL TRANSLATION & LOCALIZATION RULES:
1. Preserve all Markdown formatting intact:
   - If there are Markdown headers (e.g. ## Header or ### Subheader), translate the header text while keeping the exact '## ' or '### ' syntax.
   - Preserve bold tags (**text**), italic (*text*), bullet points (- or •), inline code (\`code\`), and links ([text](url)).
   - Maintain exact paragraph breaks and spacing.
2. Tone & Character:
   - For Personality: Reflect high-integrity, authentic, structured, and thoughtful work ethics and problem-solving mentality.
   - For Hobbies: Reflect engaging, authentic, and energizing creative balance.
   - For Story Slides: Flow naturally as an engaging portfolio narrative.
3. Natural localization:
   - Avoid awkward literal machine translation; adapt idioms and professional expressions naturally for an international audience.
   - Keep technical terms (e.g., Python, SQL, Power Query, Excel, ETL, AI prompt engineering) in standard industry format.
4. Output Format:
   - Return STRICTLY valid JSON without backticks, explanations, or code-block wrappers.

JSON Output Schema:
{
  "title": "Translated Title",
  "description": "Translated Description preserving all Markdown headers and formatting"
}`;

    const modelsToTry = ["gemini-3.5-flash-lite", "gemini-2.5-pro"];
    let responseText = "";
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt
        });
        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed in /api/ai-translate-subpage-item, trying next:`, err.message || err);
      }
    }

    if (!responseText) {
      throw lastError || new Error("Gagal mendapatkan respons terjemahan dari model Gemini.");
    }

    let cleaned = responseText.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    try {
      const parsed = JSON.parse(cleaned);
      if (parsed && typeof parsed.title === "string" && typeof parsed.description === "string") {
        return res.json(parsed);
      }
    } catch (parseErr) {
      console.warn("JSON parse failed in /api/ai-translate-subpage-item:", parseErr);
    }

    return res.status(500).json({
      error: "Gagal memproses format output terjemahan AI."
    });
  } catch (error: any) {
    console.error("Error in /api/ai-translate-subpage-item:", error);
    return res.status(500).json({
      error: error.message || "Gagal melakukan transfer bahasa konten.",
      details: error.toString()
    });
  }
});

// Vite middleware & production static handler
async function start() {
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
