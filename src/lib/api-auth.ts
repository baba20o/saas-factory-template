import { NextResponse } from "next/server";
import { hashKey } from "@/lib/api-keys";
import { supabaseAdmin } from "@/lib/supabase/admin";

export interface ApiKeyContext {
  keyId: string;
  userId: string;
  scopes: string[];
}

/**
 * Validate an API key from an Authorization header.
 * Returns the key context or null if invalid.
 * Also updates last_used_at and logs usage.
 */
export async function validateApiKey(
  request: Request,
  endpoint: string,
): Promise<{ ctx: ApiKeyContext } | { error: NextResponse }> {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer sk_")) {
    return {
      error: NextResponse.json(
        { error: "Missing or invalid API key. Use Authorization: Bearer sk_live_..." },
        { status: 401 },
      ),
    };
  }

  const raw = auth.slice(7); // remove "Bearer "
  const hash = hashKey(raw);

  const { data: key, error } = await supabaseAdmin
    .from("api_keys")
    .select("id, user_id, scopes")
    .eq("key_hash", hash)
    .is("revoked_at", null)
    .single();

  if (error || !key) {
    return {
      error: NextResponse.json({ error: "Invalid or revoked API key" }, { status: 401 }),
    };
  }

  // Update last_used_at (fire and forget)
  supabaseAdmin
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", key.id)
    .then(() => {});

  // Log usage (fire and forget)
  supabaseAdmin
    .from("api_usage")
    .insert({ key_id: key.id, endpoint, method: request.method })
    .then(() => {});

  return {
    ctx: {
      keyId: key.id,
      userId: key.user_id,
      scopes: key.scopes,
    },
  };
}
