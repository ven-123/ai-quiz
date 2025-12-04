import { GoogleGenerativeAI } from "@google/generative-ai";
import { MCQ } from "./types";

const API_KEY = process.env.REACT_APP_GEMINI_KEY;
const MODEL = process.env.REACT_APP_GEMINI_MODEL || "gemini-2.5-flash";

if (!API_KEY) {
  throw new Error("Missing REACT_APP_GEMINI_KEY environment variable.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL });

async function getResponseText(responseObj: any): Promise<string> {
  const resp = responseObj?.response ?? responseObj;
  const maybeText = resp?.text ?? resp?.output?.[0]?.content?.[0]?.text;

  if (typeof maybeText === "function") {
    const val = maybeText.call(resp);
    return typeof val === "string" ? val : await Promise.resolve(val);
  }

  return String(maybeText ?? "");
}

function extractJson(text: string) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in model response:\n" + text);
  try {
    return JSON.parse(match[0]);
  } catch (err) {
    throw new Error("Failed to parse JSON from model response:\n" + match[0]);
  }
}

export async function generateMCQs(topic: string): Promise<{ questions: MCQ[] }> {
  const prompt = `
Return ONLY valid JSON:
{
  "questions": [
    { "q": "Question?", "options": ["A","B","C","D"], "answer": 0 }
  ]
}
Generate EXACTLY 5 MCQs about: "${topic}"
Rules:
- options must be 3–4 strings
- answer must be a number (0-based index)
- NO explanation, NO extra text. Only the JSON object above.
`;

  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = await getResponseText(result);

      if (!text || !text.trim()) {
        throw new Error("Empty text returned by model.");
      }

      const parsed = extractJson(text);

      if (!Array.isArray(parsed.questions) || parsed.questions.length !== 5) {
        throw new Error("Parsed JSON does not contain 5 questions.");
      }

      for (const q of parsed.questions) {
        if (!q || typeof q.q !== "string" || !Array.isArray(q.options)) {
          throw new Error("Invalid question shape in parsed JSON.");
        }
      }

      return parsed as { questions: MCQ[] };
    } catch (err: any) {
      if (attempt >= maxAttempts) {
        throw new Error(
          `AI returned malformed JSON after ${maxAttempts} attempts. Last error: ${String(
            err?.message ?? err
          )}`
        );
      }
      await new Promise((r) => setTimeout(r, 300 * attempt));
    }
  }

  throw new Error("Unexpected error generating MCQs.");
}

export async function generateFeedback(topic: string, scorePercent: number): Promise<string> {
  const prompt = `You are an encouraging teacher.
Topic: "${topic}"
Score: ${scorePercent}%.

Give short (1–2 sentences) friendly feedback + 2 areas to revise.
Return plain text only.
`;

  const result = await model.generateContent(prompt);
  const text = await getResponseText(result);

  if (!text || !text.trim()) {
    throw new Error("Empty response from model when generating feedback.");
  }

  return text.trim();
}
