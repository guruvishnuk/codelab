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
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
      <p className="mt-2 text-muted">Showing results for "{q}"</p>

      {results === null ? (
        <p className="mt-8 text-bad">Search failed to load.</p>
      ) : results.topics.length === 0 && results.exercises.length === 0 ? (
        <p className="mt-8 text-muted">No results found.</p>
      ) : (
        <div className="mt-8 space-y-10">
          {results.topics.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold border-b border-line pb-2 mb-4">Topics</h2>
              <ul className="space-y-4">
                {results.topics.map((t) => (
                  <li key={t.slug} className="rounded border border-line bg-white p-4">
                    <Link href={`/topics/${t.slug}`} className="block hover:text-brand font-medium text-lg">
                      {t.title}
                    </Link>
                    {t.summary && <p className="mt-1 text-sm text-muted">{t.summary}</p>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {results.exercises.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold border-b border-line pb-2 mb-4">Exercises</h2>
              <ul className="space-y-2 divide-y divide-line">
                {results.exercises.map((e) => (
                  <li key={e.id} className="py-2">
                    <Link href={`/exercises/${e.id}`} className="block hover:text-brand font-medium">
                      {e.title}
                    </Link>
                    <div className="mt-1 text-xs text-muted flex gap-2">
                      <span className="capitalize">{e.difficulty}</span>
                      <span>•</span>
                      <span>Topic: {e.topic_slug}</span>
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
