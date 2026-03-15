"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/AuthShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <AuthShell>
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Check your email</h1>
          <p className="text-text-secondary text-sm mb-6">
            We sent a password reset link to{" "}
            <span className="text-text-primary font-medium">{email}</span>
          </p>
          <p className="text-text-muted text-xs mb-8">
            Didn&apos;t receive the email? Check your spam folder or try again.
          </p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-primary hover:brightness-125 font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to login
          </a>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      footer={
        <p>
          Remember your password?{" "}
          <a href="/login" className="text-primary hover:brightness-125 font-medium transition-colors">
            Sign in
          </a>
        </p>
      }
    >
      <h1 className="text-2xl font-bold text-text-primary text-center mb-2">Reset your password</h1>
      <p className="text-text-secondary text-sm text-center mb-8">
        Enter your email and we&apos;ll send you a reset link
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
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
          <span className="relative z-10">{loading ? "Sending..." : "Send reset link"}</span>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </form>
    </AuthShell>
  );
}
