"use client";

import { useState, useEffect, useCallback } from "react";
import type { RunResponse, CustomRunResponse, SubmissionItem } from "@/lib/api"; 
import { submitCodeAction, runCustomCodeAction, getExerciseSubmissionsAction } from "../app/actions";
import confetti from "canvas-confetti";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";

/**
 * Simple LCS-based line diff comparing historical submission code against current editor code.
 */
function getLineDiff(
  oldStr: string,
  newStr: string
): { type: "added" | "removed" | "unchanged"; line: string }[] {
  const a = oldStr.split("\n");
  const b = newStr.split("\n");
  const n = a.length;
  const m = b.length;

  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (a[i] === b[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  let i = n;
  let j = m;
  const diff: { type: "added" | "removed" | "unchanged"; line: string }[] = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      diff.unshift({ type: "unchanged", line: a[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      diff.unshift({ type: "added", line: b[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      diff.unshift({ type: "removed", line: a[i - 1] });
      i--;
    }
  }
  return diff;
}

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

  // Tab navigation state: 'tests' (official evaluation), 'custom' (sandbox), or 'history' (submission versions)
  const [activeTab, setActiveTab] = useState<"tests" | "custom" | "history">("tests");

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

  // Submission History states
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [expandedSubId, setExpandedSubId] = useState<number | null>(null);
  const [diffSubId, setDiffSubId] = useState<number | null>(null);
  const [copiedSubId, setCopiedSubId] = useState<number | null>(null);
  const [restoreNotice, setRestoreNotice] = useState<string | null>(null);

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

  // Load user submissions from backend
  const loadSubmissions = useCallback(async () => {
    setLoadingSubmissions(true);
    try {
      const res = await getExerciseSubmissionsAction(exerciseId);
      if (!res.error && res.submissions) {
        setSubmissions(res.submissions);
      }
    } catch {
      // Ignore background fetch failure
    } finally {
      setLoadingSubmissions(false);
    }
  }, [exerciseId]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  function handleRestoreCode(submission: SubmissionItem) {
    setCode(submission.code);
    localStorage.setItem(draftKey, submission.code);
    setRestoreNotice(`Restored submission #${submission.id} into editor`);
    setTimeout(() => setRestoreNotice(null), 4000);
  }

  async function handleCopySubCode(subId: number, subCode: string) {
    try {
      await navigator.clipboard.writeText(subCode);
      setCopiedSubId(subId);
      setTimeout(() => setCopiedSubId(null), 2000);
    } catch {
      // Ignore
    }
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
      // Refresh submissions in background so the newly recorded attempt appears in history
      loadSubmissions();
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
  }, [exerciseId, code, running, loadSubmissions]);

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

          <button
            type="button"
            onClick={() => {
              setActiveTab("history");
              loadSubmissions();
            }}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "history"
                ? "bg-brand/15 text-brand border border-brand/30 shadow-xs"
                : "text-muted hover:text-ink hover:bg-surface/60"
            }`}
          >
            <span>📜 History</span>
            {submissions.length > 0 && (
              <span className="ml-1 rounded px-1.5 py-0.2 text-[10px] font-bold bg-surface border border-line text-muted">
                {submissions.length}
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

      {/* Tab 3: Submission History & Code Versioning */}
      {activeTab === "history" && (
        <div className="mt-3 space-y-4">
          {/* Notification banner if user just restored code */}
          {restoreNotice && (
            <div className="p-3 rounded-xl border border-ok/30 bg-ok/10 text-ok text-xs font-mono flex items-center justify-between">
              <span>✓ {restoreNotice}</span>
              <button
                type="button"
                onClick={() => setActiveTab("tests")}
                className="text-xs underline hover:text-ok/80"
              >
                Go to tests →
              </button>
            </div>
          )}

          {/* Header & Refresh */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted font-mono">
              Past Attempts: <strong className="text-ink">{submissions.length}</strong>
            </div>
            <button
              type="button"
              onClick={loadSubmissions}
              disabled={loadingSubmissions}
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink disabled:opacity-50 transition-colors"
            >
              <span className={loadingSubmissions ? "inline-block animate-spin" : ""}>🔄</span>
              <span>{loadingSubmissions ? "Refreshing..." : "Refresh"}</span>
            </button>
          </div>

          {/* Submissions List */}
          {loadingSubmissions && submissions.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent mb-2" />
              <p>Loading submission history...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="rounded-xl border border-line bg-surface/40 p-6 text-center space-y-3">
              <div className="text-3xl">📜</div>
              <h4 className="text-sm font-semibold text-ink">No Submissions Recorded</h4>
              <p className="text-xs text-muted max-w-sm mx-auto">
                Runs against official test cases while logged in are automatically saved as versioned attempts.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("tests")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand/20 px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand/30 border border-brand/30 transition-all"
              >
                <span>Run Tests Now</span>
                <span>→</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub, index) => {
                const isExpanded = expandedSubId === sub.id;
                const isDiffing = diffSubId === sub.id;
                const attemptNumber = submissions.length - index;
                const formattedDate = new Date(sub.created_at).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={sub.id}
                    className={`rounded-xl border transition-all ${
                      sub.passed
                        ? "border-ok/30 bg-ok/5 hover:border-ok/50"
                        : "border-line bg-surface/50 hover:border-line/80"
                    }`}
                  >
                    {/* Submission Row Header */}
                    <div className="p-3.5 flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            sub.passed
                              ? "bg-ok/20 text-ok border border-ok/30"
                              : "bg-bad/20 text-bad border border-bad/30"
                          }`}
                        >
                          <span>{sub.passed ? "✓ Passed" : "✗ Failed"}</span>
                        </span>
                        <span className="font-mono text-xs font-semibold text-ink">
                          Attempt #{attemptNumber}
                        </span>
                        <span className="text-[11px] text-muted">
                          • {formattedDate}
                        </span>
                      </div>

                      {/* Row Quick Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleRestoreCode(sub)}
                          className="inline-flex items-center gap-1 rounded-lg bg-surface border border-line px-2.5 py-1 text-xs font-medium text-ink hover:border-brand hover:text-brand transition-colors"
                          title="Replace current editor contents with this code"
                        >
                          <span>↺</span>
                          <span>Restore</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setDiffSubId(isDiffing ? null : sub.id);
                            if (!isExpanded) setExpandedSubId(sub.id);
                          }}
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors border ${
                            isDiffing
                              ? "bg-brand/20 text-brand border-brand/40"
                              : "bg-surface border-line text-muted hover:text-ink"
                          }`}
                          title="Compare this submission against current editor code"
                        >
                          <span>±</span>
                          <span>Diff</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setExpandedSubId(isExpanded ? null : sub.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-surface border border-line px-2.5 py-1 text-xs font-medium text-muted hover:text-ink transition-colors"
                        >
                          <span>{isExpanded ? "Hide" : "View"}</span>
                          <span>{isExpanded ? "▲" : "▼"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Expanded Code & Diff Section */}
                    {isExpanded && (
                      <div className="border-t border-line/60 p-3.5 space-y-3 bg-[#0a0719]/90 rounded-b-xl">
                        {/* Top Bar for Expanded View */}
                        <div className="flex items-center justify-between text-xs font-mono text-muted">
                          <span className="font-semibold text-ink/80">
                            {isDiffing ? "± Diff: Submission (old) vs Current Editor (new)" : "Submitted Python Code"}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopySubCode(sub.id, sub.code)}
                              className="hover:text-ink transition-colors"
                            >
                              {copiedSubId === sub.id ? "✓ Copied" : "Copy Code"}
                            </button>
                          </div>
                        </div>

                        {/* Diff View */}
                        {isDiffing ? (
                          <div className="overflow-x-auto rounded-lg border border-line bg-[#060412] p-2.5 font-mono text-xs">
                            {getLineDiff(sub.code, code).map((d, i) => (
                              <div
                                key={i}
                                className={`flex items-start px-2 py-0.5 rounded leading-relaxed ${
                                  d.type === "added"
                                    ? "bg-ok/15 text-ok font-medium"
                                    : d.type === "removed"
                                    ? "bg-bad/15 text-bad line-through opacity-85"
                                    : "text-ink/80"
                                }`}
                              >
                                <span className="w-5 select-none text-muted font-bold">
                                  {d.type === "added" ? "+" : d.type === "removed" ? "-" : " "}
                                </span>
                                <span className="whitespace-pre-wrap flex-1">{d.line || " "}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          /* Plain Code View */
                          <pre className="overflow-x-auto rounded-lg border border-line bg-[#060412] p-3 font-mono text-xs text-ink/90 whitespace-pre-wrap">
                            {sub.code}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
