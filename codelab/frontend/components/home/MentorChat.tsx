"use client";

import { useState } from "react";

const HINTS = [
  "Level 1 · Concept: remember slice syntax, [start:stop:step]. What does a negative step do?",
  "Level 2 · Logic: you don't need a loop. Try slicing the whole string with a step of -1.",
  "Level 3 · Skeleton:\ndef reverse(text):\n    # return the slice with step -1\n    return ____",
];

export default function MentorChat() {
  const [hintIndex, setHintIndex] = useState(0);

  const handleAskHint = () => {
    if (hintIndex < HINTS.length) {
      setHintIndex((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setHintIndex(0);
  };

  return (
    <div className="wrap mentor">
      <div>
        <h2>Stuck? Get a nudge, not the answer.</h2>
        <p className="sub">
          The AI mentor provides three progressive levels of guidance and translates intimidating tracebacks into
          friendly, plain-English advice.
        </p>
        <div className="cta" style={{ marginTop: "26px" }}>
          <button
            onClick={handleAskHint}
            disabled={hintIndex >= HINTS.length}
            className="btn p"
          >
            {hintIndex >= HINTS.length ? "All hints used" : "Ask for a hint"}
          </button>
          <span className="mono" style={{ alignSelf: "center", color: "var(--mut)", fontSize: "13px" }}>
            {hintIndex} / 3 used
          </span>
          {hintIndex > 0 && (
            <button
              onClick={handleReset}
              className="btn"
              style={{ padding: "8px 16px", fontSize: "13px", alignSelf: "center" }}
            >
              Reset demo
            </button>
          )}
        </div>
      </div>

      <div className="chat" aria-live="polite">
        <div className="bub me2">IndexError: string index out of range</div>
        <div className="bub ai">
          <small>Mentor</small>
          That error means you asked for a character that isn't there. Check the last index of your loop or condition.
        </div>

        {HINTS.slice(0, hintIndex).map((hint, idx) => (
          <div key={idx} className="bub ai" style={{ whiteSpace: "pre-line" }}>
            <small>Mentor Hint #{idx + 1}</small>
            {hint}
          </div>
        ))}
      </div>
    </div>
  );
}
