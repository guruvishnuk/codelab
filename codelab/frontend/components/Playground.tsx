"use client";

import { useState } from "react";
import { runCode, type RunResponse } from "@/lib/api";

import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";

export default function Playground({
  exerciseId,
  starterCode,
}: {
  exerciseId: number;
  starterCode: string;
}) {
  const [code, setCode] = useState(starterCode);
  const [result, setResult] = useState<RunResponse | null>(null);
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    setError("");
    try {
      setResult(await runCode(exerciseId, code));
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
        <CodeMirror
          value={code}
          height="300px"
          theme="dark"
          extensions={[python()]}
          onChange={(value) => setCode(value)}
          className="text-sm"
        />
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={run}
          disabled={running}
          className="rounded-md bg-brand px-5 py-2 font-medium text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {running ? "Running..." : "Run tests"}
        </button>
        <button
          onClick={() => {
            setCode(starterCode);
            setResult(null);
          }}
          className="rounded-md border border-line bg-white px-4 py-2 text-sm hover:bg-brand-soft"
        >
          Reset code
        </button>
      </div>

      {error && <p className="mt-4 text-bad">{error}</p>}

      {result && (
        <div className="mt-6" aria-live="polite">
          <p className={`text-lg font-semibold ${result.passed ? "text-ok" : "text-bad"}`}>
            {result.passed
              ? "All tests passed. Nice work."
              : `${result.results.filter((r) => r.passed).length} of ${result.results.length} tests passed.`}
          </p>
          <ul className="mt-3 space-y-3">
            {result.results.map((r, i) => (
              <li key={i} className="rounded-md border border-line bg-white p-3 text-sm">
                <p className={r.passed ? "font-medium text-ok" : "font-medium text-bad"}>
                  Test {i + 1}: {r.passed ? "passed" : "failed"}
                </p>
                {!r.passed && (
                  <dl className="mt-2 grid grid-cols-[80px_1fr] gap-x-3 gap-y-1 font-mono text-xs">
                    <dt className="text-muted">Input</dt>
                    <dd className="whitespace-pre-wrap">{r.input}</dd>
                    <dt className="text-muted">Expected</dt>
                    <dd className="whitespace-pre-wrap">{r.expected}</dd>
                    <dt className="text-muted">Got</dt>
                    <dd className="whitespace-pre-wrap">{r.actual || "(nothing printed)"}</dd>
                    {r.error && (
                      <>
                        <dt className="text-muted">Error</dt>
                        <dd className="whitespace-pre-wrap text-bad">{r.error}</dd>
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
