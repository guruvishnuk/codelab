export default function Loading() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-40 rounded-2xl bg-surface/50 border border-line/60 relative overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="h-4 w-32 rounded bg-line/60" />
          <div className="h-8 w-72 rounded bg-line/80" />
          <div className="h-4 w-96 rounded bg-line/40" />
        </div>
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-[#8f7bff]/10 to-transparent" />
      </div>

      {/* Grid of Skeleton Challenge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-surface/40 border border-line/50 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-6 w-20 rounded bg-line/70" />
              <div className="h-4 w-12 rounded bg-line/50" />
            </div>
            <div className="h-5 w-40 rounded bg-line/80" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-line/40" />
              <div className="h-3 w-4/5 rounded bg-line/40" />
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-line/30">
              <div className="h-4 w-24 rounded bg-line/50" />
              <div className="h-8 w-20 rounded-xl bg-line/70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
