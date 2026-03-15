import { createClient } from "@/lib/supabase/server";

export type Plan = "free" | "pro";
export type SubStatus = "active" | "canceled" | "past_due" | "trialing";

export interface Subscription {
  plan_name: Plan;
  status: SubStatus;
  current_period_end: string | null;
  stripe_subscription_id: string | null;
}

const DEFAULT_SUB: Subscription = {
  plan_name: "free",
  status: "active",
  current_period_end: null,
  stripe_subscription_id: null,
};

export async function getUserSubscription(userId: string): Promise<Subscription> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("plan_name, status, current_period_end, stripe_subscription_id")
    .eq("user_id", userId)
    .single();

  if (!data) return DEFAULT_SUB;
  return data as Subscription;
}
