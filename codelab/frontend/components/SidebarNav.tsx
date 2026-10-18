"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchInput from "./SearchInput";

interface TopicItem {
  slug: string;
  title: string;
  summary: string;
}

const TOPIC_ICONS: Record<string, string> = {
  "python-basics": "🐍",
  "control-flow": "🔀",
  "strings": "🔤",
  "functions-and-scope": "🧩",
  "lists-and-tuples": "📋",
  "dictionaries-and-sets": "🗂️",
};

export default function SidebarNav({ topics }: { topics: TopicItem[] }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col space-y-4">
      {/* Search Bar with Keyboard Pill */}
      <SearchInput />

      {/* Curriculum Tracks Section */}
      <nav className="px-3" aria-label="Curriculum Tracks">
        <div className="mb-2.5 flex items-center justify-between px-3 text-[11px] font-mono font-bold uppercase tracking-wider text-muted">
          <span>Tracks</span>
          <span className="rounded-full bg-surface-elevated px-2 py-0.2 text-[10px] text-muted border border-line">
            {topics.length}
          </span>
        </div>

        <ul className="space-y-1">
          {topics.map((t) => {
            const isActive = pathname === `/topics/${t.slug}`;
            const icon = TOPIC_ICONS[t.slug] || "📄";

            return (
              <li key={t.slug}>
                <Link
                  href={`/topics/${t.slug}`}
                  className={`group relative flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? "border border-brand/50 bg-brand-soft text-brand shadow-glow"
                      : "text-ink/80 hover:bg-surface-elevated hover:text-ink hover:translate-x-0.5 border border-transparent"
                  }`}
                >
                  {/* Active Indicator Left Pill */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-brand" />
                  )}

                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-sm select-none">{icon}</span>
                    <span className="truncate">{t.title}</span>
                  </div>

                  <span
                    className={`font-mono text-[10px] transition-transform ${
                      isActive
                        ? "text-brand"
                        : "text-muted group-hover:text-brand group-hover:translate-x-0.5 opacity-60 group-hover:opacity-100"
                    }`}
                  >
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Platform Section */}
        <div className="mt-6 border-t border-line/60 pt-4">
          <div className="mb-2.5 px-3 text-[11px] font-mono font-bold uppercase tracking-wider text-muted">
            Platform & Tools
          </div>
          <ul className="space-y-1">
            <li>
              <Link
                href="/exercises/1"
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  pathname.startsWith("/exercises")
                    ? "border border-brand/50 bg-brand-soft text-brand shadow-glow"
                    : "text-ink/80 hover:bg-surface-elevated hover:text-ink border border-transparent"
                }`}
              >
                <span>⚡</span>
                <span>Active Playground</span>
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  pathname === "/profile"
                    ? "border border-brand/50 bg-brand-soft text-brand shadow-glow"
                    : "text-ink/80 hover:bg-surface-elevated hover:text-ink border border-transparent"
                }`}
              >
                <span>🏆</span>
                <span>Learner Profile</span>
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  pathname === "/about"
                    ? "border border-brand/50 bg-brand-soft text-brand shadow-glow"
                    : "text-ink/80 hover:bg-surface-elevated hover:text-ink border border-transparent"
                }`}
              >
                <span>📖</span>
                <span>Architecture Specs</span>
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-ink/80 hover:bg-surface-elevated hover:text-ink border border-transparent transition-all"
              >
                <span>🌌</span>
                <span>3D Landing View</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
