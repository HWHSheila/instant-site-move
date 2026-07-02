---
name: hwh-context
description: >-
  Context and guard rails for the Her Wellness Harmony portal codebase
  (instant-site-move). Use when working on any task in this repository —
  writing code, fixing bugs, running migrations, committing, or deploying.
  Prevents breaking auth, RLS, git identity, or known-safe patterns.
---

# HWH Portal — Agent Context

## Stack

React/Vite + Clerk auth + Supabase (Postgres, Edge Functions, Storage) +
Vercel hosting + Stripe billing.

Live URL: `instant-site-move.vercel.app`
DNS (`herwellnessharmony.com`) not yet pointed at Vercel — all testing uses the Vercel URL.
Supabase project: `joxwjoboqkcenmphbtpi`
Clerk domain: `sunny-opossum-53.clerk.accounts.dev`

## Guard rails — never break these

- **Git identity**: always set before committing:
  `git config user.email "support@herwellnessharmony.com"`
  `git config user.name "HWH Support"`
- **No personal names** in committed files or git history
- **Supabase client**: all portal pages must use `useSupabase()` from
  `src/hooks/use-supabase.ts` — never the static anon client from
  `src/integrations/supabase/client.ts`
- **`studio_full_access` RLS policy**: already dropped — do not recreate it
- **Clerk–Supabase bridge**: do NOT delete the Clerk third-party auth
  connection in Supabase (domain: `sunny-opossum-53.clerk.accounts.dev`)
- **Admin check**: `PortalLayout` queries `admin_users` to hide Content Studio
  from non-admins — do not remove this logic
- **New portal pages** that display tier-gated content must consume
  `usePreviewTier()` from `src/components/portal/PortalLayout.tsx`

## What is live (as of 2026-07-01)

- Content Studio (Script Generator, Content Library, Content Calendar) —
  admin-only, Clerk-JWT auth-gated, all writes set `user_id`
- Member Content page — shows portal-published `content_pieces`
- RLS on all tables — `studio_full_access` dropped, user-scoped policies active
- Admin account: `support@herwellnessharmony.com` registered in `admin_users`
- Clerk ↔ Supabase third-party auth connected via JWKS
- `use-supabase.ts` JWT fallback: tries template `"supabase"`, falls back to
  raw session token (compatible with both old and new Clerk integration)
- Preview As tier picker in sidebar (admin only) — UI works, content filter
  has a known bug (BACKLOG UX-1, needs ARCH-1 decision first)
- Stripe webhook and all edge functions deployed

## Full backlog

Read [docs/BACKLOG.md](docs/BACKLOG.md) for all pending items, open
decisions (ARCH-1, CONTENT-1), and Sheila UAT feedback status.
