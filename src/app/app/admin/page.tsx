import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.user_metadata?.is_admin) redirect("/app");

  // Fetch all users via admin client (bypasses RLS)
  const { data: users } = await supabaseAdmin.auth.admin.listUsers({ perPage: 100 });

  // Fetch subscription data for all users
  const { data: subs } = await supabaseAdmin
    .from("subscriptions")
    .select("user_id, plan_name, status");

  // Fetch key counts per user
  const { data: keyCounts } = await supabaseAdmin
    .from("api_keys")
    .select("user_id")
    .is("revoked_at", null);

  // Fetch total API usage (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { count: totalUsage } = await supabaseAdmin
    .from("api_usage")
    .select("id", { count: "exact", head: true })
    .gte("created_at", thirtyDaysAgo);

  // Build lookup maps
  const subMap = new Map(subs?.map((s) => [s.user_id, s]) ?? []);
  const keyCountMap = new Map<string, number>();
  keyCounts?.forEach((k) => {
    keyCountMap.set(k.user_id, (keyCountMap.get(k.user_id) ?? 0) + 1);
  });

  const allUsers = users?.users ?? [];
  const proCount = subs?.filter((s) => s.plan_name === "pro" && s.status === "active").length ?? 0;
  const totalKeys = keyCounts?.length ?? 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin</h1>
        <p className="text-sm text-slate-400 mt-1">Manage users, subscriptions, and API keys.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Total users</p>
          <p className="text-3xl font-bold text-white">{allUsers.length}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Pro users</p>
          <p className="text-3xl font-bold text-white">{proCount}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Active keys</p>
          <p className="text-3xl font-bold text-white">{totalKeys}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">API calls (30d)</p>
          <p className="text-3xl font-bold text-white">{totalUsage ?? 0}</p>
        </div>
      </div>

      {/* Users table */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Users</h2>
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="text-left text-xs text-slate-500 font-medium px-6 py-3">Email</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-6 py-3">Plan</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-6 py-3 hidden md:table-cell">API Keys</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-6 py-3 hidden md:table-cell">Signed up</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-6 py-3 hidden lg:table-cell">Last sign in</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-6 py-3">Role</th>
                  <th className="text-right text-xs text-slate-500 font-medium px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((u) => {
                  const sub = subMap.get(u.id);
                  const plan = sub?.plan_name ?? "free";
                  const keys = keyCountMap.get(u.id) ?? 0;
                  const isAdmin = u.user_metadata?.is_admin === true;

                  return (
                    <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                            {(u.email ?? "?")[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-white truncate">{u.email}</p>
                            {u.user_metadata?.full_name && (
                              <p className="text-xs text-slate-500 truncate">{u.user_metadata.full_name}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            plan === "pro"
                              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                              : "bg-white/10 text-slate-400"
                          }`}
                        >
                          {plan === "pro" ? "Pro" : "Free"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400 hidden md:table-cell">{keys}</td>
                      <td className="px-6 py-4 text-xs text-slate-500 hidden md:table-cell">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 hidden lg:table-cell">
                        {u.last_sign_in_at
                          ? new Date(u.last_sign_in_at).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="px-6 py-4">
                        {isAdmin && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400">
                            Admin
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/app/admin/users/${u.id}`}
                          className="text-xs text-indigo-400 hover:text-indigo-300"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
