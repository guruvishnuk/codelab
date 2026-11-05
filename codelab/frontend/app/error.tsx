"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected client-side runtime errors
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-[#ff7f70]/30 bg-[#ff7f70]/10 text-xs font-mono text-[#ff7f70]">
        <span className="w-2 h-2 rounded-full bg-[#ff7f70] animate-pulse" />
        SYSTEM_RUNTIME_EXCEPTION
      </div>

      <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-ink mb-3">
        An Unexpected Error Occurred
      </h1>

      <p className="max-w-md text-sm md:text-base text-muted mb-6 leading-relaxed">
        {error.message || "The engine encountered an unhandled exception while rendering this view."}
      </p>

      {error.digest && (
        <div className="mb-6 px-3 py-1.5 rounded-lg bg-surface/80 border border-line text-xs font-mono text-muted">
          Digest ID: <span className="text-[#8f7bff]">{error.digest}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8f7bff] to-[#ff7f70] text-white text-sm font-semibold tracking-wide shadow-lg shadow-[#8f7bff]/20 hover:opacity-95 transition-all cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl border border-line bg-surface/70 text-ink text-sm font-medium hover:border-[#8f7bff]/40 hover:bg-surface transition-all"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
