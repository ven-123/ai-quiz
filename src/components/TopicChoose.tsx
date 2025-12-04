import React, { useState } from "react";

type Props = {
  onNext: (topic: string) => void;
};

export default function TopicChoose({ onNext }: Props) {
  const [topic, setTopic] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = topic.trim();
    if (!t) return;
    onNext(t);
  };

  return (
    <div className="topic-page">
      <h2 className="topic-title">Select a Topic</h2>

      <div className="topic-card">
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <input
            type="text"
            className="topic-input"
            placeholder="e.g., Wellness, Sports, Tech Trends"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            aria-label="Topic"
          />

          <button
            type="submit"
            className="topic-button"
            disabled={!topic.trim()}
          >
            Generate Quiz
          </button>
        </form>
      </div>
    </div>
  );
}
