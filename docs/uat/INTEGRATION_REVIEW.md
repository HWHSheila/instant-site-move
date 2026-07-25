# Integration Review, 25 July 2026

Purpose: everything verified by reading the source during the Sheila UAT remediation, recorded so no future session pays to rediscover it. Every claim below carries a file and line reference. Where a claim contradicts another document in this repo, that is called out in section 8.

Method: direct code reading on 25 July 2026, against the working tree at that date. No claim here is inferred from the UI or from another document.

---

## 1. Four things write `subscribers.tier`, and none of them means "what you paid for"

This is the root cause behind the largest cluster of Sheila's failures. The column that the badge, the tier gates and the RLS content policy all read is written by four unrelated code paths.

- **The assessment.** `supabase/functions/identify-patterns/index.ts` lines 223 to 230 write Claude's `recommended_tier` directly into `subscribers.tier`. Lines 121 to 124 do the same with a hardcoded `"awareness"` when `CLAUDE_API_KEY` is missing. Re-running an assessment can therefore overwrite a real paid tier.
- **The Stripe webhook.** `supabase/functions/stripe-webhook/index.ts` lines 76 to 97 write `subscription.metadata.tier`, which originates from the tier the user clicked at checkout. Lines 141 to 150 update it on `customer.subscription.updated`, but only when metadata carries a tier. There is no reverse map from Stripe price ID to tier, so a plan change made inside Stripe never reaches the portal.
- **The day simulator.** `scripts/simulate-day.sh` lines 288 to 298 hardcode `tier: restoration` for any account advanced to day 19 or later whose tier is awareness, foundation, guided or empty. This is almost certainly what put the Restoration badge on Sheila's test accounts, since the script was run to exercise her Phase 5 rows.
- **Manual admin override.** `src/pages/portal/AdminSubscribers.tsx`.

What does *not* set it: row creation. `src/hooks/use-subscriber.ts` lines 86 to 94 insert with `payment_status: "none"` and no tier at all. The schema at `sql/portal_schema.sql` lines 8 to 15 declares `tier TEXT` nullable with **no default**, and `payment_status TEXT DEFAULT 'none'`. There is no hardcoded Restoration anywhere in the checkout path, contrary to an early hypothesis.

**Implication for any fix:** a null tier must be treated as free rather than as an empty result, because `content_items_select_tiered` reads this column.

## 2. There are two tier recommenders and they disagree

Sheila reported that mild answers produced an Integration recommendation. Both halves of that are explained here, and they are two separate engines.

- **Deterministic, client side.** `src/lib/tier-recommendation.ts` lines 33 to 55 run during intake and write `member_roadmaps.recommended_tier`. The first branch is `if (subcategoryCount >= 8 || average_baseline < 3)` returning `integration`. Because that is an OR, selecting eight symptom subcategories returns Integration even when every severity rating is mild. On this scale 1 is severe and 10 is none, so mild answers of 7 to 10 never trip the `average_baseline < 3` half. Breadth alone decides.
- **LLM, server side.** `identify-patterns` asks Claude to pick a tier using prose rules in `SYSTEM_PROMPT` lines 23 to 28. There is no deterministic scoring in that function. `fallbackResult()` lines 54 to 67 returns `awareness` when the API key is missing, the call throws, or JSON parsing fails, and lines 176 to 185 coerce any tier outside the valid five to `awareness`. Nothing prevents Claude returning `integration` for a mild presentation.

So the recommendation shown to the member and the tier written to the badge come from different engines with different logic, which is exactly what Sheila observed when she said the recommended tier and the assigned tier never matched.

## 3. The trial in code is not the trial in the business model

**What the code does.** `supabase/functions/create-checkout-session/index.ts` lines 80 to 91 create a Stripe subscription with `trial_period_days: 21` and no upfront charge, no setup fee and no `add_invoice_items`. The tier the member selected is written to `subscribers.tier` immediately and applies during the trial.

**What the business model is**, confirmed by Sheila on 25 July: a one time $19 charge covering 21 days, Foundation access for days 1 to 18, Restoration access for days 19 to 21, then automatic billing at $29 Foundation unless the member changes tier. There is no free trial option. A tier selected during the trial does **not** grant access before day 22. Monthly prices are Awareness $9, Foundation $29, Guided $69, Restoration $119, Integration $299.

**What this forces.** If a selection must not take effect until day 22, it cannot live in `subscribers.tier`. A separate `pending_tier` is required, otherwise implementing the access rule discards the member's choice.

**Note:** the results page copy already matches the business model. `src/pages/portal/PortalResults.tsx` line 302 offers "Start Your 21-Day Trial, $19" and lines 345 to 348 promise $29 Foundation afterwards. The copy was built to Sheila's spec; the Stripe integration was built to a different one. The button labelled "Start Free Trial" is the copy that is wrong, not the $19 charge.

**Webhook coverage.** Handled: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`. Not handled: `invoice.paid`, `customer.subscription.trial_will_end`. There is no trial-end tier transition anywhere.

**Day 19 unlock.** Exists only in `scripts/simulate-day.sh`. `supabase/functions/advance-journey-day/index.ts` lines 62 to 68 advance `subscriber_progress.day_number` and nothing else. The production day 19 unlock does not exist.

## 4. MailerLite: the portal fires events, MailerLite sends the mail

This distinction was miscommunicated to Sheila once and is worth stating precisely.

`supabase/functions/fire-mailerlite-trigger/index.ts` posts to `https://connect.mailerlite.com/api/subscribers`, upserting the subscriber and setting a custom field `last_trigger` to the trigger name, then optionally adding them to a group. It never sends email content. Its own header comment says Sheila builds the content in MailerLite. `docs/mailerlite/DELIVERY_INVENTORY.md` states it plainly: emails send only if MailerLite has an automation watching `last_trigger` or group entry, and the portal does not send MIME.

**The numbers, reconciled.** Four different counts are all correct about different things:

- **26** is Sheila's locked v2 business spec, `designdoc/HWH_MailerLite_Trigger_Sequence_v2.md`, one automation per trigger.
- **29** is the engineering catalog, `docs/mailerlite/triggers-v2.json`, which is her 26 plus three assessment-submit events.
- **24** is the implementable subset, 29 minus 5 marked deferred product, splitting into 12 wired Phase A triggers and 12 Phase B reminder automations.
- **12** is the Phase B reminder and hook batch built through the browser agent. It is a subset, not a competing total.

**Which triggers actually fire in production.** Billing triggers fire from `stripe-webhook`. The ten reminder and inactivity triggers fire from `supabase/functions/mailerlite-scheduled-triggers/index.ts` on cron. Assessment submits fire from `src/pages/portal/PortalMiniAssessment.tsx`, and phase completion from `src/hooks/use-member-roadmap.ts`. **The four journey triggers `day_18_restoration_preview`, `day_19_restoration_unlocked`, `day_21_billing_reminder` and `auto_billing_confirmed` fire only from `scripts/simulate-day.sh`.** A real member reaches day 18 and nothing happens. This is the gap Sheila could not have found, because her Phase 5 rows only produced email when the script was run against her account.

**Groups.** Chosen in `fire-mailerlite-trigger` in priority order cancelled, then trial, then tier, then free. Trial outranks tier, which is **correct** under Sheila's model since all trial members are Foundation. The real defect is that group assignment is add-only: there is no removal call anywhere in either repo, so a member who changes tier accumulates conflicting groups. Groups are looked up by name at runtime, no IDs are hardcoded. The eight names are HWH Free Members, HWH Trial Members, HWH Tier 1 through Tier 5 Members, and HWH Cancelled Members.

## 5. Why only the admin account could see lessons

RLS policy `member_read_published_videos` limits members to rows with `production_status = 'published'`. The catalog seeds default to `not_started`. Non-admin accounts therefore receive zero rows, and `PortalPathways` renders an empty roadmap with no error and no explanation. Admins bypass the policy, which is why the problem looked like an admin versus member difference rather than a data state.

## 6. Frontend defects with confirmed root cause

- **Blank studio editors.** `src/pages/portal/studio/MemberContentEditor.tsx` line 41 calls `useSupabase()` with no import in the block at lines 1 to 29. It throws `ReferenceError` on mount. The correct import is in the sibling `ScriptGenerator.tsx` line 18. One component serves both `/portal/studio/member-content` and `/portal/studio/weekly-notes`, so both pages fail together.
- **No error boundary anywhere in `src/**`.** Portal routes are wrapped only in `ProtectedRoute`. Any render throw white-screens the outlet, which is why the above presented as a blank page rather than an error.
- **Sign out is unreachable by label.** `src/components/portal/PortalLayout.tsx` lines 217 to 222 render `<UserButton afterSignOutUrl="/" />` followed by a sibling `<span>Account</span>`. The label sits outside the clickable trigger. Mobile repeats it at lines 267 to 272. No labelled Sign Out item exists anywhere in the portal.
- **Preview As is cosmetic on most pages.** `previewTier` is plain `useState` at line 104, not persisted. Only six pages consume it, each repeating `isAdmin && previewTier !== "admin" ? previewTier : subscriber?.tier`. Studio nav visibility keys off `isAdmin` alone at line 122, so studios stay visible while previewing as a member. `PortalAICoaching` gates on the preview tier but passes the real tier to `useAiCoachUsage`, which is why the coach counter ignored the preview.
- **Stripe flows replace the tab.** Both `PortalUpgrade.tsx` and `PortalAccount.tsx` use `window.location.href`.
- **The membership page is orphaned.** `/portal/coaching` renders `PortalUpgrade` and is registered in `App.tsx` line 173, but absent from the sidebar nav array.
- **"Guided Pathways"** appears nine times across four files, including eight copy strings in `PortalPatternDetail.tsx`.

## 7. Integrity gaps, none visible in the UI

- **Edge functions accept a Clerk JWT and then ignore it.** `ai-coach`, `create-checkout-session`, `create-portal-session`, `identify-patterns` and `finalize-assessment` act as service role on whatever `subscriber_id` the caller supplies. The JWT `sub` is never bound to the subscriber row. `admin-analytics` has no admin check. `verify_jwt` is disabled on some functions.
- **Clerk lifecycle is one way.** Email is copied once at row creation and never re-synced. There are no `user.updated` or `user.deleted` webhooks, so a deleted Clerk user orphans a subscriber row.
- **Core tables are not under migration control.** `subscribers`, `intake_responses`, `pattern_maps` and `subscriber_progress` come from `sql/portal_schema.sql` with policies in `sql/rls_policies.sql`, applied by hand. Production cannot be proven to match the repo. `subscriber_progress` also lacks the unique constraint on `subscriber_id` that its own upserts depend on.

## 8. Documents in this repo that are currently wrong

Correct these when touching the relevant area, and do not trust them in the meantime.

- `docs/mailerlite/DELIVERY_INVENTORY.md` names `advance-journey-day` as the fire site for the day 18, 19 and 21 triggers. That function only logs. The triggers fire from `scripts/simulate-day.sh`.
- `docs/mailerlite/E2E_AUTOMATION_TRACKER.md` records one automation verified and eleven todo. Twelve Phase B automations were subsequently built through the browser agent, and the tracker was never updated. Neither the tracker nor `docs/uat/UAT_SHEILA_ACK_2026-07-25.md` should be trusted for what is live in MailerLite. Settle it with a read-only API inventory.
- `docs/uat/UAT_SHEILA_ACK_2026-07-25.md` says the portal will send the journey emails itself. It will not, and must not. The correct statement is that the portal fails to fire triggers MailerLite is already waiting on. That document also describes work as being run by "a developer". There is no developer. Everything in this repo was built by the agent, and the wording should own that.
- `docs/BACKLOG.md` and `docs/MAILERLITE.md` carry the same day 18 / 19 / 21 wiring claim.

## 9. Sheila's UAT 1 results, as scored

From `designdoc/HWH_Portal_UAT_Test_Workbook-20260725.xlsx`, six tabs, 164 scored rows.

- Pass 95, Fail 38, Partial 23, Skipped 8
- 61 non-passing rows are the real backlog
- Batch 1 closes about 29 of them, split roughly 1 in Phase 1, 7 in Phase 2, 17 in Phase 3 and 4 in Phase 5
- Two of her rows need explanation rather than code: the green versus blue strength card border, and the `day_11_mini_assessment` submit event versus the `day_11_mini_assessment_reminder` automation, which are two intentional events rather than a naming error
- Her step numbering complaint is correct. Our test guide was off by one; Symptom Inventory is step 6

Verification of any fix is per layer and never inferred from the screen: SQL proving no unpaid subscriber holds a tier, production RLS matching the repo, a non-zero published lesson count for a member role, a fresh Clerk sign-up creating exactly one subscriber row, each Stripe price mapping to its intended tier, and `last_trigger` plus group correct in MailerLite after each fire.
