import { searchEntities } from "@/lib/api";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q || "";

  if (!q) {
    return redirect("/");
  }

  const results = await searchEntities(q).catch(() => null);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-display text-ink">Search Curriculum</h1>
        <p className="mt-2 text-sm text-muted">
          Showing matching tracks and exercises for: <span className="font-mono text-brand font-semibold">"{q}"</span>
        </p>
      </div>

      {results === null ? (
        <div className="cyber-card p-4 border-bad/30 bg-bad/10 text-xs font-mono text-bad">
          ⚠️ Search service is currently reconnecting. Please retry in a few moments.
        </div>
      ) : results.topics.length === 0 && results.exercises.length === 0 ? (
        <div className="cyber-card p-8 text-center text-muted text-sm">
          No matches found for "{q}". Try searching for concepts like "loop", "string", "input", or "dictionary".
        </div>
      ) : (
        <div className="space-y-8">
          {results.topics.length > 0 && (
            <section>
              <h2 className="text-lg font-bold font-display text-ink border-b border-line pb-2 mb-4 flex items-center gap-2">
                <span>📚</span> Tracks ({results.topics.length})
              </h2>
              <ul className="space-y-3">
                {results.topics.map((t) => (
                  <li key={t.slug}>
                    <Link href={`/topics/${t.slug}`} className="cyber-card p-4.5 block hover:border-brand/70 hover:shadow-glow transition-all">
                      <span className="block font-semibold text-ink hover:text-brand text-base transition-colors">
                        {t.title}
                      </span>
                      {t.summary && <p className="mt-1 text-xs text-muted leading-relaxed">{t.summary}</p>}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {results.exercises.length > 0 && (
            <section>
              <h2 className="text-lg font-bold font-display text-ink border-b border-line pb-2 mb-4 flex items-center gap-2">
                <span>⌨️</span> Exercises ({results.exercises.length})
              </h2>
              <ul className="space-y-3">
                {results.exercises.map((e, index) => (
                  <li key={e.id}>
                    <Link
                      href={`/exercises/${e.id}`}
                      className="cyber-card group p-4 sm:p-5 flex items-center justify-between gap-4 hover:border-brand/70 hover:shadow-[0_12px_36px_-10px_rgba(143,123,255,0.3)] transition-all"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-surface-elevated/90 border border-brand/30 text-brand font-mono text-sm font-bold group-hover:bg-brand group-hover:text-white transition-colors">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="min-w-0">
                          <span className="block font-bold text-ink group-hover:text-brand transition-colors text-sm sm:text-base font-display truncate">
                            {e.title}
                          </span>
                          <div className="mt-0.5 text-xs text-muted font-mono flex items-center gap-2">
                            <span>Track:</span>
                            <span className="text-brand font-semibold">{e.topic_slug}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`pill-badge ${
                            e.difficulty === "easy"
                              ? "pill-badge-mint"
                              : e.difficulty === "medium"
                              ? "pill-badge-amber"
                              : "pill-badge-coral"
                          }`}
                        >
                          {e.difficulty.toUpperCase()}
                        </span>
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-elevated border border-line text-muted group-hover:bg-brand group-hover:border-brand group-hover:text-white transition-all">
                          <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
