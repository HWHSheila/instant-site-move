#!/usr/bin/env bash
# Absolute journey-day jump for a portal test subscriber (forward or backward).
# Updates Supabase state and optionally fires MailerLite triggers via the
# production fire-mailerlite-trigger edge function.
#
# Usage:
#   bash scripts/simulate-day.sh <TARGET_DAY> [EMAIL]
#   bash scripts/simulate-day.sh --sync-only [EMAIL]
#
# Flags:
#   --dry-run         print plan only
#   --no-trigger      never fire MailerLite
#   --force-trigger   fire TARGET day's ML trigger even if not a forward move
#   --sync-only       upsert subscriber into MailerLite only (no day change)
#
# Examples:
#   bash scripts/simulate-day.sh 18 support@herwellnessharmony.com --force-trigger
#   bash scripts/simulate-day.sh 5 support@herwellnessharmony.com
#   bash scripts/simulate-day.sh --sync-only other@example.com
set -euo pipefail

if [[ -z "${BASH_VERSION:-}" ]]; then
  echo "ERROR: simulate-day.sh must run under bash." >&2
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# shellcheck disable=SC1091
source "$ROOT/scripts/load-hwh-env.sh"

TARGET_DAY=""
EMAIL="support@herwellnessharmony.com"
DRY_RUN=0
NO_TRIGGER=0
FORCE_TRIGGER=0
SYNC_ONLY=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=1; shift ;;
    --no-trigger) NO_TRIGGER=1; shift ;;
    --force-trigger) FORCE_TRIGGER=1; shift ;;
    --sync-only) SYNC_ONLY=1; shift ;;
    -h|--help)
      sed -n '2,22p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    --*)
      echo "Unknown flag: $1" >&2
      exit 1
      ;;
    *)
      if [[ "$SYNC_ONLY" -eq 1 ]]; then
        EMAIL="$1"
      elif [[ -z "$TARGET_DAY" && "$1" =~ ^[0-9]+$ ]]; then
        TARGET_DAY="$1"
      else
        EMAIL="$1"
      fi
      shift
      ;;
  esac
done

if [[ "$SYNC_ONLY" -eq 0 ]]; then
  if [[ -z "$TARGET_DAY" ]]; then
    echo "ERROR: TARGET_DAY required (1-25), or use --sync-only" >&2
    exit 1
  fi
  if [[ "$TARGET_DAY" -lt 1 || "$TARGET_DAY" -gt 25 ]]; then
    echo "ERROR: TARGET_DAY must be 1-25 (got $TARGET_DAY)" >&2
    exit 1
  fi
fi

hwh_env_check VITE_SUPABASE_URL VITE_SUPABASE_PUBLISHABLE_KEY SUPABASE_SERVICE_ROLE_KEY >/dev/null

SB_URL="${VITE_SUPABASE_URL%/}"
SB_KEY="$SUPABASE_SERVICE_ROLE_KEY"
SB_ANON="$VITE_SUPABASE_PUBLISHABLE_KEY"

sb_get() {
  local path="$1"
  curl -sS "${SB_URL}/rest/v1/${path}" \
    -H "apikey: ${SB_ANON}" \
    -H "Authorization: Bearer ${SB_KEY}"
}

sb_patch() {
  local path="$1"
  local body="$2"
  curl -sS -X PATCH "${SB_URL}/rest/v1/${path}" \
    -H "apikey: ${SB_ANON}" \
    -H "Authorization: Bearer ${SB_KEY}" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=representation" \
    -d "$body"
}

sb_post() {
  local path="$1"
  local body="$2"
  local prefer="${3:-return=representation}"
  curl -sS -X POST "${SB_URL}/rest/v1/${path}" \
    -H "apikey: ${SB_ANON}" \
    -H "Authorization: Bearer ${SB_KEY}" \
    -H "Content-Type: application/json" \
    -H "Prefer: ${prefer}" \
    -d "$body"
}

sb_delete() {
  local path="$1"
  curl -sS -X DELETE "${SB_URL}/rest/v1/${path}" \
    -H "apikey: ${SB_ANON}" \
    -H "Authorization: Bearer ${SB_KEY}"
}

phase_for_day() {
  local d="$1"
  if [[ "$d" -le 5 ]]; then echo "clarity"
  elif [[ "$d" -le 12 ]]; then echo "pattern_recognition"
  elif [[ "$d" -le 17 ]]; then echo "friction"
  elif [[ "$d" -le 21 ]]; then echo "guided_preview"
  else echo "complete"
  fi
}

trigger_for_day() {
  case "$1" in
    18) echo "day_18_restoration_preview" ;;
    19) echo "day_19_restoration_unlocked" ;;
    21) echo "day_21_billing_reminder" ;;
    22) echo "auto_billing_confirmed" ;;
    *) echo "" ;;
  esac
}

iso_days_ago() {
  local days="$1"
  python3 -c "
from datetime import datetime, timedelta, timezone
print((datetime.now(timezone.utc) - timedelta(days=${days})).strftime('%Y-%m-%dT%H:%M:%S+00:00'))
"
}

fire_ml_trigger() {
  local name="$1"
  local sub_id="$2"
  local email="$3"
  local tier="$4"
  local payment_status="$5"
  local day_num="$6"

  local body
  body="$(NAME="$name" SUB_ID="$sub_id" EMAIL="$email" TIER="$tier" PAY="$payment_status" DAY="$day_num" python3 - <<'PY'
import json, os
day = os.environ.get("DAY") or "0"
payload = {
  "trigger_name": os.environ["NAME"],
  "subscriber_id": os.environ["SUB_ID"],
  "email": os.environ["EMAIL"],
  "trigger_data": {
    "tier": os.environ.get("TIER") or None,
    "payment_status": os.environ.get("PAY") or None,
    "day_number": int(day) if day.isdigit() and int(day) > 0 else None,
  },
}
print(json.dumps(payload))
PY
)"

  curl -sS -X POST "${SB_URL}/functions/v1/fire-mailerlite-trigger" \
    -H "Authorization: Bearer ${SB_KEY}" \
    -H "Content-Type: application/json" \
    -d "$body"
}

# --- Look up subscriber ---
SUB_JSON="$(sb_get "subscribers?email=eq.${EMAIL}&select=id,email,tier,payment_status,trial_start_date,assessment_completed_at")"
SUB_ID="$(python3 -c "import json,sys; d=json.load(sys.stdin); print(d[0]['id'] if d else '')" <<<"$SUB_JSON")"
if [[ -z "$SUB_ID" ]]; then
  echo "ERROR: No subscriber found for email: $EMAIL" >&2
  exit 1
fi

TIER="$(python3 -c "import json,sys; d=json.load(sys.stdin)[0]; print(d.get('tier') or '')" <<<"$SUB_JSON")"
PAYMENT="$(python3 -c "import json,sys; d=json.load(sys.stdin)[0]; print(d.get('payment_status') or '')" <<<"$SUB_JSON")"

PROG_JSON="$(sb_get "subscriber_progress?subscriber_id=eq.${SUB_ID}&select=id,day_number,current_phase")"
CURRENT_DAY="$(python3 -c "import json,sys; d=json.load(sys.stdin); print(d[0]['day_number'] if d else 0)" <<<"$PROG_JSON")"
PROG_ID="$(python3 -c "import json,sys; d=json.load(sys.stdin); print(d[0]['id'] if d else '')" <<<"$PROG_JSON")"

echo "=== simulate-day ==="
echo "  email:         $EMAIL"
echo "  subscriber_id: $SUB_ID"
echo "  current_day:   $CURRENT_DAY"
echo "  tier:          ${TIER:-none}"
echo "  payment:       ${PAYMENT:-none}"

# --- Sync-only path ---
if [[ "$SYNC_ONLY" -eq 1 ]]; then
  TRIGGER_NAME="portal_subscriber_synced"
  echo "  mode:          sync-only → MailerLite upsert ($TRIGGER_NAME)"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    echo "DRY RUN — no changes."
    exit 0
  fi
  RESULT="$(fire_ml_trigger "$TRIGGER_NAME" "$SUB_ID" "$EMAIL" "$TIER" "${PAYMENT:-none}" "0")"
  echo "  mailerlite:    $RESULT"
  echo ""
  echo "Done. Check MailerLite → Subscribers → $EMAIL"
  exit 0
fi

PHASE="$(phase_for_day "$TARGET_DAY")"
TRIGGER="$(trigger_for_day "$TARGET_DAY")"
TRIAL_OFFSET=$((TARGET_DAY - 1))
TRIAL_START="$(iso_days_ago "$TRIAL_OFFSET")"
DAY11_OFFSET=$((TARGET_DAY - 11))
DAY21_OFFSET=$((TARGET_DAY - 21))
# completed_at for seeded assessments relative to trial start
BASELINE_AT="$TRIAL_START"
if [[ "$TARGET_DAY" -ge 11 ]]; then
  DAY11_AT="$(iso_days_ago "$DAY11_OFFSET")"
else
  DAY11_AT=""
fi
if [[ "$TARGET_DAY" -ge 21 ]]; then
  DAY21_AT="$(iso_days_ago "$DAY21_OFFSET")"
else
  DAY21_AT=""
fi

DIRECTION="same"
if [[ "$TARGET_DAY" -gt "$CURRENT_DAY" ]]; then DIRECTION="forward"
elif [[ "$TARGET_DAY" -lt "$CURRENT_DAY" ]]; then DIRECTION="backward"
fi

SHOULD_FIRE=0
if [[ "$NO_TRIGGER" -eq 0 && -n "$TRIGGER" ]]; then
  if [[ "$FORCE_TRIGGER" -eq 1 || "$DIRECTION" == "forward" || "$DIRECTION" == "same" ]]; then
    # same + force, or forward, or same with force default for UAT re-pin:
    # On "same" only fire if --force-trigger (avoid accidental re-fire when re-running)
    if [[ "$DIRECTION" == "forward" || "$FORCE_TRIGGER" -eq 1 ]]; then
      SHOULD_FIRE=1
    fi
  fi
fi
# Day 22 only if active
if [[ "$TARGET_DAY" -eq 22 && "$PAYMENT" != "active" ]]; then
  if [[ "$FORCE_TRIGGER" -eq 0 ]]; then
    SHOULD_FIRE=0
  fi
fi

echo "  target_day:    $TARGET_DAY ($PHASE)"
echo "  direction:     $DIRECTION"
echo "  trial_start:   $TRIAL_START"
echo "  ml_trigger:    ${TRIGGER:-none} (fire=$([[ $SHOULD_FIRE -eq 1 ]] && echo yes || echo no))"

if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "DRY RUN — no changes."
  exit 0
fi

# Ensure payment_status usable for trial gating if empty/none and we're in journey
NEW_PAYMENT="$PAYMENT"
if [[ -z "$PAYMENT" || "$PAYMENT" == "none" || "$PAYMENT" == "null" ]]; then
  NEW_PAYMENT="trial"
fi

echo ""
echo "=== Updating subscribers ==="
PATCH_SUB="$(python3 -c "
import json
print(json.dumps({
  'trial_start_date': '''${TRIAL_START}''',
  'assessment_completed_at': '''${BASELINE_AT}''',
  'payment_status': '''${NEW_PAYMENT}''',
}))
")"
sb_patch "subscribers?id=eq.${SUB_ID}" "$PATCH_SUB" >/dev/null
echo "  trial_start_date / assessment_completed_at / payment_status=${NEW_PAYMENT}"

# Day 19 forward: upgrade tier; Day 19 backward: leave tier unless we only bumped for sim
# Snapshot previous tier in check_in_data when upgrading
NEW_TIER="$TIER"
if [[ "$TARGET_DAY" -ge 19 && "$DIRECTION" == "forward" ]]; then
  case "$TIER" in
    awareness|foundation|guided|"")
      NEW_TIER="restoration"
      sb_patch "subscribers?id=eq.${SUB_ID}" "{\"tier\": \"restoration\"}" >/dev/null
      echo "  Day 19 side effect: tier → restoration (was ${TIER:-empty})"
      ;;
  esac
fi

echo ""
echo "=== Upserting subscriber_progress ==="
PROGRESS_BODY="$(python3 -c "
import json
print(json.dumps({
  'subscriber_id': '''${SUB_ID}''',
  'day_number': int('''${TARGET_DAY}'''),
  'current_phase': '''${PHASE}''',
  'check_in_data': {},
}))
")"
if [[ -n "$PROG_ID" ]]; then
  sb_patch "subscriber_progress?id=eq.${PROG_ID}" \
    "{\"day_number\": ${TARGET_DAY}, \"current_phase\": \"${PHASE}\"}" >/dev/null
else
  # Insert may fail on phase check; retry with known-good phases only
  INSERT_RESULT="$(sb_post "subscriber_progress" "$PROGRESS_BODY")"
  if echo "$INSERT_RESULT" | python3 -c "import json,sys; d=json.load(sys.stdin); raise SystemExit(0 if isinstance(d,list) else 1)" 2>/dev/null; then
    :
  else
    echo "  WARN: progress insert response: $INSERT_RESULT" >&2
  fi
fi
echo "  day_number=${TARGET_DAY} current_phase=${PHASE}"

echo ""
echo "=== Assessments ==="
# Baseline backdate
BASE_JSON="$(sb_get "mini_assessments?subscriber_id=eq.${SUB_ID}&assessment_type=eq.baseline&select=id,ratings")"
BASE_ID="$(python3 -c "import json,sys; d=json.load(sys.stdin); print(d[0]['id'] if d else '')" <<<"$BASE_JSON")"
BASE_RATINGS="$(python3 -c "import json,sys; d=json.load(sys.stdin); print(json.dumps(d[0].get('ratings') or {}) if d else '{}')" <<<"$BASE_JSON")"

if [[ -n "$BASE_ID" ]]; then
  sb_patch "mini_assessments?id=eq.${BASE_ID}" \
    "{\"completed_at\": \"${BASELINE_AT}\", \"created_at\": \"${BASELINE_AT}\", \"day_number\": 1}" >/dev/null
  echo "  baseline: backdated to $BASELINE_AT"
else
  # Minimal baseline seed if missing
  SEED_RATINGS='{"overall_symptom_burden":5,"overall_quality_of_life":5,"overall_daily_function":5}'
  sb_post "mini_assessments" "$(python3 -c "
import json
print(json.dumps({
  'subscriber_id': '''${SUB_ID}''',
  'assessment_type': 'baseline',
  'day_number': 1,
  'ratings': json.loads('''${SEED_RATINGS}'''),
  'open_text_improved': 'sim seed',
  'open_text_challenging': '',
  'open_text_note_to_sheila': 'simulate-day seed',
  'completed_at': '''${BASELINE_AT}''',
  'created_at': '''${BASELINE_AT}''',
}))
")" >/dev/null
  BASE_RATINGS="$SEED_RATINGS"
  echo "  baseline: seeded at $BASELINE_AT"
fi

# day_11
D11_JSON="$(sb_get "mini_assessments?subscriber_id=eq.${SUB_ID}&assessment_type=eq.day_11&select=id")"
D11_ID="$(python3 -c "import json,sys; d=json.load(sys.stdin); print(d[0]['id'] if d else '')" <<<"$D11_JSON")"
if [[ "$TARGET_DAY" -ge 11 ]]; then
  if [[ -n "$D11_ID" ]]; then
    sb_patch "mini_assessments?id=eq.${D11_ID}" \
      "{\"completed_at\": \"${DAY11_AT}\", \"created_at\": \"${DAY11_AT}\", \"day_number\": 11}" >/dev/null
    echo "  day_11: backdated to $DAY11_AT"
  else
    SEED11="$(SUB_ID="$SUB_ID" BASE_RATINGS="$BASE_RATINGS" DAY11_AT="$DAY11_AT" python3 - <<'PY'
import json, os
r = json.loads(os.environ.get("BASE_RATINGS") or "{}")
improved = {k: min(10, (v or 5) + 1) if isinstance(v, int) else v for k, v in r.items()} if r else {
  "overall_symptom_burden": 6, "overall_quality_of_life": 6, "overall_daily_function": 6
}
print(json.dumps({
  "subscriber_id": os.environ["SUB_ID"],
  "assessment_type": "day_11",
  "day_number": 11,
  "ratings": improved,
  "open_text_improved": "sim day11",
  "open_text_challenging": "",
  "open_text_note_to_sheila": "simulate-day",
  "completed_at": os.environ["DAY11_AT"],
  "created_at": os.environ["DAY11_AT"],
}))
PY
)"
    sb_post "mini_assessments" "$SEED11" >/dev/null
    echo "  day_11: seeded at $DAY11_AT"
  fi
else
  if [[ -n "$D11_ID" ]]; then
    sb_delete "mini_assessments?id=eq.${D11_ID}" >/dev/null
    echo "  day_11: deleted (target < 11)"
  fi
fi

# day_21
D21_JSON="$(sb_get "mini_assessments?subscriber_id=eq.${SUB_ID}&assessment_type=eq.day_21&select=id")"
D21_ID="$(python3 -c "import json,sys; d=json.load(sys.stdin); print(d[0]['id'] if d else '')" <<<"$D21_JSON")"
if [[ "$TARGET_DAY" -ge 21 ]]; then
  if [[ -n "$D21_ID" ]]; then
    sb_patch "mini_assessments?id=eq.${D21_ID}" \
      "{\"completed_at\": \"${DAY21_AT}\", \"created_at\": \"${DAY21_AT}\", \"day_number\": 21}" >/dev/null
    echo "  day_21: backdated to $DAY21_AT"
  else
    SEED21="$(SUB_ID="$SUB_ID" BASE_RATINGS="$BASE_RATINGS" DAY21_AT="$DAY21_AT" python3 - <<'PY'
import json, os
r = json.loads(os.environ.get("BASE_RATINGS") or "{}")
improved = {k: min(10, (v or 5) + 2) if isinstance(v, int) else v for k, v in r.items()} if r else {
  "overall_symptom_burden": 7, "overall_quality_of_life": 7, "overall_daily_function": 7
}
print(json.dumps({
  "subscriber_id": os.environ["SUB_ID"],
  "assessment_type": "day_21",
  "day_number": 21,
  "ratings": improved,
  "open_text_improved": "sim day21",
  "open_text_challenging": "",
  "open_text_note_to_sheila": "simulate-day",
  "completed_at": os.environ["DAY21_AT"],
  "created_at": os.environ["DAY21_AT"],
}))
PY
)"
    sb_post "mini_assessments" "$SEED21" >/dev/null
    echo "  day_21: seeded at $DAY21_AT"
  fi
else
  if [[ -n "$D21_ID" ]]; then
    sb_delete "mini_assessments?id=eq.${D21_ID}" >/dev/null
    echo "  day_21: deleted (target < 21)"
  fi
fi

# --- MailerLite ---
echo ""
echo "=== MailerLite ==="
if [[ "$SHOULD_FIRE" -eq 1 && -n "$TRIGGER" ]]; then
  FIRE_TIER="${NEW_TIER:-$TIER}"
  if [[ "$TARGET_DAY" -eq 19 ]]; then FIRE_TIER="restoration"; fi
  RESULT="$(fire_ml_trigger "$TRIGGER" "$SUB_ID" "$EMAIL" "$FIRE_TIER" "$NEW_PAYMENT" "$TARGET_DAY")"
  echo "  fired: $TRIGGER"
  echo "  response: $RESULT"
else
  echo "  skipped (direction=$DIRECTION force=$FORCE_TRIGGER no_trigger=$NO_TRIGGER trigger=${TRIGGER:-none})"
fi

# Verify
echo ""
echo "=== Verification ==="
VPROG="$(sb_get "subscriber_progress?subscriber_id=eq.${SUB_ID}&select=day_number,current_phase")"
python3 -c "import json,sys; d=json.load(sys.stdin); print(f\"  portal: Day {d[0]['day_number']} — {d[0]['current_phase']}\" if d else '  portal: NO PROGRESS ROW')" <<<"$VPROG"
VLOG="$(sb_get "mailer_lite_trigger_log?subscriber_id=eq.${SUB_ID}&select=trigger_name,fired_at&order=fired_at.desc&limit=3")"
echo "  recent triggers:"
python3 -c "
import json,sys
d=json.load(sys.stdin)
if not d:
  print('    (none)')
else:
  for r in d:
    print(f\"    {r.get('fired_at','')}  {r.get('trigger_name')}\")
" <<<"$VLOG"

echo ""
echo "Sheila next steps (Phase 5 workbook):"
echo "  1. Hard-refresh https://instant-site-move.vercel.app/portal (Cmd+Shift+R)"
echo "  2. Confirm dashboard shows Day ${TARGET_DAY}"
if [[ -n "$TRIGGER" && "$SHOULD_FIRE" -eq 1 ]]; then
  echo "  3. MailerLite → Subscribers → ${EMAIL} → last_trigger should be '${TRIGGER}'"
  echo "  4. If automation built for ${TRIGGER}, check inbox"
fi
echo ""
echo "Done."
