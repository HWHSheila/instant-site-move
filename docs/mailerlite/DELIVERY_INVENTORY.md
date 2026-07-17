# Phase A delivery inventory (wired triggers)

Last updated during MailerLite Right Way implementation.

## Backend fire path (verified by code)

| Trigger | Fire site |
|---|---|
| `trial_started` | `stripe-webhook` |
| `day_18_restoration_preview` | `advance-journey-day` / `simulate-day.sh` |
| `day_19_restoration_unlocked` | `advance-journey-day` / `simulate-day.sh` |
| `day_21_billing_reminder` | `advance-journey-day` / `simulate-day.sh` |
| `day_11_mini_assessment` | `PortalMiniAssessment` submit |
| `day_21_mini_assessment` | `PortalMiniAssessment` submit |
| `semi_monthly_check_in` | `PortalMiniAssessment` submit |
| `tier_upgrade` / `tier_downgrade_scheduled` | `stripe-webhook` |
| `cancellation_confirmed` | `stripe-webhook` (+ sets `cancelled_at`) |
| `auto_billing_confirmed` | `advance-journey-day` day 22 |
| `payment_failed` | `stripe-webhook` |

All routes call `fire-mailerlite-trigger` → `mailer_lite_trigger_log` + MailerLite upsert `last_trigger`.

## MailerLite inbox path

Emails send only if MailerLite has an **automation** (or campaign) watching `last_trigger` / group entry. Portal does not send MIME.

Run:

```bash
bash scripts/mailerlite-inventory.sh --email support@herwellnessharmony.com
```

Requires `MAILERLITE_API_KEY` in repo or parent `.env` (same key already in Supabase secrets).

### Gaps to close with Sheila (not backend rebuild)

- Confirm each wired `last_trigger` value has an active automation that sends the v2 subject
- Groups + `last_trigger` field: use `bash scripts/mailerlite-bootstrap.sh` (idempotent) — do not recreate manually
- Phase B reminder trigger names are **new** (`*_reminder`, `*_final_assessment_reminder`, inactivity, win-back) — Sheila needs automations for those when eng-smoke is green

## Sign-off

Do not mark wired cluster `verified` until:

1. `bash scripts/mailerlite-eng-smoke.sh --cluster wired` exits 0  
2. Inventory shows automation OR Sheila confirms owned send path  
3. Sheila inbox Pass on workbook rows  
