/**
 * Deterministic assessment scoring shared by identify-patterns.
 * Mirrors src/lib/tier-recommendation.ts (Sheila-approved 25 July 2026).
 * Keep both in sync when bands change.
 */

export type PatternSeverity = "low" | "medium" | "high";
export type RecommendedTier =
  | "awareness"
  | "foundation"
  | "guided"
  | "restoration"
  | "integration";

const TIER_ORDER: RecommendedTier[] = [
  "awareness",
  "foundation",
  "guided",
  "restoration",
  "integration",
];

export function averageOf(ratings: Record<string, number>): number {
  const values = Object.values(ratings).filter((v) => typeof v === "number");
  if (values.length === 0) return 5;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function labelPatternSeverity(rating: number): PatternSeverity {
  if (rating >= 8) return "low";
  if (rating >= 5) return "medium";
  return "high";
}

export function labelFromRatings(
  ratings: Record<string, number>
): PatternSeverity {
  return labelPatternSeverity(averageOf(ratings));
}

function startingTier(average: number): RecommendedTier {
  if (average >= 8.0) return "awareness";
  if (average >= 6.5) return "foundation";
  if (average >= 5.0) return "guided";
  if (average >= 3.5) return "restoration";
  return "integration";
}

function raiseOne(tier: RecommendedTier): RecommendedTier {
  const idx = TIER_ORDER.indexOf(tier);
  if (idx < 0 || idx >= TIER_ORDER.length - 1) return tier;
  return TIER_ORDER[idx + 1];
}

export function recommendTier(
  subcategoryCount: number,
  baselineRatings: Record<string, number>
): RecommendedTier {
  const start = startingTier(averageOf(baselineRatings));
  if (subcategoryCount < 6) return start;
  if (start === "awareness" || start === "foundation") return start;
  return raiseOne(start);
}

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

export function applyDomainSeverities<
  T extends { severity: string }
>(
  patterns: T[],
  domainRatings: Record<string, number>,
  fallbackAll: Record<string, number>
): T[] {
  const source =
    Object.keys(domainRatings).length > 0 ? domainRatings : fallbackAll;
  if (Object.keys(source).length === 0) return patterns;
  const severity = labelFromRatings(source);
  return patterns.map((p) => ({ ...p, severity }));
}
