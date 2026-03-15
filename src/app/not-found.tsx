import Link from "next/link";
import { getFactoryConfig } from "@/lib/factory";

export default function NotFound() {
  const config = getFactoryConfig();
  const primaryColor = config.branding.primary_color;

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center px-6">
      {/* Background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-15 blur-[120px] pointer-events-none"
        style={{ background: primaryColor }}
      />

      <div className="relative text-center max-w-lg">
        <p
          className="text-8xl font-bold mb-4"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}99)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </p>
        <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-slate-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl text-sm font-medium text-white transition-all hover:brightness-110"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
              boxShadow: `0 4px 16px ${primaryColor}30`,
            }}
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl text-sm font-medium text-slate-300 border border-white/10 hover:bg-white/5 transition-all"
          >
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
