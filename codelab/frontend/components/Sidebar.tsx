import Link from "next/link";
import { getTopics } from "@/lib/api";
import SearchInput from "./SearchInput";

const FALLBACK_TOPIC_LIST = [
  { slug: "python-basics", title: "Python Basics", summary: "Variables, I/O" },
  { slug: "control-flow", title: "Control Flow", summary: "Decisions & loops" },
  { slug: "strings", title: "Strings", summary: "Slicing & methods" },
  { slug: "functions-and-scope", title: "Functions & Scope", summary: "Modular code" },
  { slug: "lists-and-tuples", title: "Lists & Tuples", summary: "Sequences" },
  { slug: "dictionaries-and-sets", title: "Dictionaries & Sets", summary: "Hash mappings" },
];

export default async function Sidebar() {
  let topics: Awaited<ReturnType<typeof getTopics>> = [];
  try {
    topics = await getTopics();
  } catch {
    topics = FALLBACK_TOPIC_LIST;
  }

  return (
    <>
      <SearchInput />
      <nav className="px-3 pb-4" aria-label="Topics">
        <div className="mb-2 px-3 text-[11px] font-mono font-bold uppercase tracking-wider text-muted">
          Curriculum Tracks
        </div>
        <ul className="space-y-1">
          {topics.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/topics/${t.slug}`}
                className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-ink/90 hover:bg-brand-soft hover:text-brand transition-all"
              >
                <span className="truncate">{t.title}</span>
                <span className="text-xs font-mono text-muted group-hover:text-brand opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-line/60 pt-4">
          <div className="mb-2 px-3 text-[11px] font-mono font-bold uppercase tracking-wider text-muted">
            Explore
          </div>
          <ul className="space-y-1">
            <li>
              <Link
                href="/"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink/80 hover:bg-brand-soft hover:text-brand transition-colors"
              >
                <span>🏠</span>
                <span>Home Showcase</span>
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink/80 hover:bg-brand-soft hover:text-brand transition-colors"
              >
                <span>📖</span>
                <span>About Architecture</span>
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink/80 hover:bg-brand-soft hover:text-brand transition-colors"
              >
                <span>⚡</span>
                <span>Learner Profile</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
