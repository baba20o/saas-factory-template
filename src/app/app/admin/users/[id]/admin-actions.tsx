"use client";

import { useState } from "react";

export default function AdminActions({
  userId,
  isAdmin,
  plan,
}: {
  userId: string;
  isAdmin: boolean;
  plan: string;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleAction(action: string) {
    setLoading(action);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: data.message || "Action completed." });
        // Reload after short delay to show updated data
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setMessage({ type: "error", text: data.error || "Action failed." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error." });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Admin actions</h2>

      {message && (
        <p className={`text-sm mb-4 ${message.type === "success" ? "text-green-400" : "text-red-400"}`}>
          {message.text}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        {plan === "free" ? (
          <button
            onClick={() => handleAction("upgrade")}
            disabled={loading !== null}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading === "upgrade" ? "Upgrading..." : "Upgrade to Pro"}
          </button>
        ) : (
          <button
            onClick={() => handleAction("downgrade")}
            disabled={loading !== null}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 border border-white/10 hover:bg-white/5 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading === "downgrade" ? "Downgrading..." : "Downgrade to Free"}
          </button>
        )}

        <button
          onClick={() => handleAction(isAdmin ? "remove_admin" : "make_admin")}
          disabled={loading !== null}
          className="px-4 py-2 rounded-xl text-sm font-medium text-amber-400 border border-amber-500/30 hover:bg-amber-500/10 transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading === "make_admin" || loading === "remove_admin"
            ? "Updating..."
            : isAdmin
              ? "Remove admin"
              : "Make admin"}
        </button>

        <button
          onClick={() => handleAction("revoke_all_keys")}
          disabled={loading !== null}
          className="px-4 py-2 rounded-xl text-sm font-medium text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading === "revoke_all_keys" ? "Revoking..." : "Revoke all keys"}
        </button>
      </div>
    </div>
  );
}
