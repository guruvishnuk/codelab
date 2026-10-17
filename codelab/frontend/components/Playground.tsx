"use client";

import { useState, useEffect } from "react";
import type { RunResponse } from "@/lib/api"; 
import { submitCodeAction } from "../app/actions";
import confetti from "canvas-confetti";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";

export default function Playground({
  exerciseId,
  starterCode,
  nextExerciseId,
  topicSlug,
}: {
  exerciseId: number;
  starterCode: string;
  nextExerciseId?: number | null;
  topicSlug?: string;
}) {
  const draftKey = `draft_exercise_${exerciseId}`;

  const [code, setCode] = useState(starterCode);
  const [isLoaded, setIsLoaded] = useState(false);
  const [result, setResult] = useState<RunResponse | null>(null);
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft !== null) {
      setCode(savedDraft);
    }
    setIsLoaded(true);
  }, [draftKey]);

  function handleCodeChange(value: string) {
    setCode(value);
    localStorage.setItem(draftKey, value);
  }

  async function run() {
    setRunning(true);
    setError("");
    try {
      const res = await submitCodeAction(exerciseId, code);
      setResult(res);
      if (res.passed) {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.65 },
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <section aria-label="Code editor">
      <label htmlFor="code" className="sr-only">
        Your Python code
      </label>

      <div className="overflow-hidden rounded-md border border-line">
        {!isLoaded ? (
          <div className="h-[300px] w-full bg-ink/50 animate-pulse" />
        ) : (
          <CodeMirror
            value={code}
            height="300px"
            theme="dark"
            extensions={[python()]}
            onChange={handleCodeChange}
            className="text-sm"
          />
        )}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={run}
          disabled={running}
          className="rounded-md bg-brand px-5 py-2 font-medium text-white hover:bg-brand-dark disabled:opacity-60 transition-colors"
        >
          {running ? "Running tests..." : "Run tests"}
        </button>
        <button
          onClick={() => {
            setCode(starterCode);
            setResult(null);
            localStorage.removeItem(draftKey);
          }}
          className="rounded-md border border-line bg-white px-4 py-2 text-sm hover:bg-brand-soft transition-colors"
        >
          Reset code
        </button>
      </div>

      {error && <p className="mt-4 text-bad">{error}</p>}

      {result && (
        <div className="mt-6" aria-live="polite">
          {result.passed ? (
            <div className="mb-4 rounded-lg border border-ok/30 bg-ok/10 p-4 text-ink shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-ok">
                    <span>🎉</span> All Tests Passed! Nice work!
                  </h3>
                  {result.is_first_solve && result.xp_earned ? (
                    <p className="mt-1 text-sm font-semibold text-brand">
                      +{result.xp_earned} XP Earned! 🚀
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-muted">
                      Challenge solved. Progress saved!
                    </p>
                  )}
                </div>

                {nextExerciseId ? (
                  <a
                    href={`/exercises/${nextExerciseId}`}
                    className="inline-flex items-center gap-1 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark transition-all"
                  >
                    Next Challenge →
                  </a>
                ) : topicSlug ? (
                  <a
                    href={`/topics/${topicSlug}`}
                    className="inline-flex items-center gap-1 rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:bg-brand-soft transition-all"
                  >
                    Topic Complete! Notes →
                  </a>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="text-lg font-semibold text-bad mb-3">
              {result.results.filter((r) => r.passed).length} of {result.results.length} tests passed.
            </p>
          )}

          <ul className="space-y-3">
            {result.results.map((r, i) => (
              <li
                key={i}
                className="rounded-md border border-line bg-white p-3 text-sm shadow-xs"
              >
                <p
                  className={
                    r.passed ? "font-medium text-ok" : "font-medium text-bad"
                  }
                >
                  Test {i + 1}: {r.passed ? "passed" : "failed"}
                </p>
                {!r.passed && (
                  <dl className="mt-2 grid grid-cols-[80px_1fr] gap-x-3 gap-y-1 font-mono text-xs">
                    <dt className="text-muted">Input</dt>
                    <dd className="whitespace-pre-wrap">{r.input}</dd>
                    <dt className="text-muted">Expected</dt>
                    <dd className="whitespace-pre-wrap">{r.expected}</dd>
                    <dt className="text-muted">Got</dt>
                    <dd className="whitespace-pre-wrap">
                      {r.actual || "(nothing printed)"}
                    </dd>
                    {r.error && (
                      <>
                        <dt className="text-muted">Error</dt>
                        <dd className="whitespace-pre-wrap text-bad">
                          {r.error}
                        </dd>
                      </>
                    )}
                  </dl>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
