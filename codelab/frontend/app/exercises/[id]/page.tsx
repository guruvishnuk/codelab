import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getExercise } from "@/lib/api";
import { getExerciseFallback } from "@/lib/fallback";
import Playground from "@/components/Playground";

export default async function ExercisePage({ params }: { params: { id: string } }) {
  let ex = await getExercise(params.id).catch(() => null);
  if (!ex) {
    ex = getExerciseFallback(params.id);
  }
  if (!ex) notFound();

  return (
    <div className="max-w-6xl space-y-6">
      {/* Top Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-mono text-muted">
        <Link href="/" className="hover:text-brand transition-colors">
          Tracks
        </Link>
        <span className="text-line">/</span>
        <Link
          href={`/topics/${ex.topic_slug}`}
          className="hover:text-brand transition-colors capitalize text-muted"
        >
          {ex.topic_slug.replace(/-/g, " ")}
        </Link>
        <span className="text-line">/</span>
        <span className="text-ink font-semibold">Challenge #{ex.id}</span>
      </nav>

      {/* Challenge Title & Meta */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line/60 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-display text-ink">
            {ex.title}
          </h1>
          <p className="text-xs text-muted mt-1 font-mono">
            Track: <span className="text-brand font-semibold uppercase">{ex.topic_slug}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`pill-badge ${
              ex.difficulty === "easy"
                ? "pill-badge-mint"
                : ex.difficulty === "medium"
                ? "pill-badge-amber"
                : "pill-badge-coral"
            }`}
          >
            {ex.difficulty.toUpperCase()} • +{ex.difficulty === "easy" ? "50" : "100"} XP
          </span>
        </div>
      </div>

      {/* Main Workspace: Instructions & Playground */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)] items-start">
        {/* Left: Challenge Prompt & Instructions */}
        <div className="space-y-4">
          <div className="cyber-card cyber-card-accent p-6 backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between border-b border-line/60 pb-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
                <span>📝</span> Problem Statement
              </span>
              <span className="text-[11px] text-muted font-mono bg-surface-elevated px-2 py-0.5 rounded border border-line">
                Python 3.11
              </span>
            </div>
            <div className="notes">
              <ReactMarkdown>{ex.prompt_md}</ReactMarkdown>
            </div>
          </div>

          {/* Socratic Pro-Tip Card */}
          <div className="cyber-card p-4.5 border-brand/30 bg-surface/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand font-mono">
              <span>⚡</span>
              <span>Pro Tip & Keybindings</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Write your function in the CodeMirror editor. Use{" "}
              <kbd className="rounded border border-line bg-surface-elevated px-1.5 py-0.5 font-mono text-[10px] text-brand">
                Ctrl + Enter
              </kbd>{" "}
              (or <kbd className="rounded border border-line bg-surface-elevated px-1.5 py-0.5 font-mono text-[10px] text-brand">⌘ + Enter</kbd>) to trigger instant automated test evaluation.
            </p>
          </div>
        </div>

        {/* Right: CodeMirror Sandbox & Output Terminal */}
        <div className="cyber-card p-5 backdrop-blur-md">
          <Playground
            exerciseId={ex.id}
            starterCode={ex.starter_code}
            nextExerciseId={ex.next_exercise_id}
            topicSlug={ex.topic_slug}
          />
        </div>
      </div>

      {/* Bottom Navigation Links */}
      <div className="pt-4 flex items-center justify-between border-t border-line/60">
        <Link
          href={`/topics/${ex.topic_slug}`}
          className="btn-cyber btn-cyber-secondary text-xs"
        >
          ← Back to Topic Notes
        </Link>

        {ex.next_exercise_id && (
          <Link
            href={`/exercises/${ex.next_exercise_id}`}
            className="btn-cyber btn-cyber-primary text-xs"
          >
            <span>Next Challenge</span>
            <span>→</span>
          </Link>
        )}
      </div>
    </div>
  );
}
