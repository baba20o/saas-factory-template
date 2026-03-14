#!/usr/bin/env bash
# connect-domain.sh — Wire up a custom domain to a SaaS Factory site
#
# Connects three services in one shot:
#   1. Vercel  — adds domain to project
#   2. Dreamhost — adds A record (76.76.21.21) for root + www
#   3. Supabase — updates auth redirect URLs
#
# Prerequisites:
#   - Domain must be set to "DNS Only" in Dreamhost panel
#     (API cannot remove "Fully Hosted" managed A records)
#   - Environment variables set (see below)
#
# Usage:
#   ./scripts/connect-domain.sh <domain> [supabase_project_id]
#
# Example:
#   ./scripts/connect-domain.sh 0011011011.com sxscocltbsfpyqjzotnv

set -euo pipefail

DOMAIN="${1:-}"
SUPABASE_PROJECT="${2:-}"

if [ -z "$DOMAIN" ]; then
  echo "Usage: $0 <domain> [supabase_project_id]"
  echo "Example: $0 mydomain.com sxscocltbsfpyqjzotnv"
  exit 1
fi

# ── Load env vars ──────────────────────────────────────────────
# Try .env in co-deworker first, then local .env.local
ENV_FILE="${FACTORY_ENV:-/home/ubuntu/projects/co-deworker/.env}"
if [ -f "$ENV_FILE" ]; then
  set -a
  source "$ENV_FILE"
  set +a
fi

VERCEL_TOKEN="${VERCEL_KEY:-}"
DREAMHOST_KEY="${DREAMHOST_API_KEY:-}"
SUPABASE_TOKEN="${SUPABASE_KEY:-}"
VERCEL_SCOPE="${VERCEL_SCOPE:-google-5768s-projects}"
VERCEL_IP="76.76.21.21"

# ── Validate ───────────────────────────────────────────────────
missing=""
[ -z "$VERCEL_TOKEN" ] && missing="$missing VERCEL_KEY"
[ -z "$DREAMHOST_KEY" ] && missing="$missing DREAMHOST_API_KEY"
[ -z "$SUPABASE_TOKEN" ] && [ -n "$SUPABASE_PROJECT" ] && missing="$missing SUPABASE_KEY"

if [ -n "$missing" ]; then
  echo "ERROR: Missing env vars:$missing"
  echo "Set them in $ENV_FILE or export them directly."
  exit 1
fi

echo "═══════════════════════════════════════════════"
echo "  Connecting domain: $DOMAIN"
echo "═══════════════════════════════════════════════"
echo ""

# ── Step 1: Vercel ─────────────────────────────────────────────
echo "▸ [1/3] Vercel — adding domain to project..."

vercel_add() {
  local d="$1"
  local result
  result=$(vercel domains add "$d" \
    --token "$VERCEL_TOKEN" \
    --scope "$VERCEL_SCOPE" 2>&1) || true
  if echo "$result" | grep -q "Success"; then
    echo "  ✓ $d added to Vercel"
  elif echo "$result" | grep -q "already"; then
    echo "  ✓ $d already on Vercel"
  else
    echo "  ✗ $d — $result"
    return 1
  fi
}

vercel_add "$DOMAIN"
vercel_add "www.$DOMAIN"

echo ""

# ── Step 2: Dreamhost DNS ──────────────────────────────────────
echo "▸ [2/3] Dreamhost — adding A records → $VERCEL_IP..."

dreamhost_add() {
  local record="$1"
  local type="$2"
  local value="$3"
  local result
  result=$(curl -s "https://api.dreamhost.com/?key=$DREAMHOST_KEY&cmd=dns-add_record&format=json&record=$record&type=$type&value=$value")
  local status
  status=$(echo "$result" | python3 -c "import sys,json; print(json.load(sys.stdin).get('result','error'))" 2>/dev/null || echo "error")
  local data
  data=$(echo "$result" | python3 -c "import sys,json; print(json.load(sys.stdin).get('data',''))" 2>/dev/null || echo "")

  if [ "$status" = "success" ]; then
    echo "  ✓ $type $record → $value"
  elif echo "$data" | grep -q "record_already_exists"; then
    echo "  ✓ $type $record → $value (already exists)"
  elif [ "$data" = "not_editable" ]; then
    echo "  ✗ $type $record — not editable (domain still 'Fully Hosted'?)"
    echo "    → Set to 'DNS Only' in Dreamhost panel first"
    return 1
  else
    echo "  ✗ $type $record — $data"
    return 1
  fi
}

dreamhost_add "$DOMAIN" "A" "$VERCEL_IP"
dreamhost_add "www.$DOMAIN" "A" "$VERCEL_IP"

echo ""

# ── Step 3: Supabase auth URLs ─────────────────────────────────
if [ -n "$SUPABASE_PROJECT" ] && [ -n "$SUPABASE_TOKEN" ]; then
  echo "▸ [3/3] Supabase — updating auth redirect URLs..."

  # Get current allow list so we append, not replace
  current_list=$(curl -s -H "Authorization: Bearer $SUPABASE_TOKEN" \
    "https://api.supabase.com/v1/projects/$SUPABASE_PROJECT/config/auth" \
    | python3 -c "import sys,json; print(json.load(sys.stdin).get('uri_allow_list',''))" 2>/dev/null || echo "")

  new_entries="https://$DOMAIN/**,https://www.$DOMAIN/**"
  if [ -n "$current_list" ]; then
    # Avoid duplicates
    if echo "$current_list" | grep -q "$DOMAIN"; then
      merged="$current_list"
    else
      merged="$new_entries,$current_list"
    fi
  else
    merged="$new_entries"
  fi

  result=$(curl -s -X PATCH \
    -H "Authorization: Bearer $SUPABASE_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"site_url\":\"https://$DOMAIN\",\"uri_allow_list\":\"$merged\"}" \
    "https://api.supabase.com/v1/projects/$SUPABASE_PROJECT/config/auth")

  site_url=$(echo "$result" | python3 -c "import sys,json; print(json.load(sys.stdin).get('site_url','ERROR'))" 2>/dev/null || echo "ERROR")

  if [ "$site_url" = "https://$DOMAIN" ]; then
    echo "  ✓ site_url → https://$DOMAIN"
    echo "  ✓ redirect allow list updated"
  else
    echo "  ✗ Failed to update Supabase auth config"
    echo "    $result"
  fi
else
  echo "▸ [3/3] Supabase — skipped (no project ID provided)"
fi

echo ""
echo "═══════════════════════════════════════════════"
echo "  Done! DNS may take 5-30 min to propagate."
echo ""
echo "  Verify:  dig +short $DOMAIN A"
echo "  Expect:  $VERCEL_IP"
echo "  Site:    https://$DOMAIN"
echo "═══════════════════════════════════════════════"
