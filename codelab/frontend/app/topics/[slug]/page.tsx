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

  const totalExercises = topic.exercises.length;
  const solvedCount = topic.exercises.filter(e => e.solved).length;
  const progressPercent = Math.round((solvedCount / (totalExercises || 1)) * 100);

  return (
    <article className="max-w-4xl space-y-8">
      {/* Topic Header & Meta Strip */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-3 py-1 font-mono text-xs font-semibold text-brand">
            <span>📚</span>
            <span>Curriculum Track</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-muted">
            <span className="pill-badge pill-badge-violet">~15 mins</span>
            <span className="pill-badge pill-badge-mint">Automated Tests</span>
            <span className="pill-badge pill-badge-amber">+{totalExercises * 50} XP</span>
          </div>
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-ink">
            {topic.title}
          </h1>
          <p className="mt-2 text-base text-muted max-w-[70ch] leading-relaxed">
            {topic.summary}
          </p>
        </div>

        {/* Track Progress Bar */}
        <div className="rounded-xl border border-line bg-surface/60 p-4">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-muted">Track Progress</span>
            <span className="font-semibold text-brand">
              {solvedCount} of {totalExercises} challenges solved ({progressPercent}%)
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-surface-elevated overflow-hidden border border-line/60">
            <div
              className="h-full bg-gradient-to-r from-brand to-ok transition-all duration-500"
              style={{ width: `${Math.max(progressPercent, 4)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Concept Notes Card with Cyber Accent */}
      <div className="cyber-card cyber-card-accent p-6 md:p-8 backdrop-blur-md">
        <div className="mb-5 flex items-center justify-between border-b border-line/60 pb-3">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
            <span>📖</span> Core Concept Notes
          </span>
          <span className="text-xs text-muted font-mono bg-surface-elevated px-2.5 py-0.5 rounded-full border border-line">
            Python 3.11
          </span>
        </div>
        <div className="notes">
          <ReactMarkdown>{topic.notes_md}</ReactMarkdown>
        </div>
      </div>

      {/* Hands-on Challenges Section */}
      <div className="pt-2 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-display text-ink">Hands-on Challenges</h2>
            <p className="text-xs text-muted mt-1">
              Code in your browser against automated test cases to earn XP and level up.
            </p>
          </div>
          <span className="font-mono text-xs text-muted">
            {totalExercises} challenges
          </span>
        </div>

        <ul className="space-y-3">
          {topic.exercises.map((ex) => (
            <li key={ex.id}>
              <Link
                href={`/exercises/${ex.id}`}
                className="group flex items-center justify-between rounded-2xl border border-line bg-surface/80 p-4.5 hover:border-brand/70 hover:bg-surface-hover hover:shadow-glow transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft border border-brand/30 font-mono text-xs font-bold text-brand group-hover:scale-105 transition-transform">
                    {ex.id}
                  </span>
                  <div>
                    <span className="font-semibold text-ink group-hover:text-brand transition-colors text-sm md:text-base block">
                      {ex.title}
                    </span>
                    <span className="text-xs text-muted">Test-driven problem statement & editor</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {ex.solved ? (
                    <span className="rounded-full border border-ok/30 bg-ok/15 px-3 py-0.5 text-[11px] font-bold uppercase font-mono text-ok">
                      ✓ Solved
                    </span>
                  ) : (
                    <span className="hidden sm:inline text-xs font-mono text-muted group-hover:text-ink">
                      +{ex.difficulty === "easy" ? "50" : "100"} XP
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase font-mono ${
                      ex.difficulty === "easy"
                        ? "border border-ok/30 bg-ok/10 text-ok"
                        : ex.difficulty === "medium"
                        ? "border border-amber-500/30 bg-amber-500/15 text-amber-300"
                        : "border border-bad/30 bg-bad/10 text-bad"
                    }`}
                  >
                    {ex.difficulty}
                  </span>
                  <span className="text-muted group-hover:text-brand font-mono text-sm transition-transform group-hover:translate-x-1">
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
