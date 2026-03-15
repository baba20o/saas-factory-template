import { randomBytes, createHash } from "crypto";

const KEY_PREFIX = "sk_live_";

/** Generate a new API key. Returns { raw, hash, prefix }. raw is shown once to the user. */
export function generateApiKey(): { raw: string; hash: string; prefix: string } {
  const secret = randomBytes(32).toString("base64url");
  const raw = `${KEY_PREFIX}${secret}`;
  const hash = hashKey(raw);
  const prefix = raw.slice(0, 12) + "...";
  return { raw, hash, prefix };
}

/** SHA-256 hash a raw key for storage. Never store the raw key. */
export function hashKey(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}
