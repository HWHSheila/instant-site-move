# HWH Portal — Development Backlog

Last updated: 2026-07-01

---

## Architecture snapshot

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, TypeScript, Tailwind, shadcn/ui |
| Auth | Clerk (`sunny-opossum-53.clerk.accounts.dev`) |
| Database | Supabase Postgres (`joxwjoboqkcenmphbtpi`) |
| Edge functions | Supabase Edge Functions (Deno) |
| Storage | Supabase Storage (`content-videos` bucket) |
| Hosting | Vercel (deploys from `main` branch) |
| Billing | Stripe (webhooks → `stripe-webhook` edge function) |

Live URL: `instant-site-move.vercel.app`
DNS (`herwellnessharmony.com`) not yet pointed at Vercel.

Admin account: `support@herwellnessharmony.com` — the only row in `admin_users`.

---

## Key architectural decisions already made

- **Auth**: Clerk handles all login/signup. Supabase never manages users directly.
  Supabase third-party auth is configured to verify Clerk JWTs via JWKS.
- **Supabase client**: portal pages use `useSupabase()` from `src/hooks/use-supabase.ts`
  which attaches the Clerk JWT. Public (non-portal) pages use the static anon client.
- **Content Studio**: admin-only (UI-gated via `admin_users` table check in `PortalLayout`).
  All writes stamp `user_id` with the Clerk user ID.
- **RLS**: all tables have RLS enabled with user-scoped or admin-bypass policies.
  `studio_full_access` was dropped on 2026-07-01 after backfilling `user_id`.
- **Preview As**: `PreviewTierContext` in `PortalLayout` — admin can select a tier
  to preview what that member tier sees. All new tier-gated pages must consume
  `usePreviewTier()` from `src/components/portal/PortalLayout.tsx`.

---

## What is live and working

- [x] Content Studio — Script Generator, Content Library, Content Calendar
- [x] Member Content portal page
- [x] RLS on all 10 tables (subscribers, intake_responses, pattern_maps,
      subscriber_progress, content_items, content_drafts, admin_users,
      campaigns, calendar_entries, content_pieces)
- [x] Clerk → Supabase JWT bridge (third-party auth + JWKS fallback in hook)
- [x] Stripe webhook (`stripe-webhook` edge function, all 4 events)
- [x] Preview As tier picker in sidebar (admin only)
- [x] Intake form routes (`/portal/intake`, `/portal/results`)
- [x] Portal schema tables (subscribers, intake_responses, pattern_maps, etc.)

---

## Backlog items

### SEC — Security

- **SEC-3** *(ready to do)*: Verify `calendar_entries` delete policy is also tightened.
  `calendar_full_access` was dropped — confirm user-scoped delete policy exists.

### UX — User Experience

- **UX-1** *(blocked by ARCH-1)*: Preview As tier filter is broken.
  `PortalContent.tsx` `matchesTier` check compares `item.content_lane` against
  tier names — `content_lane` is always `"member"`, so any non-admin preview
  shows an empty list. Fix: use a proper tier field once ARCH-1 is decided.

### ARCH — Architecture decisions

- **ARCH-1** *(open decision — needed before UX-1)*: Two content tables exist:
  - `content_pieces` — Sheila's studio output, no tier field, used by `PortalContent`
  - `content_items` — curated content with `tier_access text[]` + tier RLS, not yet used in frontend

  **Option A** (simpler): Add `tier_access text[]` column to `content_pieces`,
  update RLS + `PortalContent` filter to use it. Sheila sets tier when publishing.

  **Option B** (cleaner): Publish flow copies approved pieces into `content_items`
  with a tier assignment. `PortalContent` reads `content_items` instead.

  Recommendation: Option A. Sheila works in one table, tier gating is a field.

### CONTENT — Content creation UX

- **CONTENT-1** *(after Step 1 feedback)*: Free-form script input path.
  Sheila uses Claude/Cursor to draft scripts outside the portal and wants
  to paste them in without going through the 6-step wizard.
  Options: (a) plain text input + direct save, (b) free-text prompt box
  sent to `generate-script` edge function, (c) both as tabs alongside wizard.

### STEP — UAT-gated features

- **STEP-2** *(gated on Step 1 feedback)*: Intake form + pattern map UAT.
  Routes exist (`/portal/intake`, `/portal/results`), DB tables exist,
  Claude API key set in Supabase secrets. Ready to test once Step 1 passes.

- **STEP-3** *(gated on Step 2 feedback)*: Stripe trial + tier upgrade UAT.
  Create `support+test@herwellnessharmony.com` Clerk account for checkout test.
  All price IDs and webhook are already configured.

- **STEP-4** *(planned)*: Tier-gated content. Wire `journey-content` edge function
  so Pattern Library and Pathways serve real, personalized, tier-locked content.
  Requires ARCH-1 resolved first.

### FUTURE — Post-UAT features

- HeyGen AI video generation (edge function scaffolded, not wired)
- Email automation (MailerLite integration exists for public pages, not portal)
- Admin panel (routes under `/admin/`, pages exist, not linked from nav)
- Campaigns (table + UI exist, not fully wired)
- Weekly Notes / Community / AI Coach (pages exist, no backend)
- DNS cutover: point `herwellnessharmony.com` to Vercel

---

## Sheila UAT feedback slots

| Step | Status | Date sent | Feedback received |
|---|---|---|---|
| Step 1 — Content Studio | Sent | 2026-07-01 | Pending |
| Step 2 — Intake + Pattern Map | Not sent | — | — |
| Step 3 — Stripe checkout | Not sent | — | — |

**Gate rule**: do not send Step N+1 guide until Step N feedback is received and all blockers resolved.

---

## Known non-issues — do not fix these

- `pillars`, `pain_points`, `gallup_strengths`, `false_beliefs` are **not DB tables**.
  They are hardcoded arrays in the React frontend. The `ALTER TABLE` lines for
  these in `sql/rls_policies.sql` fail silently — that is expected and fine.
- `calendar_entries` table exists but is **unused in the frontend**.
  `ContentCalendar.tsx` reads from `content_pieces.scheduled_date` directly.
- `herwellnessharmony.com` DNS is **not yet pointed at Vercel**. All testing
  uses `instant-site-move.vercel.app`. Do not change DNS until UAT is complete.
- `content_weeks` table may or may not exist — not used by any frontend page.

---

## Git rules

```bash
git config user.email "support@herwellnessharmony.com"
git config user.name "HWH Support"
```

Always set before committing. No personal names in any committed file.
Push to `origin main` → Vercel auto-deploys.
Remote: `https://github.com/HWHSheila/instant-site-move.git`
