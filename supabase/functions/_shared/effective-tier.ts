/**
 * Server-side copy of the effective tier rule.
 *
 * Must stay identical to src/lib/effective-tier.ts and to the effective_tier()
 * SQL function. Three copies exist because the rule is enforced in three
 * places, and they are only safe while they agree.
 *
 * Sheila's trial model, 25 July 2026: $19 for 21 days, Foundation on days
 * 1 to 18, Restoration on 19 to 21, then the tier being billed.
 */

export type Tier = "awareness" | "foundation" | "guided" | "restoration" | "integration";

export const TRIAL_UNLOCK_DAY = 19;

export function trialDayNumber(
  trialStartDate: string | null | undefined,
  now: Date = new Date()
): number | null {
  if (!trialStartDate) return null;
  const start = new Date(trialStartDate);
  if (Number.isNaN(start.getTime())) return null;

  const startUtc = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
  const nowUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const elapsed = Math.floor((nowUtc - startUtc) / 86_400_000);

  return elapsed < 0 ? null : elapsed + 1;
}

export function resolveEffectiveTier(subscriber: {
  tier?: string | null;
  payment_status?: string | null;
  trial_start_date?: string | null;
}, now: Date = new Date()): Tier | null {
  switch (subscriber.payment_status) {
    case "trial": {
      const day = trialDayNumber(subscriber.trial_start_date, now) ?? 1;
      return day >= TRIAL_UNLOCK_DAY ? "restoration" : "foundation";
    }
    case "active":
    case "past_due":
      return (subscriber.tier as Tier | null) ?? null;
    default:
      return null;
  }
}
