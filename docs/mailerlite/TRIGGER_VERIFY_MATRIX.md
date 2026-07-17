# Trigger verify matrix

Contract for every MailerLite trigger. Update this file in the same PR as code that adds/changes a fire path.

Legend: `portal_status` = `wired` | `phase_b` | `deferred_product` | `verified`

---

## Wired (Phase A delivery)

### trial_started
| Field | Value |
|---|---|
| workflow | Member pays $19 trial → welcome / journey start email |
| eligibility_rule | Stripe checkout/subscription creates trial; webhook fires once |
| portal_status | wired |
| eng_proof | Stripe test event or fire script; log row + `last_trigger=trial_started` |
| sheila_proof | Phase 5/6 workbook inbox |
| v2_copy_ref | Subject: Your root cause journey starts now |

### day_18_restoration_preview
| Field | Value |
|---|---|
| workflow | Day 18 of trial → preview Restoration unlock |
| eligibility_rule | `advance-journey-day` when `day_number` becomes 18 |
| portal_status | wired |
| eng_proof | `simulate-day.sh 18 EMAIL --force-trigger` |
| sheila_proof | Phase 5 Section 3 |
| v2_copy_ref | Subject: A preview of what's coming in 3 days |

### day_19_restoration_unlocked
| Field | Value |
|---|---|
| workflow | Day 19 → Restoration open + tier upgrade path |
| eligibility_rule | `advance-journey-day` when day becomes 19 |
| portal_status | wired |
| eng_proof | `simulate-day.sh 19 EMAIL --force-trigger` |
| sheila_proof | Phase 5 Section 3 |
| v2_copy_ref | Subject: Restoration tier is now open to you |

### day_21_billing_reminder
| Field | Value |
|---|---|
| workflow | Day 21 → billing heads-up (kept; v2 proposed Day 19) |
| eligibility_rule | `advance-journey-day` when day becomes 21 |
| portal_status | wired |
| eng_proof | `simulate-day.sh 21 EMAIL --force-trigger` |
| sheila_proof | Phase 5 Section 3 |
| v2_copy_ref | Subject: Your trial ends in 2 days, here's what happens next |
| note | Do not move to Day 19 without Sheila confirm |

### day_11_mini_assessment / day_21_mini_assessment / semi_monthly_check_in
| Field | Value |
|---|---|
| workflow | Member **submits** check-in → confirmation / follow-up |
| eligibility_rule | Portal mini-assessment submit path |
| portal_status | wired |
| eng_proof | Submit in portal or fire script with submit trigger name |
| sheila_proof | Phase 6 workbook |
| v2_copy_ref | Submit events (distinct from reminder triggers below) |

### tier_upgrade / tier_downgrade_scheduled / cancellation_confirmed / auto_billing_confirmed / payment_failed
| Field | Value |
|---|---|
| workflow | Stripe lifecycle emails |
| eligibility_rule | `stripe-webhook` / day-22 journey for auto_billing |
| portal_status | wired |
| eng_proof | Webhook fixture or fire script; assert log + `last_trigger` |
| sheila_proof | Phase 6 workbook |
| v2_copy_ref | Matching v2 subjects for upgrade/downgrade/cancel/billing/payment failed |

---

## Phase B — assessment reminders

### wellness_assessment_reminder_1
| Field | Value |
|---|---|
| workflow | 24h after signup, assessment still incomplete → nudge |
| eligibility_rule | `assessment_completed = false` AND age from `coalesce(trial_start_date, created_at)` ∈ [24h, 72h) AND no log for this trigger |
| portal_status | phase_b |
| eng_proof | `mailerlite-eng-smoke.sh --cluster assessment_reminders` |
| sheila_proof | After smoke green |
| v2_copy_ref | Subject: Quick reminder, your Wellness Assessment is waiting |

### wellness_assessment_reminder_2
| Field | Value |
|---|---|
| workflow | 72h still incomplete → stronger nudge |
| eligibility_rule | incomplete AND age ∈ [72h, 6d) AND has reminder_1 log AND never reminder_2 |
| portal_status | phase_b |
| eng_proof | same cluster |
| sheila_proof | After smoke green |
| v2_copy_ref | Subject: You are missing your personalized roadmap |

### wellness_assessment_reminder_3
| Field | Value |
|---|---|
| workflow | 6d still incomplete → last reminder |
| eligibility_rule | incomplete AND age ≥ 6d AND has reminder_2 AND never reminder_3 |
| portal_status | phase_b |
| eng_proof | same cluster |
| sheila_proof | After smoke green |
| v2_copy_ref | Subject: Last reminder, complete your Wellness Assessment |

---

## Phase B — check-in reminders

### day_11_mini_assessment_reminder
| Field | Value |
|---|---|
| workflow | Day ≥ 11, no day_11 mini row → remind to check in |
| eligibility_rule | `subscriber_progress.day_number >= 11` AND no `mini_assessments` with `assessment_type=day_11` AND never logged this reminder |
| portal_status | phase_b |
| eng_proof | `mailerlite-eng-smoke.sh --cluster checkin_reminders` |
| sheila_proof | After smoke green |
| v2_copy_ref | Subject: Time for your Day 11 check in |

### day_21_final_assessment_reminder
| Field | Value |
|---|---|
| workflow | Day ≥ 21, no day_21 mini row → remind |
| eligibility_rule | `day_number >= 21` AND no day_21 mini AND never logged reminder |
| portal_status | phase_b |
| eng_proof | same cluster |
| sheila_proof | After smoke green |
| v2_copy_ref | Subject: Your Day 21 check in is here |

### semi_monthly_check_in_reminder
| Field | Value |
|---|---|
| workflow | Paying/trial member past day 21, ≥15d since last mini → remind |
| eligibility_rule | `payment_status in (active, trial)` AND `day_number > 21` AND days since latest mini_assessment ≥ 15 AND no reminder log in last 15d |
| portal_status | phase_b |
| eng_proof | same cluster |
| sheila_proof | After smoke green |
| v2_copy_ref | Subject: Time for your check in |

---

## Phase B — inactivity

### inactivity_3_day / inactivity_7_day / inactivity_10_day
| Field | Value |
|---|---|
| workflow | No portal login for 3 / 7 / 10 days → re-engagement; stop after 10 until login |
| eligibility_rule | Based on `subscribers.last_login_at`: 3d∈(3,7], 7d∈(7,10], 10d>10; fire each once per idle streak (idempotent via trigger_log since last_login_at) |
| portal_status | phase_b |
| eng_proof | `mailerlite-eng-smoke.sh --cluster inactivity` |
| sheila_proof | After smoke green |
| v2_copy_ref | Subjects: We noticed you've been away / It's been a week… / Still here whenever you're ready |

---

## Phase B — journey hooks

### phase_completed
| Field | Value |
|---|---|
| workflow | All lessons in a pathway phase completed → celebrate + next phase |
| eligibility_rule | After lesson complete, all lessons in that `phase` for member roadmap are `completed`; fire once per phase (log) |
| portal_status | phase_b |
| eng_proof | `mailerlite-eng-smoke.sh --cluster journey_hooks` |
| sheila_proof | After smoke green |
| v2_copy_ref | Subject: You just completed {{phase_name}} |

### full_roadmap_completed
| Field | Value |
|---|---|
| workflow | All roadmap phases complete |
| eligibility_rule | All pathway lessons completed; never logged full_roadmap_completed |
| portal_status | phase_b |
| eng_proof | same cluster |
| sheila_proof | After smoke green |
| v2_copy_ref | Subject: You completed your full roadmap |

---

## Phase B — win-back

### cancellation_win_back
| Field | Value |
|---|---|
| workflow | 30 days after cancel → win-back |
| eligibility_rule | `payment_status = cancelled` AND `cancelled_at <= now() - 30d` AND never logged win-back |
| portal_status | phase_b |
| eng_proof | `mailerlite-eng-smoke.sh --cluster winback` |
| sheila_proof | After smoke green |
| v2_copy_ref | Subject: We've kept your roadmap ready for you |

---

## Deferred product (do not implement)

| trigger_name | Why |
|---|---|
| assessment_not_completed | Needs Day 7 default Foundational Gut pathway product |
| maintenance_phase_entered | No maintenance state machine |
| maintenance_tracking_gap | No maintenance product |
| maintenance_30_day_check_in | No maintenance product |
| all_payment_retries_failed | Needs Stripe retry exhaustion design |
