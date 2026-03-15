import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      {/* Background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-15 blur-[120px] pointer-events-none"
        style={{ background: "var(--color-primary)" }}
      />

      <div className="relative text-center max-w-lg">
        <p
          className="text-8xl font-bold mb-4"
          style={{
            background: "linear-gradient(135deg, var(--color-primary), var(--color-gradient-to))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </p>
        <h1 className="text-2xl font-bold text-text-primary mb-3">Page not found</h1>
        <p className="text-text-secondary mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl text-sm font-medium text-white transition-all hover:brightness-110"
            style={{
              background: "linear-gradient(135deg, var(--color-primary), var(--color-gradient-to))",
              boxShadow: "0 4px 16px color-mix(in srgb, var(--color-primary) 30%, transparent)",
            }}
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl text-sm font-medium text-text-secondary border border-glass-border hover:bg-surface-elevated transition-all"
          >
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
