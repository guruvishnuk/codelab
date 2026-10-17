"use client";

import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";

interface Token {
  cls: string;
  text: string;
}

const TOKENS: Token[] = [
  { cls: "k", text: "def " },
  { cls: "f", text: "reverse" },
  { cls: "", text: "(text):\n    " },
  { cls: "cm", text: "# step -1 walks backwards\n    " },
  { cls: "k", text: "return " },
  { cls: "", text: "text[::-1]" },
];

export default function LiveEditor() {
  const [typedSegments, setTypedSegments] = useState<{ cls: string; text: string }[]>([]);
  const [cursorTokenIndex, setCursorTokenIndex] = useState(0);
  const [testStatus, setTestStatus] = useState<boolean[]>([false, false, false]);
  const [showXp, setShowXp] = useState(false);
  const timeouts = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    let isCancelled = false;

    const addTimeout = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        if (!isCancelled) fn();
      }, ms);
      timeouts.current.push(id);
    };

    function startCycle() {
      setTypedSegments([]);
      setCursorTokenIndex(0);
      setTestStatus([false, false, false]);
      setShowXp(false);

      let tokenIdx = 0;
      let charIdx = 0;
      let currentSegments: { cls: string; text: string }[] = [];

      function typeChar() {
        if (tokenIdx >= TOKENS.length) {
          // Completed typing: run test cases
          runTests();
          return;
        }

        const currentToken = TOKENS[tokenIdx];
        charIdx++;

        const currentPartial = {
          cls: currentToken.cls,
          text: currentToken.text.slice(0, charIdx),
        };

        setTypedSegments([...currentSegments, currentPartial]);

        if (charIdx >= currentToken.text.length) {
          currentSegments.push(currentToken);
          tokenIdx++;
          charIdx = 0;
          setCursorTokenIndex(tokenIdx);
        }

        addTimeout(typeChar, 48);
      }

      function runTests() {
        // Sequentially mark tests as ok
        addTimeout(() => setTestStatus([true, false, false]), 400);
        addTimeout(() => setTestStatus([true, true, false]), 850);
        addTimeout(() => {
          setTestStatus([true, true, true]);
          setShowXp(true);
          // Fire confetti!
          try {
            confetti({
              particleCount: 80,
              spread: 65,
              origin: { x: 0.72, y: 0.42 },
              colors: ["#8f7bff", "#ff7f70", "#ffc857", "#4be3c3", "#ffffff"],
            });
          } catch {
            // Safe fallback if canvas not available
          }
        }, 1300);

        // Reset and repeat after 8 seconds
        addTimeout(startCycle, 8500);
      }

      addTimeout(typeChar, 400);
    }

    startCycle();

    return () => {
      isCancelled = true;
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
    };
  }, []);

  return (
    <div className="labw">
      <div className="lab" role="img" aria-label="Live demo of a CodeLab challenge being solved">
        <div className="bar">
          <b />
          <b />
          <b />
          <span className="mono">strings / reverse_it.py</span>
        </div>
        <div className="note">
          <strong>Lesson:</strong> slices use <span className="mono">[start:stop:step]</span>. A step of{" "}
          <span className="mono">-1</span> walks backwards.
        </div>
        <pre id="code">
          {typedSegments.map((seg, i) =>
            seg.cls ? (
              <span key={i} className={seg.cls}>
                {seg.text}
              </span>
            ) : (
              seg.text
            )
          )}
          <span className="caret" />
        </pre>
        <div className="tests">
          <div className={testStatus[0] ? "ok" : ""}>✓ reverse("abc") → "cba"</div>
          <div className={testStatus[1] ? "ok" : ""}>✓ reverse("") → ""</div>
          <div className={testStatus[2] ? "ok" : ""}>✓ reverse("level") → "level"</div>
        </div>
      </div>
      <div className={`xp ${showXp ? "on" : ""}`}>+50 XP 🎊</div>
    </div>
  );
}
