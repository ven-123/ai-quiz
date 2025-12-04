// src/aiService.ts
import { MCQ } from "./types";

const VERCEL_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"        // Local dev
    : "";                            // Production → relative path "/api/..."

type AIResponse = { questions: MCQ[] };


// ------------------ CALL BACKEND: /api/generate-mcqs ------------------
export async function generateMCQs(topic: string): Promise<AIResponse> {
  const res = await fetch(`${VERCEL_BASE}/api/generate-mcqs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`Backend error ${res.status}: ${text}`);
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error("Invalid JSON from backend: " + text);
  }
}


// ------------------ CALL BACKEND: /api/generate-feedback ------------------
export async function generateFeedback(topic: string, score: number): Promise<string> {
  const res = await fetch(`${VERCEL_BASE}/api/generate-feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, score }),
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`Backend error ${res.status}: ${text}`);
  }

  return text;
}