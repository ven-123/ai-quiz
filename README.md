## AI-Assisted Knowledge Quiz

An interactive web application that generates quizzes using AI. Users enter any topic, receive AI-generated multiple-choice questions, attempt the quiz, and get personalized feedback based on their performance.


## Project Setup and Demo

### Running the Application Locally
npm install
npm start

### Environment Variables

Create a .env file in the project root:

REACT_APP_GEMINI_KEY=your_api_key_here
REACT_APP_GEMINI_MODEL=gemini-1.5-flash


Restart the server after modifying .env.

Demo (Optional)

Provide screen recording or hosted link demonstrating all four screens:

Topic selection

Quiz generation

Quiz interface

Score + AI feedback


## Problem Understanding

The goal is to build an AI-assisted quiz generator that:

Accepts any topic from the user

Generates exactly 5 multiple-choice questions using AI

Ensures the AI produces valid structured JSON

Displays questions sequentially with navigation

Tracks user progress and selected answers

Computes the final score

Generates personalized feedback using AI

### Key Constraints & Assumptions

AI may occasionally return malformed JSON → must retry

Options must contain 3–4 choices

Answer index must be 0-based

Feedback should be concise, helpful, and friendly


## AI Prompts
### MCQ Generation Prompt

The AI is instructed to return strictly formatted JSON:

{
  "questions": [
    { "q": "Question?", "options": ["A","B","C","D"], "answer": 0 }
  ]
}


Rules enforced:

Return only JSON

Exactly 5 questions

Options: 3–4 items

answer: number (0-based)

No extra explanation

### Retry Logic

If the model returns malformed or partial JSON:

Attempt parsing

If parsing fails, retry up to 3 times

After maximum retries, show a user-facing error

### Feedback Prompt

Given:

Topic

Score percentage

The AI returns:

1–2 sentence constructive feedback

Two improvement suggestions

## Architecture
### Component Flow
TopicChoose → GenerateScreen → QuizScreen → ResultScreen

### Code Structure
src/
  components/
    TopicChoose.tsx
    GenerateScreen.tsx
    QuizScreen.tsx
    ResultScreen.tsx
  aiService.ts
  App.tsx
  App.css

### Responsibilities

TopicChoose: gather user input

GenerateScreen: trigger AI request + handle retry logic

QuizScreen: display questions, navigation, progress bar

ResultScreen: show score + AI feedback

aiService: manages Gemini requests & JSON validation

### Styling

Fully custom CSS

Modern gradient UI

Responsive layout

Reusable components (.btn, .card, .option, .progress)

## Demo

### Topic Selection
![Topic Selection](public/screenshots/screen_1.png)

### Quiz Generation (AI Loading)
![Quiz Loading](public/screenshots/screen_2.png)

### Quiz Interface
![Quiz Interface](public/screenshots/screen_3.png)

### Result & AI Feedback
![Result Screen](public/screenshots/screen_4.png)


## Known Issues / Improvements
### Potential Enhancements

Add correct/incorrect indicators after answering

Add quiz explanation mode

Add option to select difficulty level

Add timer modes

Add animations between question transitions

Persist quiz history using localStorage

### Technical Improvements

Add schema validation for AI output

Implement debounce for topic input

Convert AI service to use AbortControllers for cancellation


## Bonus Work

Robust retry mechanism for malformed AI responses

Modern design system with reusable utility classes

Gradient score indicator and improved UI polish

Mobile-optimized responsive UI

Clear separation of screens and service logic

Enhanced visual feedback on option selection