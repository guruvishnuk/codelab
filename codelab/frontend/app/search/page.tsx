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
                {results.exercises.map((e) => (
                  <li key={e.id}>
                    <Link href={`/exercises/${e.id}`} className="cyber-card p-4 flex items-center justify-between hover:border-brand/70 hover:shadow-glow transition-all">
                      <div>
                        <span className="block font-semibold text-ink hover:text-brand transition-colors text-sm">
                          {e.title}
                        </span>
                        <div className="mt-1 text-xs text-muted font-mono">
                          Topic: <span className="text-brand">{e.topic_slug}</span>
                        </div>
                      </div>
                      <span className="pill-badge pill-badge-violet">
                        {e.difficulty.toUpperCase()}
                      </span>
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
