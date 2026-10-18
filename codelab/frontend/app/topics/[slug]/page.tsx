import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getTopic } from "@/lib/api";
import { getTopicFallback } from "@/lib/fallback";

export default async function TopicPage({ params }: { params: { slug: string } }) {
  let topic = await getTopic(params.slug).catch(() => null);
  if (!topic) {
    topic = getTopicFallback(params.slug);
  }
  if (!topic) notFound();

  return (
    <article className="max-w-4xl space-y-8">
      {/* Topic Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-3 py-1 font-mono text-xs font-semibold text-brand mb-3">
          <span>📚</span>
          <span>Curriculum Track</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-ink">
          {topic.title}
        </h1>
        <p className="mt-2 text-base text-muted max-w-[65ch] leading-relaxed">
          {topic.summary}
        </p>
      </div>

      {/* Concept Notes Card */}
      <div className="rounded-2xl border border-line bg-surface/70 p-6 md:p-8 shadow-xs backdrop-blur-xs">
        <div className="mb-4 flex items-center justify-between border-b border-line/60 pb-3">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
            <span>📖</span> Concept Breakdown
          </span>
          <span className="text-xs text-muted font-mono">~2 min read</span>
        </div>
        <div className="notes">
          <ReactMarkdown>{topic.notes_md}</ReactMarkdown>
        </div>
      </div>

      {/* Hands-on Challenges Section */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold font-display text-ink">Interactive Challenges</h2>
            <p className="text-xs text-muted mt-1">Run code against automated test cases to earn XP.</p>
          </div>
          <span className="font-mono text-xs text-muted">
            {topic.exercises.length} challenges
          </span>
        </div>

        <ul className="space-y-3">
          {topic.exercises.map((ex) => (
            <li key={ex.id}>
              <Link
                href={`/exercises/${ex.id}`}
                className="group flex items-center justify-between rounded-xl border border-line bg-surface/80 p-4.5 hover:border-brand/70 hover:bg-surface-hover hover:shadow-glow transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-soft font-mono text-xs font-bold text-brand group-hover:scale-105 transition-transform">
                    {ex.id}
                  </span>
                  <div>
                    <span className="font-semibold text-ink group-hover:text-brand transition-colors block">
                      {ex.title}
                    </span>
                    <span className="text-xs text-muted">Click to open editor and tests</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {ex.solved && (
                    <span className="rounded-md border border-ok/30 bg-ok/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-ok">
                      ✓ Solved
                    </span>
                  )}
                  <span
                    className={`rounded-md px-2.5 py-0.5 text-xs font-semibold uppercase ${
                      ex.difficulty === "easy"
                        ? "border border-ok/30 bg-ok/10 text-ok"
                        : ex.difficulty === "medium"
                        ? "border border-amber-500/30 bg-amber-500/15 text-amber-300"
                        : "border border-bad/30 bg-bad/10 text-bad"
                    }`}
                  >
                    {ex.difficulty}
                  </span>
                  <span className="text-muted group-hover:text-brand font-mono text-sm transition-colors">
                    →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
