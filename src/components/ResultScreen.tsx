import React, { useEffect, useState } from "react";
import { generateFeedback } from "../aiService";

type Props = {
  scorePercent: number;
  topic: string;
  onRestart: () => void;
  onChangeTopic: () => void;
};

export default function ResultScreen({
  scorePercent,
  topic,
  onRestart,
  onChangeTopic,
}: Props) {

  const [feedback, setFeedback] = useState("Loading feedback...");

  useEffect(() => {
    (async () => {
      try {
        const res = await generateFeedback(topic, scorePercent);
        setFeedback(res);
      } catch (err: any) {
        setFeedback("Unable to load AI feedback. Try again.");
      }
    })();
  }, [topic, scorePercent]);

  return (
    <div className="app-container" style={{ maxWidth: 760, margin: "0 auto" }}>
      
      <div className="card theme-animated-bg" style={{ textAlign: "center", paddingBottom: 32 }}>
        
        <h2 className="h-title">Your Results</h2>
        
        {/* Score Circle */}
        <div style={{
          width: 150,
          height: 150,
          borderRadius: "50%",
          margin: "20px auto",
          background: "linear-gradient(135deg, #6ee7b7, #60a5fa)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 12px 35px rgba(96,165,250,0.22)"
        }}>
          <div style={{
            fontSize: 42,
            fontWeight: 900,
            color: "#042033",
          }}>
            {scorePercent}%
          </div>
        </div>

        {/* AI Feedback */}
        <div className="small" style={{
          marginTop: 14,
          whiteSpace: "pre-wrap",
          fontSize: 15,
          color: "#dce7f7"
        }}>
          {feedback}
        </div>

        {/* Buttons */}
        <div className="row" style={{
          justifyContent: "center",
          marginTop: 24,
          gap: 12
        }}>
          <button className="btn btn-primary" onClick={onRestart}>
            Retry Quiz
          </button>
          <button className="btn btn-ghost" onClick={onChangeTopic}>
            Change Topic
          </button>
        </div>

      </div>
    </div>
  );
}
