// src/aiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MCQ } from "./types";

// Load env vars
const API_KEY = process.env.REACT_APP_GEMINI_KEY!;
const MODEL = process.env.REACT_APP_GEMINI_MODEL || "gemini-2.5-flash";

if (!API_KEY) {
  throw new Error("Missing REACT_APP_GEMINI_KEY in .env");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL });

function extractJson(text: string) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in response:\n" + text);
  return JSON.parse(match[0]);
}

// ------------------ Generate MCQs --------------------
export async function generateMCQs(topic: string): Promise<{ questions: MCQ[] }> {
  const prompt = `
Return ONLY valid JSON:
{
  "questions": [
    { "q": "Question?", "options": ["A","B","C","D"], "answer": 0 }
  ]
}

Generate EXACTLY 5 MCQs about "${topic}".
Rules:
- "options" must be 3–4 strings
- "answer" must be 0-based index
- strictly no extra text
  `;

  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      const parsed = extractJson(text);

      if (parsed.questions?.length !== 5) {
        throw new Error("Did not receive 5 questions");
      }

      return parsed;
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  throw new Error("Unexpected error");
}

// ------------------ Generate Feedback --------------------
export async function generateFeedback(topic: string, scorePercent: number): Promise<string> {
  const prompt = `
Topic: ${topic}
Score: ${scorePercent}%

Give short friendly feedback (1–2 sentences) and 2 areas to revise.
Return plain text.
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return text.trim();
}