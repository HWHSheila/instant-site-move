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

/** Symptom log requires $9+ tier or active trial. */
export function canAccessSymptomLog(
  tier: string | null | undefined,
  paymentStatus: string | null | undefined,
  trialStartDate: string | null | undefined
): boolean {
  if (isPaidTier(tier)) return true;
  if (paymentStatus === "trial" || paymentStatus === "active") return true;
  return !!trialStartDate;
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
