import { BASELINE_RATING_ITEMS } from "./assessment-data";
import type { AssessmentType } from "./mini-assessment-schedule";

export type ComparisonDirection = "improved" | "unchanged" | "needs_attention";

export interface AssessmentSnapshot {
  assessment_type: AssessmentType;
  completed_at: string;
  ratings: Record<string, number>;
}

export interface ComparisonRow {
  key: string;
  label: string;
  category: string;
  values: Partial<Record<AssessmentType, number>>;
  direction: ComparisonDirection | null;
}

/** Higher rating = better (10 = none/resolved). */
export function compareRating(
  baseline: number | undefined,
  current: number | undefined
): ComparisonDirection | null {
  if (baseline == null || current == null) return null;
  if (current > baseline) return "improved";
  if (current < baseline) return "needs_attention";
  return "unchanged";
}

export function buildComparisonRows(
  assessments: AssessmentSnapshot[]
): ComparisonRow[] {
  const byType = new Map<AssessmentType, AssessmentSnapshot>();
  for (const a of assessments) {
    byType.set(a.assessment_type, a);
  }

  const baseline = byType.get("baseline");
  const latest = assessments
    .filter((a) => a.assessment_type !== "baseline")
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0];

  const rows: ComparisonRow[] = [];

  for (const cat of BASELINE_RATING_ITEMS) {
    for (const item of cat.items) {
      const values: Partial<Record<AssessmentType, number>> = {};
      for (const a of assessments) {
        const val = a.ratings[item.key];
        if (typeof val === "number") {
          values[a.assessment_type] = val;
        }
      }

      rows.push({
        key: item.key,
        label: item.label,
        category: cat.category,
        values,
        direction: compareRating(
          baseline?.ratings[item.key],
          latest?.ratings[item.key]
        ),
      });
    }
  }

  return rows;
}

export function averageRating(ratings: Record<string, number>): number | null {
  const vals = Object.values(ratings).filter((v) => typeof v === "number");
  if (vals.length === 0) return null;
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}
