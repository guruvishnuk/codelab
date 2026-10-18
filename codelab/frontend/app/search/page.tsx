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
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-display text-ink">Search Results</h1>
        <p className="mt-2 text-sm text-muted">
          Showing matching tracks and exercises for: <span className="font-mono text-brand font-semibold">"{q}"</span>
        </p>
      </div>

      {results === null ? (
        <div className="rounded-xl border border-bad/30 bg-bad/10 p-4 text-xs font-mono text-bad">
          Search service is currently reconnecting. Please retry in a few moments.
        </div>
      ) : results.topics.length === 0 && results.exercises.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center text-muted text-sm">
          No matches found for "{q}". Try searching for concepts like "loop", "string", "input", or "dictionary".
        </div>
      ) : (
        <div className="space-y-8">
          {results.topics.length > 0 && (
            <section>
              <h2 className="text-lg font-bold font-display text-ink border-b border-line pb-2 mb-4 flex items-center gap-2">
                <span>📚</span> Topics ({results.topics.length})
              </h2>
              <ul className="space-y-3">
                {results.topics.map((t) => (
                  <li key={t.slug} className="rounded-xl border border-line bg-surface p-4 hover:border-brand/60 hover:bg-surface-hover transition-all">
                    <Link href={`/topics/${t.slug}`} className="block font-semibold text-ink hover:text-brand text-base transition-colors">
                      {t.title}
                    </Link>
                    {t.summary && <p className="mt-1 text-xs text-muted leading-relaxed">{t.summary}</p>}
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
                  <li key={e.id} className="rounded-xl border border-line bg-surface p-4 hover:border-brand/60 hover:bg-surface-hover transition-all">
                    <div className="flex items-center justify-between">
                      <Link href={`/exercises/${e.id}`} className="block font-semibold text-ink hover:text-brand transition-colors">
                        {e.title}
                      </Link>
                      <span className="capitalize text-[11px] font-mono px-2 py-0.5 rounded border border-line bg-surface-elevated text-muted">
                        {e.difficulty}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-muted font-mono">
                      Topic: <span className="text-brand">{e.topic_slug}</span>
                    </div>
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
