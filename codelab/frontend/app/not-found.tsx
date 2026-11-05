import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-4">
      <div className="relative mb-6">
        <div className="font-mono text-8xl md:text-9xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#8f7bff] via-[#ff7f70] to-[#4be3c3] opacity-80 select-none animate-pulse">
          404
        </div>
        <div className="absolute inset-0 blur-2xl bg-[#8f7bff]/20 -z-10 rounded-full" />
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-[#8f7bff]/30 bg-[#8f7bff]/10 text-xs font-mono text-[#8f7bff]">
        <span className="w-2 h-2 rounded-full bg-[#8f7bff] animate-ping" />
        ROUTE_NOT_FOUND
      </div>

      <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-ink mb-3">
        Page Lost in Cyberspace
      </h1>

      <p className="max-w-md text-sm md:text-base text-muted mb-8 leading-relaxed">
        The challenge or module you are looking for has been moved, renamed, or never compiled into this universe.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8f7bff] to-[#ff7f70] text-white text-sm font-semibold tracking-wide shadow-lg shadow-[#8f7bff]/20 hover:opacity-95 transition-all"
        >
          Return to All Tracks
        </Link>
        <Link
          href="/profile"
          className="px-5 py-2.5 rounded-xl border border-line bg-surface/70 text-ink text-sm font-medium hover:border-[#8f7bff]/40 hover:bg-surface transition-all"
        >
          View Dashboard
        </Link>
      </div>
    </div>
  );
}
