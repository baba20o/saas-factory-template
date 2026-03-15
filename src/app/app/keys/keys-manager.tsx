"use client";

import { useState } from "react";

interface ApiKey {
  id: string;
  prefix: string;
  name: string;
  scopes: string[];
  last_used_at: string | null;
  revoked_at: string | null;
  created_at: string;
}

export default function KeysManager({ initialKeys }: { initialKeys: ApiKey[] }) {
  const [keys, setKeys] = useState(initialKeys);
  const [newKeyRaw, setNewKeyRaw] = useState<string | null>(null);
  const [keyName, setKeyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [copied, setCopied] = useState(false);

  async function createKey() {
    setCreating(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: keyName || "Default" }),
      });
      const data = await res.json();
      if (data.key) {
        setNewKeyRaw(data.key);
        // Refresh keys list
        const listRes = await fetch("/api/keys");
        const listData = await listRes.json();
        if (listData.keys) setKeys(listData.keys);
        setKeyName("");
        setShowCreate(false);
      }
    } finally {
      setCreating(false);
    }
  }

  async function revokeKey(id: string) {
    const res = await fetch("/api/keys", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setKeys(keys.map((k) => (k.id === id ? { ...k, revoked_at: new Date().toISOString() } : k)));
    }
  }

  function copyKey() {
    if (newKeyRaw) {
      navigator.clipboard.writeText(newKeyRaw);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const activeKeys = keys.filter((k) => !k.revoked_at);
  const revokedKeys = keys.filter((k) => k.revoked_at);

  return (
    <div className="space-y-6">
      {/* New key reveal banner */}
      {newKeyRaw && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-amber-400 mb-1">
                Save your API key now — you won&apos;t see it again
              </h3>
              <code className="block text-sm text-white bg-black/40 rounded-lg px-4 py-2.5 mt-2 break-all font-mono">
                {newKeyRaw}
              </code>
            </div>
            <button
              onClick={copyKey}
              className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium text-white border border-white/10 hover:bg-white/5 transition-all cursor-pointer"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <button
            onClick={() => setNewKeyRaw(null)}
            className="mt-3 text-xs text-slate-500 hover:text-slate-300 cursor-pointer"
          >
            Dismiss — I&apos;ve saved it
          </button>
        </div>
      )}

      {/* Create key */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Active keys</h2>
        {!showCreate && activeKeys.length < 5 && (
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-90 transition-all cursor-pointer"
          >
            Create new key
          </button>
        )}
      </div>

      {showCreate && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-sm text-slate-400 mb-1.5">Key name</label>
            <input
              type="text"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="e.g. Production, Development"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
          <button
            onClick={createKey}
            disabled={creating}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer shrink-0"
          >
            {creating ? "Creating..." : "Create"}
          </button>
          <button
            onClick={() => setShowCreate(false)}
            className="px-4 py-2.5 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5 transition-all cursor-pointer shrink-0"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Active keys table */}
      {activeKeys.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-12 text-center">
          <p className="text-sm text-slate-500">No API keys yet</p>
          <p className="text-xs text-slate-600 mt-1">Create a key to start using the API.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="text-left text-xs text-slate-500 font-medium px-6 py-3">Name</th>
                <th className="text-left text-xs text-slate-500 font-medium px-6 py-3">Key</th>
                <th className="text-left text-xs text-slate-500 font-medium px-6 py-3 hidden sm:table-cell">Created</th>
                <th className="text-left text-xs text-slate-500 font-medium px-6 py-3 hidden sm:table-cell">Last used</th>
                <th className="text-right text-xs text-slate-500 font-medium px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {activeKeys.map((key) => (
                <tr key={key.id} className="border-b border-white/5 last:border-0">
                  <td className="px-6 py-4 text-sm text-white">{key.name}</td>
                  <td className="px-6 py-4">
                    <code className="text-xs text-slate-400 font-mono bg-white/5 px-2 py-1 rounded">
                      {key.prefix}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 hidden sm:table-cell">
                    {new Date(key.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 hidden sm:table-cell">
                    {key.last_used_at
                      ? new Date(key.last_used_at).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => revokeKey(key.id)}
                      className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Revoked keys */}
      {revokedKeys.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-white mt-8">Revoked keys</h2>
          <div className="rounded-2xl border border-white/10 overflow-hidden opacity-60">
            <table className="w-full">
              <tbody>
                {revokedKeys.map((key) => (
                  <tr key={key.id} className="border-b border-white/5 last:border-0">
                    <td className="px-6 py-3 text-sm text-slate-500 line-through">{key.name}</td>
                    <td className="px-6 py-3">
                      <code className="text-xs text-slate-600 font-mono">{key.prefix}</code>
                    </td>
                    <td className="px-6 py-3 text-xs text-slate-600">
                      Revoked {new Date(key.revoked_at!).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Quick start */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
        <h3 className="text-lg font-semibold text-white mb-4">Quick start</h3>
        <pre className="text-sm text-slate-300 bg-black/40 rounded-xl p-4 overflow-x-auto font-mono">
{`curl https://your-domain.com/api/v1/plans \\
  -H "Authorization: Bearer sk_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "Build a mobile app"}'`}
        </pre>
      </div>
    </div>
  );
}
