export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title skeleton */}
      <div className="h-8 w-48 rounded-lg bg-glass-surface" />
      <div className="h-4 w-80 rounded bg-glass-surface" />

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-2xl border border-glass-border bg-glass-surface" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="h-64 rounded-2xl border border-glass-border bg-glass-surface mt-6" />
    </div>
  );
}
