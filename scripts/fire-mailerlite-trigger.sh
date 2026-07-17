#!/usr/bin/env bash
# Fire a MailerLite trigger via the production edge function (logs + upsert).
#
# Usage:
#   bash scripts/fire-mailerlite-trigger.sh EMAIL TRIGGER_NAME
#   bash scripts/fire-mailerlite-trigger.sh support@herwellnessharmony.com wellness_assessment_reminder_1
#   bash scripts/fire-mailerlite-trigger.sh EMAIL TRIGGER --data '{"assessment_url":"..."}'
set -euo pipefail

if [[ -z "${BASH_VERSION:-}" ]]; then
  echo "ERROR: fire-mailerlite-trigger.sh must run under bash." >&2
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
# shellcheck disable=SC1091
source "$ROOT/scripts/load-hwh-env.sh"

EMAIL=""
TRIGGER=""
EXTRA_DATA="{}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --data) EXTRA_DATA="$2"; shift 2 ;;
    -h|--help)
      sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    --*) echo "Unknown: $1" >&2; exit 1 ;;
    *)
      if [[ -z "$EMAIL" ]]; then EMAIL="$1"
      elif [[ -z "$TRIGGER" ]]; then TRIGGER="$1"
      else echo "Unexpected arg: $1" >&2; exit 1
      fi
      shift
      ;;
  esac
done

if [[ -z "$EMAIL" || -z "$TRIGGER" ]]; then
  echo "Usage: bash scripts/fire-mailerlite-trigger.sh EMAIL TRIGGER [--data JSON]" >&2
  exit 1
fi

# Validate trigger name against catalog when present
CATALOG="$ROOT/docs/mailerlite/triggers-v2.json"
if [[ -f "$CATALOG" ]]; then
  ok="$(python3 -c "
import json,sys
c=json.load(open(sys.argv[1]))
names={t['trigger_name'] for t in c['triggers']}
# allow portal_subscriber_created bootstrap
names.add('portal_subscriber_created')
print('yes' if sys.argv[2] in names else 'no')
" "$CATALOG" "$TRIGGER")"
  if [[ "$ok" != "yes" ]]; then
    echo "ERROR: trigger_name '$TRIGGER' not in docs/mailerlite/triggers-v2.json" >&2
    exit 1
  fi
fi

hwh_env_check VITE_SUPABASE_URL VITE_SUPABASE_PUBLISHABLE_KEY SUPABASE_SERVICE_ROLE_KEY >/dev/null

SB_URL="${VITE_SUPABASE_URL%/}"
SB_KEY="$SUPABASE_SERVICE_ROLE_KEY"
SB_ANON="$VITE_SUPABASE_PUBLISHABLE_KEY"

enc_email="$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$EMAIL")"
sub_json="$(curl -sS "${SB_URL}/rest/v1/subscribers?email=eq.${enc_email}&select=id,email,tier,payment_status&limit=1" \
  -H "apikey: ${SB_ANON}" \
  -H "Authorization: Bearer ${SB_KEY}")"

SID="$(echo "$sub_json" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d[0]['id'] if d else '')")"
TIER="$(echo "$sub_json" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d[0].get('tier') or '' if d else '')")"
PAY="$(echo "$sub_json" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d[0].get('payment_status') or '' if d else '')")"

if [[ -z "$SID" ]]; then
  echo "ERROR: no subscriber for email $EMAIL" >&2
  exit 1
fi

BODY="$(python3 -c "
import json,sys
extra=json.loads(sys.argv[4])
td={**extra}
if sys.argv[2]: td.setdefault('tier', sys.argv[2])
if sys.argv[3]: td.setdefault('payment_status', sys.argv[3])
print(json.dumps({
  'trigger_name': sys.argv[1],
  'subscriber_id': sys.argv[5],
  'email': sys.argv[6],
  'trigger_data': td,
}))
" "$TRIGGER" "$TIER" "$PAY" "$EXTRA_DATA" "$SID" "$EMAIL")"

echo "Firing $TRIGGER for $EMAIL (subscriber $SID)"
RESP="$(curl -sS -X POST "${SB_URL}/functions/v1/fire-mailerlite-trigger" \
  -H "Authorization: Bearer ${SB_KEY}" \
  -H "Content-Type: application/json" \
  -d "$BODY")"
echo "$RESP" | python3 -m json.tool 2>/dev/null || echo "$RESP"
echo "Done."
