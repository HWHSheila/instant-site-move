#!/usr/bin/env bash
# Read-only MailerLite inventory: groups, fields, automations, sample last_trigger.
# Never prints API keys.
#
# Usage:
#   bash scripts/mailerlite-inventory.sh
#   bash scripts/mailerlite-inventory.sh --email support@herwellnessharmony.com
set -euo pipefail

if [[ -z "${BASH_VERSION:-}" ]]; then
  echo "ERROR: mailerlite-inventory.sh must run under bash." >&2
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
# shellcheck disable=SC1091
source "$ROOT/scripts/load-hwh-env.sh"

EMAIL=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --email) EMAIL="$2"; shift 2 ;;
    -h|--help)
      sed -n '2,10p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *) echo "Unknown: $1" >&2; exit 1 ;;
  esac
done

hwh_env_check MAILERLITE_API_KEY >/dev/null
API_BASE="https://connect.mailerlite.com/api"
AUTH="Authorization: Bearer ${MAILERLITE_API_KEY}"

ml_get() {
  curl -sS -H "$AUTH" -H "Accept: application/json" "$1"
}

echo "=== Groups (HWH*) ==="
ml_get "${API_BASE}/groups?limit=100" | python3 -c "
import json,sys
data=json.load(sys.stdin)
for g in sorted(data.get('data',[]), key=lambda x: x.get('name') or ''):
    name=g.get('name') or ''
    if name.startswith('HWH'):
        print(f\"{name}\tid={g.get('id')}\tactive={g.get('active_count', g.get('total', '?'))}\")
"

echo ""
echo "=== Custom fields ==="
ml_get "${API_BASE}/fields?limit=100" | python3 -c "
import json,sys
data=json.load(sys.stdin)
for f in data.get('data',[]):
    print(f\"{f.get('name')}\tkey={f.get('key')}\ttype={f.get('type')}\")
"

echo ""
echo "=== Automations (name / status / id) ==="
# MailerLite Classic/new API: /automations
auto_raw="$(ml_get "${API_BASE}/automations?limit=100" 2>/dev/null || echo '{}')"
echo "$auto_raw" | python3 -c "
import json,sys
try:
    data=json.load(sys.stdin)
except Exception:
    print('(could not parse automations response)')
    sys.exit(0)
items=data.get('data')
if items is None:
    print('(no automations endpoint or empty)', data.get('message') or data.get('error') or '')
    sys.exit(0)
if not items:
    print('(zero automations)')
    sys.exit(0)
for a in items:
    name=a.get('name') or a.get('title') or '?'
    status=a.get('status') or a.get('enabled') or '?'
    print(f\"{name}\tstatus={status}\tid={a.get('id')}\")
"

CATALOG="$ROOT/docs/mailerlite/triggers-v2.json"
if [[ -f "$CATALOG" ]]; then
  echo ""
  echo "=== Catalog wired triggers (expect delivery path) ==="
  python3 -c "
import json
c=json.load(open('$CATALOG'))
for t in c['triggers']:
    if t.get('portal_status')=='wired':
        print(t['trigger_name'])
"
fi

if [[ -n "$EMAIL" ]]; then
  echo ""
  echo "=== Subscriber lookup: $EMAIL ==="
  enc="$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$EMAIL")"
  ml_get "${API_BASE}/subscribers/${enc}" | python3 -c "
import json,sys
data=json.load(sys.stdin)
d=data.get('data') or data
fields=d.get('fields') or {}
print('email:', d.get('email'))
print('status:', d.get('status'))
print('last_trigger:', fields.get('last_trigger'))
groups=d.get('groups') or []
if isinstance(groups, list):
    for g in groups:
        if isinstance(g, dict):
            print('group:', g.get('name'), g.get('id'))
        else:
            print('group_id:', g)
" 2>/dev/null || echo "(subscriber not found or parse error)"
fi

echo ""
echo "=== Inventory complete (read-only) ==="
