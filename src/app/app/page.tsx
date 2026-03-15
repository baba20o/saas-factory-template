import { createClient } from "@/lib/supabase/server";
import { getUserSubscription } from "@/lib/subscription";
import { getFactoryConfig } from "@/lib/factory";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const subscription = user ? await getUserSubscription(user.id) : null;
  const config = getFactoryConfig();
  const primaryColor = config.branding.primary_color;
  const stats = config.dashboard?.stats ?? [
    { label: "Plans Created", key: "plans_created" },
    { label: "Exports", key: "exports" },
    { label: "Team Members", key: "team_members" },
  ];

  const isPro = subscription?.plan_name === "pro";

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Here&apos;s what&apos;s happening with your {config.product.name} account.
            </p>
          </div>
          {!isPro && (
            <a
              href="/app/billing"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:brightness-110 shrink-0"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
                boxShadow: `0 4px 16px ${primaryColor}30`,
              }}
            >
              Upgrade to Pro
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.key}
            className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6"
          >
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-white">0</p>
            <p className="text-xs text-slate-500 mt-1">No data yet</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition-all duration-200 hover:bg-white/[0.06] hover:border-white/20 group"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
              style={{ background: `${primaryColor}20`, color: primaryColor }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-white">Create new plan</h3>
            <p className="text-xs text-slate-500 mt-1">Start a new project plan from scratch</p>
          </button>

          <a
            href="/docs"
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition-all duration-200 hover:bg-white/[0.06] hover:border-white/20 group"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-white/10 text-slate-400 transition-transform group-hover:scale-110">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-white">View docs</h3>
            <p className="text-xs text-slate-500 mt-1">Learn how to get the most out of {config.product.name}</p>
          </a>

          <a
            href="/app/settings"
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition-all duration-200 hover:bg-white/[0.06] hover:border-white/20 group"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-white/10 text-slate-400 transition-transform group-hover:scale-110">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-white">Settings</h3>
            <p className="text-xs text-slate-500 mt-1">Manage your profile and preferences</p>
          </a>
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Recent activity</h2>
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-12 text-center">
          <div className="text-slate-600 mb-3">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <p className="text-sm text-slate-500">No recent activity</p>
          <p className="text-xs text-slate-600 mt-1">Get started by creating your first plan.</p>
        </div>
      </div>
    </div>
  );
}
