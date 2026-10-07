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
    <form onSubmit={onSubmit} className="px-5 pb-4">
      <input 
        type="search" 
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search topics and exercises..." 
        className="w-full rounded-md border border-line px-3 py-1.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
      />
    </form>
  );
}
