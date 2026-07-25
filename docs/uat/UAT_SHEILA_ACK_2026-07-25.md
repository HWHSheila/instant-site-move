# Your Portal Test Results: What We Heard, and What You Will Get

Prepared for Sheila, 25 July 2026
Based on your completed test workbook, `HWH_Portal_UAT_Test_Workbook-20260725.xlsx`

---

## How to use this document

Read the short version, then skim the batch that interests you. Every item is numbered.

A companion sign-off sheet follows this document. It has one row per numbered item with a single cell for you to mark **Approve**, **Change it**, or **Skip**, plus space for notes. You only need to approve **Batch 1** right now. The later batches are listed so you can see where things are heading, not so you can decide on them today.

Nothing is being built until you have reviewed this.

---

## The short version

You marked every phase "Not yet" or "No", and you were right to. Your notes were specific enough that we could trace almost every complaint to a single cause in the code, which is unusual and genuinely helpful.

Three findings matter most:

1. **The assessment was quietly setting people's membership level.** When someone finished the wellness assessment, the portal took the tier it *recommended* and recorded it as the tier they *had*. That one mistake explains the Restoration badge on unpaid accounts, the tier previews doing nothing, the Symptom Log opening without payment, and the AI Coach counter being wrong. It is a small fix with a large blast radius.
2. **Members could not see their roadmap at all.** Lessons are only visible to members once marked Published, and none of them were. Your admin account could see everything, which is why the problem looked like an admin versus member issue.
3. **Something you could not have tested: the Day 18, Day 19 and Day 21 emails were never going to reach a real member.** More on that below, because it is the most important thing in this document.

---

## Two things you could not have seen

Neither of these appear in your workbook, because no test step could have revealed them. We found them while tracing your other notes.

### The journey emails were not really connected

Your Phase 5 notes say the Day 18 and Day 21 emails did not arrive, and you assumed it was because the emails had not been built in MailerLite yet. That was a fair assumption, and it was partly true.

The fuller answer is that the portal itself never sends those emails. The Day 18, Day 19, Day 21 and Day 22 emails only get sent when a developer runs a test script by hand. The portal's own daily job advances the member's day number and does nothing else. So even with all the emails now built in MailerLite, a real paying member would still receive nothing on those days.

We are building that into the portal so it sends on its own. This is separate from the MailerLite work, which is finished: all 12 reminder emails are now built and switched on.

### Your MailerLite groups are slowly getting messy

Two problems. When someone is on trial they are filed under HWH Trial Members no matter which tier they are on, and when someone changes tier we add them to the new group but never remove them from the old one. Over time a single member accumulates several conflicting groups, which will make your segments unreliable when you start sending real campaigns.

We are fixing the group handling so your lists stay clean.

---

## Where we owe you a correction

**Item: "No sign out button is available."**

Sign out does exist. It is inside the small circular avatar icon at the very bottom of the left sidebar. You have to click the icon to discover it, which is not good enough, and the fact that you looked for it and could not find it is the only evidence that matters. We are adding a plain, labelled **Sign Out** item you can actually see.

We are also correcting one error of ours in the test guide itself: your note that "Step 5 is Early Life and Birth History, Symptom Inventory is step 6" is correct. Our guide had the step numbers wrong, not the portal.

---

## Batch 1: Am I the right member?

This batch fixes who the portal thinks you are, and the handful of things that are simply broken or missing. It is the batch we would like your approval on now.

1. **You saw:** every account shows a Restoration badge, even a free account with no payment, and before Day 19. **You will get:** membership comes from payment alone. The assessment will still recommend a tier, but recommending is all it does.
2. **You saw:** switching Preview As between Awareness and Foundation changes nothing. **You will get:** previews that apply the real limits for that tier.
3. **You saw:** Social Studio and Portal Studio stay visible while you preview as a member. **You will get:** admin studios hidden in member preview.
4. **You saw:** there is no way to preview a free member with no tier. **You will get:** a free member preview, so you can check locked screens without creating a second login.
5. **You saw:** the Symptom Log and the videos open before any payment. **You will get:** both following the corrected membership level.
6. **You saw:** roadmap lessons appear on your admin account only, and other users see nothing. **You will get:** the roadmap lessons published so real members can see them.
7. **You saw:** an empty roadmap that gives no explanation. **You will get:** a clear message when there is nothing to show, instead of a blank page that looks broken.
8. **You saw:** My Progress works on the admin account only. **You will get:** the same fix as item 6 resolves this.
9. **You saw:** the Member Content editor page is blank. **You will get:** a working page. One line of broken code stops it from loading at all.
10. **You saw:** the Weekly Notes editor page is blank. **You will get:** a working page. Same cause as item 9.
11. **You said:** the menu should read **My Guided Roadmap**, not Guided Pathways. **You will get:** the label changed.
12. **You said:** Deep Support Coaching is missing from the menu, and once the assessment is done there is no way back to the membership options. **You will get:** the link restored and the page reachable again.
13. **You said:** there is no Sign Out button. **You will get:** a labelled Sign Out item. See the correction above.
14. **You saw:** checkout and Manage Billing open in the same tab. **You will get:** both opening in a new tab.
15. **Not from your notes, but in this batch:** two pieces of behind-the-scenes work. We are making sure database changes are applied properly and identically everywhere, rather than by hand, and we are closing a gap where the portal's payment and coaching functions trusted whichever account they were told about instead of checking it was really you. Neither is visible on screen. Both need doing before real members and real card payments arrive.

---

## Batch 2: Does the money work?

This batch fixes your Stripe and email findings, including the journey email problem described above.

16. **You saw:** paying does not put you on the tier you selected, it shows Restoration. **You will get:** payment driving the tier. Your assessment can no longer overwrite it, and we are separately auditing the price setup, because a single mis-set price would produce exactly this.
17. **You saw:** some accounts show "no subscription" even though payment succeeded. **You will get:** subscription status recorded correctly.
18. **You saw:** the Account page never shows when the trial ends. **You will get:** the trial end date displayed.
19. **You saw:** the billing portal is empty and there is no way to change plan. **You will get:** plan changes enabled.
20. **You saw:** there is no cancel option in the billing portal. **You will get:** cancellation enabled.
21. **Not from your notes:** if you change plan inside Stripe today, the portal does not notice. **You will get:** a plan change in Stripe updating the tier in the portal.
22. **You saw:** the Day 18 and Day 21 emails never arrived. **You will get:** the portal sending those emails itself, on the right day, with no developer involved. See the explanation above.
23. **You saw:** Day 19 was not really an automatic upgrade, it had been showing Restoration all along. **You will get:** a real Day 19 unlock. Our recommendation is that Day 19 changes what a member can see and not what they are billed, but this is one of the four decisions below.
24. **Not from your notes:** the MailerLite group problem described above. **You will get:** clean group handling.
25. **You marked Skipped:** the `trial_started` and `tier_upgrade` email tests. **You will get:** both re-run for you once item 16 is done.
26. **Your observation:** the portal sends `day_11_mini_assessment` while the email waits for `day_11_mini_assessment_reminder`. **Explanation, no change needed:** these are two different emails on purpose. The reminder nudges someone who has not done their check-in. The other fires when they finish it. Nothing is misnamed. If you would also like a "we have got your check-in" email, say so and we will add it.

---

## Batch 3: Do my results make sense?

This is the batch only you can really judge, because it is about whether the portal's clinical reasoning matches yours.

27. **You saw:** you rated everything mild, between 7 and 10, and the patterns still came back medium to high. **You will get:** scoring corrected so mild ratings produce mild patterns.
28. **You saw:** the dashboard says your primary focus is metabolic while My Guided Roadmap starts with gut, and you pointed out the primary should not be metabolism when gut issues are present. **You will get:** one source of truth for both, following your rule that gut comes first when gut is driving the metabolic and hormonal picture.
29. **You saw:** the Pattern Library shows the same default cards on every account regardless of the assessment. **You will get:** cards built from that person's own results.
30. **You saw:** pattern cards appear even before an assessment has been completed. **You will get:** nothing shown until there are real results.
31. **You saw:** the "Where to go next" section on a pattern card disagrees with the roadmap order. **You will get:** it following the roadmap sequence.
32. **You saw:** a fresh account shows no assessment results on Start Here. **You will get:** Start Here reflecting the results and the journey day.
33. **You asked:** the baseline numbers should be reviewable after submitting, not hidden until the Day 11 check-in. **You will get:** a read-only summary of the baseline right after submit.
34. **You saw:** the pregnancies, deliveries and miscarriages fields accept negative numbers. **You will get:** zero or higher only.
35. **You said:** ask about current symptoms first and history second, and do not offer a current symptom again on the past symptoms list. **You will get:** the order swapped and the lists de-duplicated.
36. **You said:** the scale should read "1 = severe symptoms" and "10 = no symptoms". **You will get:** that wording.
37. **You asked:** the check-in view on My Progress should be visible before the mini assessments are completed. **You will get:** the check-in schedule shown from the start.
38. **Our error:** the step numbers in the test guide were off by one. **You will get:** a corrected guide.

---

## Batch 4: Can I run my content?

This batch is about your daily work: scripting videos and trusting the AI Coach.

39. **You saw:** the Script Generator offers the same pain points and false beliefs for every pillar instead of that pillar's own. **You will get:** your real pillar-specific pain points and false beliefs loaded in.
40. **You saw:** the hook types are wrong. **You will get:** your four hook types: Pattern Disruption, Hidden Driver, Misinterpretation, and Unexpected Connection.
41. **You saw:** a script saves, but there is no way to find it again. **You will get:** the ability to open and re-read a saved script from the video library.
42. **You saw:** only NS-01 has a script, action items and reflection fields. Every other lesson shows just a video placeholder. **You will get:** lessons that say so plainly when a script has not been written yet. The scripts themselves are yours to generate, and item 41 is what makes that practical.
43. **You asked:** scripts written as one flowing paragraph rather than split into labelled sections. **You will get:** a paragraph option, with the sectioned version still available.
44. **You saw:** the AI Coach counter shows 150 for every tier and does not reset. **You will get:** a counter that follows the real limit for the tier.
45. **You saw:** the Coach answered something other than what you asked, and told you that you had completed lessons you had not. **You will get:** a Coach that reads your actual progress and answers the question in front of it.
46. **You said:** long dashes need to be scrubbed from the whole site, because they read as AI written. **You will get:** them removed from Coach replies, lesson scripts and site copy, plus an automatic check so they cannot creep back in. This document was written to that rule, so you can see we took it seriously.
47. **You noted:** the strength card border is green, not blue, and you were not sure whether the colour mattered. **Explanation:** it does not. Nothing behind it is wrong. If you would prefer blue, say so and we will change it.

---

## What we are not doing yet, and why

- **Short comprehension check-ins between lessons.** You said there should be a quick check-in every couple of lessons to confirm the member understood the material, and that none are happening. You are right, and it is worth being straight with you: this was never built. The Day 11, Day 21 and semi-monthly check-ins exist, but lesson-level ones do not. This is new work rather than a repair, and we need a short brief from you before we can size it.
- **A single dashboard for all your deliverables, feeding into social scheduling.** You described wanting everything in one place rather than copying scripts out to manage elsewhere. We agree with the goal. It is a bigger piece of design than the rest of this list, so we would rather do item 41 first, get you unblocked, and then design this properly with you.
- **Going live on Stripe.** We are staying in test mode for these rounds, which is why you will keep seeing "test mode" on the billing screens. Switching to live payments is its own checklist and comes after the billing items above are proven.

---

## Four decisions we need from you

These are yours to make, not ours. Each one has our recommendation so you can simply confirm if you agree.

1. **What does the trial actually cost, and what happens after it?** Right now there are three different answers in three places. The code creates a genuine 21 day trial with no charge and then bills whichever tier the member selected. Your test guide lists Awareness at $19. One screen promises billing at $29 for Foundation. We need one story from you and we will make the code, the prices and the wording all match it.
2. **On Day 19, should Restoration unlock what a member can see, or also change what they are billed?** *Our recommendation: unlock what they can see only.* Changing someone's bill in the middle of a trial is hard to undo and easy to get wrong.
3. **The lesson check-ins.** How often should they appear, roughly how many questions, and what should happen when someone answers poorly?
4. **The script content source.** Can you confirm that `HWH_Pain_Points_False_Beliefs_Master-2` and your four hook types are the current, authoritative versions? You mentioned this may need an updated file, and we do not want to load the wrong content in.

---

## What happens next

1. You review this document. Anything we have described wrongly, or in a way you did not mean, tell us now rather than after it is built.
2. We send the sign-off sheet. You mark Approve, Change it, or Skip on each numbered item. **Only Batch 1 is needed to start.**
3. We build Batch 1, test every layer ourselves, and then hand you a short re-test list covering only the items above, not the whole workbook again.
4. You confirm Batch 1 is right, and only then do we start Batch 2.

If it is easier to talk than to write, a twenty minute call works well. We will fill the sheet in as we go and send it back for you to confirm.

One request on timing: if we can have Batch 1 approved within a couple of days, work can start straight away. Anything you have not commented on by then, we will build as described here, since Batch 1 contains no decisions that could go either way.
