"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/AuthShell";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

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
        <a href="/login" className="text-primary hover:brightness-125 font-medium transition-colors">
          Back to login
        </a>
      }
    >
      <h1 className="text-2xl font-bold text-text-primary text-center mb-2">Set new password</h1>
      <p className="text-text-secondary text-sm text-center mb-8">Enter your new password below</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1.5">New password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            minLength={6}
            className="w-full rounded-xl border border-glass-border bg-glass-surface px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-1.5">Confirm password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            minLength={6}
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
          <span className="relative z-10">{loading ? "Updating..." : "Update password"}</span>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </form>
    </AuthShell>
  );
}
