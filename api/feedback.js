// api/feedback.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!apiKey) {
    res.status(500).json({ error: "GEMINI_API_KEY not set in environment" });
    return;
  }

  const { topic, score } = req.body || {};
  if (!topic || typeof score !== "number") {
    res.status(400).json({ error: "Missing topic or score" });
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `
You are an encouraging teacher.
Topic: "${topic}"
Score: ${score}%.
Give short (1–2 sentences) friendly feedback + 2 areas to revise.
Return plain text only.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text()?.trim() || "No feedback available.";

    res.status(200).json({ feedback: text });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};