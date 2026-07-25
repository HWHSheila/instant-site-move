# E2E automation tracker

**Policy:** Venkat does not click through MailerLite for remaining triggers. Browser agent builds under approve. Pattern proven by #1.

---

## wellness_assessment_reminder_1 — VERIFIED (2026-07-17)

### (a) What
- Trigger: `wellness_assessment_reminder_1`
- Subject: Quick reminder, your Wellness Assessment is waiting
- Real life: ~24h after signup if assessment incomplete

### (b) How
- Built in MailerLite UI (Venkat + screen-by-screen guide); Active
- Trigger: Updates field → `last_trigger` is equal `wellness_assessment_reminder_1`
- Email: Simple editor; body from v2; merge tag `{$name}`
- Not repeatable (ML default) — one send per subscriber

### (c) Test I/O
- Input: `bash scripts/fire-mailerlite-trigger.sh support@herwellnessharmony.com wellness_assessment_reminder_1`
- Eng: success, log row, `last_trigger` set
- Inbox: received + opened (CSV sent=1 open=1)

### (d) Sign-off
- Eng: pass  
- Inbox: pass (delivery)  
- Overall: **verified**

---

## Remaining (todo — browser agent)

| trigger_name | status |
|---|---|
| wellness_assessment_reminder_2 | todo |
| wellness_assessment_reminder_3 | todo |
| day_11_mini_assessment_reminder | todo |
| day_21_final_assessment_reminder | todo |
| semi_monthly_check_in_reminder | todo |
| inactivity_3_day | todo |
| inactivity_7_day | todo |
| inactivity_10_day | todo |
| phase_completed | todo |
| full_roadmap_completed | todo |
| cancellation_win_back | todo |

When building: copy #1 pattern; use `{$name}`; ensure Name on test subscriber; fire once per subscriber (or enable repeatable only for test).
