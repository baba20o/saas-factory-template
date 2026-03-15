import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  // Verify admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.user_metadata?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId, action } = await request.json();
  if (!userId || !action) {
    return NextResponse.json({ error: "Missing userId or action" }, { status: 400 });
  }

  switch (action) {
    case "upgrade": {
      await supabaseAdmin.from("subscriptions").upsert(
        {
          user_id: userId,
          plan_name: "pro",
          status: "active",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );
      return NextResponse.json({ message: "User upgraded to Pro." });
    }

    case "downgrade": {
      await supabaseAdmin
        .from("subscriptions")
        .update({ plan_name: "free", status: "active", updated_at: new Date().toISOString() })
        .eq("user_id", userId);
      return NextResponse.json({ message: "User downgraded to Free." });
    }

    case "make_admin": {
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: { is_admin: true },
      });
      return NextResponse.json({ message: "User granted admin access." });
    }

    case "remove_admin": {
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: { is_admin: false },
      });
      return NextResponse.json({ message: "Admin access removed." });
    }

    case "revoke_all_keys": {
      await supabaseAdmin
        .from("api_keys")
        .update({ revoked_at: new Date().toISOString() })
        .eq("user_id", userId)
        .is("revoked_at", null);
      return NextResponse.json({ message: "All API keys revoked." });
    }

    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
