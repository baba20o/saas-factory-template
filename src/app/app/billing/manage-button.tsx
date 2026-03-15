"use client";

import { useState } from "react";

export default function ManageButton() {
  const [loading, setLoading] = useState(false);

  async function handleManage() {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setLoading(false);
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleManage}
      disabled={loading}
      className="px-5 py-2.5 rounded-xl text-sm font-medium text-white border border-white/10 hover:bg-white/5 transition-all disabled:opacity-50 cursor-pointer"
    >
      {loading ? "Opening portal..." : "Manage subscription"}
    </button>
  );
}
