📘 AI-Assisted Knowledge Quiz

An interactive quiz generator powered by Google Gemini AI.
Users enter a topic → AI generates MCQs → user takes quiz → AI gives personalized feedback.



1. Project Setup & Demo
Run the project locally
npm install
npm start

Environment Variables

Create a .env file in the project root:

REACT_APP_GEMINI_KEY=your_api_key_here
REACT_APP_GEMINI_MODEL=gemini-1.5-flash


Note: You must restart the development server after editing .env.

Demo



🧠 2. Problem Understanding

The requirement is to build an AI-assisted quiz with 4 screens:

Topic selection

AI-generated MCQs (exactly 5 questions)

Interactive quiz UI with progress and navigation

Result screen with AI-generated feedback

Key goals:

AI must return consistent JSON

App must detect malformed JSON and retry automatically

Quiz UI should be clean, modern, and responsive

Use organized component-based architecture

Assumptions:

Gemini API returns valid results within max 3 retries

MCQs contain 3–4 options

Score-based feedback should be encouraging and helpful


3. AI Prompts & Iterations
MCQ Generation Prompt

The model is instructed strictly:

{
  "questions": [
    { "q": "Question?", "options": ["A","B","C","D"], "answer": 0 }
  ]
}


Rules enforced:

Must generate exactly 5 MCQs

“answer” must be the 0-based index

No explanation, no extra text

If JSON invalid → retry up to 3 times

Feedback Prompt

AI receives:

Topic

Score percentile

Returns:

1–2 sentence encouragement

2 improvement suggestions

Plain text only