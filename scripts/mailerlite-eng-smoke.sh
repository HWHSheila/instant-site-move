#!/usr/bin/env bash
# Engineering smoke for MailerLite trigger clusters (pre-Sheila gate).
# Never prints secrets. Exit 0 only if assertions pass.
#
# Usage:
#   bash scripts/mailerlite-eng-smoke.sh --cluster assessment_reminders
#   bash scripts/mailerlite-eng-smoke.sh --cluster wired --email support@herwellnessharmony.com
#
# Clusters: wired | assessment_reminders | checkin_reminders | inactivity | winback | journey_hooks
set -euo pipefail

if [[ -z "${BASH_VERSION:-}" ]]; then
  echo "ERROR: mailerlite-eng-smoke.sh must run under bash." >&2
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
# shellcheck disable=SC1091
source "$ROOT/scripts/load-hwh-env.sh"

CLUSTER=""
EMAIL="support@herwellnessharmony.com"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --cluster) CLUSTER="$2"; shift 2 ;;
    --email) EMAIL="$2"; shift 2 ;;
    -h|--help)
      sed -n '2,14p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *) echo "Unknown: $1" >&2; exit 1 ;;
  esac
done

if [[ -z "$CLUSTER" ]]; then
  echo "ERROR: --cluster required" >&2
  exit 1
fi

hwh_env_check VITE_SUPABASE_URL VITE_SUPABASE_PUBLISHABLE_KEY SUPABASE_SERVICE_ROLE_KEY >/dev/null
# MAILERLITE_API_KEY optional locally — last_trigger assertion skipped if missing
HAS_ML_KEY=0
if [[ -n "${MAILERLITE_API_KEY:-}" ]]; then HAS_ML_KEY=1; fi

SB_URL="${VITE_SUPABASE_URL%/}"
SB_KEY="$SUPABASE_SERVICE_ROLE_KEY"
SB_ANON="$VITE_SUPABASE_PUBLISHABLE_KEY"
API_BASE="https://connect.mailerlite.com/api"
ML_AUTH="Authorization: Bearer ${MAILERLITE_API_KEY:-}"

fail() { echo "FAIL: $*" >&2; exit 1; }
pass() { echo "PASS: $*"; }

sb_get() {
  curl -sS "${SB_URL}/rest/v1/${1}" \
    -H "apikey: ${SB_ANON}" -H "Authorization: Bearer ${SB_KEY}"
}
sb_patch() {
  curl -sS -X PATCH "${SB_URL}/rest/v1/${1}" \
    -H "apikey: ${SB_ANON}" -H "Authorization: Bearer ${SB_KEY}" \
    -H "Content-Type: application/json" -H "Prefer: return=representation" \
    -d "$2"
}
sb_delete() {
  curl -sS -X DELETE "${SB_URL}/rest/v1/${1}" \
    -H "apikey: ${SB_ANON}" -H "Authorization: Bearer ${SB_KEY}"
}

enc_email="$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$EMAIL")"
SUB_JSON="$(sb_get "subscribers?email=eq.${enc_email}&select=id,email,tier,payment_status,assessment_completed,trial_start_date,last_login_at,cancelled_at,created_at&limit=1")"
SID="$(echo "$SUB_JSON" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d[0]['id'] if d else '')")"
[[ -n "$SID" ]] || fail "no subscriber for $EMAIL"

# Snapshot for restore
SNAP="$SUB_JSON"

log_count() {
  local trigger="$1"
  sb_get "mailer_lite_trigger_log?subscriber_id=eq.${SID}&trigger_name=eq.${trigger}&select=id" \
    | python3 -c "import json,sys; print(len(json.load(sys.stdin)))"
}

delete_logs() {
  local trigger="$1"
  sb_delete "mailer_lite_trigger_log?subscriber_id=eq.${SID}&trigger_name=eq.${trigger}" >/dev/null
}

invoke_scheduled() {
  local jobs_json="$1"
  curl -sS -X POST "${SB_URL}/functions/v1/mailerlite-scheduled-triggers" \
    -H "Authorization: Bearer ${SB_KEY}" \
    -H "Content-Type: application/json" \
    -d "$jobs_json"
}

ml_last_trigger() {
  if [[ "$HAS_ML_KEY" -ne 1 ]]; then
    echo ""
    return 0
  fi
  local enc
  enc="$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$EMAIL")"
  curl -sS -H "$ML_AUTH" -H "Accept: application/json" \
    "${API_BASE}/subscribers/${enc}" \
    | python3 -c "import json,sys; d=json.load(sys.stdin).get('data') or {}; print((d.get('fields') or {}).get('last_trigger') or '')" 2>/dev/null || echo ""
}

assert_last_trigger() {
  local expected="$1"
  if [[ "$HAS_ML_KEY" -ne 1 ]]; then
    echo "SKIP: MailerLite last_trigger check (add MAILERLITE_API_KEY to .env for full smoke)"
    return 0
  fi
  local lt
  lt="$(ml_last_trigger)"
  [[ "$lt" == "$expected" ]] || fail "MailerLite last_trigger=$lt expected $expected"
}

restore_sub() {
  local body
  body="$(echo "$SNAP" | python3 -c "
import json,sys
d=json.load(sys.stdin)[0]
keep={k:d.get(k) for k in ['assessment_completed','trial_start_date','last_login_at','cancelled_at','payment_status','tier']}
print(json.dumps(keep))
")"
  sb_patch "subscribers?id=eq.${SID}" "$body" >/dev/null
}

echo "=== eng-smoke cluster=$CLUSTER email=$EMAIL sid=$SID ==="

case "$CLUSTER" in
  wired)
    TRIGGER="day_18_restoration_preview"
    before="$(log_count "$TRIGGER")"
    bash "$ROOT/scripts/fire-mailerlite-trigger.sh" "$EMAIL" "$TRIGGER" >/dev/null
    after="$(log_count "$TRIGGER")"
    [[ "$after" -gt "$before" ]] || fail "expected new log for $TRIGGER"
    assert_last_trigger "$TRIGGER"
    pass "wired fire + last_trigger"
    ;;

  assessment_reminders)
    delete_logs "wellness_assessment_reminder_1"
    delete_logs "wellness_assessment_reminder_2"
    delete_logs "wellness_assessment_reminder_3"
    # Eligible for reminder_1: incomplete, age ~36h
    TS="$(python3 -c "from datetime import datetime,timedelta,timezone; print((datetime.now(timezone.utc)-timedelta(hours=36)).isoformat())")"
    sb_patch "subscribers?id=eq.${SID}" "{\"assessment_completed\":false,\"trial_start_date\":\"${TS}\"}" >/dev/null

    invoke_scheduled '{"jobs":["assessment"]}' >/dev/null
    c1="$(log_count wellness_assessment_reminder_1)"
    [[ "$c1" -eq 1 ]] || fail "expected 1 reminder_1 log, got $c1"
    invoke_scheduled '{"jobs":["assessment"]}' >/dev/null
    c1b="$(log_count wellness_assessment_reminder_1)"
    [[ "$c1b" -eq 1 ]] || fail "idempotency failed: got $c1b reminder_1 logs"
    assert_last_trigger "wellness_assessment_reminder_1"
    # Negative: mark completed — should not get reminder_2 from this fixture
    delete_logs "wellness_assessment_reminder_2"
    sb_patch "subscribers?id=eq.${SID}" "{\"assessment_completed\":true}" >/dev/null
    invoke_scheduled '{"jobs":["assessment"]}' >/dev/null
    c2="$(log_count wellness_assessment_reminder_2)"
    [[ "$c2" -eq 0 ]] || fail "negative: completed should not get reminder_2"
    restore_sub
    pass "assessment_reminders"
    ;;

  checkin_reminders)
    delete_logs "day_11_mini_assessment_reminder"
    # Ensure day>=11 and no day_11 mini
    sb_get "subscriber_progress?subscriber_id=eq.${SID}&select=id" >/dev/null
    PROG="$(sb_get "subscriber_progress?subscriber_id=eq.${SID}&select=id,day_number")"
    HAS="$(echo "$PROG" | python3 -c "import json,sys; print('yes' if json.load(sys.stdin) else 'no')")"
    if [[ "$HAS" == "yes" ]]; then
      sb_patch "subscriber_progress?subscriber_id=eq.${SID}" '{"day_number":11}' >/dev/null
    else
      fail "subscriber_progress missing for $EMAIL — create via simulate-day first"
    fi
    sb_delete "mini_assessments?subscriber_id=eq.${SID}&assessment_type=eq.day_11" >/dev/null
    invoke_scheduled '{"jobs":["checkin"]}' >/dev/null
    c="$(log_count day_11_mini_assessment_reminder)"
    [[ "$c" -eq 1 ]] || fail "expected 1 day_11 reminder, got $c"
    invoke_scheduled '{"jobs":["checkin"]}' >/dev/null
    c2="$(log_count day_11_mini_assessment_reminder)"
    [[ "$c2" -eq 1 ]] || fail "idempotency failed for day_11 reminder"
    pass "checkin_reminders"
    ;;

  inactivity)
    delete_logs "inactivity_3_day"
    TS="$(python3 -c "from datetime import datetime,timedelta,timezone; print((datetime.now(timezone.utc)-timedelta(days=4)).isoformat())")"
    sb_patch "subscribers?id=eq.${SID}" "{\"last_login_at\":\"${TS}\"}" >/dev/null
    invoke_scheduled '{"jobs":["inactivity"]}' >/dev/null
    c="$(log_count inactivity_3_day)"
    [[ "$c" -ge 1 ]] || fail "expected inactivity_3_day log"
    invoke_scheduled '{"jobs":["inactivity"]}' >/dev/null
    c2="$(log_count inactivity_3_day)"
    [[ "$c2" -eq "$c" ]] || fail "idempotency failed inactivity"
    # Negative: recent login
    NOW="$(python3 -c "from datetime import datetime,timezone; print(datetime.now(timezone.utc).isoformat())")"
    delete_logs "inactivity_7_day"
    sb_patch "subscribers?id=eq.${SID}" "{\"last_login_at\":\"${NOW}\"}" >/dev/null
    before7="$(log_count inactivity_7_day)"
    invoke_scheduled '{"jobs":["inactivity"]}' >/dev/null
    after7="$(log_count inactivity_7_day)"
    [[ "$after7" -eq "$before7" ]] || fail "recent login should not fire inactivity_7"
    restore_sub
    pass "inactivity"
    ;;

  winback)
    delete_logs "cancellation_win_back"
    TS="$(python3 -c "from datetime import datetime,timedelta,timezone; print((datetime.now(timezone.utc)-timedelta(days=31)).isoformat())")"
    ORIG_PAY="$(echo "$SNAP" | python3 -c "import json,sys; print(json.load(sys.stdin)[0].get('payment_status') or '')")"
    sb_patch "subscribers?id=eq.${SID}" "{\"payment_status\":\"cancelled\",\"cancelled_at\":\"${TS}\"}" >/dev/null
    invoke_scheduled '{"jobs":["winback"]}' >/dev/null
    c="$(log_count cancellation_win_back)"
    [[ "$c" -eq 1 ]] || fail "expected win-back log, got $c"
    invoke_scheduled '{"jobs":["winback"]}' >/dev/null
    c2="$(log_count cancellation_win_back)"
    [[ "$c2" -eq 1 ]] || fail "idempotency failed winback"
    # restore payment status carefully
    sb_patch "subscribers?id=eq.${SID}" "{\"payment_status\":\"${ORIG_PAY}\",\"cancelled_at\":null}" >/dev/null
    restore_sub
    pass "winback"
    ;;

  journey_hooks)
    # Hook path is client-side; smoke validates fire + catalog name + log
    delete_logs "phase_completed"
    bash "$ROOT/scripts/fire-mailerlite-trigger.sh" "$EMAIL" "phase_completed" \
      --data '{"phase_name":"Gut Function","next_phase":"Metabolic Repair"}' >/dev/null
    c="$(log_count phase_completed)"
    [[ "$c" -ge 1 ]] || fail "phase_completed log missing"
    assert_last_trigger "phase_completed"
    pass "journey_hooks (fire path; client eligibility covered by unit of useCompleteLesson)"
    ;;

  *)
    fail "unknown cluster: $CLUSTER"
    ;;
esac

echo "=== eng-smoke OK: $CLUSTER ==="
exit 0
