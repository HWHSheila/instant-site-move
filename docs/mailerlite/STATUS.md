## Current phase: B (pattern proven; stop manual UI grind)
## Last completed: E2E proof for `wellness_assessment_reminder_1` via MailerLite automation
## In progress: none — remaining automations deferred to **browser agent** (Venkat not click-monkey)
## Blocked: none
## Do not redo: groups, last_trigger field, fire-mailerlite-trigger core; do not ask Venkat to click Automations #2–#12
## Open decisions: Day 21 vs Day 19 billing (default: keep Day 21)
## Last eng-smoke: all clusters pass (2026-07-17)
## Sheila UAT: optional later; do not ping for building automations

### Decision (2026-07-17, Venkat)
**Option 1:** Stop UI grind. Trigger #1 proves the pattern. Agent builds remaining MailerLite automations later via **browser agent under approve** (or batch session). Not owned-send bypass. Not hand-guiding Venkat through every screen.

### E2E proof — wellness_assessment_reminder_1
| Item | Result |
|---|---|
| Automation | Active in MailerLite; trigger `last_trigger` is equal `wellness_assessment_reminder_1` |
| Real fire | `fire-mailerlite-trigger.sh` → log + `last_trigger` upsert OK |
| Inbox | support@ received subject “Quick reminder, your Wellness Assessment is waiting” |
| ML stats | sent=1, open=1 (export CSV) |
| Name tag | Fixed to `{$name}`; subscriber Name set to Sheila |
| Re-fire | Will not send again — automation `repeatable: false` (expected for one-shot reminder) |

### Remaining automations (browser agent later)
reminder_2/3, day_11/21/semi-monthly reminders, inactivity 3/7/10, phase/full roadmap, win-back — same pattern as #1. See `docs/mailerlite/SHEILA_PHASE_B_AUTOMATIONS.md` for names/subjects; bodies in `triggers-v2.md`. Always use `{$name}` not `{{name}}`.

### Deployed
- Git: `origin/production` (MailerLite portal/cron work)
- Parent `.env`: `MAILERLITE_API_KEY` present
