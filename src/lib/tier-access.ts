/**
 * Tier access helpers — mirrors HWH tier gating specs.
 */

export const PAID_TIERS = [
  "awareness",
  "foundation",
  "guided",
  "restoration",
  "integration",
] as const;

export type PaidTier = (typeof PAID_TIERS)[number];

export function isPaidTier(tier: string | null | undefined): tier is PaidTier {
  return !!tier && PAID_TIERS.includes(tier as PaidTier);
}

/**
 * Symptom log requires an entitlement of $9 or above.
 *
 * Takes the effective tier, which already accounts for the trial, rather than
 * re-deriving trial state here. Previously this granted access whenever a trial
 * date existed, which made a free preview show paid content.
 */
export function canAccessSymptomLog(effectiveTier: string | null | undefined): boolean {
  return isPaidTier(effectiveTier);
}

export function tierDisplayName(tier: string | null | undefined): string {
  const labels: Record<string, string> = {
    awareness: "Root-Cause Pattern Awareness",
    foundation: "Foundation",
    guided: "Guided",
    restoration: "Restoration",
    integration: "Integration",
  };
  return tier ? labels[tier] ?? tier : "Free Account";
}
