"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/AuthShell";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = "/app";
    }
  }

  return (
    <AuthShell
      footer={
        <p>
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-primary hover:brightness-125 font-medium transition-colors">
            Create one
          </a>
        </p>
      }
    >
      <h1 className="text-2xl font-bold text-text-primary text-center mb-2">Welcome back</h1>
      <p className="text-text-secondary text-sm text-center mb-8">Sign in to your account to continue</p>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-glass-border bg-glass-surface px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            required
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
              Password
            </label>
            <a href="/forgot-password" className="text-xs text-primary hover:brightness-125 transition-colors">
              Forgot password?
            </a>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-glass-border bg-glass-surface px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            required
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2.5">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all disabled:opacity-50 relative overflow-hidden group"
          style={{
            backgroundImage: "linear-gradient(135deg, var(--color-primary), var(--color-gradient-to))",
            boxShadow: "0 8px 24px -4px color-mix(in srgb, var(--color-primary) 40%, transparent)",
          }}
        >
          <span className="relative z-10">{loading ? "Signing in..." : "Sign in"}</span>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-text-muted">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Google OAuth */}
      <button
        onClick={async () => {
          const supabase = createClient();
          await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/auth/callback` },
          });
        }}
        className="w-full rounded-xl border border-glass-border bg-glass-surface py-3 text-sm font-medium text-text-secondary hover:bg-surface-elevated transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>
    </AuthShell>
  );
}
