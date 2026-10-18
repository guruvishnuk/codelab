"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchInput() {
  const [q, setQ] = useState("");
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <form onSubmit={onSubmit} className="px-3 pb-3">
      <div className="relative">
        <input 
          type="search" 
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search lessons & exercises..." 
          className="w-full rounded-lg border border-line bg-surface/80 px-3 py-1.5 text-xs text-ink placeholder:text-muted outline-none focus:border-brand focus:ring-1 focus:ring-brand shadow-xs transition-all"
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted pointer-events-none">
          🔍
        </span>
      </div>
    </form>
  );
}
