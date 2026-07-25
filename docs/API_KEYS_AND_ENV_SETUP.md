# API Keys and Environment Setup

This project is configured to read environment variables from the parent folder (`../.env`) so secrets do not need to live in this repository.

## Local setup (safe pattern)

1. Copy `parent.env.example` to `../.env`.
2. Add real values only in `../.env`.
3. Keep real keys out of commits, PRs, and chat.

The Vite app now uses `envDir: ".."` in `vite.config.ts`, so frontend runtime variables can be loaded from parent-level env.

## Variable ownership by platform

Use this ownership model consistently:

- Frontend (`VITE_*`), read by React app:
  - `VITE_SUPABASE_PROJECT_ID`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
  - `VITE_SUPABASE_URL`
  - `VITE_CLERK_PUBLISHABLE_KEY`
  - `VITE_STRIPE_PUBLISHABLE_KEY`
  - `VITE_STRIPE_PRICE_ID_*`

- Server-side only (never in frontend bundles):
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `MAILERLITE_API_KEY`
  - `SYSTEME_IO_API_KEY`
  - `CLAUDE_API_KEY`

- Deployment/automation tokens:
  - `VERCEL_ACCESS_TOKEN`
  - `GITHUB_TOKEN`
  - `SUPABASE_ACCESS_TOKEN`

## Where each secret should be stored

- Local development:
  - `../.env` (outside repo) for convenience.

- Vercel:
  - Set frontend variables under project environment variables.
  - Only set server-side secrets if a Vercel server function needs them.

- Supabase Edge Functions:
  - Store server secrets with `supabase secrets set ...` or Supabase dashboard secrets.
  - Do not pass server secrets through client code.

- Clerk:
  - Keep publishable key in frontend env (`VITE_CLERK_PUBLISHABLE_KEY`).
  - Keep Clerk secret/admin keys only in server-side runtime where needed.

- Stripe:
  - Publishable key can be client-side.
  - Secret key and webhook secret must remain server-side only.

## Secrets required by the Batch 1 identity work

Two new Supabase Edge Function secrets. Portal functions fail closed without
them, returning 401, so set both before deploying the functions.

- `CLERK_ISSUER` — the Clerk Frontend API URL, for example
  `https://clerk.your-domain.com`. Used to fetch Clerk's JWKS and verify caller
  tokens in `supabase/functions/_shared/clerk-auth.ts`. Not a secret in the
  strict sense, but it must be set or RS256 tokens are refused rather than
  trusted.
- `CLERK_WEBHOOK_SECRET` — the signing secret of the Clerk webhook endpoint
  pointed at the `clerk-webhook` function. Subscribe that endpoint to
  `user.created`, `user.updated` and `user.deleted`.

`SUPABASE_JWT_SECRET` is already present in the Edge Function runtime and is
used to verify tokens minted through the Clerk "supabase" JWT template.

## Existing integrations currently in this branch

- Clerk frontend bootstrap: `src/main.tsx`
- Supabase client env usage: `src/integrations/supabase/client.ts`
- MailerLite edge function secret usage: `supabase/functions/mailerlite-subscribe/index.ts`
- Systeme edge function secret usage: `supabase/functions/systeme-subscribe/index.ts`

## Security hygiene checklist

- If any key is pasted in chat, docs, screenshots, or committed accidentally: rotate immediately.
- Use different test and live keys.
- Add least privilege and expiration where provider supports it.
- Re-check all dashboard secrets after every production incident.

## Agent policy (credentials)

Agents must **not** ask the user to paste API keys or tokens in chat.

Before claiming a task is blocked on missing credentials:

1. Read the project skill: [`.cursor/skills/hwh-credentials/SKILL.md`](../.cursor/skills/hwh-credentials/SKILL.md)
2. Run `source scripts/load-hwh-env.sh` then `hwh_env_check <VAR>`
3. For edge functions, check `npx supabase secrets list --project-ref joxwjoboqkcenmphbtpi` (names only — values are write-only)

**Dual-write:** whenever a secret is obtained or set for Supabase, also persist it with `bash scripts/upsert-hwh-env.sh KEY` (stdin value) into `/Users/venkat/work/hwh/.env`. Never Supabase-only.

If still missing, report the var name and file path only (`/Users/venkat/work/hwh/.env` or `instant-site-move/.env`).

## Agent policy (Lovable sync)

When syncing Sheila's Lovable edits from `main` → `production`:

1. Read [`.cursor/skills/lovable-sync/SKILL.md`](../.cursor/skills/lovable-sync/SKILL.md)
2. Run `bash scripts/lovable-delta.sh`
3. Follow [`docs/LOVABLE_SYNC.md`](LOVABLE_SYNC.md) — never ask Sheila to use git
