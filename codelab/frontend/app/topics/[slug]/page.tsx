import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopic } from "@/lib/api";
import { getTopicFallback } from "@/lib/fallback";
import TopicDeepDive from "@/components/TopicDeepDive";

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

      {/* Interactive Concept Notes & Deep Dive with Multilingual and Level Support */}
      <TopicDeepDive slug={topic.slug} fallbackNotes={topic.notes_md} />

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

        <ul className="space-y-3.5">
          {topic.exercises.map((ex, index) => (
            <li key={ex.id}>
              <Link
                href={`/exercises/${ex.id}`}
                className="cyber-card group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/70 hover:shadow-[0_12px_36px_-10px_rgba(143,123,255,0.3)]"
              >
                {/* Left hover accent glow line */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand via-brand to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-2xl" />

                <div className="flex items-center gap-4 min-w-0">
                  {/* Dedicated challenge number badge with futuristic styling */}
                  <div
                    className={`relative shrink-0 flex items-center justify-center w-11 h-11 rounded-xl font-mono text-sm font-bold transition-all duration-300 ${
                      ex.solved
                        ? "bg-ok/15 border border-ok/40 text-ok shadow-[0_0_15px_rgba(75,227,195,0.25)]"
                        : "bg-surface-elevated/90 border border-brand/30 text-brand shadow-inner group-hover:bg-brand group-hover:text-white group-hover:border-brand group-hover:shadow-[0_0_20px_rgba(143,123,255,0.45)] group-hover:scale-105"
                    }`}
                  >
                    {ex.solved ? (
                      <svg className="w-5 h-5 text-ok" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span>{String(index + 1).padStart(2, "0")}</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-ink group-hover:text-brand transition-colors text-sm sm:text-base font-display truncate">
                        {ex.title}
                      </h3>
                      {ex.solved && (
                        <span className="hidden sm:inline-block text-[11px] font-mono text-ok font-semibold">
                          ✓ Solved
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted/90 mt-0.5 line-clamp-1 flex items-center gap-2">
                      <span>Test-driven runner</span>
                      <span className="text-line">•</span>
                      <span className="font-mono text-[11px] text-muted/60">Python 3.11</span>
                    </p>
                  </div>
                </div>

                {/* Right metadata and interactive action pill */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-line/40">
                  <div className="flex items-center gap-2.5">
                    {ex.solved ? (
                      <span className="pill-badge pill-badge-mint">
                        ✓ +{ex.difficulty === "easy" ? "50" : "100"} XP EARNED
                      </span>
                    ) : (
                      <span className="pill-badge pill-badge-amber">
                        ⚡ +{ex.difficulty === "easy" ? "50" : "100"} XP
                      </span>
                    )}

                    <span
                      className={`pill-badge ${
                        ex.difficulty === "easy"
                          ? "pill-badge-mint"
                          : ex.difficulty === "medium"
                          ? "pill-badge-amber"
                          : "pill-badge-coral"
                      }`}
                    >
                      {ex.difficulty.toUpperCase()}
                    </span>
                  </div>

                  {/* Interactive cyber action arrow */}
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-surface-elevated border border-line text-muted group-hover:bg-brand group-hover:border-brand group-hover:text-white group-hover:shadow-[0_0_15px_rgba(143,123,255,0.4)] transition-all duration-300 shrink-0">
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
