import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserSubscription } from "@/lib/subscription";
import { getFactoryConfig } from "@/lib/factory";
import { DashboardShell } from "./components/dashboard-shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const subscription = await getUserSubscription(user.id);
  const config = getFactoryConfig();

  return (
    <DashboardShell
      user={{ email: user.email!, id: user.id, isAdmin: user.user_metadata?.is_admin === true }}
      plan={subscription.plan_name}
      config={{
        productName: config.product.name,
        logoText: config.branding.logo_text,
        primaryColor: config.branding.primary_color,
        navItems: config.dashboard?.nav_items,
      }}
    >
      {children}
    </DashboardShell>
  );
}
