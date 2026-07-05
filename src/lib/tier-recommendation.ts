/**
 * Tier recommendation after assessment.
 * Dev-proposed thresholds — Sheila approves async (see HWH_Clarifications doc).
 */

export type RecommendedTier =
  | "awareness"
  | "foundation"
  | "guided"
  | "restoration"
  | "integration";

export interface TierRecommendation {
  recommended_tier: RecommendedTier;
  tier_reasoning: string;
  subcategory_count: number;
  average_baseline: number;
}

export function recommendTier(
  subcategoryCount: number,
  baselineRatings: Record<string, number>
): TierRecommendation {
  const values = Object.values(baselineRatings).filter((v) => typeof v === "number");
  const average_baseline =
    values.length > 0
      ? values.reduce((sum, v) => sum + v, 0) / values.length
      : 5;

  let recommended_tier: RecommendedTier = "foundation";
  let tier_reasoning: string;

  if (subcategoryCount >= 8 || average_baseline < 3) {
    recommended_tier = "integration";
    tier_reasoning =
      `Your roadmap spans ${subcategoryCount} focus areas and your baseline ratings suggest significant symptom burden ` +
      `(average ${average_baseline.toFixed(1)}/10, where lower means more severe). ` +
      `Integration tier provides the deepest personalization and highest-touch support for a pathway this comprehensive.`;
  } else if (subcategoryCount >= 5 || average_baseline < 4) {
    recommended_tier = "restoration";
    tier_reasoning =
      `With ${subcategoryCount} focus areas and baseline ratings averaging ${average_baseline.toFixed(1)}/10, ` +
      `Restoration tier offers full guided sequencing and adaptive check-ins suited to your roadmap complexity.`;
  } else if (subcategoryCount >= 3 || average_baseline < 6) {
    recommended_tier = "guided";
    tier_reasoning =
      `Your roadmap includes ${subcategoryCount} focus areas with moderate symptom patterns ` +
      `(baseline average ${average_baseline.toFixed(1)}/10). Guided tier adds practical direction and AI coaching support.`;
  } else if (subcategoryCount <= 2 && average_baseline >= 7) {
    recommended_tier = "awareness";
    tier_reasoning =
      `Your patterns are relatively focused (${subcategoryCount} areas) with milder baseline ratings ` +
      `(average ${average_baseline.toFixed(1)}/10). Pattern Awareness tier lets you observe and track at your own pace.`;
  } else {
    recommended_tier = "foundation";
    tier_reasoning =
      `Your roadmap includes ${subcategoryCount} focus areas with baseline ratings averaging ${average_baseline.toFixed(1)}/10. ` +
      `Foundation tier provides core educational modules, action item tracking, and weekly coaching notes.`;
  }

  return {
    recommended_tier,
    tier_reasoning,
    subcategory_count: subcategoryCount,
    average_baseline,
  };
}
