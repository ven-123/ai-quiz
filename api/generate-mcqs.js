// api/generate-mcqs.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

function extractJson(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("No JSON object found in Gemini response.");
  }
  return JSON.parse(match[0]);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY not set in environment" });
  }

  const { topic } = req.body || {};
  if (!topic || !topic.trim()) {
    return res.status(400).json({ error: "Missing topic" });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `
Return ONLY valid JSON:
{
  "questions": [
    { "q": "Question?", "options": ["A","B","C","D"], "answer": 0 }
  ]
}

Generate EXACTLY 5 multiple-choice questions about: "${topic}"

Rules:
- "options" must contain 3–4 choices.
- "answer" must be the 0-based index of the correct option.
- NO explanation, NO extra text. Only the JSON.
`;

    let attempts = 0;
    const maxAttempts = 3;
    let lastError = null;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const parsed = extractJson(text);

        if (!parsed.questions || parsed.questions.length !== 5) {
          throw new Error("Invalid MCQ JSON structure");
        }

        // Success
        return res.status(200).json(parsed);
      } catch (err) {
        lastError = err;
      }
    }

    return res.status(500).json({
      error: "AI returned malformed JSON after multiple attempts.",
      details: String(lastError),
    });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
