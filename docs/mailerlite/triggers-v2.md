# HWH MailerLite Trigger Sequence — Technical Specifications
## For Venkat's Development Reference
### Version 2.0, 26 Triggers Locked

---

## Overview

The HWH portal must connect to MailerLite via API to fire automated email triggers based on member actions and inactivity. This document specifies every trigger event the portal needs to send to MailerLite, what data to pass, and the full email content for each automation.

Each of the 26 triggers below corresponds to exactly one automation with exactly one email. There are no multi-step sequences and no delays inside a single automation. All 26 automations should be built through Cursor using the MailerLite API, not built manually inside the MailerLite dashboard.

---

## Instructions for Cursor / API Build

For each of the 26 triggers listed in this document, Cursor should create one MailerLite automation using the API with the following mapping:

1. Automation Name, use the exact name given under each trigger below.
2. Trigger, configure the automation to fire on the event described in the When to Fire column for that trigger.
3. Email, each automation contains exactly one email with the Subject, Preview Text, and Body given below.
4. Personalization, every email must use the MailerLite merge field for first name in the greeting, formatted as Hello {{name}},
5. Data passed with the trigger, use the fields listed in Data to Pass so the correct merge fields are available to populate the body.
6. Closing signature, every email ends with the exact block below, with no variation:

In health and harmony,
Sheila
Her Wellness Harmony

Do not add steps, delays, or conditional branches beyond what a single trigger and single email require. Sheila has approved all email content below as final. No content should be altered inside MailerLite once built.

---

## MailerLite API Connection

Sheila will provide her MailerLite API key directly to Venkat. The portal must use the MailerLite API to:
1. Add new members to the correct subscriber group
2. Fire automation triggers based on portal events
3. Pass relevant member data with each trigger

---

## Subscriber Groups

| Member Status | MailerLite Group |
|---|---|
| Free Account (never paid or payment failed) | HWH Free Members |
| Trial member (Days 1-21) | HWH Trial Members |
| Root-Cause Pattern Awareness subscriber | HWH Tier 1 Members |
| Foundation subscriber | HWH Tier 2 Members |
| Guided subscriber | HWH Tier 3 Members |
| Restoration subscriber | HWH Tier 4 Members |
| Integration subscriber | HWH Tier 5 Members |
| Cancelled member | HWH Cancelled Members |

When a member upgrades or downgrades their tier they must be moved to the correct group automatically.

---

## The 26 Locked Triggers

### 1. Trial Started

**Automation Name:** Trial Started
**When to Fire:** Immediately upon $19 payment confirmation
**Data to Pass:** Member name, email, trial start date, roadmap pathway assigned

**Subject:** Your root cause journey starts now
**Preview:** Here is what happens over your next 21 days.
**Body:**
Hello {{name}},

Welcome to Her Wellness Harmony. Your 21 day trial is officially underway, and everything from here is built around finding the actual root of what you have been feeling, not just managing symptoms.

Your first step is your Wellness Assessment. It takes about 10 minutes and it is what builds your personalized roadmap through the gut, metabolism, and hormone cascade. Nothing unlocks until this is complete, so this is the one thing to do today.

Over the next 21 days you will move through your roadmap at your own pace, with a mid trial check in on Day 11 and a final one on Day 21. On Day 19, Restoration tier opens up so you can explore more of what is available before your trial ends.

Start your Wellness Assessment here.

In health and harmony,
Sheila
Her Wellness Harmony

---

### 2. Wellness Assessment Reminder 1

**Automation Name:** Wellness Assessment Reminder 1
**When to Fire:** 24 hours after signup if Wellness Assessment (including Day 1 baseline ratings, Step 13) not submitted
**Data to Pass:** Member name, email, direct link to assessment

**Subject:** Quick reminder, your Wellness Assessment is waiting
**Preview:** It takes about 10 minutes and unlocks your personalized roadmap.
**Body:**
Hello {{name}},

Just a quick nudge. Your Wellness Assessment is still open, and it is the piece that turns your roadmap from generic to actually yours. Ten minutes now saves you weeks of guessing later.

Complete your Wellness Assessment here.

In health and harmony,
Sheila
Her Wellness Harmony

---

### 3. Wellness Assessment Reminder 2

**Automation Name:** Wellness Assessment Reminder 2
**When to Fire:** 48 hours after Reminder 1, 72 hours total from signup, if still not submitted
**Data to Pass:** Member name, email, direct link to assessment

**Subject:** You are missing your personalized roadmap
**Preview:** Your Wellness Assessment is still open.
**Body:**
Hello {{name}},

Your Wellness Assessment is still sitting unfinished, and without it your roadmap cannot be built around your actual patterns. This is the foundation everything else is built on, so it is worth carving out the ten minutes.

Complete your Wellness Assessment here.

In health and harmony,
Sheila
Her Wellness Harmony

---

### 4. Wellness Assessment Reminder 3

**Automation Name:** Wellness Assessment Reminder 3
**When to Fire:** 72 hours after Reminder 2, 6 days total from signup, if still not submitted. Final reminder, sequence stops after this regardless of submission status.
**Data to Pass:** Member name, email, direct link to assessment

**Subject:** Last reminder, complete your Wellness Assessment
**Preview:** This is the final reminder before we move forward without it.
**Body:**
Hello {{name}},

This is the last reminder about your Wellness Assessment. If it is not completed soon, we will move forward with a general starting pathway so you are not stuck waiting, and you can always complete the assessment later to have your roadmap adjusted to fit you more precisely.

Complete your Wellness Assessment here.

In health and harmony,
Sheila
Her Wellness Harmony

---

### 5. Assessment Not Completed

**Automation Name:** Assessment Not Completed
**When to Fire:** Day 7 of trial, if Wellness Assessment still not submitted after all three reminders
**Data to Pass:** Member name, email, default pathway assigned, direct link to assessment

*Note: this trigger is new and not present in the original 24 trigger set. Timing is set to fire the day after Reminder 3 closes the initial sequence, since Reminder 3 stops the sequence but does not resolve the account status. Confirm this timing is correct.*

**Subject:** We started you on our Foundational Gut pathway
**Preview:** You can update this anytime by completing your assessment.
**Body:**
Hello {{name}},

Since your Wellness Assessment has not been completed yet, we have started you on our Foundational Gut pathway so your trial time is not wasted. This is a solid general starting point, but it is not personalized to your specific patterns the way a completed assessment would be.

You can complete your Wellness Assessment at any point and your roadmap will update to reflect it.

Complete your Wellness Assessment here.

In health and harmony,
Sheila
Her Wellness Harmony

---

### 6. Day 11 Mini Assessment Reminder

**Automation Name:** Day 11 Mini Assessment Reminder
**When to Fire:** Day 11 of trial
**Data to Pass:** Member name, email, roadmap pathway

**Subject:** Time for your Day 11 check in
**Preview:** A quick check in to track your progress so far.
**Body:**
Hello {{name}},

You are halfway through your trial. Your Day 11 mini assessment takes just a couple of minutes and helps track how your patterns are shifting since Day 1. This is how we know what is working and what needs adjusting.

Complete your Day 11 check in here.

In health and harmony,
Sheila
Her Wellness Harmony

---

### 7. Day 21 Final Assessment Reminder

**Automation Name:** Day 21 Final Assessment Reminder
**When to Fire:** Day 21 of trial
**Data to Pass:** Member name, email, roadmap pathway

**Subject:** Your Day 21 check in is here
**Preview:** Let's see how far you have come before your trial wraps up.
**Body:**
Hello {{name}},

Your trial is coming to a close, and your Day 21 assessment is the moment to look back at how far you have come since Day 1. This is separate from your billing, it is purely about tracking your progress and setting up what comes next in your roadmap.

Complete your Day 21 check in here.

In health and harmony,
Sheila
Her Wellness Harmony

---

### 8. Day 18 Restoration Unlock Preview

**Automation Name:** Day 18 Restoration Unlock Preview
**When to Fire:** Day 18 of trial
**Data to Pass:** Member name, email

**Subject:** A preview of what's coming in 3 days
**Preview:** Restoration tier access opens for you on Day 19.
**Body:**
Hello {{name}},

In three days, on Day 19, your trial expands to include Restoration tier access. That means more of your roadmap opens up before your trial even ends, so you get a real feel for the deeper level of support before you decide what tier is right for you going forward.

In health and harmony,
Sheila
Her Wellness Harmony

---

### 9. Day 19 Restoration Unlocked

**Automation Name:** Day 19 Restoration Unlocked
**When to Fire:** Day 19 of trial, when tier auto-upgrades
**Data to Pass:** Member name, email

**Subject:** Restoration tier is now open to you
**Preview:** Explore your expanded access for the rest of your trial.
**Body:**
Hello {{name}},

Restoration tier is now unlocked in your account. Take these last few days of your trial to explore what is available at this level. It is the clearest way to know whether Restoration is the right fit once your trial ends.

Log in and explore Restoration here.

In health and harmony,
Sheila
Her Wellness Harmony

---

### 10. Day 19 Billing Reminder

**Automation Name:** Day 19 Billing Reminder
**When to Fire:** Day 19 of trial
**Data to Pass:** Member name, email, current default tier at billing (Foundation, $29/month), cutoff date and time for changes

*Note: this replaces the original Day 21 billing reminder. Moving the reminder to Day 19 gives members a full 2 days to make a tier change or cancel before the 24 hour cutoff ahead of Day 22 billing. This is the only billing reminder, there is no second reminder on Day 21.*

**Subject:** Your trial ends in 2 days, here's what happens next
**Preview:** Foundation billing begins Day 22 unless you make a change.
**Body:**
Hello {{name}},

Your 21 day trial wraps up in 2 days. Starting Day 22, your account automatically moves to Foundation tier at $29 a month, unless you choose a different tier or cancel first.

If you want to make any changes, you need to do it at least 24 hours before Day 22 billing. Right now you have a full 2 days of room to decide, so there is no rush, just don't wait until the last minute.

Manage your tier here.

In health and harmony,
Sheila
Her Wellness Harmony

---

### 11. Phase Completed

**Automation Name:** Phase Completed
**When to Fire:** Each time member completes any phase in their roadmap, regardless of how many phases their roadmap contains
**Data to Pass:** Member name, email, completed phase name, next phase name if applicable

**Subject:** You just completed {{phase_name}}
**Preview:** Here's what's opening up next in your roadmap.
**Body:**
Hello {{name}},

You just finished {{phase_name}}. That is real progress through your roadmap, and it means your next phase is now open.

Keep going, here is what's next.

In health and harmony,
Sheila
Her Wellness Harmony

---

### 12. Full Roadmap Completed

**Automation Name:** Full Roadmap Completed
**When to Fire:** When member completes all phases in their customized roadmap
**Data to Pass:** Member name, email, pathway name

**Subject:** You completed your full roadmap
**Preview:** Let's talk about what maintenance looks like from here.
**Body:**
Hello {{name}},

You have completed your entire {{pathway_name}} roadmap. That is not a small thing, it means you worked through the full root cause process from start to finish.

From here you are moving into maintenance, which is about staying consistent with what you have built rather than working through new material every day.

In health and harmony,
Sheila
Her Wellness Harmony

---

### 13. Maintenance Phase Entered

**Automation Name:** Maintenance Phase Entered
**When to Fire:** When member transitions to maintenance
**Data to Pass:** Member name, email

**Subject:** Welcome to maintenance
**Preview:** Here's how to stay consistent without the daily structure.
**Body:**
Hello {{name}},

You are officially in maintenance. This phase looks different than the roadmap you just finished, there is less structured daily content and more focus on staying consistent with your tracking so old patterns don't quietly creep back in.

We will check in with you regularly to help you stay on top of it.

In health and harmony,
Sheila
Her Wellness Harmony

---

### 14. Inactive 3 Days

**Automation Name:** Inactive 3 Days
**When to Fire:** Member has not logged in for 3 consecutive days. Resets if member logs in.
**Data to Pass:** Member name, email, last lesson completed

**Subject:** We noticed you've been away
**Preview:** Your last lesson is still waiting for you.
**Body:**
Hello {{name}},

It has been a few days since you logged in. Your last completed lesson was {{last_lesson}}, and your roadmap is right where you left it whenever you are ready to pick back up.

Log back in here.

In health and harmony,
Sheila
Her Wellness Harmony

---

### 15. Inactive 7 Days

**Automation Name:** Inactive 7 Days
**When to Fire:** Member has not logged in for 7 consecutive days. Resets if member logs in.
**Data to Pass:** Member name, email, last lesson completed

**Subject:** It's been a week, let's get you back on track
**Preview:** A short nudge to help you pick back up.
**Body:**
Hello {{name}},

It has been a full week since your last login. Life happens, and picking back up doesn't require starting over, your progress through {{last_lesson}} is all still saved.

Log back in here.

In health and harmony,
Sheila
Her Wellness Harmony

---

### 16. Inactive 10 Days

**Automation Name:** Inactive 10 Days
**When to Fire:** Member has not logged in for 10 consecutive days. Resets if member logs in. After this trigger, pause re-engagement sequence, do not continue sending after 10 days of no login and no email response.
**Data to Pass:** Member name, email, last lesson completed

**Subject:** Still here whenever you're ready
**Preview:** No pressure, just a reminder that your roadmap is waiting.
**Body:**
Hello {{name}},

It has been 10 days since you logged in. This is the last check in from us for a while, we don't want to clutter your inbox. Your roadmap and progress through {{last_lesson}} will be exactly where you left them whenever life settles and you are ready to come back.

Log back in here.

In health and harmony,
Sheila
Her Wellness Harmony

---

### 17. Maintenance Tracking Gap

**Automation Name:** Maintenance Tracking Gap
**When to Fire:** Member has not logged a tracking entry for 5 consecutive days during maintenance
**Data to Pass:** Member name, email

**Subject:** Haven't seen a tracking entry in a few days
**Preview:** A quick log helps you stay ahead of old patterns.
**Body:**
Hello {{name}},

It has been a few days since your last tracking entry in maintenance. A quick log now is the easiest way to catch a pattern creeping back before it turns into a full setback.

Log a tracking entry here.

In health and harmony,
Sheila
Her Wellness Harmony

---

### 18. Maintenance 30-Day Check-In

**Automation Name:** Maintenance 30-Day Check-In
**When to Fire:** Every 30 days, ongoing throughout the entire maintenance phase, not just once at 30 days
**Data to Pass:** Member name, email, days in maintenance

**Subject:** Your 30 day maintenance check in
**Preview:** Let's see how things are holding steady.
**Body:**
Hello {{name}},

You have been in maintenance for {{days_in_maintenance}} days now. This is a good point to check in on how things are holding, and to flag anything that feels like it is starting to drift so we can catch it early.

Complete your maintenance check in here.

In health and harmony,
Sheila
Her Wellness Harmony

---

### 19. Semi-Monthly Check-In Reminder

**Automation Name:** Semi-Monthly Check-In Reminder
**When to Fire:** Every 15 days for paying members after Day 21, not every 14 days
**Data to Pass:** Member name, email, days since last assessment

**Subject:** Time for your check in
**Preview:** A quick assessment to keep your roadmap accurate.
**Body:**
Hello {{name}},

It has been 15 days since your last check in. A quick assessment now keeps your roadmap accurate to where you actually are, instead of where you were two weeks ago.

Complete your check in here.

In health and harmony,
Sheila
Her Wellness Harmony

---

### 20. Tier Upgrade

**Automation Name:** Tier Upgrade
**When to Fire:** When member upgrades to a higher tier
**Data to Pass:** Member name, email, old tier, new tier

**Subject:** Your upgrade is confirmed
**Preview:** Here's what's newly unlocked in your account.
**Body:**
Hello {{name}},

Your upgrade from {{old_tier}} to {{new_tier}} is confirmed and active right now. Log in to see what's newly unlocked in your roadmap.

Explore your account here.

In health and harmony,
Sheila
Her Wellness Harmony

---

### 21. Tier Downgrade Scheduled

**Automation Name:** Tier Downgrade Scheduled
**When to Fire:** When member schedules a downgrade
**Data to Pass:** Member name, email, current tier, new tier, effective date

**Subject:** Your tier change is scheduled
**Preview:** Here's when it takes effect and what changes.
**Body:**
Hello {{name}},

Your downgrade from {{current_tier}} to {{new_tier}} is scheduled to take effect on {{effective_date}}. You'll keep full access to {{current_tier}} until then, nothing changes right away.

In health and harmony,
Sheila
Her Wellness Harmony

---

### 22. Cancellation Confirmed

**Automation Name:** Cancellation Confirmed
**When to Fire:** When member cancels subscription
**Data to Pass:** Member name, email, tier at cancellation, access end date

**Subject:** Your cancellation is confirmed
**Preview:** Here's what happens to your access from here.
**Body:**
Hello {{name}},

Your cancellation is confirmed. You'll keep access to {{tier}} through {{access_end_date}}, after that your account will move to a free account with your progress preserved.

We would love to have you back anytime you are ready.

In health and harmony,
Sheila
Her Wellness Harmony

---

### 23. Cancellation Win-Back

**Automation Name:** Cancellation Win-Back
**When to Fire:** 30 days after cancellation, not 7 days
**Data to Pass:** Member name, email

**Subject:** We've kept your roadmap ready for you
**Preview:** Come back anytime, your progress is saved.
**Body:**
Hello {{name}},

It has been 30 days since you cancelled. Your progress and roadmap are still saved exactly where you left them, so picking back up doesn't mean starting over.

If now feels like the right time, we would love to have you back.

Restart your membership here.

In health and harmony,
Sheila
Her Wellness Harmony

---

### 24. Auto-Billing Confirmed

**Automation Name:** Auto-Billing Confirmed
**When to Fire:** When Day 22 Foundation billing processes successfully
**Data to Pass:** Member name, email

**Subject:** Your Foundation billing is confirmed
**Preview:** Here's a quick receipt and what's included this month.
**Body:**
Hello {{name}},

Your Foundation tier billing for this month has processed successfully. You have full access to everything included at this tier, and you can manage or change your tier anytime from your account.

View your account here.

In health and harmony,
Sheila
Her Wellness Harmony

---

### 25. Payment Failed

**Automation Name:** Payment Failed
**When to Fire:** When a Stripe payment fails
**Data to Pass:** Member name, email, tier, next retry date

**Subject:** We couldn't process your payment
**Preview:** Here's how to update your card before your access changes.
**Body:**
Hello {{name}},

We were not able to process your payment for {{tier}}. We will automatically try again on {{next_retry_date}}, but you can update your card now to avoid any interruption to your access.

Update your payment method here.

In health and harmony,
Sheila
Her Wellness Harmony

---

### 26. All Payment Retries Failed

**Automation Name:** All Payment Retries Failed
**When to Fire:** After all Stripe retry attempts fail (1 day, 3 days, 3 days, 7 days total), when member's account downgrades to Free Account, Tier 0
**Data to Pass:** Member name, email, prior tier

**Subject:** Your account has moved to Free access
**Preview:** Update your payment anytime to restore your tier.
**Body:**
Hello {{name}},

After a few unsuccessful attempts, we were not able to process your payment, so your account has moved to a Free account. Your progress and data are fully preserved, nothing is lost.

Whenever you are ready, you can update your payment method and restore your {{prior_tier}} access.

Update your payment method here.

In health and harmony,
Sheila
Her Wellness Harmony

---

## Important Development Notes

1. All triggers must pass the member's first name for personalization.
2. All Wellness Assessment reminder emails must be logged in Supabase with timestamp and member ID as proof of delivery. This protects Her Wellness Harmony in the event of a refund dispute.
3. All triggers must pass the member's assigned roadmap pathway so email content can reference their specific journey where applicable.
4. Inactivity triggers must reset if the member logs in. Do not fire subsequent inactivity triggers after a login.
5. The Supabase database must log the timestamp of every trigger fired for each member.
6. Every automation has exactly one email. Do not build multi-step sequences.
7. Semi-monthly check-in reminders fire every 15 days, not every 14 days.
8. Maintenance check-ins fire every 30 days ongoing throughout the entire maintenance phase, not just once at 30 days.
9. Cancellation win-back fires at 30 days after cancellation, not 7 days.
10. The Day 1 baseline mini assessment is not a separate submission event. It is Step 13 of the Wellness Assessment, so its reminders are covered entirely by the Wellness Assessment reminder sequence.
11. Day 19 Billing Reminder is the only billing reminder before Day 22 auto-billing. There is no second reminder on Day 21, moving the reminder to Day 19 gives members a full 2 days of room to act before the 24 hour cutoff.
12. Assessment Not Completed fires once, on Day 7, only if the Wellness Assessment is still not submitted after all three reminders. Confirm this timing before build.
13. All 26 automations should be built via Cursor using the MailerLite API, not built manually inside the MailerLite dashboard.

---

*End of MailerLite Trigger Sequence Specifications, Version 2.0*
