# HWH Portal UAT: Batch 1 Corrections and Decision Answers
## For Venkat, in response to UAT_SHEILA_ACK_2026-07-25.md

---

## Batch 1 Corrections

### 1. Restoration badge / membership level bug (Item 1)

This is not one bug. It is two separate broken systems, and both need to be fixed independently.

The assessment's recommendation logic was defaulting to Integration tier for every member regardless of symptom severity, even mild symptoms produced an Integration recommendation. Separately, checkout was hardcoded or defaulting to Restoration tier at signup, regardless of what tier the assessment had recommended. The recommended tier and the assigned tier never matched at all, they were both wrong, independently of each other.

Please confirm the fix addresses both the recommendation logic and the checkout assignment logic as two distinct issues, not a single copy-through bug.

### 2. Portal-sending-emails-directly confusion (journey emails section)

The document states the portal will send Day 18, 19, 21, and 22 emails directly, separate from MailerLite, and says all 12 reminder emails are built and switched on in MailerLite.

This does not match what was actually built. 26 emails were built in MailerLite specifically so that MailerLite automations, triggered by portal-side events, handle these sends. Please clarify why the plan shifted to portal-sent emails instead of using the 26 already-built MailerLite automations, and where the number 12 is coming from when 26 were built and confirmed.

### 3. MailerLite groups getting "messy" (trial tier conflict claim)

The explanation that trial members get filed under HWH Trial Members regardless of tier, creating conflicting groups, does not reflect the actual tier model. All trial members are on Foundation tier by default during the trial period. Tier selection does not take effect until the trial ends. There should not be a tier conflict happening during the trial itself. This part of the explanation may be based on a misunderstanding of the tier structure rather than a real bug, please review and confirm.

### 4. Purpose of groups clarification

Groups and the 26 individual triggers both need to coexist, groups are not being replaced by the trigger-based emails. Groups exist so a one-off broadcast can be sent to a single tier, for example only Tier 5 members, when needed. Please confirm every subscriber is being correctly assigned to their actual tier group, since that is the entire purpose groups serve.

### 5. Sign Out / avatar icon (correction section)

When testing, no avatar image had been uploaded, so the sidebar only displayed the word "Account" with no visible avatar image, and the word itself was not clickable. The fix needed is not only a labelled Sign Out item added to a menu, it is making the word "Account" itself clickable, not only an icon next to it, so the account menu, including sign out, opens whether or not an avatar image exists.

---

## Answers to the Four Decisions

### Decision 1: Trial cost and what happens after

The trial is a one-time $19 charge for 21 days. There is no free trial option, this was decided against.

The trial runs at Foundation tier level for the first 18 days, then unlocks Restoration tier access for the final 3 days. The $19 price was specifically calculated to cover 18 days at Foundation plus 3 days at Restoration.

If no tier change is made before the trial ends, auto-billing begins at $29 a month, Foundation tier, which is the default tier after the trial period.

Full tier pricing, monthly:
- Awareness: $9
- Foundation: $29
- Guided: $69
- Restoration: $119
- Integration: $299

The test guide listing Awareness at $19 is incorrect. Awareness is $9 a month. The $19 figure is the one-time trial charge only and is not tied to any single tier's monthly price.

### Decision 2: Day 19 Restoration unlock, billing question

This is not an open decision. There is no billing change at Day 19 or at any point during the trial. The $19 trial charge already has the Restoration access built into its price, as described above. Access expands on Day 19, nothing gets billed differently at that point or any other point during the trial.

### Decision 3: Lesson check-ins

Confirmed as a real gap in the current build, not new work requiring a fresh brief. This was already specified in the Sequential Content Locking doc under the name Progress Reflection Check-In, and previously flagged as missing in mid-July testing.

Structure needed:
- When a member gives a wrong or weak response on a Progress Reflection Check-In, redirect them back to the specific part of the lesson or script the question came from
- Give them the option to redo the check-in after reviewing
- If the response is still weak after that, show a Contact Support button routing to support@herwellnessharmony.com
- This flow applies uniformly across all tiers that have Progress Reflection Check-Ins, Foundation tier and above, and does not depend on AI Coach access, since AI Coach does not start until Guided tier
- This also creates a feedback signal for identifying which lessons are generating repeated weak responses, useful for knowing which lesson content needs to be revised

Please advise on question format, multiple choice or short answer, and roughly how many questions per check-in based on what's feasible to build.

### Decision 4: Script content source

Confirmed. The four hook types, Pattern Disruption, Hidden Driver, Misinterpretation, and Unexpected Connection, are correct and authoritative.

Confirmed. `HWH_Pain_Points_False_Beliefs_Master-2` is the correct, current file.

No new MD file is needed. This is a confirmation of existing content, not a replacement.

---

*End of Batch 1 Corrections and Decision Answers*
