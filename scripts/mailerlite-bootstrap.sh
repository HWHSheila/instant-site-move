#!/usr/bin/env bash
# Idempotent MailerLite groups + last_trigger field bootstrap.
# Never prints API keys. Safe to re-run.
#
# Usage:
#   bash scripts/mailerlite-bootstrap.sh
#   bash scripts/mailerlite-bootstrap.sh --dry-run
set -euo pipefail

if [[ -z "${BASH_VERSION:-}" ]]; then
  echo "ERROR: mailerlite-bootstrap.sh must run under bash." >&2
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
# shellcheck disable=SC1091
source "$ROOT/scripts/load-hwh-env.sh"

DRY_RUN=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=1; shift ;;
    -h|--help)
      sed -n '2,10p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *) echo "Unknown flag: $1" >&2; exit 1 ;;
  esac
done

hwh_env_check MAILERLITE_API_KEY >/dev/null
API_BASE="https://connect.mailerlite.com/api"
AUTH="Authorization: Bearer ${MAILERLITE_API_KEY}"

GROUPS=(
  "HWH Free Members"
  "HWH Trial Members"
  "HWH Tier 1 Members"
  "HWH Tier 2 Members"
  "HWH Tier 3 Members"
  "HWH Tier 4 Members"
  "HWH Tier 5 Members"
  "HWH Cancelled Members"
)

ml_get() {
  curl -sS -H "$AUTH" -H "Accept: application/json" "$1"
}

ml_post() {
  local url="$1" body="$2"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    echo "[dry-run] POST $url"
    echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
    return 0
  fi
  curl -sS -X POST -H "$AUTH" -H "Content-Type: application/json" -H "Accept: application/json" \
    -d "$body" "$url"
}

echo "=== MailerLite bootstrap (idempotent) ==="

existing_groups="$(ml_get "${API_BASE}/groups?limit=100")"
echo "$existing_groups" | python3 -c "
import json,sys
data=json.load(sys.stdin)
names={g.get('name') for g in data.get('data',[])}
print('existing_group_count', len(names))
for n in sorted(names):
    if n and n.startswith('HWH'):
        print('  ', n)
" 2>/dev/null || echo "WARN: could not parse groups list"

for name in "${GROUPS[@]}"; do
  found="$(echo "$existing_groups" | python3 -c "
import json,sys
name=sys.argv[1]
data=json.load(sys.stdin)
print('yes' if any(g.get('name')==name for g in data.get('data',[])) else 'no')
" "$name" 2>/dev/null || echo "no")"
  if [[ "$found" == "yes" ]]; then
    echo "group ok: $name"
  else
    echo "creating group: $name"
    ml_post "${API_BASE}/groups" "$(python3 -c "import json,sys; print(json.dumps({'name': sys.argv[1]}))" "$name")" >/dev/null
    echo "  created: $name"
  fi
done

# Refresh after creates
existing_groups="$(ml_get "${API_BASE}/groups?limit=100")"

# Ensure last_trigger custom field exists
fields="$(ml_get "${API_BASE}/fields?limit=100")"
has_field="$(echo "$fields" | python3 -c "
import json,sys
data=json.load(sys.stdin)
keys={f.get('key') or f.get('name') for f in data.get('data',[])}
print('yes' if 'last_trigger' in keys else 'no')
" 2>/dev/null || echo "no")"

if [[ "$has_field" == "yes" ]]; then
  echo "field ok: last_trigger"
else
  echo "creating field: last_trigger (text)"
  ml_post "${API_BASE}/fields" '{"name":"last_trigger","type":"text"}' >/dev/null
  echo "  created: last_trigger"
fi

echo "=== Bootstrap complete ==="
