import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateApiKey } from "@/lib/api-keys";

/** GET /api/keys — list user's API keys */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data: keys, error } = await supabase
    .from("api_keys")
    .select("id, prefix, name, scopes, last_used_at, revoked_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ keys });
}

/** POST /api/keys — create a new API key */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  // Check key limit (max 5 active keys)
  const { count } = await supabase
    .from("api_keys")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .is("revoked_at", null);

  if ((count ?? 0) >= 5) {
    return NextResponse.json({ error: "Maximum 5 active keys allowed" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const name = (body.name as string)?.trim() || "Default";

  const { raw, hash, prefix } = generateApiKey();

  const { error } = await supabase.from("api_keys").insert({
    user_id: user.id,
    key_hash: hash,
    prefix,
    name,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Return the raw key ONCE — it's never stored or retrievable again
  return NextResponse.json({ key: raw, prefix, name });
}

/** DELETE /api/keys — revoke a key by id */
export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await request.json().catch(() => ({ id: null }));
  if (!id) return NextResponse.json({ error: "Missing key id" }, { status: 400 });

  const { error } = await supabase
    .from("api_keys")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ revoked: true });
}
