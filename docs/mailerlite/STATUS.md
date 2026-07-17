## Current phase: B (backend + production shipped; Sheila automations pending your send)
## Last completed: production push `f863e1b` + eng-smoke all clusters with last_trigger asserts
## In progress: none — wait for your approve before Sheila outreach
## Blocked: none
## Do not redo: groups, last_trigger field, fire-mailerlite-trigger core
## Open decisions: Day 21 vs Day 19 billing (default: keep Day 21)
## Last eng-smoke: wired / assessment_reminders / checkin_reminders / inactivity / winback / journey_hooks — all pass with last_trigger (2026-07-17)
## Sheila UAT: do not ping until you approve; brief ready at docs/mailerlite/SHEILA_PHASE_B_AUTOMATIONS.md

### Deployed
- Git: `origin/production` @ `f863e1b` (Vercel)
- Supabase: `mailerlite-scheduled-triggers`, `stripe-webhook` (`cancelled_at`), cron @ 07:00 UTC
- Parent `.env`: `MAILERLITE_API_KEY` present for agent scripts

### Portal (production)
- `useSubscriber` writes `last_login_at` (hourly throttle)
- `useCompleteLesson` fires `phase_completed` / `full_roadmap_completed`
