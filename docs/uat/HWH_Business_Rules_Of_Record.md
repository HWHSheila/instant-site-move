# Her Wellness Harmony: business rules of record

**For:** Sheila
**Opened:** 25 July 2026, with Batch 1
**Extended by:** each later batch

---

## What this document is

A record of your own rules for how the portal behaves, written back to you in
plain language so you can confirm we understood them.

It is a mirror, not a specification we wrote. Every rule below is something you
stated, with a note of where you stated it. Where two of your own statements
disagree, both are shown, dated, and the later one governs. Where a rule is still
waiting on you, it says so rather than pretending it is settled.

Nothing technical appears here. There is a separate internal document for that.

### How to read an entry

- **The rule** in your words
- **Where you said it**
- **What you will see** on screen
- **Status**: confirmed, superseded, or awaiting your decision
- **Proven by**: the retest row that demonstrates it

A rule with no test is unproven. A test with no rule means we invented a
requirement. Both are treated as mistakes.

---

## 1. Membership and what a tier means

### 1.1 A tier is what someone pays for, nothing else

**Where you said it:** UAT Phase 3 row 1.2, "the badge says Restoration for an
account that never paid", and Phase 2 row 4.1.

**What you will see:** an account that has never paid shows no tier at all. The
assessment can recommend a tier, and that recommendation appears on your results
as a recommendation, but it never becomes the membership badge on its own.

**Status:** confirmed 25 July 2026.

**Proven by:** UAT 1a, Phase 3 row 1.2 and Phase 2 row 4.1.

**Note on what you saw:** the assessment was writing its recommendation straight
into the membership badge, and the day-advance tool we used for testing was
forcing Restoration at day 19. Both were built that way by us. Both are now
stopped, and the badges they left behind have been cleared, but only on accounts
with no payment history of any kind.

### 1.2 The tier ladder and its prices

**Where you said it:** your pricing answer of 25 July 2026.

| Tier | Price |
| --- | --- |
| Root-Cause Pattern Awareness | $9 a month |
| Foundation | $29 a month |
| Guided | $69 a month |
| Restoration | $119 a month |
| Integration | $299 a month |

**Status:** confirmed 25 July 2026. Replaces every earlier price list.

---

## 2. The trial

### 2.1 The trial is not free, and it is 21 days

**Where you said it:** your Decision 1 answer of 25 July 2026, and UAT Phase 3
row 8.1 where you flagged that the button said "free".

**The rule:** a member pays **$19 once**, which covers 21 days.

- Days 1 to 18: Foundation-level access
- Days 19 to 21: Restoration-level access, so they see what the deeper tier offers
- Day 22 onward: billed $29 a month for Foundation, unless they chose otherwise

**What you will see:** the button now names the $19 price instead of saying free.
On the account page, a member on trial sees which day they are on, when
Restoration access opens, when the trial ends, and what they will be billed for
afterwards.

**Status:** confirmed 25 July 2026.

**Proven by:** UAT 1a, Phase 3 row 8.1 and the account page rows.

### 2.2 Choosing a tier during the trial does not grant it early

**Where you said it:** your Decision 1 answer of 25 July 2026, confirming that
everyone on trial follows the same ladder regardless of what they picked.

**What you will see:** someone who picks Integration on day 2 still sees
Foundation content until day 19 and Restoration from day 19. Their choice is
remembered and takes effect when billing starts on day 22.

**Status:** confirmed 25 July 2026. The remembering is in place now; the billing
that acts on it is Batch 2.

**Still open, not blocking:** whether the $19 is taken at the moment of checkout.
This changes how the payment is set up but not the access rules above.

### 2.3 Superseded: the earlier trial model

**Where you said it:** Business Architecture Requirements, 1 July 2026.

That version had everyone entering at Root-Cause Pattern Awareness at $9 a month,
with a Guided Experience Preview on days 19 to 21, then staying at $9 or
upgrading.

**Status:** superseded on 25 July 2026. Four things changed: the entry tier moved
from Awareness to Foundation, the charge became a one-time $19 rather than $9 a
month, day 19 now opens Restoration rather than a Guided preview, and the default
after the trial became $29 Foundation.

Recorded rather than deleted, so if any of those four changes was not intended,
you can see exactly which one to pull back.

---

## 3. The assessment and what it recommends

### 3.1 Mild answers must produce a mild result

**Where you said it:** UAT Phase 2 row 5.2, "mild symptoms produced too many
focus areas", and your report that everything came back Integration.

**The rule, approved 25 July 2026:** severity decides the starting tier.
Breadth can raise it by one step, but only when the starting tier is Guided or
higher. Mild never becomes Integration on breadth alone. Pattern labels follow
the same 1 to 10 ratings: 8 to 10 is low, 5 to 7 is medium, 1 to 4 is high.

**What you will see:** a mild assessment (ratings of 7 to 10 across the board)
recommends Foundation or Awareness, not Integration, and the pattern cards are
labelled low, not medium or high.

**Status:** confirmed 25 July 2026. Built. Numbers in
`HWH_Scoring_Thresholds_For_Approval_2026-07-25.md`.

**Proven by:** UAT 1a, Phase 2 rows 5.2 and the mild-pattern-label row.

### 3.2 A recommendation is a recommendation

**Where you said it:** your exclusions of 25 July 2026, ruling out any path that
takes payment before the assessment.

**What you will see:** the assessment suggests a tier and explains why. It does
not select, charge, or grant anything.

**Status:** confirmed 25 July 2026.

---

## 4. What members can see

### 4.1 Lessons appear once they are ready, and silence is never the answer

**Where you said it:** UAT Phase 2 row 5.3, "only the admin account sees lessons",
and Phase 3 row 2.2.

**What you will see:** members now see the lessons that have a recording. Lessons
without one stay hidden, because a lesson that opens to nothing is worse than one
that has not appeared yet. When a member has a roadmap but none of its lessons
are released, the page says so in a sentence instead of showing an empty screen.

**Status:** confirmed 25 July 2026.

**Proven by:** UAT 1a, Phase 2 row 5.3 and Phase 3 row 2.2.

### 4.2 The roadmap is called My Guided Roadmap

**Where you said it:** UAT Phase 2 row 3.3 and Phase 3 row 2.1.

**What you will see:** the old name Guided Pathways is gone from the menu and
from the wording on the pattern pages.

**Status:** confirmed 25 July 2026.

**Proven by:** UAT 1a, Phase 3 row 2.1.

---

## 5. Previewing as a member

### 5.1 Preview shows exactly what that member would see

**Where you said it:** UAT Phase 2 rows 4.1 and 4.3, Phase 3 rows 6.3 and 7.3.

**What you will see:** choosing a tier to preview now changes the content, the
menu and the limits together. The Studio menus disappear while previewing, because
a member never has them. There is a new option to preview as a free account with
no tier at all. The coach's monthly question count now shows the number for the
tier being previewed rather than always showing 150.

**Status:** confirmed 25 July 2026.

**Proven by:** UAT 1a, Phase 2 rows 4.1 and 4.3, Phase 3 rows 6.3 and 7.3.

### 5.2 The coach allowance by tier

**Where you said it:** your confirmed tier feature matrix, 25 July 2026.

| Tier | Questions a month |
| --- | --- |
| Awareness, $9 | 10 |
| Foundation, $29 | 35 |
| Guided, $69 | 100 |
| Restoration, $119 | 150 |
| Integration, $299 | Unlimited |

**Status:** confirmed 25 July 2026.

---

## 6. Getting around and getting out

### 6.1 Signing out must be obvious

**Where you said it:** UAT Phase 2 row 1.3.

**What you will see:** a plainly labelled Sign Out in the menu, on both desktop
and phone. The word Account is now clickable and takes you to your account page,
which it did not before.

**Status:** confirmed 25 July 2026.

**Proven by:** UAT 1a, Phase 2 row 1.3.

### 6.2 Membership options are reachable, but only after the assessment

**Where you said it:** UAT Phase 5 row 1.1, "there is no coaching menu item", and
your exclusions of 25 July 2026 ruling out a standalone pricing page and any
pay-before-assessment path.

**What you will see:** Deep Support Coaching appears in the menu once the
assessment is complete, and not before. Someone who has not taken the assessment
has no route to pricing at all.

**Status:** confirmed 25 July 2026.

**Note:** your UAT row asked for the menu item back and your exclusions forbid a
pricing entry point. Both are satisfied by making it conditional rather than
always present. If you meant it should always be visible, say so and we will
change it.

**Proven by:** UAT 1a, Phase 5 row 1.1.

### 6.3 Payment pages open in a new tab

**Where you said it:** UAT Phase 3 row 10.3 and Phase 5 row 1.2.

**What you will see:** checkout and Manage Billing open in a new tab, so the
portal stays where it was behind them.

**Status:** confirmed 25 July 2026.

**Proven by:** UAT 1a, Phase 3 row 10.3 and Phase 5 row 1.2.

### 6.4 A page that fails says so

**Where you said it:** UAT Phase 3 rows 9.1 to 9.7, where two editors opened to a
blank white page and six further rows could not be tested behind them.

**What you will see:** both editors work. Beyond that, if any page in the portal
ever fails again, it shows a short message with the menu still working, so you can
carry on rather than being stuck on a white screen.

**Status:** confirmed 25 July 2026.

**Proven by:** UAT 1a, Phase 3 rows 9.1 to 9.7.

---

## 7. Rules recorded for later batches

Listed so they are not lost, with the batch that will answer them.

### 7.1 Free accounts receive no email of any kind

**Where you said it:** your exclusions of 25 July 2026.

**Conflict to resolve, Batch 2:** three of the twelve automations now live are
wellness assessment reminders. By definition those go to people who have not
completed the assessment and have not paid. Either those reminders are an
intended exception, or "free account" means something narrower than it reads.
We will not turn on the reminder schedule until you tell us which.

### 7.2 The journey emails must send themselves

**Where you said it:** UAT Phase 6, on the day 18, 19 and 21 emails.

**Status: not yet true.** The email service is set up and the messages exist,
but the portal never tells it when a member reaches day 18, 19 or 21. We wired
that into a testing script and never wired it into the product itself, which is
why the emails only appeared when we ran them by hand. Batch 2.

### 7.3 Progress check-ins

**Where you said it:** your confirmation of 25 July 2026 that this is a real gap
against the Sequential Content Locking document, not new work.

**Your flow, recorded:** a weak answer sends the member back to the specific part
of the lesson the question came from and offers a retake. A second weak answer
shows a Contact Support button. Available from Foundation upward, and it must not
depend on the AI Coach, which only starts at Guided.

**Awaiting your decision:** question format and count. We recommend two or three
multiple choice questions per check-in, because it can be graded without the AI
Coach and it drives your redirect-and-retry flow. Scheduled after Batch 4.

---

## 8. Where these rules came from

Assembled from your own documents and messages. Where they disagree, the most
recent wins and the earlier one is kept and dated rather than deleted.

| Date | Source |
| --- | --- |
| 25 July 2026 | Your completed UAT workbook, your Batch 1 corrections and decisions, your clarifications and exclusions |
| 17 July 2026 | Your MailerLite trigger sequence v2, 26 triggers locked |
| 5 July 2026 | Your completed planning questions and portal review |
| 1 July 2026 | Your Business Architecture, Technical Architecture and Legal Compliance requirements |

One caution: file dates are not authorship dates. Several of these documents were
copied or touched later than they were written. Each entry above is dated by the
conversation that produced it, and where a document carries no date of its own we
say so rather than guessing.
