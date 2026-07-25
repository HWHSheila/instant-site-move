/**
 * Tier recommendation after assessment.
 *
 * Numbers approved by Sheila 25 July 2026 in
 * docs/uat/HWH_Scoring_Thresholds_For_Approval_2026-07-25.md.
 *
 * Rule: severity decides the starting tier. Breadth can raise it by one
 * step, but only when the starting tier is Guided or higher. Mild never
 * becomes Integration on breadth alone.
 *
 * Scale: 1 = severe symptoms, 10 = no symptoms. Higher is better.
 */

export type RecommendedTier =
  | "awareness"
  | "foundation"
  | "guided"
  | "restoration"
  | "integration";

export type PatternSeverity = "low" | "medium" | "high";

export interface TierRecommendation {
  recommended_tier: RecommendedTier;
  tier_reasoning: string;
  subcategory_count: number;
  average_baseline: number;
}

const TIER_ORDER: RecommendedTier[] = [
  "awareness",
  "foundation",
  "guided",
  "restoration",
  "integration",
];

function averageOf(ratings: Record<string, number>): number {
  const values = Object.values(ratings).filter((v) => typeof v === "number");
  if (values.length === 0) return 5;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/** Pattern label from a single area rating (Sheila-approved bands). */
export function labelPatternSeverity(rating: number): PatternSeverity {
  if (rating >= 8) return "low";
  if (rating >= 5) return "medium";
  return "high";
}

/** Pattern label from the average of a set of ratings. */
export function labelPatternSeverityFromAverage(
  ratings: Record<string, number>
): PatternSeverity {
  return labelPatternSeverity(averageOf(ratings));
}

function startingTierFromSeverity(average: number): RecommendedTier {
  if (average >= 8.0) return "awareness";
  if (average >= 6.5) return "foundation";
  if (average >= 5.0) return "guided";
  if (average >= 3.5) return "restoration";
  return "integration";
}

function raiseOneTier(tier: RecommendedTier): RecommendedTier {
  const idx = TIER_ORDER.indexOf(tier);
  if (idx < 0 || idx >= TIER_ORDER.length - 1) return tier;
  return TIER_ORDER[idx + 1];
}

/**
 * Breadth of 6+ raises one step, but only when the severity-based start
 * was Guided or higher. Mild (Awareness / Foundation) is never lifted.
 */
function applyBreadth(
  start: RecommendedTier,
  subcategoryCount: number
): RecommendedTier {
  if (subcategoryCount < 6) return start;
  if (start === "awareness" || start === "foundation") return start;
  return raiseOneTier(start);
}

export function recommendTier(
  subcategoryCount: number,
  baselineRatings: Record<string, number>
): TierRecommendation {
  const average_baseline = averageOf(baselineRatings);
  const start = startingTierFromSeverity(average_baseline);
  const recommended_tier = applyBreadth(start, subcategoryCount);

  const raised =
    recommended_tier !== start
      ? ` Because your roadmap spans ${subcategoryCount} focus areas, the recommendation moves up one step from ${start}.`
      : "";

  const tier_reasoning =
    `Your baseline ratings average ${average_baseline.toFixed(1)}/10 ` +
    `(10 means no symptoms, 1 means severe), across ${subcategoryCount} focus areas. ` +
    `That places you at the ${recommended_tier} recommendation.` +
    raised;

  return {
    recommended_tier,
    tier_reasoning,
    subcategory_count: subcategoryCount,
    average_baseline,
  };
}

/** Ratings whose keys start with any of the given prefixes. */
export function ratingsForPrefixes(
  baselineRatings: Record<string, number>,
  prefixes: string[]
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [key, value] of Object.entries(baselineRatings)) {
    if (typeof value !== "number") continue;
    if (prefixes.some((p) => key.startsWith(p))) out[key] = value;
  }
  return out;
}
