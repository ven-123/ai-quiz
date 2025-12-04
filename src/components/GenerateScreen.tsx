import React, { useCallback, useEffect, useRef, useState } from "react";
import { MCQ } from "../types";
import { generateMCQs } from "../aiService";

type Props = {
  topic: string;
  onReady: (questions: MCQ[]) => void;
  onBack: () => void;
};

export default function GenerateScreen({ topic, onReady, onBack }: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const mountedRef = useRef(true);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await generateMCQs(topic); 
      if (!mountedRef.current) return;
      onReady(res.questions);
      
      // If parent doesn't navigate away, ensure we stop loader
      if (mountedRef.current) setLoading(false);
    } catch (err: any) {
      if (!mountedRef.current) return;
      setError(String(err?.message ?? err) || "Unknown error when calling AI.");
      setLoading(false);
    }
  }, [topic, onReady]);

  // load on mount or topic change
  useEffect(() => {
    mountedRef.current = true;
    fetchQuestions();
    return () => {
      mountedRef.current = false;
    };
  }, [topic, fetchQuestions]);

  if (loading) {
    return (
      <div className="app-container" style={{ display: "flex", justifyContent: "center" }}>
        <div className="card loader-wrap" style={{ maxWidth: 720, width: "100%" }}>
          <div className="spinner" />
          <div style={{ textAlign: "center" }}>
            <div className="h-title">Generating 5 MCQs for: {topic}</div>
            <div className="small" style={{ marginTop: 8 }}>
              This may take a few seconds — the AI is preparing your quiz.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error or fallback UI
  return (
    <div className="app-container" style={{ display: "flex", justifyContent: "center" }}>
      <div className="card" style={{ maxWidth: 720, width: "100%" }}>
        <div className="h-title">Failed to generate!</div>

        <div className="small" style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>{error}</div>

        <div style={{ height: 14 }} />

        <div className="row">
          <button
            className="btn btn-primary"
            onClick={fetchQuestions}
            style={{ minWidth: 120 }}
          >
            Retry
          </button>

          <button
            className="btn btn-ghost"
            onClick={onBack}
            style={{ marginLeft: 12, minWidth: 80 }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
