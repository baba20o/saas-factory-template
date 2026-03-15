import { createClient } from "@/lib/supabase/server";
import KeysManager from "./keys-manager";

export default async function KeysPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: keys } = await supabase
    .from("api_keys")
    .select("id, prefix, name, scopes, last_used_at, revoked_at, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  // Get usage count for last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { count: usageCount } = await supabase
    .from("api_usage")
    .select("id", { count: "exact", head: true })
    .gte("created_at", thirtyDaysAgo);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">API Keys</h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage your API keys for programmatic access.
        </p>
      </div>

      {/* Usage stat */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-glass-border bg-glass-surface backdrop-blur-xl p-6">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Active keys</p>
          <p className="text-3xl font-bold text-text-primary">
            {keys?.filter((k) => !k.revoked_at).length ?? 0}
          </p>
          <p className="text-xs text-text-muted mt-1">of 5 max</p>
        </div>
        <div className="rounded-2xl border border-glass-border bg-glass-surface backdrop-blur-xl p-6">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-2">API calls (30d)</p>
          <p className="text-3xl font-bold text-text-primary">{usageCount ?? 0}</p>
          <p className="text-xs text-text-muted mt-1">Last 30 days</p>
        </div>
        <div className="rounded-2xl border border-glass-border bg-glass-surface backdrop-blur-xl p-6">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Rate limit</p>
          <p className="text-3xl font-bold text-text-primary">1,000</p>
          <p className="text-xs text-text-muted mt-1">requests / day</p>
        </div>
      </div>

      <KeysManager initialKeys={keys ?? []} />
    </div>
  );
}
