import Link from "next/link";
import { getTopics } from "@/lib/api";
import SearchInput from "./SearchInput";

export default async function Sidebar() {
  let topics: Awaited<ReturnType<typeof getTopics>> = [];
  try {
    topics = await getTopics();
  } catch {
    return <p className="px-5 pb-4 text-sm text-bad">Can't reach the API.</p>;
  }

  return (
    <>
      <SearchInput />
      <nav className="px-3 pb-4" aria-label="Topics">
        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
          Topics
        </div>
        <ul className="space-y-1">
        {topics.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/topics/${t.slug}`}
              className="block rounded-md px-3 py-2 text-sm font-medium text-ink hover:bg-brand-soft"
            >
              {t.title}
            </Link>
          </li>
        ))}
        </ul>

        <div className="mt-6 border-t border-line pt-4">
          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Platform
          </div>
          <ul className="space-y-1">
            <li>
              <Link
                href="/about"
                className="block rounded-md px-3 py-2 text-sm font-medium text-ink hover:bg-brand-soft"
              >
                About CodeLab
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
