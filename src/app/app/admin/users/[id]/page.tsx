import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";
import AdminActions from "./admin-actions";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  if (!currentUser?.user_metadata?.is_admin) redirect("/app");

  // Fetch the target user
  const { data: { user: targetUser }, error } = await supabaseAdmin.auth.admin.getUserById(id);
  if (error || !targetUser) notFound();

  // Fetch subscription
  const { data: sub } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("user_id", id)
    .single();

  // Fetch API keys
  const { data: keys } = await supabaseAdmin
    .from("api_keys")
    .select("id, prefix, name, scopes, last_used_at, revoked_at, created_at")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  // Fetch recent API usage (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const activeKeyIds = keys?.filter((k) => !k.revoked_at).map((k) => k.id) ?? [];
  let usageCount = 0;
  if (activeKeyIds.length > 0) {
    const { count } = await supabaseAdmin
      .from("api_usage")
      .select("id", { count: "exact", head: true })
      .in("key_id", activeKeyIds)
      .gte("created_at", thirtyDaysAgo);
    usageCount = count ?? 0;
  }

  const plan = sub?.plan_name ?? "free";
  const isAdmin = targetUser.user_metadata?.is_admin === true;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <Link href="/app/admin" className="text-slate-500 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{targetUser.email}</h1>
          <p className="text-sm text-slate-400 mt-0.5">User detail — {targetUser.id}</p>
        </div>
      </div>

      {/* User info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 space-y-3">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Profile</h2>
          <div>
            <p className="text-xs text-slate-500">Email</p>
            <p className="text-sm text-white">{targetUser.email}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Name</p>
            <p className="text-sm text-white">{targetUser.user_metadata?.full_name || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Signed up</p>
            <p className="text-sm text-white">
              {targetUser.created_at ? new Date(targetUser.created_at).toLocaleString() : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Last sign in</p>
            <p className="text-sm text-white">
              {targetUser.last_sign_in_at
                ? new Date(targetUser.last_sign_in_at).toLocaleString()
                : "Never"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Provider</p>
            <p className="text-sm text-white">
              {targetUser.app_metadata?.provider ?? "email"}
            </p>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                plan === "pro"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "bg-white/10 text-slate-400"
              }`}
            >
              {plan === "pro" ? "Pro" : "Free"}
            </span>
            {isAdmin && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400">
                Admin
              </span>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 space-y-3">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Subscription</h2>
          {sub ? (
            <>
              <div>
                <p className="text-xs text-slate-500">Plan</p>
                <p className="text-sm text-white capitalize">{sub.plan_name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Status</p>
                <p className="text-sm text-white capitalize">{sub.status}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Stripe Customer ID</p>
                <p className="text-sm text-white font-mono text-xs">{sub.stripe_customer_id || "—"}</p>
              </div>
              {sub.current_period_end && (
                <div>
                  <p className="text-xs text-slate-500">Renews</p>
                  <p className="text-sm text-white">
                    {new Date(sub.current_period_end).toLocaleDateString()}
                  </p>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-500">No subscription record. Default free plan.</p>
          )}
          <div className="pt-2 border-t border-white/5">
            <p className="text-xs text-slate-500">API usage (30d)</p>
            <p className="text-2xl font-bold text-white">{usageCount}</p>
          </div>
        </div>
      </div>

      {/* Admin actions */}
      <AdminActions userId={id} isAdmin={isAdmin} plan={plan} />

      {/* API Keys */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">
          API Keys ({keys?.filter((k) => !k.revoked_at).length ?? 0} active)
        </h2>
        {keys && keys.length > 0 ? (
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="text-left text-xs text-slate-500 font-medium px-6 py-3">Name</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-6 py-3">Prefix</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-6 py-3">Status</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-6 py-3">Created</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-6 py-3">Last used</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((k) => (
                  <tr key={k.id} className="border-b border-white/5 last:border-0">
                    <td className="px-6 py-3 text-sm text-white">{k.name}</td>
                    <td className="px-6 py-3">
                      <code className="text-xs text-slate-400 font-mono">{k.prefix}</code>
                    </td>
                    <td className="px-6 py-3">
                      {k.revoked_at ? (
                        <span className="text-xs text-red-400">Revoked</span>
                      ) : (
                        <span className="text-xs text-green-400">Active</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-xs text-slate-500">
                      {new Date(k.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-xs text-slate-500">
                      {k.last_used_at ? new Date(k.last_used_at).toLocaleDateString() : "Never"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-8 text-center">
            <p className="text-sm text-slate-500">No API keys</p>
          </div>
        )}
      </div>
    </div>
  );
}
