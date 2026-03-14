import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      // TODO: Update user subscription status in Supabase
      console.log("Checkout completed for:", session.customer_email, "User ID:", session.metadata?.supabase_user_id);
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      // TODO: Downgrade user in Supabase
      console.log("Subscription cancelled:", subscription.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
