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
        <span>/</span>
        <Link
          href={`/topics/${ex.topic_slug}`}
          className="hover:text-brand transition-colors capitalize"
        >
          {ex.topic_slug.replace(/-/g, " ")}
        </Link>
        <span>/</span>
        <span className="text-ink font-semibold">Challenge #{ex.id}</span>
      </nav>

      {/* Challenge Title & Meta */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line/60 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-display text-ink">
            {ex.title}
          </h1>
          <p className="text-xs text-muted mt-1 font-mono">
            Topic: <span className="text-brand uppercase">{ex.topic_slug}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
              ex.difficulty === "easy"
                ? "border border-ok/30 bg-ok/10 text-ok"
                : ex.difficulty === "medium"
                ? "border border-amber-500/30 bg-amber-500/15 text-amber-300"
                : "border border-bad/30 bg-bad/10 text-bad"
            }`}
          >
            {ex.difficulty} (+{ex.difficulty === "easy" ? "50" : "100"} XP)
          </span>
        </div>
      </div>

      {/* Main Workspace: Instructions & Playground */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)] items-start">
        {/* Left: Challenge Prompt & Instructions */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-surface/70 p-6 shadow-xs backdrop-blur-xs">
            <div className="mb-3 flex items-center justify-between border-b border-line/60 pb-2.5">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <span>📝</span> Instructions
              </span>
              <span className="text-[11px] text-muted font-mono">Python 3</span>
            </div>
            <div className="notes">
              <ReactMarkdown>{ex.prompt_md}</ReactMarkdown>
            </div>
          </div>

          {/* Socratic Helper Card */}
          <div className="rounded-xl border border-line/60 bg-surface/40 p-4 text-xs text-muted space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-ink">
              <span>💡</span>
              <span>Pro Tip</span>
            </div>
            <p>
              Write your solution in the editor on the right and press{" "}
              <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 font-mono text-[10px] text-brand">
                Ctrl + Enter
              </kbd>{" "}
              to run the automated test suite immediately.
            </p>
          </div>
        </div>

        {/* Right: CodeMirror Sandbox & Output Terminal */}
        <div className="rounded-2xl border border-line bg-surface/50 p-5 shadow-xs">
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
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface/80 px-4 py-2 text-xs font-semibold text-ink hover:bg-surface-hover hover:border-brand/40 transition-colors"
        >
          ← Back to Topic Notes
        </Link>

        {ex.next_exercise_id && (
          <Link
            href={`/exercises/${ex.next_exercise_id}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-dark shadow-sm shadow-brand/20 transition-all"
          >
            <span>Next Exercise</span>
            <span>→</span>
          </Link>
        )}
      </div>
    </div>
  );
}
