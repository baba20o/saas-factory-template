export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title skeleton */}
      <div className="h-8 w-48 rounded-lg bg-white/5" />
      <div className="h-4 w-80 rounded bg-white/5" />

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-2xl border border-white/10 bg-white/[0.02]" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="h-64 rounded-2xl border border-white/10 bg-white/[0.02] mt-6" />
    </div>
  );
}
