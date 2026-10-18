"use client";

import { useState, useEffect, useCallback } from "react";
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
  const [executionMs, setExecutionMs] = useState<number | null>(null);

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

  const run = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setError("");
    const startTime = performance.now();
    try {
      const res = await submitCodeAction(exerciseId, code);
      const duration = Math.round(performance.now() - startTime);
      setExecutionMs(duration);

      if ((res as any).error) {
        setError((res as any).error);
        setResult(null);
        return;
      }
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
  }, [exerciseId, code, running]);

  // Global keyboard shortcut: Ctrl+Enter or Cmd+Enter to execute tests
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        run();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [run]);

  return (
    <section aria-label="Code editor">
      <label htmlFor="code" className="sr-only">
        Your Python code
      </label>

      {/* Editor Box */}
      <div className="overflow-hidden rounded-xl border border-line bg-[#0a0719] shadow-sm">
        <div className="flex items-center justify-between border-b border-line/60 bg-surface/50 px-4 py-2 font-mono text-xs text-muted">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-bad/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-ok/70" />
            <span className="ml-2 text-ink/70">solution.py</span>
          </div>
          <span>Python 3.11</span>
        </div>

        {!isLoaded ? (
          <div className="h-[300px] w-full bg-[#0a0719] animate-pulse" />
        ) : (
          <CodeMirror
            value={code}
            height="320px"
            theme="dark"
            extensions={[python()]}
            onChange={handleCodeChange}
            className="text-sm font-mono"
          />
        )}
      </div>

      {/* Actions and Latency Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={run}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60 transition-all shadow-sm shadow-brand/25"
          >
            {running ? (
              <>
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Running tests...</span>
              </>
            ) : (
              <>
                <span>▶ Run tests</span>
              </>
            )}
          </button>
          <span
            title="Keyboard shortcut: Ctrl+Enter (Cmd+Enter on Mac)"
            className="hidden sm:inline-flex items-center rounded-lg border border-line bg-surface/80 px-2 py-1 font-mono text-[11px] text-muted shadow-xs"
          >
            Ctrl+↵
          </span>
          <button
            onClick={() => {
              setCode(starterCode);
              setResult(null);
              setExecutionMs(null);
              localStorage.removeItem(draftKey);
            }}
            className="rounded-xl border border-line bg-surface px-4 py-2 text-sm font-medium text-ink hover:bg-surface-hover transition-colors"
          >
            Reset
          </button>
        </div>

        {executionMs !== null && (
          <span className="inline-flex items-center gap-1 font-mono text-xs text-muted bg-surface/80 border border-line px-2.5 py-1 rounded-lg">
            <span>⚡ Execution:</span>
            <strong className="text-brand">{executionMs}ms</strong>
          </span>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3.5 rounded-xl border border-bad/30 bg-bad/10 text-bad text-xs font-mono">
          ⚠️ {error}
        </div>
      )}

      {/* Results Terminal */}
      {result && (
        <div className="mt-6" aria-live="polite">
          {result.passed ? (
            <div className="mb-4 rounded-xl border border-ok/30 bg-ok/10 p-5 text-ink shadow-sm">
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
                      Challenge solved. Progress saved to profile!
                    </p>
                  )}
                </div>

                {nextExerciseId ? (
                  <a
                    href={`/exercises/${nextExerciseId}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark transition-all"
                  >
                    <span>Next Challenge</span>
                    <span>→</span>
                  </a>
                ) : topicSlug ? (
                  <a
                    href={`/topics/${topicSlug}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:bg-surface-hover transition-all"
                  >
                    Topic Complete! Notes →
                  </a>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="text-base font-semibold text-bad mb-3 flex items-center gap-2">
              <span>✗</span> {result.results.filter((r) => r.passed).length} of {result.results.length} tests passed.
            </p>
          )}

          <ul className="space-y-3">
            {result.results.map((r, i) => (
              <li
                key={i}
                className="rounded-xl border border-line bg-surface/90 p-4 text-sm shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <p
                    className={
                      r.passed ? "font-semibold text-ok" : "font-semibold text-bad"
                    }
                  >
                    Test Case #{i + 1}: {r.passed ? "passed" : "failed"}
                  </p>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                      r.passed
                        ? "bg-ok/15 text-ok border border-ok/30"
                        : "bg-bad/15 text-bad border border-bad/30"
                    }`}
                  >
                    {r.passed ? "✓ PASS" : "✗ FAIL"}
                  </span>
                </div>
                {!r.passed && (
                  <dl className="mt-3 grid grid-cols-[80px_1fr] gap-x-3 gap-y-1.5 font-mono text-xs bg-[#0a0719] p-3.5 rounded-xl border border-line/60">
                    <dt className="text-muted">Input</dt>
                    <dd className="whitespace-pre-wrap text-ink">{r.input}</dd>
                    <dt className="text-muted">Expected</dt>
                    <dd className="whitespace-pre-wrap text-ok">{r.expected}</dd>
                    <dt className="text-muted">Got</dt>
                    <dd className="whitespace-pre-wrap text-bad">
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
