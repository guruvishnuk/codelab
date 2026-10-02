import Link from "next/link";
import { getTopics } from "@/lib/api";

export default async function Home() {
  const topics = await getTopics().catch(() => null);

  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
        Read a short note. Then write the code.
      </h1>
      <p className="mt-4 max-w-[60ch] text-lg text-muted">
        Each topic has notes and exercises. Your code runs against test cases and you see
        right away which ones pass.
      </p>

      <h2 className="mt-12 text-xl font-semibold">Pick a topic</h2>
      {topics === null ? (
        <p className="mt-4 text-bad">
          The API isn't responding. Start the backend, then refresh this page.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {topics.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/topics/${t.slug}`}
                className="flex items-baseline justify-between gap-6 py-4 hover:text-brand"
              >
                <span className="text-lg font-medium">{t.title}</span>
                <span className="text-sm text-muted">{t.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
