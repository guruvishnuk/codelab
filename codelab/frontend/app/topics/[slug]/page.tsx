import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getTopic } from "@/lib/api";

export default async function TopicPage({ params }: { params: { slug: string } }) {
  const topic = await getTopic(params.slug).catch(() => null);
  if (!topic) notFound();

  return (
    <article className="max-w-3xl">
      <h1 className="text-4xl font-bold tracking-tight">{topic.title}</h1>
      <p className="mt-2 text-muted">{topic.summary}</p>

      <div className="notes mt-8">
        <ReactMarkdown>{topic.notes_md}</ReactMarkdown>
      </div>

      <h2 className="mt-12 text-2xl font-semibold">Exercises</h2>
      <ul className="mt-4 divide-y divide-line border-y border-line">
        {topic.exercises.map((ex) => (
          <li key={ex.id}>
            <Link
              href={`/exercises/${ex.id}`}
              className="flex items-center justify-between py-4 hover:text-brand"
            >
              <span className="font-medium">
                {ex.title}
                {ex.solved && (
                  <span className="ml-3 rounded bg-ok/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ok">
                    Solved
                  </span>
                )}
              </span>
              <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand-dark">
                {ex.difficulty}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
