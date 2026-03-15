"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/AuthShell";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <AuthShell>
        <div className="text-center py-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/25">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-3">Check your email</h1>
          <p className="text-text-secondary text-sm leading-relaxed mb-6">
            We sent a confirmation link to<br />
            <span className="text-text-primary font-medium">{email}</span>
          </p>
          <p className="text-text-muted text-xs">
            Click the link in your email to activate your account. Didn&apos;t receive it?{" "}
            <button
              onClick={() => { setSuccess(false); setLoading(false); }}
              className="text-primary hover:brightness-125 transition-colors"
            >
              Try again
            </button>
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      footer={
        <p>
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:brightness-125 font-medium transition-colors">
            Sign in
          </a>
        </p>
      }
    >
      <h1 className="text-2xl font-bold text-text-primary text-center mb-2">Create your account</h1>
      <p className="text-text-secondary text-sm text-center mb-8">Start planning projects in 60 seconds</p>

      <form onSubmit={handleSignup} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
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
          <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            className="w-full rounded-xl border border-glass-border bg-glass-surface px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            minLength={6}
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
          <span className="relative z-10">{loading ? "Creating account..." : "Create account"}</span>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        <p className="text-xs text-text-muted text-center">
          By signing up, you agree to our{" "}
          <a href="/terms" className="text-text-secondary hover:text-text-primary transition-colors">Terms</a>
          {" "}and{" "}
          <a href="/privacy" className="text-text-secondary hover:text-text-primary transition-colors">Privacy Policy</a>
        </p>
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
