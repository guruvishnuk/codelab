"use client";

import { useState, useEffect, useCallback } from "react";
import type { RunResponse, CustomRunResponse } from "@/lib/api"; 
import { submitCodeAction, runCustomCodeAction } from "../app/actions";
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

  // Editor states
  const [code, setCode] = useState(starterCode);
  const [isLoaded, setIsLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Tab navigation state: 'tests' (official evaluation) or 'custom' (arbitrary stdin/stdout sandbox)
  const [activeTab, setActiveTab] = useState<"tests" | "custom">("tests");

  // Official Test Run states
  const [result, setResult] = useState<RunResponse | null>(null);
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const [executionMs, setExecutionMs] = useState<number | null>(null);

  // Custom Test Case states
  const [customInput, setCustomInput] = useState("");
  const [customResult, setCustomResult] = useState<CustomRunResponse | null>(null);
  const [customError, setCustomError] = useState("");
  const [runningCustom, setRunningCustom] = useState(false);
  const [customExecutionMs, setCustomExecutionMs] = useState<number | null>(null);

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback or ignore
    }
  }

  // Restore saved draft from localStorage on initial mount
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

  // Submit code to execute against official test cases
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

  // Execute arbitrary code with custom stdin
  const runCustom = useCallback(async () => {
    if (runningCustom) return;
    setRunningCustom(true);
    setCustomError("");
    const startTime = performance.now();
    try {
      const res = await runCustomCodeAction(code, customInput);
      const duration = Math.round(performance.now() - startTime);
      setCustomExecutionMs(duration);

      if ((res as any).error) {
        setCustomError((res as any).error);
        setCustomResult(null);
        return;
      }
      setCustomResult(res);
    } catch (e) {
      setCustomError(e instanceof Error ? e.message : "Failed to run custom input.");
    } finally {
      setRunningCustom(false);
    }
  }, [code, customInput, runningCustom]);

  // Global keyboard shortcut: Ctrl+Enter or Cmd+Enter executes active tab
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (activeTab === "custom") {
          runCustom();
        } else {
          run();
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [run, runCustom, activeTab]);

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
          <div className="flex items-center gap-3">
            <span>Python 3.11</span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] text-muted hover:text-ink hover:bg-surface/80 transition-colors"
              title="Copy code to clipboard"
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
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

      {/* Tab Switcher: Official Test Cases vs Custom Input Sandbox */}
      <div className="mt-4 flex items-center justify-between border-b border-line/60 pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("tests")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "tests"
                ? "bg-brand/15 text-brand border border-brand/30 shadow-xs"
                : "text-muted hover:text-ink hover:bg-surface/60"
            }`}
          >
            <span>🧪 Official Test Cases</span>
            {result && (
              <span
                className={`ml-1 rounded px-1.5 py-0.2 text-[10px] font-bold ${
                  result.passed ? "bg-ok/20 text-ok" : "bg-bad/20 text-bad"
                }`}
              >
                {result.results.filter((r) => r.passed).length}/{result.results.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("custom")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "custom"
                ? "bg-brand/15 text-brand border border-brand/30 shadow-xs"
                : "text-muted hover:text-ink hover:bg-surface/60"
            }`}
          >
            <span>⚙️ Custom Input</span>
            {customResult && (
              <span className="ml-1 rounded px-1.5 py-0.2 text-[10px] font-bold bg-surface border border-line text-brand">
                {customResult.stderr ? "Err" : "OK"}
              </span>
            )}
          </button>
        </div>

        {/* Global Shortcut hint */}
        <span
          title="Keyboard shortcut: Ctrl+Enter (Cmd+Enter on Mac)"
          className="hidden sm:inline-flex items-center rounded-lg border border-line bg-surface/80 px-2 py-1 font-mono text-[11px] text-muted shadow-xs"
        >
          Ctrl+↵
        </span>
      </div>

      {/* Tab 1: Official Test Cases Mode */}
      {activeTab === "tests" && (
        <div className="mt-3">
          {/* Actions and Latency Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
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
        </div>
      )}

      {/* Tab 2: Custom Test Case Sandbox Mode */}
      {activeTab === "custom" && (
        <div className="mt-3 space-y-4">
          <div>
            <label
              htmlFor="custom-stdin"
              className="block text-xs font-mono text-muted mb-1.5"
            >
              Standard Input (stdin)
            </label>
            <textarea
              id="custom-stdin"
              rows={3}
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Provide inputs passed to input() line-by-line (e.g. 10&#10;20)"
              className="w-full rounded-xl border border-line bg-[#0a0719] px-3.5 py-2.5 font-mono text-xs text-ink placeholder:text-muted/60 focus:border-brand focus:outline-none transition-colors"
            />
          </div>

          {/* Custom Run Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={runCustom}
              disabled={runningCustom}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60 transition-all shadow-sm shadow-brand/25"
            >
              {runningCustom ? (
                <>
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Executing custom run...</span>
                </>
              ) : (
                <>
                  <span>▶ Run with Custom Input</span>
                </>
              )}
            </button>

            {customExecutionMs !== null && (
              <span className="inline-flex items-center gap-1 font-mono text-xs text-muted bg-surface/80 border border-line px-2.5 py-1 rounded-lg">
                <span>⚡ Runtime:</span>
                <strong className="text-brand">{customExecutionMs}ms</strong>
              </span>
            )}
          </div>

          {customError && (
            <div className="p-3.5 rounded-xl border border-bad/30 bg-bad/10 text-bad text-xs font-mono">
              ⚠️ {customError}
            </div>
          )}

          {/* Custom Execution Output Terminal */}
          {customResult && (
            <div className="space-y-3 rounded-xl border border-line bg-surface/90 p-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-line/60 pb-2">
                <span className="font-mono text-xs font-semibold text-ink">
                  Standard Output (stdout)
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                    customResult.stderr
                      ? "bg-bad/15 text-bad border border-bad/30"
                      : "bg-ok/15 text-ok border border-ok/30"
                  }`}
                >
                  {customResult.stderr ? "Runtime Error" : "Exit Code 0"}
                </span>
              </div>

              {/* Output Content */}
              <pre className="overflow-x-auto rounded-lg bg-[#0a0719] p-3 font-mono text-xs text-ink/90 whitespace-pre-wrap min-h-[60px]">
                {customResult.stdout || (
                  <span className="text-muted italic">(Program produced no output)</span>
                )}
              </pre>

              {/* Stderr Trace if present */}
              {customResult.stderr && (
                <div className="space-y-1.5 pt-1">
                  <span className="font-mono text-xs font-semibold text-bad">
                    Error Traceback (stderr)
                  </span>
                  <pre className="overflow-x-auto rounded-lg bg-bad/10 border border-bad/30 p-3 font-mono text-xs text-bad whitespace-pre-wrap">
                    {customResult.stderr}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
