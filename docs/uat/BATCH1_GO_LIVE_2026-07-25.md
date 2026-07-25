# Batch 1 go-live, 25 July 2026

## What is live

| Layer | Status |
| --- | --- |
| Git `production` branch | Pushed through `98b8c5a` |
| Frontend | Deployed to https://instant-site-move.vercel.app |
| Database migrations | Applied through `20260725120500_publish_scripted_lessons` |
| Edge functions | `identify-patterns`, `ai-coach`, `create-checkout-session`, `create-portal-session`, `finalize-assessment`, `admin-analytics`, `clerk-webhook`, `stripe-webhook`, `audit-stripe-prices` |
| `CLERK_ISSUER` | Set on Supabase secrets |
| Stripe price secrets | All five match Sheila's approved amounts ($9 / $29 / $69 / $119 / $299), test mode, active |
| Unpaid accounts with a false tier | Cleared (0 remaining) |
| Published lessons members can see | 2 (NS-01, GL-01). No recordings uploaded yet; pages show the existing video placeholder |

## Retest pack for Sheila

1. Workbook: [`HWH_Portal_UAT_1a_Batch1-20260725.xlsx`](HWH_Portal_UAT_1a_Batch1-20260725.xlsx)
2. Rules of record: [`HWH_Business_Rules_Of_Record.md`](HWH_Business_Rules_Of_Record.md)
3. Create two accounts via Sign Up on the portal (Clerk):
   - **Fresh unassessed:** new email, do not complete the assessment until the mild-scoring row
   - **Non-admin member:** different email, complete a short assessment so the roadmap and membership link appear
4. Keep using the admin account for Preview As and Studio editor rows

## Still open (does not block UAT 1a)

- **`CLERK_WEBHOOK_SECRET`** is not set. Email sync and orphan cleanup on Clerk user delete will not run until a Clerk webhook is pointed at the `clerk-webhook` function and the signing secret is stored. Portal identity checks on the other functions already use `CLERK_ISSUER` and do not need it.
- **Checkout still creates a Stripe free trial**, not the $19 one-time charge. That is Batch 2. UAT 1a stops at the Stripe page without paying.
- **Most lessons remain unpublished** until they have a script or a recording. Members will see NS-01 and GL-01; empty sections show the new explanation instead of a blank page.

## How to prove the three deciding rows

1. Unpaid account: no Restoration badge
2. Fresh mild assessment (ratings 7–10): Awareness or Foundation recommendation, pattern labels low
3. Non-admin account: My Guided Roadmap shows NS-01 / GL-01
