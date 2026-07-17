# Sheila — Phase B MailerLite automations (ready to build)

**Status:** Draft for Venkat to forward. Do **not** send until eng-smoke is green and Venkat approves outreach.

Portal already fires these `last_trigger` values (and logs them). Emails only send if MailerLite has an automation that watches the field / group change.

## How to wire each automation (MailerLite UI)

1. **Automations → Create** (or edit existing)
2. Trigger: **Subscriber field is updated** → field `last_trigger` **equals** the exact string below
3. Action: **Send email** with the subject (and body from v2 doc / Content)
4. Optional filter: member is in the expected HWH group (Trial / Tier / Cancelled)

Test user: `support@herwellnessharmony.com` on https://instant-site-move.vercel.app

---

## Assessment reminders

| `last_trigger` (exact) | Subject (v2) |
|---|---|
| `wellness_assessment_reminder_1` | Quick reminder, your Wellness Assessment is waiting |
| `wellness_assessment_reminder_2` | You are missing your personalized roadmap |
| `wellness_assessment_reminder_3` | Last reminder, complete your Wellness Assessment |

## Check-in reminders (not submit confirmations)

| `last_trigger` (exact) | Subject (v2) |
|---|---|
| `day_11_mini_assessment_reminder` | Time for your Day 11 check in |
| `day_21_final_assessment_reminder` | Your Day 21 check in is here |
| `semi_monthly_check_in_reminder` | Time for your check in |

Note: submit-time triggers `day_11_mini_assessment`, `day_21_mini_assessment`, `semi_monthly_check_in` are separate (already wired in portal).

## Inactivity

| `last_trigger` (exact) | Subject (v2) |
|---|---|
| `inactivity_3_day` | We noticed you've been away |
| `inactivity_7_day` | It's been a week, let's get you back on track |
| `inactivity_10_day` | Still here whenever you're ready |

## Journey completion

| `last_trigger` (exact) | Subject (v2) |
|---|---|
| `phase_completed` | You just completed {{phase_name}} |
| `full_roadmap_completed` | You completed your full roadmap |

Custom fields passed when available: `phase_name`, `next_phase`.

## Win-back

| `last_trigger` (exact) | Subject (v2) |
|---|---|
| `cancellation_win_back` | We've kept your roadmap ready for you |

---

## Already covered (Phase 5 — do not rebuild unless broken)

`trial_started`, `day_18_restoration_preview`, `day_19_restoration_unlocked`, `day_21_billing_reminder`, tier upgrade/downgrade, `cancellation_confirmed`, `auto_billing_confirmed`, `payment_failed`, mini-assessment **submit** triggers.

Billing reminder stays on **Day 21** unless you ask to move it to Day 19.

## Deferred (do not build yet)

Maintenance emails, Day 7 default pathway, all payment retries failed — product not ready.

## Full copy

See `docs/mailerlite/triggers-v2.md` (your v2 sequence).
