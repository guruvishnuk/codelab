"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function SearchInput() {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <form onSubmit={onSubmit} className="px-3 pb-2">
      <div className="relative group">
        <input 
          ref={inputRef}
          type="search" 
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search tracks & lessons..." 
          className="w-full rounded-xl border border-line bg-surface/90 pl-8 pr-12 py-2 text-xs text-ink placeholder:text-muted outline-none focus:border-brand focus:ring-1 focus:ring-brand shadow-xs transition-all"
        />
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted pointer-events-none group-focus-within:text-brand transition-colors">
          🔍
        </span>
        <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center rounded border border-line bg-surface-elevated px-1.5 py-0.5 font-mono text-[9px] text-muted pointer-events-none">
          ⌘K
        </kbd>
      </div>
    </form>
  );
}
