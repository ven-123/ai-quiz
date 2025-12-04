import React, { useEffect, useState } from "react";
import { MCQ } from "../types";

type Props = {
  questions: MCQ[];
  onFinish: (scorePercent: number) => void;
  onRestart: () => void;
};

export default function QuizScreen({ questions, onFinish, onRestart }: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    Array(questions.length).fill(-1)
  );

  useEffect(() => {
    setIndex(0);
    setAnswers(Array(questions.length).fill(-1));
  }, [questions]);

  const q = questions[index];

  function selectOption(i: number) {
    setAnswers(prev => {
      const copy = [...prev];
      copy[index] = i;
      return copy;
    });
  }

  function submitQuiz() {
    let correct = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].answer) correct++;
    }
    const percent = Math.round((correct / questions.length) * 100);
    onFinish(percent);
  }

  const currentAnswered = answers[index] !== -1;

  return (
    <div className="app-container" style={{ maxWidth: 780, margin: "0 auto" }}>
      <button
        className="btn btn-ghost"
        onClick={onRestart}
        style={{ marginBottom: 16 }}
      >
        ⬅ Change Topic
      </button>

      <div className="card">
        <h2 className="h-title">
          Question {index + 1} / {questions.length}
        </h2>

        <div className="progress">
          <div
            className="progress-bar"
            style={{
              width: `${((index + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        <div className="question-wrap">
          <div className="question-title">{q.q}</div>

          <div className="options">
            {q.options.map((opt, i) => {
              const selected = answers[index] === i;

              return (
                <div
                  key={i}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selected}
                  className={`option ${selected ? "selected" : ""}`}
                  onClick={() => selectOption(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      selectOption(i);
                    }
                  }}
                >
                  <span style={{ opacity: 0.7 }}>{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="row" style={{ marginTop: 20 }}>
        <button
          className="btn btn-ghost"
          disabled={index === 0}
          onClick={() => setIndex(i => Math.max(0, i - 1))}
        >
          Previous
        </button>

        {index < questions.length - 1 ? (
          <button
            className="btn btn-primary"
            onClick={() => setIndex(i => Math.min(questions.length - 1, i + 1))}
            disabled={!currentAnswered}
          >
            Next
          </button>
        ) : (
          <button className="btn btn-primary" onClick={submitQuiz} disabled={answers.includes(-1)}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
