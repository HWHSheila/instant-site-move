## Current phase: B (backend shipped; Sheila UAT gated)
## Last completed: Phase A durable assets + Phase B schema/cron/hooks + eng-smoke all clusters
## In progress: none — next is Sheila delivery automations for Phase B trigger names + Vercel production deploy for portal hooks
## Blocked: none
## Do not redo: groups, last_trigger field, fire-mailerlite-trigger core
## Open decisions: Day 21 vs Day 19 billing (default: keep Day 21)
## Last eng-smoke: wired / assessment_reminders / checkin_reminders / inactivity / winback / journey_hooks — all pass (2026-07-17); local MAILERLITE_API_KEY now in parent `/Users/venkat/work/hwh/.env` (inventory verified 2026-07-17)
## Sheila UAT: do not ping Phase B clusters until automations exist for new reminder names; wired Phase 5 already passed

### Deployed (Supabase)
- Edge fn `mailerlite-scheduled-triggers`
- Edge fn `stripe-webhook` (`cancelled_at` on subscription deleted)
- SQL: `subscribers.cancelled_at` + pg_cron `mailerlite-scheduled-triggers` @ 07:00 UTC

### Portal code (needs Vercel `production` deploy)
- `useSubscriber` writes `last_login_at` (hourly throttle)
- `useCompleteLesson` fires `phase_completed` / `full_roadmap_completed`
