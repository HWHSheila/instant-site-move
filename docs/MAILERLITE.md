# MailerLite integration (backend-first)

Portal fires trigger **names** via `fire-mailerlite-trigger`. Sheila owns email copy/automations in MailerLite. Gaps that block coverage are usually **our** cron/hooks/state — not the ML dashboard.

## Agent entry

```text
HANDOFF — MailerLite
1. Read .cursor/skills/mailerlite/SKILL.md
2. Read docs/mailerlite/STATUS.md
3. Do not recreate groups/fields; run mailerlite-bootstrap.sh if unsure
4. Do not implement deferred_product triggers
5. Before claiming done: mailerlite-eng-smoke.sh --cluster <x>
6. Update STATUS.md with what you finished and the exact next step
7. Never commit .env or print MAILERLITE_API_KEY
```

## Docs map

| Path | Purpose |
|---|---|
| `docs/mailerlite/triggers-v2.json` | Canonical trigger names + `portal_status` |
| `docs/mailerlite/triggers-v2.md` | Sheila v2 copy (full) |
| `docs/mailerlite/TRIGGER_VERIFY_MATRIX.md` | Eligibility + eng/Sheila proof |
| `docs/mailerlite/STATUS.md` | Living handoff between sessions |

## Credentials

```bash
source scripts/load-hwh-env.sh
hwh_env_check MAILERLITE_API_KEY
hwh_env_check VITE_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY
```

- Scripts: `load-hwh-env.sh` only (never echo secrets)
- Edge functions: Supabase secret `MAILERLITE_API_KEY`
- Docs list **names** of env vars, never values

## Scripts

| Script | Role |
|---|---|
| `scripts/mailerlite-bootstrap.sh` | Idempotent groups + `last_trigger` field |
| `scripts/mailerlite-inventory.sh` | Read-only groups/fields/automations |
| `scripts/fire-mailerlite-trigger.sh EMAIL TRIGGER` | Manual fire via edge fn |
| `scripts/simulate-day.sh` | Journey day jump + day 18/19/21 fires |
| `scripts/mailerlite-eng-smoke.sh --cluster <name>` | Pre-Sheila engineering gate |

### UAT without waiting calendar time

Backdate fixture columns, then fire the real job or fire script:

```bash
# Assessment reminder_1: trial_start ~36h ago, assessment_completed=false
# Inactivity 3d: last_login_at ~4d ago
# Win-back: cancelled_at ~31d ago, payment_status=cancelled

bash scripts/fire-mailerlite-trigger.sh support@herwellnessharmony.com wellness_assessment_reminder_1
# Or invoke scheduled job after fixtures:
curl -X POST "$VITE_SUPABASE_URL/functions/v1/mailerlite-scheduled-triggers" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" -d '{}'
```

Same pattern as Day 18 sim in `simulate-day` skill.

## Architecture

- **Dispatcher:** `supabase/functions/fire-mailerlite-trigger` — log → upsert → `last_trigger` → group
- **Journey days:** `advance-journey-day` + pg_cron
- **Stripe:** `stripe-webhook` — trial/tier/cancel/payment_failed; sets `cancelled_at` on delete
- **Scheduled:** `mailerlite-scheduled-triggers` + pg_cron — assessment/check-in/inactivity/win-back reminders
- **Hooks:** `useSubscriber` touches `last_login_at`; `useCompleteLesson` fires phase/roadmap complete

## portal_status values

| Status | Meaning |
|---|---|
| `wired` | Portal already fires; Phase A delivery scope |
| `phase_b` | Backend query/hook in this program |
| `deferred_product` | Needs product that does not exist yet — do not implement |

**Billing reminder:** keep `day_21_billing_reminder` until Sheila explicitly moves it to Day 19.

## Sign-off gate (do not skip)

Three layers: contract (matrix) → engineering smoke → Sheila inbox UAT.

**Gate rule:** do not send Sheila a “ready to test” note for a cluster until:

```bash
bash scripts/mailerlite-eng-smoke.sh --cluster <name>
# exits 0
```

Suggested clusters: `wired`, `assessment_reminders`, `checkin_reminders`, `inactivity`, `journey_hooks`, `winback`.

Per-cluster checklist:

1. Matrix row matches v2 “When to Fire”
2. Eng smoke green (positive + negative + idempotent)
3. Inventory shows delivery path for that `last_trigger`
4. Sheila workbook steps sent
5. Sheila Pass on inbox
6. Matrix / BACKLOG → `verified`

## Branch policy

Portal MailerLite work → push to `production` (Vercel). Do not rely on Lovable `main` for secret-backed edge deploys.
