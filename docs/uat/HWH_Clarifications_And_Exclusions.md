<!-- AGENT INSTRUCTIONS
This document serves two purposes:

1. FOR SHEILA: Plain-language summary of what needs clarification before future phases, and what has been explicitly excluded from the build. No action needed right now — these are queued for when each phase approaches.

2. FOR DEVELOPMENT AGENTS: Technical reference for scope boundaries. When implementing any phase, check this document first. If a feature is listed under Exclusions, do not build it. If a question is listed under Clarifications, do not proceed with that feature until the answer is captured here.

When Sheila provides answers to clarification questions, update this document inline with her response and the date, then remove the item from the "pending" list.
-->

# HWH Portal — Clarifications Needed & Exclusions

This document tracks two things:
1. **Clarifications** — questions that need answers before certain phases can be built
2. **Exclusions** — features explicitly removed from scope or deferred

Nothing here blocks Phase 1. Phase 1 is fully specified and ready to build.

---

## Clarifications Needed

### Before Phase 2: Wellness Assessment

**Tier recommendation thresholds**

After a member completes the 13-step Wellness Assessment, the portal recommends a specific membership tier based on two factors (whichever is higher):
- Roadmap complexity — how many sub-categories are in their personalized pathway
- Baseline symptom severity — how low their Day 1 ratings are (scale of 1-10 across 23 items)

A higher reading on either factor pushes the recommendation toward a higher tier (Guided at $69, Restoration at $119, or Integration at $299).

The development team will propose specific numeric thresholds (e.g., "5+ sub-categories or average baseline below 4 recommends Restoration") for Sheila to review and approve.

> **Status:** Pending — dev team proposes after Phase 2 schema is drafted
>
> **Sheila's answer:** _(not yet provided)_

---

### Before Phase 3: My Guided Roadmap

**Member Content and Weekly Coaching Notes — how does Sheila create them?**

Sheila defined these content types:
- **Member Content:** Blog-style articles with tips, separate from roadmap lesson videos
- **Weekly Coaching Notes:** Short, positive motivational written notes published weekly

The question is: how does Sheila write and publish these?

Options:
- A simple text editor built into the portal (write, format, save, publish — all in one place)
- Write in another tool (Google Docs, Word, etc.) and paste into the portal
- Some other workflow

> **Status:** Pending — ask Sheila before Phase 3 begins
>
> **Sheila's answer:** _(not yet provided)_

---

### Before Phase 5: Trial & Billing

**Priority Support messaging — what does "direct message" mean?**

Sheila defined message allowances for higher tiers:
- Restoration ($119/mo): 12 direct messages to Sheila per month + 1 free 15-minute Calendly call
- Integration ($299/mo): 20 direct messages to Sheila per month + 2 free 15-minute Calendly calls

The question is: what does the messaging look like?

Options:
- **In-portal inbox** — a simple message thread inside the portal where Sheila and the member exchange messages (like a basic chat)
- **Email-based** — the portal sends messages to Sheila's email and tracks the count, but the actual conversation happens over email
- **External tool** — Voxer, WhatsApp, or another messaging platform (portal just tracks the count)

This determines whether a messaging UI needs to be built or not.

> **Status:** Pending — ask Sheila before Phase 5 begins
>
> **Sheila's answer:** _(not yet provided)_

**Calendly repeat bookings**

Sheila's existing Calendly link (for strategy sessions) was set up as a one-time introductory call. Before Priority Support goes live, confirm whether this same link works for repeat monthly bookings by the same member, or whether Sheila needs to create a new recurring-call event type in Calendly.

> **Status:** Pending — Sheila to verify in Calendly before Phase 5 launch
>
> **Sheila's answer:** _(not yet provided)_

---

## Exclusions (Explicitly Not Being Built)

### Permanently excluded from current scope

| Feature | Reason | Source |
|---------|--------|--------|
| Lesson-level comments or Q&A | Sheila decided against it at all tiers | Completed Review, Gap 2 |
| Batch video upload | Sheila uploads one video at a time per slot; no multi-file upload | Completed Review, Decision 3 |
| Content Calendar for Portal workspace | Calendar is a social-media-only concept; does not apply to portal lesson videos | Completed Review, Decision 1 |
| Campaigns for Portal workspace | Campaigns are social-media-only; do not apply to portal lesson videos | Completed Review, Decision 1 |
| Standalone pricing/tier page | No direct pricing entry point exists; tier selection only appears after assessment via recommendation | Completed Review, Step 5 |
| Pay-before-assessment path | Every member must complete the 13-step assessment before any payment option appears | Completed Review, Step 5 |
| Assessment reminder emails for free accounts | Free account holders receive zero emails of any kind | Completed Review, Step 8 |

### Deferred (will be revisited later)

| Feature | Reason | When to revisit |
|---------|--------|-----------------|
| Community access (all tiers) | Sheila is deciding between Skool, built-in portal forum, or other options | After Phase 6, when Sheila is ready |
| "Publish to Portal" on social Content Library | No longer needed after workspace split; social content stays social | Clean up dead code when PortalContent.tsx is rewritten in Phase 3 |
| `portal_published` / `content_lane='member'` columns on `content_pieces` | Dead code after workspace split; leave in place, non-breaking | Clean up in Phase 3 when PortalContent reads from `portal_videos` instead |
| HeyGen video generation | Not in current scope | Future |
| Admin panel routes (currently unregistered in App.tsx) | Admin pages exist but are not routable | Wire when admin features are needed |
| DNS cutover (herwellnessharmony.com to portal) | Waiting until full build and UAT are complete | After all phases |

---

## Tier Feature Matrix (Updated per Sheila's Review)

For reference — this is the confirmed tier structure after all changes:

| Feature | Free | $9 | $29 | $69 | $119 | $299 |
|---------|------|-----|------|------|-------|-------|
| Start Here page | Yes | Yes | Yes | Yes | Yes | Yes |
| Wellness Assessment | Yes | Yes | Yes | Yes | Yes | Yes |
| View personalized roadmap | -- | View only | Full | Full | Full | Full |
| Sequential lesson access | -- | Self-guided | Full | Full | Full guided | Full guided |
| Symptom tracking (free-form log) | -- | Yes | Yes | Yes | Yes | Yes |
| Action item tracking | -- | -- | Yes | Yes | Yes | Yes |
| Progress Reflection Check-Ins | -- | -- | Yes | Yes | Yes | Yes |
| Weekly Coaching Notes | -- | -- | Yes | Yes | Yes | Yes |
| Member Content (articles) | -- | -- | Yes | Yes | Yes | Yes |
| Pattern Library | -- | Yes | Yes | Yes | Yes | Yes |
| AI Coaching Assistant (monthly limit) | -- | 10 | 35 | 100 | 150 | Unlimited |
| Priority Support messages/mo | -- | -- | -- | -- | 12 | 20 |
| Calendly strategy calls/mo | -- | -- | -- | -- | 1 | 2 |
| Community | Deferred | Deferred | Deferred | Deferred | Deferred | Deferred |

---

## Implementation Readiness

| Phase | Ready to build? | Blocker |
|-------|-----------------|---------|
| **Phase 1: Portal Video Library** | **YES — fully specified** | None |
| Phase 2: Wellness Assessment | Mostly — tier recommendation thresholds need proposing | Dev proposes, Sheila approves |
| Phase 3: My Guided Roadmap | Partially — content authoring workflow TBD | Ask Sheila about authoring tool |
| Phase 4: Mini Assessments | Yes — unchanged from original spec | None |
| Phase 5: Trial & Billing | Partially — Priority Support messaging TBD, Calendly TBD | Ask Sheila about messaging mechanism; verify Calendly |
| Phase 6: MailerLite | Yes — scope is clear (paid members only) | None |
