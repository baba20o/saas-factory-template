import { createClient } from "@/lib/supabase/server";
import { getUserSubscription } from "@/lib/subscription";
import { getFactoryConfig } from "@/lib/factory";
import PlanCard from "./plan-card";
import ManageButton from "./manage-button";

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const subscription = user ? await getUserSubscription(user.id) : null;
  const config = getFactoryConfig();
  const primaryColor = config.branding.primary_color;

  const isPro = subscription?.plan_name === "pro";
  const renewalDate = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your subscription and billing details.</p>
      </div>

      {/* Current plan */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Current plan</h2>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              isPro
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                : "bg-white/10 text-slate-400"
            }`}
          >
            {isPro ? "Pro" : "Free"}
          </span>
        </div>
        {isPro ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-400">
              You&apos;re on the <strong className="text-white">Pro plan</strong>.
              {renewalDate && <> Next billing date: <strong className="text-white">{renewalDate}</strong>.</>}
            </p>
            {subscription?.status === "canceled" && (
              <p className="text-sm text-amber-400">
                Your subscription has been canceled and will end on {renewalDate}.
              </p>
            )}
            <ManageButton />
          </div>
        ) : (
          <p className="text-sm text-slate-400">
            You&apos;re on the <strong className="text-white">Free plan</strong>. Upgrade to unlock all features.
          </p>
        )}
      </div>

      {/* Plan comparison */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Compare plans</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {config.pricing.map((tier) => {
            const isCurrent =
              (tier.price === 0 && !isPro) || (tier.price > 0 && isPro);
            return (
              <PlanCard
                key={tier.name}
                name={tier.name}
                price={tier.price}
                interval={tier.interval}
                features={tier.features}
                isCurrent={isCurrent}
                isPro={isPro}
                priceId={tier.stripe_price_id}
                primaryColor={primaryColor}
              />
            );
          })}
        </div>
      </div>

      {/* Invoice history */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Invoice history</h2>
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-8 text-center">
          <p className="text-sm text-slate-500">No invoices yet</p>
          <p className="text-xs text-slate-600 mt-1">Invoices will appear here after your first payment.</p>
        </div>
      </div>
    </div>
  );
}
