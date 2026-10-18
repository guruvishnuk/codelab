import Link from "next/link";
import { notFound } from "next/navigation";
import { getExercise } from "@/lib/api";
import { getExerciseFallback } from "@/lib/fallback";
import Playground from "@/components/Playground";
import ExercisePrompt from "@/components/ExercisePrompt";

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
        {/* Left: Interactive Multilingual Challenge Prompt & Instructions */}
        <ExercisePrompt
          exerciseId={ex.id}
          defaultTitle={ex.title}
          defaultPromptMd={ex.prompt_md}
          difficulty={ex.difficulty}
        />

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
