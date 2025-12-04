// src/aiService.ts
import { MCQ } from "./types";

type AIResponse = {
  questions: MCQ[];
};

// 👇 Replace this with your actual Vercel URL
const VERCEL_BASE =
  process.env.NODE_ENV === "development"
    ? "https://YOUR-PROJECT-NAME.vercel.app"
    : ""; // in production, relative `/api/...` works

// Call Vercel serverless: /api/generate-mcqs
export async function generateMCQs(topic: string): Promise<AIResponse> {
  const res = await fetch(`${VERCEL_BASE}/api/generate-mcqs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Backend error ${res.status}: ${text}`);
  }

  const data = await res.json();

  if (!Array.isArray(data.questions) || data.questions.length !== 5) {
    throw new Error("Malformed questions received from backend.");
  }

  return data as AIResponse;
}

// Call Vercel serverless: /api/feedback
export async function generateFeedback(
  topic: string,
  scorePercent: number
): Promise<string> {
  const res = await fetch(`${VERCEL_BASE}/api/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, score: scorePercent }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Backend error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const feedback = (data.feedback as string) || "";

  if (!feedback.trim()) {
    throw new Error("Empty feedback returned from backend.");
  }

  return feedback.trim();
}
