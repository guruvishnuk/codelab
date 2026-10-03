import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getExercise } from "@/lib/api";
import Playground from "@/components/Playground";

export default async function ExercisePage({ params }: { params: { id: string } }) {
  const ex = await getExercise(params.id).catch(() => null);
  if (!ex) notFound();

  return (
    <div>
      <Link href={`/topics/${ex.topic_slug}`} className="text-sm text-brand hover:underline">
        Back to notes
      </Link>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">{ex.title}</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="notes">
          <ReactMarkdown>{ex.prompt_md}</ReactMarkdown>
        </div>
        <Playground exerciseId={ex.id} starterCode={ex.starter_code} />
      </div>

      <div className="mt-8">
        {ex.next_exercise_id ? (
          <Link
            href={`/exercises/${ex.next_exercise_id}`}
            className="inline-block rounded-md bg-brand px-5 py-2 font-medium text-white hover:bg-brand-dark"
          >
            Next exercise →
          </Link>
        ) : (
          <Link
            href={`/topics/${ex.topic_slug}`}
            className="inline-block rounded-md border border-line px-5 py-2 text-sm font-medium hover:bg-brand-soft"
          >
            ← Back to topic notes
          </Link>
        )}
      </div>
    </div>
  );
}
