/**
 * Effective tier resolution.
 *
 * `subscribers.tier` means one thing only: the tier the member pays for. It is
 * written by billing and by nothing else. What a member may actually see is
 * derived here, because during the trial it is not the same as what they pay for.
 *
 * Sheila's confirmed trial model, 25 July 2026:
 *   one-time $19 covering 21 days
 *   days 1 to 18   Foundation access
 *   days 19 to 21  Restoration access
 *   day 22 onward  the tier they are billed for, defaulting to Foundation
 *
 * A tier chosen during the trial does not grant access before day 22. That
 * choice is held separately as the pending tier and applied when billing starts.
 */

export type Tier =
  | "awareness"
  | "foundation"
  | "guided"
  | "restoration"
  | "integration";

export const TIER_RANK: Record<Tier, number> = {
  awareness: 1,
  foundation: 2,
  guided: 3,
  restoration: 4,
  integration: 5,
};

export const TRIAL_BASE_TIER: Tier = "foundation";
export const TRIAL_UNLOCK_TIER: Tier = "restoration";
export const TRIAL_UNLOCK_DAY = 19;
export const TRIAL_LENGTH_DAYS = 21;

export interface EffectiveTierInput {
  tier: string | null | undefined;
  paymentStatus: string | null | undefined;
  trialStartDate: string | null | undefined;
  /** Overrides the date-derived day when a journey day is already known. */
  dayNumber?: number | null;
  now?: Date;
}

/**
 * Day 1 is the day the trial started. Derived from the start date rather than
 * the journey counter so access stays correct even if the daily job has not run.
 */
export function trialDayNumber(
  trialStartDate: string | null | undefined,
  now: Date = new Date()
): number | null {
  if (!trialStartDate) return null;
  const start = new Date(trialStartDate);
  if (Number.isNaN(start.getTime())) return null;

  const startUtc = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
  const nowUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const elapsedDays = Math.floor((nowUtc - startUtc) / 86_400_000);

  return elapsedDays < 0 ? null : elapsedDays + 1;
}

/**
 * Returns the tier whose content the member may see, or null for a free
 * account with no entitlement. Null means free, never "unknown".
 */
export function resolveEffectiveTier(input: EffectiveTierInput): Tier | null {
  const { tier, paymentStatus, trialStartDate, dayNumber, now } = input;
  const paid = isTier(tier) ? tier : null;

  switch (paymentStatus) {
    case "trial": {
      const day = dayNumber ?? trialDayNumber(trialStartDate, now) ?? 1;
      return day >= TRIAL_UNLOCK_DAY ? TRIAL_UNLOCK_TIER : TRIAL_BASE_TIER;
    }
    case "active":
    case "past_due":
      // past_due keeps access until billing actually cancels the subscription
      return paid;
    case "cancelled":
      return null;
    default:
      return null;
  }
}

export function isTier(value: string | null | undefined): value is Tier {
  return !!value && value in TIER_RANK;
}

/** True when `tier` is at or above `required`. A null tier is free and never qualifies. */
export function tierMeets(tier: Tier | null, required: Tier): boolean {
  if (!tier) return false;
  return TIER_RANK[tier] >= TIER_RANK[required];
}
