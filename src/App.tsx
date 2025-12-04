import React, {useState} from "react";
import TopicChoose from "./components/TopicChoose";
import GenerateScreen from "./components/GenerateScreen";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";
import {MCQ} from "./types";

function App() {
  const [topic, setTopic] = useState<string>("");
  const [questions, setQuestions] = useState<MCQ[] | null>(null);
  const [score, setScore] = useState<number | null>(null);

  // reset to start a new flow
  function resetAll() {
    setTopic("");
    setQuestions(null);
    setScore(null);
  }

  return (
    
    <div className="app" style={{maxWidth: 760, margin: "24px auto", padding: 20}}>
      <h1 className="main-title">AI-Assisted Knowledge Quiz</h1>

      {/* Screen 1: Topic */}
      {!topic && <TopicChoose onNext={(t) => setTopic(t)} />}

      {/* Screen 2: Generate */}
      {topic && !questions && !score && (
        <GenerateScreen
          topic={topic}
          onReady={(q) => setQuestions(q)}
          onBack={() => setTopic("")}
        />
      )}

      {/* Screen 3: Quiz */}
      {questions && score === null &&(
        <QuizScreen
          questions={questions}
          onFinish={(s) => setScore(s)}
          onRestart={() => {
            setQuestions(null);
            setTopic("");
          }}
        />
      )}

      {/* Screen 4: Result */}
      {score !== null && questions && (
        <ResultScreen
          topic={topic}
          scorePercent={score}          
          onRestart={() => {
            setScore(null);
            setQuestions(null);
          }}
          onChangeTopic={() => {
            setTopic("");
            setScore(null);
            setQuestions(null);
          }}
        />

      )}
    </div>
  );
}

export default App;
